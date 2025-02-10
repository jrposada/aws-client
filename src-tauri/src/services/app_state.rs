use log::info;
use serde::{Deserialize, Serialize};
use std::fs::File;
use std::io::Read;
use std::io::Write;
use std::path::PathBuf;
use std::sync::RwLock;
use tauri::async_runtime::Mutex;
use uuid::Uuid;

use crate::{
    services::request_executor::RequestExecutor,
    types::{request::Request, request_data::RequestData, request_type::RequestType},
};

const EXTENSION: &str = ".aws-client";

#[derive(Debug, Deserialize, Serialize)]
pub struct SavedAppState {
    /** According state write to file system, request ID currently active in the frontend. */
    pub saved_active_request: Option<String>,

    /** According state write to file system, filepath of this file. */
    pub saved_filepath: Option<String>,

    /** According state write to file system, open requests IDs in the frontend. */
    pub saved_open_requests: Vec<String>,

    /** According state write to file system, complete list of all requests in the workspace. */
    pub saved_requests: Vec<Request>,

    /** According state in memory, request ID currently active in the frontend. */
    pub active_request: Option<String>,

    /** According state in memory, filepath of this file. */
    pub filepath: Option<String>,

    /** According state in memory, open requests IDs in the frontend. */
    pub open_requests: Vec<String>,

    /** According state in memory, complete list of all requests in the workspace. */
    pub requests: Vec<Request>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct AppState {
    /** According state write to file system, request ID currently active in the frontend. */
    pub saved_active_request: RwLock<Option<String>>,

    /** According state write to file system, filepath of this file. */
    pub saved_filepath: RwLock<Option<String>>,

    /** According state write to file system, open requests IDs in the frontend. */
    pub saved_open_requests: RwLock<Vec<String>>,

    /** According state write to file system, complete list of all requests in the workspace. */
    pub saved_requests: RwLock<Vec<Request>>,

    /** According state in memory, request ID currently active in the frontend. */
    pub active_request: RwLock<Option<String>>,

    /** According state in memory, filepath of this file. */
    pub filepath: RwLock<Option<String>>,

    /** According state in memory, open requests IDs in the frontend. */
    pub open_requests: RwLock<Vec<String>>,

    /** According state in memory, complete list of all requests in the workspace. */
    pub requests: RwLock<Vec<Request>>,
}

impl AppState {
    pub fn new() -> AppState {
        // TODO: open internal file
        AppState {
            saved_active_request: RwLock::new(None),
            saved_filepath: RwLock::new(None),
            saved_open_requests: RwLock::new(Vec::new()),
            saved_requests: RwLock::new(Vec::new()),
            active_request: RwLock::new(None),
            filepath: RwLock::new(None),
            open_requests: RwLock::new(Vec::new()),
            requests: RwLock::new(Vec::new()),
        }
    }

    pub async fn add_request(&self, request_type: RequestType, title: &str) -> Result<(), String> {
        info!(">>> AppState.add_request {:?}", request_type);

        let id = Uuid::new_v4().to_string();

        let request: Request = Request {
            data: RequestData::new(request_type),
            id,
            is_dirty: true,
            request_type,
            result: None,
            title: title.to_string(),
        };

        // Add to requests
        info!("--- AppState.add_request add to requests");
        let mut requests_guard = self.requests.write().unwrap();
        requests_guard.push(request.clone());
        drop(requests_guard);

        // Add to open requests
        info!("--- AppState.add_request add to open requests");
        let mut open_requests_guard = self.open_requests.write().unwrap();
        open_requests_guard.push(request.id.clone());
        drop(open_requests_guard);

        // Set as active
        info!("--- AppState.add_request set as active requests");
        let mut active_request_guard = self.active_request.write().unwrap();
        *active_request_guard = Some(request.id.clone());
        drop(active_request_guard);

        info!("<<< AppState.add_request {:?}", request_type);
        return Ok(());
    }

    pub async fn execute_request(&self, id: &str) -> Result<(), String> {
        info!(">>> AppState.execute_request");

        info!("--- AppState.execute_request update in requests");
        let mut requests_guard = self.requests.write().unwrap();
        match requests_guard.iter_mut().find(|item| item.id == id) {
            Some(request) => {
                let result = RequestExecutor::execute(request).await?;
                request.safe_set_result(result)?;
            }
            None => {
                return Err(format!("Could not find request {:?}", id));
            }
        }
        drop(requests_guard);

        info!("<<< AppState.execute_request");
        return Ok(());
    }

