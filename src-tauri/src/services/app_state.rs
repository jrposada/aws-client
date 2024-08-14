use log::info;
use serde::{ Deserialize, Serialize };
use std::fs::File;
use std::sync::Mutex;
use uuid::Uuid;
// use std::io::Read;
use std::io::Write;
// use std::path::PathBuf;
// use tauri::{ api::path::app_data_dir, AppHandle };

use crate::{
    services::request_executor::RequestExecutor,
    types::{
        request::Request,
        request_data::RequestData,
        request_type::RequestType,
    },
};

const EXTENSION: &str = ".aws-client";

#[derive(Debug, Deserialize, Serialize)]
pub struct SavedAppState {
    /** According state write to file system, request currently active in the frontend. */
    pub saved_active_request: Option<Request>,

    /** According state write to file system, filepath of this file. */
    pub saved_filepath: Option<String>,

    /** According state write to file system, open requests in the frontend. */
    pub saved_open_requests: Vec<Request>,

    /** According state write to file system, complete list of all requests in the workspace. */
    pub saved_requests: Vec<Request>,

    /** According state in memory, request currently active in the frontend. */
    pub active_request: Option<Request>,

    /** According state in memory, filepath of this file. */
    pub filepath: Option<String>,

    /** According state in memory, open requests in the frontend. */
    pub open_requests: Vec<Request>,

    /** According state in memory, complete list of all requests in the workspace. */
    pub requests: Vec<Request>,
}

// TODO: simplify step open requests and active requests variables should only hold ids
#[derive(Debug, Deserialize, Serialize)]
pub struct AppState {
    /** According state write to file system, request currently active in the frontend. */
    pub saved_active_request: Mutex<Option<Request>>,

    /** According state write to file system, filepath of this file. */
    pub saved_filepath: Mutex<Option<String>>,

    /** According state write to file system, open requests in the frontend. */
    pub saved_open_requests: Mutex<Vec<Request>>,

    /** According state write to file system, complete list of all requests in the workspace. */
    pub saved_requests: Mutex<Vec<Request>>,

    /** According state in memory, request currently active in the frontend. */
    pub active_request: Mutex<Option<Request>>,

    /** According state in memory, filepath of this file. */
    pub filepath: Mutex<Option<String>>,

    /** According state in memory, open requests in the frontend. */
    pub open_requests: Mutex<Vec<Request>>,

    /** According state in memory, complete list of all requests in the workspace. */
    pub requests: Mutex<Vec<Request>>,
}

impl AppState {
    pub fn new() -> AppState {
        // TODO: open internal file
        AppState {
            saved_active_request: Mutex::new(None),
            saved_filepath: Mutex::new(None),
            saved_open_requests: Mutex::new(Vec::new()),
            saved_requests: Mutex::new(Vec::new()),
            active_request: Mutex::new(None),
            filepath: Mutex::new(None),
            open_requests: Mutex::new(Vec::new()),
            requests: Mutex::new(Vec::new()),
        }
    }

    pub fn add_request(
        &self,
        request_type: RequestType,
        title: &str
    ) -> Result<(), String> {
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
        let mut requests_guard = self.requests.lock().unwrap();
        requests_guard.push(request.clone());
        drop(requests_guard);

        // Add to open requests
        info!("--- AppState.add_request add to open requests");
        let mut open_requests_guard = self.open_requests.lock().unwrap();
        open_requests_guard.push(request.clone());
        drop(open_requests_guard);

        // Set as active
        info!("--- AppState.add_request set as active requests");
        let mut active_request_guard = self.active_request.lock().unwrap();
        *active_request_guard = Some(request.clone());
        drop(active_request_guard);

        info!("<<< AppState.add_request {:?}", request_type);
        return Ok(());
    }

    pub async fn execute_request(&self, id: &str) -> Result<(), String> {
        info!(">>> AppState.execute_request");

        // Find request.
        let mut _updated_request: Option<Request> = None;

        info!("--- AppState.execute_request update in requests");
        let mut requests_guard = self.requests.lock().unwrap();
        match requests_guard.iter_mut().find(|item| item.id == id) {
            Some(request) => {
                let result = RequestExecutor::execute(request).await?;
                request.safe_set_result(result)?;
                _updated_request = Some(request.clone());
            }
            None => {
                return Err(format!("Could not find request {:?}", id));
            }
        }
        drop(requests_guard);

        info!("--- AppState.execute_request update in open requests if open");
        let mut open_requests_guard = self.open_requests.lock().unwrap();
        match open_requests_guard.iter_mut().find(|item| item.id == id) {
            Some(request) => {
                match _updated_request {
                    Some(ref updated_request) => {
                        request.safe_set_result(
                            updated_request.result.clone()
                        )?;
                    }
                    None => {
                        request.safe_set_result(None)?;
                    }
                }
            }
            None => {}
        }
        drop(open_requests_guard);

        info!(
            "--- AppState.execute_request update in update active requests if active"
        );
        let mut active_request_guard = self.active_request.lock().unwrap();
        match *active_request_guard {
            Some(ref mut active_request) => {
                if active_request.id == id {
                    match _updated_request {
                        Some(updated_request) => {
                            active_request.safe_set_result(
                                updated_request.result
                            )?;
                        }
                        None => {
                            active_request.safe_set_result(None)?;
                        }
                    }
                }
            }
            None => {}
        }
        drop(active_request_guard);

        info!("<<< AppState.execute_request");
        return Ok(());
    }

