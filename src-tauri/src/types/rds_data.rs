pub struct RdsData {
    pub cluster_arn: String,
    pub database: String,
    pub profile_name: String,
    pub query: String,
    pub secret_arn: String,
}

impl RdsData {
    pub fn new() -> RdsData {
        RdsData {
            cluster_arn: String::from(
                "arn:aws:rds:us-east-1:220162591379:cluster:scon-test-supply-connections-db-cluster"
            ),
            database: String::from("scon"),
            profile_name: String::from("default"),
            query: String::from(
                "select * from connection_task_template limit 1"
            ),
            secret_arn: String::from(
                "arn:aws:secretsmanager:us-east-1:220162591379:secret:scon-supply-connections-db-test-readonly-password-secret-zuWRhJ"
            ),
        }
    }
}