    /** Open workspace */
    pub fn open(&self, filepath: &str) -> Result<(), String> {
        info!("AppState.open {:?}", filepath);

        let filepath: PathBuf = PathBuf::from(filepath);

        if !filepath.exists() {
            return Err(format!("File does not exist"));
        }

        let mut file = File::open(filepath).map_err(|e| e.to_string())?;
        let mut json = String::new();
        file.read_to_string(&mut json).map_err(|e| e.to_string())?;

        // Deserialize the JSON string into our SavedAppState struct.
        let saved_state: SavedAppState =
            serde_json::from_str(&json).map_err(|e| format!("Failed to parse JSON: {}", e))?;

        // Update each field in the AppState by acquiring the locks.
        *self.saved_active_request.write().unwrap() = saved_state.saved_active_request;
        *self.saved_filepath.write().unwrap() = saved_state.saved_filepath;
        *self.saved_open_requests.write().unwrap() = saved_state.saved_open_requests;
        *self.saved_requests.write().unwrap() = saved_state.saved_requests;
        *self.active_request.write().unwrap() = saved_state.active_request;
        *self.filepath.write().unwrap() = saved_state.filepath;
        *self.open_requests.write().unwrap() = saved_state.open_requests;
        *self.requests.write().unwrap() = saved_state.requests;

        return Ok(());
    }

    pub async fn remove_open_request(&self, id: &str) -> Result<(), String> {
        info!(">>> AppState.remove_open_request {:?}", id);

        // First, remove from open requests if it is open.
        let mut open_requests_guard = self.open_requests.write().unwrap();
        if let Some(open_request_index) = open_requests_guard
            .iter()
            .position(|open_request_id| *open_request_id == id)
        {
            info!("--- AppState.remove_open_request remove");
            open_requests_guard.remove(open_request_index);
        }
        drop(open_requests_guard);

        // Second, update active request if it matches IDs.
        let mut active_request_guard = self.active_request.write().unwrap();
        if let Some(active_request_id) = active_request_guard.as_mut() {
            if active_request_id == id {
                info!("--- AppState.remove_open_request is active");
                let open_requests_guard = self.open_requests.write().unwrap();
                if let Some(last_request_id) = open_requests_guard.last() {
                    info!(
                        "--- AppState.remove_open_request set {:?} as active",
                        last_request_id
                    );
                    *active_request_id = last_request_id.clone();
                } else {
                    // If there is no last request, we should clear the active_request
                    info!("--- AppState.remove_open_request no candidate for active");
                    *active_request_guard = None;
                }
                drop(open_requests_guard);
            }
        }
        drop(active_request_guard);

        info!("<<< AppState.remove_open_request {:?}", id);
        return Ok(());
    }

    pub async fn remove_request(&self, id: &str) -> Result<(), String> {
        info!(">>> AppState.remove_request {:?}", id);

        // First, remove request from workspace requests.
        let mut requests_guard = self.requests.write().unwrap();
        let request_index = requests_guard
            .iter()
            .position(|item| item.id == id)
            .unwrap();
        requests_guard.remove(request_index);
        drop(requests_guard);

        // Second, remove from open requests if it is open.
        self.remove_open_request(id).await;

        info!("<<< AppState.remove_request {:?}", id);
        return Ok(());
    }

    pub async fn save_as(&self, filepath: &str) -> Result<(), String> {
        info!(">>> AppState.save_as {:?}", filepath);

        info!("--- AppState.save_as set filepath");
        let mut filepath_guard = self.filepath.write().unwrap();
        *filepath_guard = Some(filepath.to_string());
        drop(filepath_guard);

        self.save().await?;

        info!("<<< AppState.save_as {:?}", filepath);
        return Ok(());
    }

