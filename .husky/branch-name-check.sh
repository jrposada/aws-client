#!/bin/sh
RED='\033[0;31m'
NC='\033[0m'

local_branch_name="$(git rev-parse --abbrev-ref HEAD)"
valid_regex='^\b(feat|fix)\b/.+$'

if ! echo "$local_branch_name" | grep -qE "$valid_regex"; then
    echo '-------------'
    echo ' Branch name '
    echo '-------------'
    echo "${RED}Error${NC} Branch name does not match pattern: $valid_regex"
    exit 1
fi
