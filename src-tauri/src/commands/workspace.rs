use tauri::State;

use crate::services::app_state::AppState;

#[tauri::command]
pub async fn get_workspace_filepath<'r>(
    app_state: State<'r, AppState>
) -> Result<Option<String>, String> {
    let filepath = app_state.filepath.lock().unwrap();

    Ok(filepath.clone())
}
