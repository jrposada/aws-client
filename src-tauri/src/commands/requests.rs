use log::info;
use tauri::State;

use crate::{ services::app_state::AppState, types::request_type::RequestType };

#[tauri::command]
pub async fn delete_open_requests<'r>(
    app_state: State<'r, AppState>,
    id: &str
) -> Result<(), String> {
    info!(">>> delete_open_requests {:?}", id);
    app_state.remove_open_request(id)?;
    info!("<<< delete_open_requests {:?}", id);
    Ok(())
}

#[tauri::command]
pub async fn delete_requests<'r>(
    app_state: State<'r, AppState>,
    id: &str
) -> Result<(), String> {
    info!(">>> delete_requests {:?}", id);
    app_state.remove_request(id)?;
    info!("<<< delete_requests {:?}", id);
    Ok(())
}

#[tauri::command]
pub async fn get_active_request<'r>(
    app_state: State<'r, AppState>
) -> Result<String, String> {
    info!(">>> get_active_request");
    let result = match serde_json::to_string(&app_state.active_request) {
        Ok(value) => Ok(String::from(value)),
        Err(error) => Err(format!("{:?}", error)),
    };
    info!("<<< get_active_request");
    result
}

#[tauri::command]
pub async fn get_open_requests<'r>(
    app_state: State<'r, AppState>
) -> Result<String, String> {
    info!(">>> get_open_requests");
    let result = match serde_json::to_string(&app_state.open_requests) {
        Ok(value) => Ok(String::from(value)),
        Err(error) => Err(format!("{:?}", error)),
    };
    info!("<<< get_open_requests");
    return result;
}

#[tauri::command]
pub async fn get_requests<'r>(
    app_state: State<'r, AppState>
) -> Result<String, String> {
    info!(">>> get_requests");
    let result = match serde_json::to_string(&app_state.requests) {
        Ok(value) => Ok(String::from(value)),
        Err(error) => Err(format!("{:?}", error)),
    };
    info!("<<< get_requests");
    return result;
}

#[tauri::command]
pub async fn post_active_request<'r>(
    app_state: State<'r, AppState>,
    id: &str
) -> Result<(), String> {
    info!(">>> post_active_request {:?}", id);
    app_state.set_active_request(id)?;
    info!("<<< post_active_request {:?}", id);
    return Ok(());
}

#[tauri::command]
pub async fn post_requests<'r>(
    app_state: State<'r, AppState>,
    request_type: &str
) -> Result<(), String> {
    info!(">>> post_requests {:?}", request_type);
    app_state.add_request(request_type.parse::<RequestType>()?);
    info!("<<< post_requests {:?}", request_type);
    return Ok(());
}