    /** Save the full state. */
    pub async fn save(&self) -> Result<(), String> {
        info!(">>> AppState.save");

        let filepath_guard = self.filepath.read().unwrap();
        if let None = *filepath_guard {
            info!("--- AppState.save no filepath to save to");
            return Err(format!("No filepath to save to"));
        }
        drop(filepath_guard);

        info!("--- AppState.save set `isDirty` flags to false for requests");
        let mut requests_guard = self.requests.write().unwrap();
        for request in requests_guard.iter_mut() {
            request.is_dirty = false;
        }
        drop(requests_guard);

        info!("--- AppState.save copy memory state to saved state: active request");
        {
            let mut saved_active_request_guard = self.saved_active_request.write().unwrap();
            *saved_active_request_guard = self.active_request.read().unwrap().clone();
        }

        info!("--- AppState.save copy memory state to saved state: open requests");
        {
            let mut saved_open_requests_guard = self.saved_open_requests.write().unwrap();
            *saved_open_requests_guard = self.open_requests.read().unwrap().clone();
        }

        info!("--- AppState.save copy memory state to saved state: requests");
        {
            let mut saved_requests_guard = self.saved_requests.write().unwrap();
            *saved_requests_guard = self.requests.read().unwrap().clone();
        }

        // Save to file
        info!("--- AppState.save save to file");
        let filepath_guard = self.filepath.read().unwrap();
        if let Some(ref filepath) = *filepath_guard {
            info!("--- AppState.save lock state");
            let saved_state = SavedAppState {
                saved_active_request: self.saved_active_request.read().unwrap().clone(),
                saved_filepath: self.saved_filepath.read().unwrap().clone(),
                saved_open_requests: self.saved_open_requests.read().unwrap().clone(),
                saved_requests: self.saved_requests.read().unwrap().clone(),
                active_request: self.active_request.read().unwrap().clone(),
                filepath: filepath_guard.clone(),
                open_requests: self.open_requests.read().unwrap().clone(),
                requests: self.requests.read().unwrap().clone(),
            };
            let state = serde_json::to_string(&saved_state).unwrap();
            AppState::save_to_file(filepath, &state)?;
        } else {
            info!("--- AppState.save no filepath at write time");
            return Err(format!("No filepath at write time"));
        }
        drop(filepath_guard);

        info!("<<< AppState.save");
        return Ok(());
    }

    /** Save only active */
    pub async fn save_active_as(&self, filepath: &str) -> Result<(), String> {
        // Update flag for active
        let mut filepath_guard = self.filepath.write().unwrap();
        *filepath_guard = Some(filepath.to_string());
        drop(filepath_guard);

        self.save_active()?;

        return Ok(());
    }

    /** Save only active  */
    pub fn save_active(&self) -> Result<(), String> {
        // Update flag for active
        // TODO implement

        return Ok(());
    }

    pub async fn set_active_request(&self, id: &str) -> Result<(), String> {
        // FIXME: not working as expected.
        // TODO: invert ifs to reduce repetition.
        let open_requests = self.open_requests.read().unwrap();

        // Find the request in open_requests
        if let Some(request_id) = open_requests
            .iter()
            .find(|open_request_id| *open_request_id == id)
        {
            // Set active request
            let mut active_request = self.active_request.write().unwrap();
            *active_request = Some(request_id.clone());
            return Ok(());
        }

        drop(open_requests);

        // Need to open request first.
        let requests = self.requests.read().unwrap();

        if let Some(request) = requests.iter().find(|item| item.id == id) {
            // Reacquire the open_requests lock to modify it
            let mut open_requests = self.open_requests.write().unwrap();
            open_requests.push(request.id.clone());
            drop(open_requests);

            // Set active request
            let mut active_request = self.active_request.write().unwrap();
            *active_request = Some(request.id.clone());
            drop(active_request);
            return Ok(());
        }

        return Err(format!("Cannot set current id. ID {:?} not found", id));

        // TODO: is this needed?
        // Open requests
        // const next: WorkspaceServiceState = { ...prev };
        //         let request = findById(id, prev.openRequests);
        //         if (!request) {
        //             // Need to open request first.
        //             request = findById(id, prev.requests);
        //             if (!request) {
        //                 throw new Error(
        //                     `Can not set current id. ID "${id}" not found`,
        //                 );
        //             }
        //             next.openRequests.push(request);
        //         }
        //         // Second current request
        //         next.currentRequest = findById(id, next.openRequests);
        //         return next;
    }

    pub async fn update_request(
        &self,
        id: &str,
        title: &str,
        data: Option<RequestData>,
    ) -> Result<(), String> {
        info!(">>> AppState.update_request {:?}", id);

        info!("--- AppState.update_request update in requests");
        let mut requests_guard = self.requests.write().unwrap();
        match requests_guard.iter_mut().find(|item| item.id == id) {
            Some(request) => {
                request.title = title.to_string();
                request.safe_set_data(data.clone())?;
            }
            None => {
                return Err(format!("Could not find request {:?}", id));
            }
        }
        drop(requests_guard);

        info!("<<< AppState.update_request {:?}", id);
        return Ok(());
    }

    fn save_to_file(filepath: &str, state: &str) -> Result<(), String> {
        info!(">>> AppState.save_to_file {:?}", filepath);

        let mut file = File::create(filepath).map_err(|e| e.to_string())?;
        file.write_all(state.as_bytes())
            .map_err(|e| e.to_string())?;

        info!("<<< AppState.save_to_file {:?}", filepath);
        return Ok(());
    }
}
