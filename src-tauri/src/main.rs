// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod services;

use commands::app_state::{load_app_state, save_app_state};
use commands::rds::rds_execute;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            load_app_state,
            rds_execute,
            save_app_state
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
