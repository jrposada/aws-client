use serde::{ Deserialize, Serialize };

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct RdsData {
    pub cluster_arn: String,
    pub database: String,
    pub query: String,
    pub secret_arn: String,
}

impl RdsData {
    pub fn new() -> RdsData {
        RdsData {
            cluster_arn: "arn:aws:rds:us-east-1:220162591379:cluster:scon-test-supply-connections-db-cluster".to_string(),
            database: "scon".to_string(),
            query: "select * from connection_task_template limit 1".to_string(),
            secret_arn: "arn:aws:secretsmanager:us-east-1:220162591379:secret:scon-supply-connections-db-test-readonly-password-secret-zuWRhJ".to_string(),
        }
    }
}
