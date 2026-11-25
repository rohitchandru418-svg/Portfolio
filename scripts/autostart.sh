#!/usr/bin/env bash
# Bring the preview server back if it is not running. Safe to call repeatedly
# and from a login shell: it exits immediately when port 12000 already answers.
set -u
PORT=12000
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LOCK="/tmp/portfolio-autostart.lock"

curl -s -o /dev/null --max-time 1 "http://127.0.0.1:${PORT}/" && exit 0

# One starter at a time (several shells may open at once after a restart).
mkdir "$LOCK" 2>/dev/null || exit 0
trap 'rmdir "$LOCK" 2>/dev/null' EXIT

cd "$ROOT" || exit 0
setsid nohup ./scripts/serve.sh >/dev/null 2>&1 < /dev/null &