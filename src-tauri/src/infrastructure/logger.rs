use log::LevelFilter;
use tauri::{AppHandle, Manager};

/** Setup logger file. Log traces will also be output to standard output. Logger file location is `<app_data_dir>/logs/<date>.log` */
pub fn setup_logger(app_handle: &AppHandle) -> Result<(), fern::InitError> {
    // Get tauri data directory.
    let mut log_dir = app_handle.path().app_data_dir().unwrap();

    // Create logs folder if it does not exist.
    log_dir.push("logs");
    std::fs::create_dir_all(&log_dir).unwrap();

    // Define log filename using current date.
    log_dir.push(
        format!("{}.log", chrono::Local::now().format("%Y-%m-%d_%H:%M:%S"))
    );

    fern::Dispatch
        ::new()
        .format(|out, message, record| {
            out.finish(
                format_args!(
                    "{} [{}] {}",
                    chrono::Local::now().format("%Y-%m-%d %H:%M:%S %:z"),
                    record.level(),
                    message
                )
            )
        })
        .level(LevelFilter::Info)
        .chain(std::io::stdout())
        .chain(fern::log_file(log_dir)?)
        .apply()?;
    return Ok(());
}
