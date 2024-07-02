use super::{ request_result::RequestResult, request_type::RequestType };
use serde::Serialize;

#[derive(Clone, Debug, Serialize)]
pub struct Request<TData, TResult> {
    pub data: TData,
    pub id: String,
    pub is_dirty: bool,
    pub request_type: RequestType,
    pub result: Option<RequestResult<TResult>>,
    pub title: String,
}
