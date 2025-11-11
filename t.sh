#!/usr/bin/env bash
set -euo pipefail
echo "syncing.."

git add -u .

if git diff --cached --quiet; then
    echo 'nothing'
else
    echo "NEED commit !!!"
    git commit -m 'merged github,gitlab and local changes'
fi

if [ "$(git rev-list origin/master..HEAD)" ]; then
	echo "PUSH"
	git push
fi

echo " "
echo "OK"
