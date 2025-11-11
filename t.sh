#!/usr/bin/env bash
set -euo pipefail
echo "syncing.."

if git diff --cached --quiet; then
    echo 'nothing'
else
    echo "NEED commit !!!"
fi

if [ "$(git rev-list origin/master..HEAD)" ]; then
	echo "PUSH"
fi
