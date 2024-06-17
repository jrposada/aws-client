use std::fs::File;
use std::io::Read;
use std::io::Write;
use std::path::PathBuf;
use tauri::{api::path::app_data_dir, AppHandle};

const EXTENSION: &str = ".aws-client";

#[tauri::command]
pub async fn save_app_state(
    app_handle: AppHandle,
    state: &str,
    filepath: Option<String>,
) -> Result<String, String> {
    let filepath: PathBuf = if let Some(mut custom_path) = filepath {
        if !custom_path.ends_with(EXTENSION) {
            custom_path.push_str(EXTENSION);
        }
        PathBuf::from(custom_path)
    } else {
        let app_data_dir: PathBuf =
            app_data_dir(&app_handle.config()).ok_or("Failed to get app data directory")?;
        app_data_dir.join(format!("app_state{}", EXTENSION))
    };

    println!("{:?}", filepath);

    let mut file = File::create(filepath).map_err(|e| e.to_string())?;
    file.write_all(state.as_bytes())
        .map_err(|e| e.to_string())?;

    Ok("App state saved".to_string())
}

#[tauri::command]
pub fn load_app_state(app_handle: AppHandle) -> Result<String, String> {
    let app_data_dir: PathBuf =
        app_data_dir(&app_handle.config()).ok_or("Failed to get app data directory")?;
    let filepath = app_data_dir.join(format!("app_state{}", EXTENSION));

    if !filepath.exists() {
        return Ok("{}".into()); // Return an empty JSON object if the state file does not exist
    }

    let mut file = File::open(filepath).map_err(|e| e.to_string())?;
    let mut state = String::new();
    file.read_to_string(&mut state).map_err(|e| e.to_string())?;

    Ok(state)
}
