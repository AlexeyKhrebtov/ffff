#!/usr/bin/env bash
set -euo pipefail
echo "syncing.."

if git diff --cached --quiet; then
    echo 'merged github,gitlab and local changes'
else
    echo "nothing to commit"
fi
