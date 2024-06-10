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
