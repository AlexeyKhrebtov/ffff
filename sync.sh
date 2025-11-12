#!/usr/bin/env bash
set -euo pipefail
echo "syncing.."
echo "fetching changes from gitlab and github"
git fetch
git merge origin/main --no-edit --allow-unrelated-histories

echo "sleeping for three seconds"
sleep 3

echo "writing last 60 lines of the log file to tail.server.log"

tail -n 60 ~/anchor_click.js > ./r.r

git add ./r.r
git commit -m 'fresh server log'

git add -u .
if ! git diff --cached --exit-code; then
    git commit -m 'merged github,gitlab and local changes'
fi

# Чтобы гарантировать, что origin/main обновлён
git fetch origin main >/dev/null 2>&1 || echo "Warning: unable to fetch origin/main"

# --- Проверяем, что мы на ветке main ---
if [ "$(git symbolic-ref --short -q HEAD)" = "main" ]; then
  echo "On branch main"

  # --- Проверяем, есть ли изменения относительно origin/main ---
  if ! git diff --quiet origin/main; then
    echo "Changes detected — pushing..."
    git push || echo "GitLab push skipped or already up to date"
  else
    echo "No new commits to push"
  fi

else
  echo "Skipping push — detached HEAD state in GitLab CI"
fi

echo " "
echo $status
