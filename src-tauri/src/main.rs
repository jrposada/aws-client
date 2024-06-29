// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use log::info;

mod commands;
mod infrastructure;
mod services;

use commands::app_state::{ load_app_state, save_app_state };
use commands::logger::logger;
use commands::rds::rds_execute;
use infrastructure::logger::setup_logger;

fn main() {
    tauri::Builder
        ::default()
        .invoke_handler(
            tauri::generate_handler![load_app_state, logger, rds_execute, save_app_state]
        )
        .setup(|app| {
            setup_logger(&app.handle()).expect("Failed to set up logger");
            info!("Application started");
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
