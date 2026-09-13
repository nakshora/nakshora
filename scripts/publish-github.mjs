#!/usr/bin/env node
// Publish all Nakshora packages to GitHub Packages (npm registry).
//
//   - npmjs.com publishing is handled automatically by the release workflow
//     (changesets). This script is the companion step for GitHub Packages.
//   - Requires: NODE_AUTH_TOKEN (or GITHUB_TOKEN) with `packages: write`, and
//     packages built (`pnpm build`).
//
// Why pack with pnpm first?
//   Changesets intentionally keeps `workspace:*` ranges in the on-disk
//   package.json files (`changeset publish` delegates to `pnpm publish`, which
//   rewrites them on the fly). Plain `npm publish` does NOT understand the
//   `workspace:` protocol and dies with
//   `Unsupported URL Type "workspace:": workspace:*`.
//   So we let `pnpm pack` produce tarballs whose manifests already contain the
//   real versions, and publish those tarballs with npm (which supports
//   --registry/--userconfig for the GitHub Packages mirror).
//
// Usage: node scripts/publish-github.mjs

import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, rmSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const REGISTRY = 'https://npm.pkg.github.com';

const token = process.env.NODE_AUTH_TOKEN ?? process.env.GITHUB_TOKEN;
if (!token) {
  console.error('❌ Missing NODE_AUTH_TOKEN / GITHUB_TOKEN environment variable.');
  process.exit(1);
}

const root = resolve(new URL('..', import.meta.url).pathname);
const packagesDir = join(root, 'packages', '@nakshora');

// npm/pnpm config used only by this script (never written into the repo tree).
const npmrcPath = join(root, '.npmrc.gh.tmp');
writeFileSync(
  npmrcPath,
  `@nakshora:registry=${REGISTRY}\n//npm.pkg.github.com/:_authToken=${token}\n`,
);
const packDir = mkdtempSync(join(tmpdir(), 'nakshora-gh-pack-'));

/** Run a command, returning { status, output } without throwing. */
function run(cmd, args, cwd) {
  try {
    const output = execFileSync(cmd, args, {
      cwd,
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    process.stdout.write(output);
    return { status: 0, output };
  } catch (error) {
    const output = `${error.stdout ?? ''}${error.stderr ?? ''}`;
    process.stdout.write(output);
    return { status: error.status ?? 1, output };
  }
}

function isAlreadyPublished(output) {
  return /cannot publish over the previously published|already published|EPUBLISHCONFLICT|EEXISTS/i.test(
    output,
  );
}

let failures = 0;
let published = 0;
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

    // 1. Pack with pnpm → tarball with `workspace:*` resolved to real versions.
    rmSync(packDir, { recursive: true, force: true });
    const pack = run('pnpm', ['pack', '--pack-destination', packDir], dir);
    const tarballs = existsSync(packDir)
      ? readdirSync(packDir).filter((f) => f.endsWith('.tgz'))
      : [];
    if (pack.status !== 0 || tarballs.length !== 1) {
      console.error(`❌ Failed to pack ${pkg.name}@${pkg.version}`);
      failures++;
      continue;
    }
    const tarball = join(packDir, tarballs[0]);

    // 2. Publish the tarball to GitHub Packages.
    const publish = run(
      'npm',
      [
        'publish',
        tarball,
        '--registry',
        REGISTRY,
        '--access',
        'public',
        `--userconfig=${npmrcPath}`,
      ],
      dir,
    );
    if (publish.status === 0) {
      console.log(`✅ Published ${pkg.name}@${pkg.version} to GitHub Packages`);
      published++;
    } else if (isAlreadyPublished(publish.output)) {
      console.log(`⏭️  ${pkg.name}@${pkg.version} is already on GitHub Packages — skipped`);
      published++;
    } else {
      console.error(`❌ Failed to publish ${pkg.name}@${pkg.version} to GitHub Packages`);
      failures++;
    }
  }
} finally {
  rmSync(npmrcPath, { force: true });
  rmSync(packDir, { recursive: true, force: true });
}

console.log(`\nGitHub Packages: ${published} published, ${failures} failed`);
process.exit(failures > 0 ? 1 : 0);
