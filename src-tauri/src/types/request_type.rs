use serde::Serialize;
use std::str::FromStr;

#[derive(Debug, Clone, Serialize)]
pub enum RequestType {
    Rds,
}

impl FromStr for RequestType {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s.to_lowercase().as_str() {
            "rds" => Ok(RequestType::Rds),
            _ => Err(String::from("Failed to parse request type")),
        }
    }
}
