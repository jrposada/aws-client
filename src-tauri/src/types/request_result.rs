use serde::{ Deserialize, Serialize };

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct RequestResultData {
    pub rds: Option<String>,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct RequestResult {
    pub success: bool,
    pub data: Option<RequestResultData>,
}

impl Default for RequestResult {
    fn default() -> Self {
        Self {
            success: false,
            data: None,
        }
    }
}
