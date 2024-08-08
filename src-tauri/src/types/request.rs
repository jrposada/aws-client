use super::{
    request_data::RequestData,
    request_result::RequestResult,
    request_type::RequestType,
};
use log::info;
use serde::{ Deserialize, Serialize };

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct Request {
    pub data: RequestData,
    pub id: String,
    pub is_dirty: bool,
    pub request_type: RequestType,
    pub result: Option<RequestResult>,
    pub title: String,
}

impl Request {
    pub fn safe_set_data(
        &mut self,
        data: Option<RequestData>
    ) -> Result<(), String> {
        info!(">>> Request.save_set_data");
        match data {
            Some(data) => {
                Request::validate_data(&self.request_type, &data)?;
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

    pub fn safe_set_result(
        &mut self,
        result: Option<RequestResult>
    ) -> Result<(), String> {
        info!(">>> Request.safe_set_result");
        match result {
            Some(result) => {
                Request::validate_result(&self.request_type, &result)?;
                info!("--- Request.safe_set_result set");
                self.result = Some(result);
                info!("<<< Request.safe_set_result");
                return Ok(());
            }
            None => {
                info!("<<< Request.safe_set_result");
                self.result = None;
                return Ok(());
            }
        }
    }

    fn validate_data(
        request_type: &RequestType,
        data: &RequestData
    ) -> Result<(), String> {
        match request_type {
            RequestType::Rds => {
                return Request::validate_data_rds(&data);
            }
        }
    }

    fn validate_data_rds(data: &RequestData) -> Result<(), String> {
        info!(">>> Request.validate_data_rds");

        if let None = data.rds {
            return Err("Data.rds must not be undefined".to_string());
        }

        info!("<<< Request.validate_data_rds");
        return Ok(());
    }

    fn validate_result(
        request_type: &RequestType,
        result: &RequestResult
    ) -> Result<(), String> {
        match request_type {
            RequestType::Rds => {
                return Request::validate_result_rds(&result);
            }
        }
    }

    fn validate_result_rds(result: &RequestResult) -> Result<(), String> {
        info!(">>> Request.validate_result_rds");

        if let None = result.data {
            return Err("Data must not be undefined".to_string());
        }

        if let None = result.data.as_ref().unwrap().rds {
            return Err("Data.rds must not be undefined".to_string());
        }

        info!("<<< Request.validate_result_rds");
        return Ok(());
    }
}
