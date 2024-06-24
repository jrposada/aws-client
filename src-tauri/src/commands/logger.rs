use log::info;

#[tauri::command]
pub async fn logger(value: &str) -> Result<(), ()> {
    info!("{}", value);
    Ok(())
}
