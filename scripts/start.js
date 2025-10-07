#!/usr/bin/env node
// Robust start script for Render/other hosts.
// Ensures server is built before starting and supports dynamic PORT.
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function run(cmd) {
  execSync(cmd, { stdio: 'inherit', cwd: __dirname + '/..' });
}

if (!existsSync(__dirname + '/../server/dist/index.js')) {
  console.log('[start] Build output missing, running build...');
  try {
    run('npm run build:server');
  } catch (e) {
    console.error('[start] Build failed.', e);
    process.exit(1);
  }
}

// Launch server
const port = process.env.PORT || 3000;
// Quick port availability check (linux lsof)
try {
  execSync(`lsof -iTCP -sTCP:LISTEN -P | grep :${port} `, { stdio: 'ignore' });
  console.error(`[start] Port ${port} already in use. If this is a dev instance, stop the other process first.`);
  process.exit(1);
} catch {
  // grep exited non-zero -> port free
}
console.log(`[start] Launching server on port ${port}...`);
run('node server/dist/index.js');
