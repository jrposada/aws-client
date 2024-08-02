use serde::{ Deserialize, Serialize };

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct RequestResult<TData> {
    pub success: bool,
    pub data: Option<TData>,
}

impl<TData> Default for RequestResult<TData> {
    fn default() -> Self {
        Self {
            success: false,
            data: None,
        }
    }
}
