#!/usr/bin/env node
// ---------------------------------------------------------------------------
// Nakshora Docs — dependency bootstrap.
// Hosts differ: Cloudflare Pages installs the pnpm monorepo root (docs-site is
// intentionally NOT a workspace member, so its deps are skipped there). This
// guard installs docs-site's own dependencies whenever vite/react are missing,
// making `npm run build` work under any package manager.
// ---------------------------------------------------------------------------
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

let missing = false;
for (const spec of ['vite/bin/vite.js', 'react', 'react-dom']) {
  try {
    require.resolve(spec);
  } catch {
    missing = true;
  }
}

if (missing) {
  console.log('docs-site: dependencies missing — running npm install…');
  const r = spawnSync('npm', ['install', '--no-audit', '--no-fund', '--loglevel=error'], {
    stdio: 'inherit'
  });
  if (r.status !== 0) {
    console.error('docs-site: npm install failed');
    process.exit(r.status || 1);
  }
}
