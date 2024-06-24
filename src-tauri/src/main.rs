// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use log::{info, LevelFilter};
use tauri::AppHandle;

mod commands;
mod services;

use commands::app_state::{load_app_state, save_app_state};
use commands::logger::logger;
use commands::rds::rds_execute;

fn setup_logger(app_handle: &AppHandle) -> Result<(), fern::InitError> {
    // Get tauri data directory.
    let mut log_dir = app_handle.path_resolver().app_data_dir().unwrap();

    // Create logs folder if it does not exist.
    log_dir.push("logs");
    std::fs::create_dir_all(&log_dir).unwrap();

    // Define log filename using current date.
    log_dir.push(format!(
        "{}.log",
        chrono::Local::now().format("%Y-%m-%d_%H:%M:%S")
    ));

    fern::Dispatch::new()
        .format(|out, message, record| {
            out.finish(format_args!(
                "{} [{}] {}",
                chrono::Local::now().format("%Y-%m-%d %H:%M:%S %:z"),
                record.level(),
                message
            ))
        })
        .level(LevelFilter::Info)
        .chain(std::io::stdout())
        .chain(fern::log_file(log_dir)?)
        .apply()?;
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            load_app_state,
            logger,
            rds_execute,
            save_app_state
        ])
        .setup(|app| {
            setup_logger(&app.handle()).expect("Failed to set up logger");
            info!("Application started");
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
