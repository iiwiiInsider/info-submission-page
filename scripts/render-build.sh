#!/usr/bin/env sh
set -euo pipefail

echo "[render-build] Node version: $(node -v)"

echo "[render-build] Installing all workspace dependencies (including dev)" 
npm ci --workspaces

echo "[render-build] Building server" 
npm run build:server

echo "[render-build] Build complete"
