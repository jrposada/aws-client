use aws_sdk_rds::Client;

use crate::services::aws_config::AwsConfig;

#[tauri::command]
pub async fn rds_list(profile_name: &str) -> Result<String, String> {
    let config = AwsConfig::new(profile_name).await;
    let client = Client::new(&config);

    let response_result = client.describe_db_clusters().send().await;

    let response = match response_result {
        Ok(response) => response,
        Err(error) => {
            return Err(format!("Error: {}", error));
        }
    };

    println!("Found {} clusters:", response.db_clusters().len());

    for cluster in response.db_clusters() {
        let name = cluster.database_name().unwrap_or("Unknown");
        let engine = cluster.engine().unwrap_or("Unknown");
        let id = cluster.db_cluster_identifier().unwrap_or("Unknown");
        let class = cluster.db_cluster_instance_class().unwrap_or("Unknown");
        println!("\tDatabase: {name}");
        println!("\t  Engine: {engine}");
        println!("\t      ID: {id}");
        println!("\tInstance: {class}");
    }

    Ok(format!("Hello, {}!", profile_name))
}
