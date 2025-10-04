use log::info;
use serde::{ Deserialize, Serialize };
use aws_sdk_rdsdata::types::Field::{
    BlobValue,
    BooleanValue,
    DoubleValue,
    IsNull,
    LongValue,
    StringValue,
};
use aws_sdk_rdsdata::Client;
use std::collections::HashMap;

use crate::services::aws_config::AwsConfig;
use crate::types::request_result::RequestResultData;
use crate::types::request_type::RequestType;
use crate::types::{ request::Request, request_result::RequestResult };

#[derive(Debug, Deserialize, Serialize)]
struct ColumnMetadata {
    name: String,
}

pub struct RequestExecutor {}

impl RequestExecutor {
    pub async fn execute(
        request: &Request
    ) -> Result<Option<RequestResult>, String> {
        match request.request_type {
            RequestType::Rds => {
                match request.data.rds {
                    Some(ref rds_data) => {
                        return RequestExecutor::rds(
                            &rds_data.cluster_arn,
                            &rds_data.database,
                            &request.data.profile_name,
                            &rds_data.query,
                            &rds_data.secret_arn
                        ).await;
                    }
                    None => {
                        return Err("Data can not be undefined".to_string());
                    }
                }
            }
        }
    }

    async fn rds(
        cluster_arn: &str,
        database: &str,
        profile_name: &str,
        query: &str,
        secret_arn: &str
    ) -> Result<Option<RequestResult>, String> {
        info!(">>> RequestExecutor.rds");

        let config = AwsConfig::new(profile_name).await;
        let client = Client::new(&config);

        let statement = client
            .execute_statement()
            .include_result_metadata(true)
            .resource_arn(cluster_arn)
            .database(database)
            .sql(query)
            .secret_arn(secret_arn);

        let result = statement.send().await;

        let response = match result {
            Ok(response) => response,
            Err(error) => {
                return Err(format!("Error: {}", error));
            }
        };

        // Extract column metadata
        let column_metadata_raw = response.column_metadata();
        let column_metadata: Vec<ColumnMetadata> = column_metadata_raw
            .iter()
            .map(|column| ColumnMetadata {
                name: column.name().unwrap_or("Unknown column").to_string(),
            })
            .collect();

        // Extract records
        let records_raw = response.records();
        let records: Vec<HashMap<String, String>> = records_raw
            .iter()
            .map(|record| {
                let mut map = HashMap::new();
                for (metadata, value) in column_metadata.iter().zip(record) {
                    let value_str = match value {
                        StringValue(s) => s.clone(),
                        LongValue(l) => l.to_string(),
                        BooleanValue(b) => b.to_string(),
                        DoubleValue(d) => d.to_string(),
                        BlobValue(b) =>
                            String::from_utf8_lossy(b.as_ref()).to_string(),
                        IsNull(_) => "null".to_string(),
                        _ => "unknown".to_string(),
                    };
                    map.insert(metadata.name.to_string(), value_str);
                }
                map
            })
            .collect();

        info!("<<< RequestExecutor.rds");
        return match serde_json::to_string(&records) {
            Ok(response_str) =>
                Ok(
                    Some(RequestResult {
                        data: Some(RequestResultData {
                            rds: Some(response_str),
                        }),
                        success: true,
                    })
                ),

            Err(error) => Err(format!("Failed to convert to JSON: {}", error)),
        };
    }
}
