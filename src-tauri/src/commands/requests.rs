use log::info;
use tauri::State;

use crate::{
    services::app_state::AppState,
    types::{
        request_data::RequestData,
        request_type::RequestType,
    },
};

#[tauri::command]
pub async fn delete_open_requests<'r>(
    app_state: State<'r, AppState>,
    id: &str
) -> Result<(), String> {
    info!(">>> delete_open_requests {:?}", id);
    app_state.remove_open_request(id).await?;
    info!("<<< delete_open_requests {:?}", id);
    return Ok(());
}

#[tauri::command]
pub async fn delete_requests<'r>(
    app_state: State<'r, AppState>,
    id: &str
) -> Result<(), String> {
    info!(">>> delete_requests {:?}", id);
    app_state.remove_request(id).await?;
    info!("<<< delete_requests {:?}", id);
    return Ok(());
}

#[tauri::command]
pub async fn get_active_request<'r>(
    app_state: State<'r, AppState>
) -> Result<Option<String>, String> {
    info!(">>> get_active_request");
    let active_request_guard = app_state.active_request.read().unwrap();
    info!("<<< get_active_request");
    return Ok(active_request_guard.clone());
}

#[tauri::command]
pub async fn get_open_requests<'r>(
    app_state: State<'r, AppState>
) -> Result<String, String> {
    info!(">>> get_open_requests");
    let result = match serde_json::to_string(&app_state.open_requests) {
        Ok(value) => Ok(value.to_string()),
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
        Ok(value) => Ok(value.to_string()),
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
    app_state.set_active_request(id).await?;
    info!("<<< post_active_request {:?}", id);
    return Ok(());
}

#[tauri::command]
pub async fn post_requests<'r>(
    app_state: State<'r, AppState>,
    request_type: &str,
    title: &str
) -> Result<(), String> {
    info!(">>> post_requests {:?}", request_type);
    app_state.add_request(request_type.parse::<RequestType>()?, title).await?;
    info!("<<< post_requests {:?}", request_type);
    return Ok(());
}

#[tauri::command]
pub async fn post_requests_execute<'r>(
    app_state: State<'r, AppState>,
    id: &str
) -> Result<(), String> {
    info!(">>> post_requests_execute {:?}", id);
    app_state.execute_request(id).await?;
    info!("<<< post_requests_execute {:?}", id);
    return Ok(());
}

#[tauri::command]
pub async fn put_requests<'r>(
    app_state: State<'r, AppState>,
    id: &str,
    title: &str,
    data: Option<&str>
) -> Result<(), String> {
    info!(">>> put_requests {:?}", id);

    let data: Option<RequestData> = match data {
        Some(data) => {
            match serde_json::from_str(data) {
                Ok(parsed_data) => Some(parsed_data),
                Err(error) => {
                    return Err(format!("Failed to parse data: {:?}", error));
                }
            }
        }
        None => None,
    };

    app_state.update_request(id, title, data).await?;

    info!("<<< put_requests {:?}", id);
    return Ok(());
}
