use aws_sdk_rdsdata::Client;

use crate::services::aws_config::AwsConfig;

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

    println!("<<< rds_execute");
    Ok(format!("{:?}", response))
}
