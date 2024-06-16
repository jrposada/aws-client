use std::fs::File;
use std::io::Write;
use tauri::{api::path::app_data_dir, AppHandle};

#[tauri::command]
pub async fn save_app_state(app_handle: AppHandle, state: &str) -> Result<String, String> {
    let app_data_dir =
        app_data_dir(&app_handle.config()).ok_or("Failed to get app data directory")?;
    let file_path = app_data_dir.join("app_state.json");

    println!("{:?}", file_path);

    let mut file = File::create(file_path).map_err(|e| e.to_string())?;
    file.write_all(state.as_bytes())
        .map_err(|e| e.to_string())?;

    Ok("App state saved".to_string())
}
