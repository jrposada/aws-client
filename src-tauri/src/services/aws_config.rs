use aws_config::BehaviorVersion;
use aws_config::meta::region::RegionProviderChain;
use aws_config::profile::ProfileFileCredentialsProvider;
use aws_config::profile::ProfileFileRegionProvider;
use aws_config::SdkConfig;

pub struct AwsConfig {}

impl AwsConfig {
    pub async fn new(profile_name: &str) -> SdkConfig {
        // Specify the profile to use
        let credentials_provider = ProfileFileCredentialsProvider::builder()
            .profile_name(profile_name)
            .build();
        let profile_region_provider = ProfileFileRegionProvider::builder()
            .profile_name(profile_name)
            .build();
        let region_provider = RegionProviderChain::first_try(profile_region_provider)
            .or_default_provider()
            .or_else("us-east-1");

        let config = aws_config
            ::defaults(BehaviorVersion::latest())
            .credentials_provider(credentials_provider)
            .region(region_provider)
            .load().await;

        return config;
    }
}
