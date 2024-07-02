use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
pub struct RequestData {
    pub profile_name: String,
}
