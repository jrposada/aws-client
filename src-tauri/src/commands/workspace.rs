use log::info;
use tauri::State;

use crate::services::app_state::AppState;

#[tauri::command]
pub async fn get_workspace_filepath<'r>(
    app_state: State<'r, AppState>
) -> Result<Option<String>, String> {
    info!(">>> get_workspace_filepath");
    let filepath_guard = app_state.filepath.lock().unwrap();
    info!("<<< get_workspace_filepath");
    return Ok(filepath_guard.clone());
}

#[tauri::command]
pub async fn post_workspace_save_active_as<'r>(
    app_state: State<'r, AppState>,
    filepath: &str
) -> Result<(), String> {
    info!(">>> post_workspace_save_active_as {:?}", filepath);
    app_state.save_active_as(filepath)?;
    info!("<<< post_workspace_save_active_as {:?}", filepath);
    return Ok(());
}

#[tauri::command]
pub async fn post_workspace_save_active<'r>(
    app_state: State<'r, AppState>
) -> Result<(), String> {
    info!(">>> post_workspace_save_active");
    app_state.save_active()?;
    info!("<<< post_workspace_save_active");
    return Ok(());
}

#[tauri::command]
pub async fn post_workspace_save_as<'r>(
    app_state: State<'r, AppState>,
    filepath: &str
) -> Result<(), String> {
    info!(">>> post_workspace_save_as {:?}", filepath);
    app_state.save_as(filepath)?;
    info!("<<< post_workspace_save_as {:?}", filepath);
    return Ok(());
}

#[tauri::command]
pub async fn post_workspace_save<'r>(
    app_state: State<'r, AppState>
) -> Result<(), String> {
    info!(">>> post_workspace_save");
    app_state.save()?;
    info!("<<< post_workspace_save");
    return Ok(());
}
