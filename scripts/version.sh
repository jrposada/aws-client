#!/bin/sh

# Check if the version argument is provided
if [ -z "$1" ]; then
  echo "Error: Version argument is required."
  echo "Usage: $0 <version>"
  exit 1
fi

VERSION=$1
SCRIPT_DIR=$(dirname "$(readlink -f "$0")")

# Update version in tauri.conf.json
TAURI_FILEPATH="$SCRIPT_DIR/../src-tauri/tauri.conf.json"
if [ -f "$TAURI_FILEPATH" ]; then
  sed -i.bak -E "s/\"version\": \".*\"/\"version\": \"$VERSION\"/" $TAURI_FILEPATH
  echo "Updated version in $TAURI_FILEPATH to $VERSION"
else
  echo "Error: tauri.conf.json not found!"
fi

# Update version in package.json
PACKAGE_FILEPATH="$SCRIPT_DIR/../package.json"
if [ -f "package.json" ]; then
  sed -i.bak -E "s/\"version\": \".*\"/\"version\": \"$VERSION\"/" package.json
  echo "Updated version in package.json to $VERSION"
else
  echo "Error: package.json not found!"
fi

# Cleanup backup files
rm -f $SCRIPT_DIR/../src-tauri/tauri.conf.json.bak package.json.bak

echo "Version update complete."
