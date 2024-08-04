use super::{
    request_data::RequestData,
    request_result::RequestResult,
    request_type::RequestType,
};
use log::info;
use serde::{ Deserialize, Serialize };
use serde_json::Value;

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct Request<TResult> {
    pub data: RequestData,
    pub id: String,
    pub is_dirty: bool,
    pub request_type: RequestType,
    pub result: Option<RequestResult<TResult>>,
    pub title: String,
}

impl Request<RequestResult<Value>> {
    pub fn safe_set_data(
        &mut self,
        data: Option<RequestData>
    ) -> Result<(), String> {
        info!(">>> Request.save_set_data");
        match data {
            Some(data) => {
                Request::validate(&self.request_type, &data)?;
                info!("--- Request.save_set_data set");
                self.data = data;
                info!("<<< Request.save_set_data");
                return Ok(());
            }
            None => {
                info!("<<< Request.save_set_data");
                return Ok(());
            }
        }
    }

    fn validate(
        request_type: &RequestType,
        data: &RequestData
    ) -> Result<(), String> {
        match request_type {
            RequestType::Rds => {
                return Request::validate_rds(&data);
            }
        }
    }

    fn validate_rds(data: &RequestData) -> Result<(), String> {
        info!(">>> Request.validate_rds");

        if let None = data.rds {
            return Err("Data must not be undefined".to_string());
        }

        info!("<<< Request.validate_rds");
        return Ok(());
    }
}
