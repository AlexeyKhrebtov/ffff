#!/usr/bin/env bash
set -euo pipefail
echo "syncing.."
git fetch
git pull

touch `date +%F`-output.log
git add .
git commit -m "m"
git push

git add -u .

if git diff --cached --quiet; then
    echo 'nothing'
else
    echo "NEED commit !!!"
    git commit -m 'merged github,gitlab and local changes'
fi

if [ "$(git rev-list origin/main..HEAD)" ]; then
	echo "PUSH"
	git push
fi

echo " "
echo "OK"
