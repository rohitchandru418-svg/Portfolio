#!/usr/bin/env bash
# Stop the production server started by scripts/serve.sh.
set -u
pkill -f "next-server" 2>/dev/null
pkill -f "next start" 2>/dev/null
sleep 1
echo "stopped"