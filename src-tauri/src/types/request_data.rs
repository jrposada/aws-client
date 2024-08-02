use serde::{ Deserialize, Serialize };

use super::{ rds_data::RdsData, request_type::RequestType };

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct RequestData {
    pub rds: Option<RdsData>,
    pub profile_name: String,
}

impl RequestData {
    pub fn new(request_type: RequestType) -> RequestData {
        let mut request_data = RequestData {
            profile_name: "default".to_string(),
            rds: None,
        };

        match request_type {
            RequestType::Rds => {
                request_data.rds = Some(RdsData::new());
            }
        }

        return request_data;
    }
}
