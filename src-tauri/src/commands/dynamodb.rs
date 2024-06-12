use aws_sdk_dynamodb::{ Client, Error };

use crate::services::aws_config::AwsConfig;

pub async fn list(profile_name: &str) -> Result<(), Error> {
    let config = AwsConfig::new(profile_name).await;
    let client = Client::new(&config);

    let response = client.list_tables().send().await?;

    println!("hey");
    let names = response.table_names();

    for name in names {
        println!("  {}", name);
    }

    println!();
    println!("Found {} tables", names.len());

    Ok(())
}
