// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use log::info;

mod commands;
mod infrastructure;
mod services;
mod types;

use commands::app_state::{ load_app_state, save_app_state };
use commands::logger::logger;
use commands::rds::rds_execute;
use commands::requests::{
    delete_open_requests,
    delete_requests,
    get_active_request,
    get_open_requests,
    get_requests,
    post_active_request,
    post_requests,
};
use commands::workspace::{
    get_workspace_filepath,
    post_workspace_save_active_as,
    post_workspace_save_active,
    post_workspace_save_as,
    post_workspace_save,
};
use infrastructure::logger::setup_logger;
use services::app_state::AppState;

fn main() {
    tauri::Builder
        ::default()
        .manage(AppState::new())
        .invoke_handler(
            tauri::generate_handler![
                delete_open_requests,
                delete_requests,
                get_active_request,
                get_open_requests,
                get_requests,
                get_workspace_filepath,
                load_app_state,
                logger,
                post_active_request,
                post_requests,
                post_workspace_save_active_as,
                post_workspace_save_active,
                post_workspace_save_as,
                post_workspace_save,
                rds_execute,
                save_app_state
            ]
        )
        .setup(|app| {
            setup_logger(&app.handle()).expect("Failed to set up logger");
            info!("Application started");
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
