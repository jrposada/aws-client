use log::info;
use tauri::State;

use crate::{ services::app_state::AppState, types::request_type::RequestType };

#[tauri::command]
pub async fn get_active_request<'r>(
    app_state: State<'r, AppState>
) -> Result<String, String> {
    info!(">>> get_active_request");
    match serde_json::to_string(&app_state.active_request) {
        Ok(value) => Ok(String::from(value)),
        Err(error) => Err(format!("{:?}", error)),
    }
}

#[tauri::command]
pub async fn get_open_requests<'r>(
    app_state: State<'r, AppState>
) -> Result<String, String> {
    info!(">>> get_open_requests");
    match serde_json::to_string(&app_state.open_requests) {
        Ok(value) => Ok(String::from(value)),
        Err(error) => Err(format!("{:?}", error)),
    }
}

#[tauri::command]
pub async fn get_requests<'r>(
    app_state: State<'r, AppState>
) -> Result<String, String> {
    info!(">>> get_requests");
    match serde_json::to_string(&app_state.requests) {
        Ok(value) => Ok(String::from(value)),
        Err(error) => Err(format!("{:?}", error)),
    }
}

#[tauri::command]
pub async fn post_active_request<'r>(
    app_state: State<'r, AppState>,
    id: &str
) -> Result<(), String> {
    info!("post_active_request");
    app_state.set_active_request(id)?;
    Ok(())
}

#[tauri::command]
pub async fn post_requests<'r>(
    app_state: State<'r, AppState>,
    request_type: &str
) -> Result<(), String> {
    info!("post_requests");
    app_state.add_request(request_type.parse::<RequestType>()?);
    Ok(())
}
