use aws_sdk_rdsdata::types::Field::{
    BlobValue, BooleanValue, DoubleValue, IsNull, LongValue, StringValue,
};
use aws_sdk_rdsdata::Client;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

use crate::services::aws_config::AwsConfig;

#[derive(Debug, Serialize, Deserialize)]
struct RdsRecord {
    column1: String,
    column2: i32,
    // Add fields as necessary based on your SQL result
}

#[derive(Debug, Serialize, Deserialize)]
struct ColumnMetadata {
    name: String,
}

#[tauri::command]
pub async fn rds_execute(
    cluster_arn: &str,
    database: &str,
    profile_name: &str,
    query: &str,
    secret_arn: &str,
) -> Result<String, String> {
    println!(">>> rds_execute");

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
                    BlobValue(b) => String::from_utf8_lossy(b.as_ref()).to_string(),
                    IsNull(_) => "null".to_string(),
                    _ => "unknown".to_string(),
                };
                map.insert(metadata.name.to_string(), value_str);
            }
            map
        })
        .collect();

    println!("<<< rds_execute");
    match serde_json::to_string(&records) {
        Ok(response_str) => Ok(response_str),
        Err(error) => Err(format!("Failed to convert to JSON: {}", error)),
    }
}