    pub fn remove_open_request(&self, id: &str) -> Result<(), String> {
        info!(">>> AppState.remove_open_request {:?}", id);

        // First, remove from open requests if it is open.
        let mut open_requests_guard = self.open_requests.lock().unwrap();
        if
            let Some(open_request_index) = open_requests_guard
                .iter()
                .position(|item| item.id == id)
        {
            info!("--- AppState.remove_open_request remove");
            open_requests_guard.remove(open_request_index);
        }
        drop(open_requests_guard);

        // Second, update active request if it matches IDs.
        let mut active_request_guard = self.active_request.lock().unwrap();
        if let Some(active_request) = active_request_guard.as_mut() {
            if active_request.id == id {
                info!("--- AppState.remove_open_request is active");
                let open_requests_guard = self.open_requests.lock().unwrap();
                if let Some(last_request) = open_requests_guard.last() {
                    info!(
                        "--- AppState.remove_open_request set {:?} as active",
                        last_request.id
                    );
                    *active_request = last_request.clone();
                } else {
                    // If there is no last request, we should clear the active_request
                    info!(
                        "--- AppState.remove_open_request no candidate for active"
                    );
                    *active_request_guard = None;
                }
                drop(open_requests_guard);
            }
        }
        drop(active_request_guard);

        info!("<<< AppState.remove_open_request {:?}", id);
        return Ok(());
    }

    pub fn remove_request(&self, id: &str) -> Result<(), String> {
        info!(">>> AppState.remove_request {:?}", id);

        // First, remove request from workspace requests.
        let mut requests_guard = self.requests.lock().unwrap();
        let request_index = requests_guard
            .iter()
            .position(|item| item.id == id)
            .unwrap();
        requests_guard.remove(request_index);
        drop(requests_guard);

        // Second, remove from open requests if it is open.
        self.remove_open_request(id)?;

        info!("<<< AppState.remove_request {:?}", id);
        return Ok(());
    }

    pub fn save_as(&self, filepath: &str) -> Result<(), String> {
        info!(">>> AppState.save_as {:?}", filepath);

        info!("--- AppState.save_as set filepath");
        let mut filepath_guard = self.filepath.lock().unwrap();
        *filepath_guard = Some(filepath.to_string());
        drop(filepath_guard);

        self.save()?;

        info!("<<< AppState.save_as {:?}", filepath);
        return Ok(());
    }

