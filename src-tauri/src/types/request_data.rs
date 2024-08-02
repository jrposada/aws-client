use serde::{ Deserialize, Serialize };

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct RequestData {
    pub profile_name: String,
}
