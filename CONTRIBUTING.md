# AWS Client developer guide

_This guide assumes you are using a Linux system like WSL or Ubuntu._

## Prerequisites

1. Rust v1.78.0. It is recommended to use rust version manager. Check [official install instructions](https://github.com/sdepold/rsvm?tab=readme-ov-file#installation).

    Once Rust version manager is installed install Rust v1.78.0

    ```bash
    rsvm install 1.78.0
    rsvm use 1.78.0
    ```

    If `rsvm` is not working check the following two lines are in your bash config file.

    ```bash
    PATH=~/.console-ninja/.bin:$PATH
    [[ -s /home/<user-name>/.rsvm/rsvm.sh ]] && . /home/<user-name>/.rsvm/rsvm.sh
    ```

2. Tauri setup. Official Linux [instructions](https://tauri.app/v1/guides/getting-started/prerequisites#setting-up-linux).

## Getting started

```bash
# Install project node dependencies
npm i
# Launch app in debug mode
npm run tauri dev
```

## Contributing

1. Pull latest main
    ```bash
    git checkout main
    git pull
    ```

2. Create branch name. Branch name must follow pattern `[feat|fix]/<short-description>`. For example `feat/dynamo-db-request` or `fix/incorrect-aws-credentials`

3. Make your changes and publish branch.

4. Open Pull Request against main. Make sure to include a short description of your changes. Make sure your PR title follow's pattern  `[feat|fix]: <short-description>`. For example `feat: dynamo-db-request` or `fix: incorrect-aws-credentials`.

    Use the following template for your description:

    ```markdown
    ## Summary
    Explain your changes.
    ```

5. Wait for your changes to be approved.

## AWS Credentials

To test app functionality you will need access to an AWS account. If you do not have one you may request one to be created.

You can refresh you local AWS credentials by running the following command. Make sure to update the profile name to match one configured in your local machine.

```bash
aws sso login --profile <your-profile>
```

### How to create a User

1. Go to **IAM Identity Center**
2. Got to **Users** section and select **Add user**
3. Fill username and click **Next**
4. Add new user to group **AWSClientDeveloper**
5. User should receive an email to setup their password and do their first login.
6. For subsequent access the will need IAM Identity Center's **AWS access portal URL**

### Configure AWS CLI

1. [Install AWS CLI 2](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) Follow Linux instructions. _Don't forget to remove installer folder once you are done._

2. Configure AWS CLI with IAM Identity Center profile

    ```bash
    aws configure sso
    ```

    ```
    SSO session name (Recommended): jrposada-sso
    SSO start URL [None]: https://d-806701903d.awsapps.com/start/#
    SSO region [None]: eu-west-3
    ```

    Choose `AWSClientDeveloper` role and `eu-west-3` region when prompted.

    For the profile name you can use whatever you prefer. For this guide we have used `aws-client-dev`

    Run `aws dynamodb list-tables --profile aws-client-dev` to test your setup.

    If everything goes correctly you should see a list of DynamoDB tables and you `~/.aws/config` file should look something like:

    ```
    [profile aws-client-dev]
    sso_session = jrposada-sso
    sso_account_id = <account-id>
    sso_role_name = AWSClientDeveloper
    region = eu-west-3
    output = json

    [sso-session jrposada-sso]
    sso_start_url = https://d-806701903d.awsapps.com/start/#
    sso_region = eu-west-3
    sso_registration_scopes = sso:account:access
    ```

## Troubleshooting

### Can not open browser

Install the following dependencies

```bash
sudo apt install wslu
```

If it still does not work afterwards:

```bash
sudo apt install -y ca-certificates fonts-liberation libasound2 libatk-bridge2.0-0 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 lsb-release wget xdg-utils
```
