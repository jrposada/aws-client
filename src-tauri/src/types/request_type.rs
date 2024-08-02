use std::str::FromStr;
use serde::{ Deserialize, Deserializer, Serialize, Serializer };

#[derive(Clone, Copy, Debug)]
pub enum RequestType {
    Rds,
}

impl FromStr for RequestType {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s.to_lowercase().as_str() {
            "rds" => Ok(RequestType::Rds),
            _ => Err("Failed to parse request type".to_string()),
        }
    }
}

impl ToString for RequestType {
    fn to_string(&self) -> String {
        match *self {
            RequestType::Rds => "rds".to_string(),
        }
    }
}

// Implement Serialize for RequestType
impl Serialize for RequestType {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
        where S: Serializer
    {
        serializer.serialize_str(&self.to_string())
    }
}

// Implement Deserialize for RequestType
impl<'de> Deserialize<'de> for RequestType {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
        where D: Deserializer<'de>
    {
        let s = String::deserialize(deserializer)?;
        RequestType::from_str(&s).map_err(serde::de::Error::custom)
    }
}
