// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod services;

use commands::dynamodb::dynamodb_list;
use commands::rds::rds_list;

fn main() {
    tauri::Builder
        ::default()
        .invoke_handler(tauri::generate_handler![dynamodb_list, rds_list])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
