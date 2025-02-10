use log::info;

mod commands;
mod infrastructure;
mod services;
mod types;

use commands::logger::logger;
use commands::requests::{
    delete_open_requests,
    delete_requests,
    get_active_request,
    get_open_requests,
    get_requests,
    post_active_request,
    post_requests_execute,
    post_requests,
    put_requests,
};
use commands::workspace::{
    get_workspace_filepath,
    post_workspace_open,
    post_workspace_save_active_as,
    post_workspace_save_active,
    post_workspace_save_as,
    post_workspace_save,
};
use infrastructure::logger::setup_logger;
use services::app_state::AppState;
use tauri::Manager;


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(AppState::new())
        .invoke_handler(tauri::generate_handler![
            delete_open_requests,
                delete_requests,
                get_active_request,
                get_open_requests,
                get_requests,
                get_workspace_filepath,
                logger,
                post_active_request,
                post_requests_execute,
                post_requests,
                post_workspace_open,
                post_workspace_save_active_as,
                post_workspace_save_active,
                post_workspace_save_as,
                post_workspace_save,
                put_requests
        ])
        .setup(|app| {
            setup_logger(&app.handle()).expect("Failed to set up logger");
            info!("Application started ({:?})", app.path().app_data_dir().unwrap().to_str());
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
