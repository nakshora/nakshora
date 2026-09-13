#!/usr/bin/env node
// Publish all Nakshora packages to GitHub Packages (npm registry).
//
//   - npmjs.com publishing is handled automatically by the release workflow
//     (changesets). This script is the companion step for GitHub Packages.
//   - Requires: NODE_AUTH_TOKEN (or GITHUB_TOKEN) and packages built (`pnpm build`).
//
// Usage: node scripts/publish-github.mjs

import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, rmSync, writeFileSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const token = process.env.NODE_AUTH_TOKEN ?? process.env.GITHUB_TOKEN;
if (!token) {
  console.error('❌ Missing NODE_AUTH_TOKEN / GITHUB_TOKEN environment variable.');
  process.exit(1);
}

const root = resolve(new URL('..', import.meta.url).pathname);
const packagesDir = join(root, 'packages', '@nakshora');

const npmrcPath = join(root, '.npmrc.gh.tmp');
// Map the @nakshora scope to GitHub Packages (kept out of the repo)
writeFileSync(
  npmrcPath,
  `@nakshora:registry=https://npm.pkg.github.com\n//npm.pkg.github.com/:_authToken=${token}\n`,
);

let failures = 0;
try {
  const dirs = readdirSync(packagesDir).map((d) => join(packagesDir, d));
  for (const dir of dirs) {
    const pkgPath = join(dir, 'package.json');
    if (!existsSync(pkgPath)) continue;
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    if (pkg.private) continue;
    if (!existsSync(join(dir, 'dist'))) {
      console.warn(`⚠️  ${pkg.name}: no dist/ found — run \`pnpm build\` first. Skipping.`);
      failures++;
      continue;
    }
    try {
      execFileSync(
        'npm',
        [
          'publish',
          '--registry',
          'https://npm.pkg.github.com',
          '--access',
          'public',
          `--userconfig=${npmrcPath}`,
        ],
        { cwd: dir, stdio: 'inherit' },
      );
      console.log(`✅ Published ${pkg.name}@${pkg.version} to GitHub Packages`);
    } catch {
      failures++;
      console.error(`❌ Failed to publish ${pkg.name}`);
    }
  }
} finally {
  rmSync(npmrcPath, { force: true });
}

process.exit(failures > 0 ? 1 : 0);
