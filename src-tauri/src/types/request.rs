use super::{
    request_data::RequestData,
    request_result::RequestResult,
    request_type::RequestType,
};
use serde::{ Deserialize, Serialize };

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct Request<TResult> {
    pub data: RequestData,
    pub id: String,
    pub is_dirty: bool,
    pub request_type: RequestType,
    pub result: Option<RequestResult<TResult>>,
    pub title: String,
}
