use aws_sdk_dynamodb::Client;

use crate::services::aws_config::AwsConfig;

#[tauri::command]
pub async fn dynamodb_list(profile_name: &str) -> Result<String, String> {
    let config = AwsConfig::new(profile_name).await;
    let client = Client::new(&config);

    let response_result = client.list_tables().send().await;

    let response = match response_result {
        Ok(response) => response,
        Err(error) => {
            return Ok(format!("Error: {}", error));
        }
    };

    println!("hey");
    let names = response.table_names();

    for name in names {
        println!("  {}", name);
    }

    println!();
    println!("Found {} tables", names.len());

    Ok(format!("Hello, {}!", profile_name))
}
