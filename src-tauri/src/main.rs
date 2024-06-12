// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod services;

use commands::dynamodb::list;

fn main() {
    tauri::Builder
        ::default()
        .invoke_handler(tauri::generate_handler![dynamodb_list])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
async fn dynamodb_list(profile_name: &str) -> Result<String, ()> {
    let _ = list(profile_name).await;
    Ok(format!("Hello, {}!", profile_name))
}
