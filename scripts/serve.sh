#!/usr/bin/env bash
# Start the production server on port 12000, detached, so it survives the
# session. Logs go to .logs/prod.log. Idempotent: exits if already listening.
set -u
cd "$(dirname "$0")/.."
PORT=12000
LOG=".logs/prod.log"
mkdir -p .logs

if curl -s -o /dev/null --max-time 2 "http://127.0.0.1:${PORT}/"; then
  echo "already serving on ${PORT}"
  exit 0
fi

if [ ! -d .next ]; then
  echo "no .next build — running npm run build"
  npm run build
fi

setsid nohup npx next start -H 0.0.0.0 -p "${PORT}" > "${LOG}" 2>&1 < /dev/null &
echo "started (pid $!) -> ${LOG}"