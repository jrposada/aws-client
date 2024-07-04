use log::info;
use serde_json::Value;
use std::sync::Mutex;
use uuid::Uuid;

use crate::types::{
    request::Request,
    request_data::RequestData,
    request_result::RequestResult,
    request_type::RequestType,
};

pub struct AppState {
    pub active_request: Mutex<
        Option<Request<RequestData, RequestResult<Value>>>
    >,
    pub filepath: Mutex<Option<String>>,
    pub open_requests: Mutex<Vec<Request<RequestData, RequestResult<Value>>>>,
    pub requests: Mutex<Vec<Request<RequestData, RequestResult<Value>>>>,
}

impl AppState {
    pub fn add_request(&self, request_type: RequestType) {
        info!(">>> AppState.add_request");

        let id = Uuid::new_v4().to_string();
        // TODO move title to frontend so that it can be localized.
        let title = format!("New Request: {:?}", request_type);

        let request: Request<RequestData, RequestResult<Value>> = Request {
            data: RequestData {
                profile_name: Default::default(),
            },
            id,
            is_dirty: true,
            request_type,
            result: None,
            title,
        };

        // Add to requests
        info!(">>> AppState.add_request add to requests");
        let mut requests_guard = self.requests.lock().unwrap();
        requests_guard.push(request.clone());
        drop(requests_guard);

        // Add to open requests
        info!(">>> AppState.add_request add to open requests");
        let mut open_requests_guard = self.open_requests.lock().unwrap();
        open_requests_guard.push(request.clone());
        drop(open_requests_guard);

        // Set as active
        info!(">>> AppState.add_request set as active requests");
        let mut active_request_guard = self.active_request.lock().unwrap();
        *active_request_guard = Some(request.clone());
        drop(active_request_guard);

        info!("<<< AppState.add_request");
    }

    pub fn remove_open_request(&self, id: &str) -> Result<(), String> {
        // First, remove from open requests if it is open.
        let mut open_requests_guard = self.open_requests.lock().unwrap();
        if
            let Some(open_request_index) = open_requests_guard
                .iter()
                .position(|item| item.id == id)
        {
            open_requests_guard.remove(open_request_index);
        }
        drop(open_requests_guard);

        // Second, update active request if it matches IDs.
        let mut active_request_guard = self.active_request.lock().unwrap();
        if let Some(active_request) = active_request_guard.as_mut() {
            if active_request.id == id {
                let open_requests_guard = self.open_requests.lock().unwrap();
                if let Some(last_request) = open_requests_guard.last() {
                    *active_request = last_request.clone();
                } else {
                    // If there is no last request, we should clear the active_request
                    *active_request_guard = None;
                }
                drop(open_requests_guard);
            }
        }
        drop(active_request_guard);

        Ok(())
    }

    pub fn remove_request(&self, id: &str) -> Result<(), String> {
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

        Ok(())
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

        Err(format!("Cannot set current id. ID {:?} not found", id))

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
}
