use std::fs::File;
use std::io::Read;
use std::io::Write;
use std::path::PathBuf;
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

#[tauri::command]
pub fn load_app_state(app_handle: AppHandle) -> Result<String, String> {
    let app_data_dir: PathBuf =
        app_data_dir(&app_handle.config()).ok_or("Failed to get app data directory")?;
    let file_path = app_data_dir.join("app_state.json");

    if !file_path.exists() {
        return Ok("{}".into()); // Return an empty JSON object if the state file does not exist
    }

    let mut file = File::open(file_path).map_err(|e| e.to_string())?;
    let mut state = String::new();
    file.read_to_string(&mut state).map_err(|e| e.to_string())?;

    Ok(state)
}