    /** Save the full state. */
    pub fn save(&self) -> Result<(), String> {
        info!(">>> AppState.save");

        let filepath_guard = self.filepath.lock().unwrap();
        if let None = *filepath_guard {
            info!("--- AppState.save no filepath to save to");
            return Err(format!("No filepath to save to"));
        }
        drop(filepath_guard);

        info!("--- AppState.save set `isDirty` flags to false for requests");
        let mut requests_guard = self.requests.lock().unwrap();
        for request in requests_guard.iter_mut() {
            request.is_dirty = false;
        }
        drop(requests_guard);

        info!(
            "--- AppState.save set `isDirty` flags to false for open requests"
        );
        let mut open_requests_guard = self.open_requests.lock().unwrap();
        for open_request in open_requests_guard.iter_mut() {
            open_request.is_dirty = false;
        }
        drop(open_requests_guard);

        info!(
            "--- AppState.save set `isDirty` flags to false for active request"
        );
        let mut active_request_guard = self.active_request.lock().unwrap();
        if let Some(ref mut active_request) = *active_request_guard {
            active_request.is_dirty = false;
        }
        drop(active_request_guard);

        info!(
            "--- AppState.save copy memory state to saved state: active request"
        );
        {
            let mut saved_active_request_guard = self.saved_active_request
                .lock()
                .unwrap();
            *saved_active_request_guard = self.active_request
                .lock()
                .unwrap()
                .clone();
        }

        info!(
            "--- AppState.save copy memory state to saved state: open requests"
        );
        {
            let mut saved_open_requests_guard = self.saved_open_requests
                .lock()
                .unwrap();
            *saved_open_requests_guard = self.open_requests
                .lock()
                .unwrap()
                .clone();
        }

        info!("--- AppState.save copy memory state to saved state: requests");
        {
            let mut saved_requests_guard = self.saved_requests.lock().unwrap();
            *saved_requests_guard = self.requests.lock().unwrap().clone();
        }

        // Save to file
        info!("--- AppState.save save to file");
        let filepath_guard = self.filepath.lock().unwrap();
        if let Some(ref filepath) = *filepath_guard {
            info!("--- AppState.save lock state");
            let saved_state = SavedAppState {
                saved_active_request: self.saved_active_request
                    .lock()
                    .unwrap()
                    .clone(),
                saved_filepath: self.saved_filepath.lock().unwrap().clone(),
                saved_open_requests: self.saved_open_requests
                    .lock()
                    .unwrap()
                    .clone(),
                saved_requests: self.saved_requests.lock().unwrap().clone(),
                active_request: self.active_request.lock().unwrap().clone(),
                filepath: filepath_guard.clone(),
                open_requests: self.open_requests.lock().unwrap().clone(),
                requests: self.requests.lock().unwrap().clone(),
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
    pub fn save_active_as(&self, filepath: &str) -> Result<(), String> {
        // Update flag for active
        let mut filepath_guard = self.filepath.lock().unwrap();
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

    pub fn set_active_request(&self, id: &str) -> Result<(), String> {
        // FIXME: not working as expected.
        // TODO: invert ifs to reduce repetition.
        let open_requests = self.open_requests.lock().unwrap();

        // Find the request in open_requests
        if let Some(request) = open_requests.iter().find(|item| item.id == id) {
            // Set active request
            let mut active_request = self.active_request.lock().unwrap();
            *active_request = Some(request.clone());
            return Ok(());
        }

        drop(open_requests);

        // Need to open request first.
        let requests = self.requests.lock().unwrap();

        if let Some(request) = requests.iter().find(|item| item.id == id) {
            // Reacquire the open_requests lock to modify it
            let mut open_requests = self.open_requests.lock().unwrap();
            open_requests.push(request.clone());
            drop(open_requests);

            // Set active request
            let mut active_request = self.active_request.lock().unwrap();
            *active_request = Some(request.clone());
            drop(active_request);
            return Ok(());
        }

        return Err(format!("Cannot set current id. ID {:?} not found", id));

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

    pub fn update_request(
        &self,
        id: &str,
        title: &str,
        data: Option<RequestData>
    ) -> Result<Request, String> {
        info!(">>> AppState.update_request {:?}", id);

        let mut _updated_request: Option<Request> = None;

        info!("--- AppState.update_request update in requests");
        let mut requests_guard = self.requests.lock().unwrap();
        match requests_guard.iter_mut().find(|item| item.id == id) {
            Some(request) => {
                request.title = title.to_string();
                request.safe_set_data(data.clone())?;
                _updated_request = Some(request.clone());
            }
            None => {
                return Err(format!("Could not find request {:?}", id));
            }
        }
        drop(requests_guard);

        info!("--- AppState.update_request update in open requests if open");
        let mut open_requests_guard = self.open_requests.lock().unwrap();
        match open_requests_guard.iter_mut().find(|item| item.id == id) {
            Some(request) => {
                request.title = title.to_string();
                request.safe_set_data(data.clone())?;
            }
            None => {}
        }
        drop(open_requests_guard);

        info!(
            "--- AppState.update_request update in update active requests if active"
        );
        let mut active_request_guard = self.active_request.lock().unwrap();
        match *active_request_guard {
            Some(ref mut active_request) => {
                if active_request.id == id {
                    active_request.title = title.to_string();
                    active_request.safe_set_data(data.clone())?;
                }
            }
            None => {}
        }
        drop(active_request_guard);

        let result = match _updated_request {
            Some(request) => Ok(request),
            None => Err(format!("Could not find request {:?}", id)),
        };

        info!("<<< AppState.update_request {:?}", id);
        return result;
    }

    fn save_to_file(filepath: &str, state: &str) -> Result<(), String> {
        info!(">>> AppState.save_to_file {:?}", filepath);

        let mut file = File::create(filepath).map_err(|e| e.to_string())?;
        file.write_all(state.as_bytes()).map_err(|e| e.to_string())?;

        info!("<<< AppState.save_to_file {:?}", filepath);
        return Ok(());
    }
}
