#!/usr/bin/env node
// Propagate a release version to the places `changeset version` does NOT
// rewrite, so the monorepo stays internally consistent after a bump.
//
// `changeset version` only touches the *published* packages' `package.json`
// files and their changelogs. Two other things carry the version by hand:
//
//   • the root `package.json` — `"private": true`, so changesets skips it
//   • `packages/@nakshora/core/src/version.ts` — the runtime `version` export
//     that feeds the CSS banners (`/*! Nakshora v… */`), `metadata` and the
//     AI corpus
//
// Everything downstream of `version.ts` is *regenerated*, never edited:
// `pnpm build` rebuilds the four packages (`dist/`, including the eight source
// maps that inline `version.ts`) plus the committed static CSS bundles
// (`dist/css/*`, `min.main.css`, `site/index.min.css`,
// `playground/playground.min.css`), and `pnpm ai:export` rewrites
// `ai/corpus.json`. Those generated files are checked in and compared
// byte-for-byte by the suite (`core/test/site.test.ts`,
// `core/test/playground.test.ts`, `core/test/version.test.ts`), so a bare
// `changeset version` leaves them stale and turns the release PR red.
//
//   node scripts/sync-version.mjs           # rewrite the two files
//   node scripts/sync-version.mjs --check   # exit 1 when either would change
//
// `pnpm release:version` chains this immediately after `changeset version`
// and before the rebuild — see `.github/workflows/release.yml`.

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// The four packages published to npm, released in lockstep.
const PACKAGES = ['core', 'cli', 'postcss', 'vite-plugin'];

const readJson = (rel) => JSON.parse(readFileSync(join(root, rel), 'utf-8'));

// The published packages are the source of truth: `changeset version` has just
// rewritten them, and they always move together.
const found = PACKAGES.map((p) => [p, readJson(`packages/@nakshora/${p}/package.json`).version]);
const distinct = [...new Set(found.map(([, v]) => v))];
if (distinct.length !== 1) {
  console.error(
    `❌ the published packages disagree on their version:\n${found
      .map(([p, v]) => `   @nakshora/${p} ${v}`)
      .join('\n')}\n   Run \`pnpm changeset version\` (or \`pnpm release:version\`) first.`,
  );
  process.exit(1);
}
const version = distinct[0];

const prettier = require('prettier');
const check = process.argv.includes('--check');
const targets = [];

/** Record a file rewrite, or (in --check mode) a would-be rewrite. */
function emit(label, absPath, next) {
  const before = readFileSync(absPath, 'utf-8');
  if (before === next) {
    console.log(`✅ ${label} already at ${version}`);
    return;
  }
  if (check) {
    console.error(`❌ ${label} is out of sync (wants ${version}) — run \`pnpm release:version\``);
    targets.push(label);
    return;
  }
  writeFileSync(absPath, next);
  console.log(`✅ ${label} → ${version}`);
}

// 1. Root package.json — formatted with prettier so `pnpm format:check` stays
//    green (the release workflow's quality gate runs it on the release PR).
{
  const rel = 'package.json';
  const absPath = join(root, rel);
  const pkg = readJson(rel);
  pkg.version = version;
  const options = (await prettier.resolveConfig(absPath)) ?? {};
  const next = await prettier.format(`${JSON.stringify(pkg, null, 2)}\n`, {
    ...options,
    filepath: absPath,
  });
  emit(rel, absPath, next);
}

// 2. core/src/version.ts — replace only the string literal, leaving the
//    surrounding comment (and therefore prettier's layout) untouched.
{
  const rel = join('packages', '@nakshora', 'core', 'src', 'version.ts');
  const absPath = join(root, rel);
  const before = readFileSync(absPath, 'utf-8');
  const next = before.replace(
    /export const version = '[^']*';/,
    `export const version = '${version}';`,
  );
  if (next === before && !before.includes(`export const version = '${version}';`)) {
    console.error(`❌ ${rel}: could not find \`export const version = '…';\` to rewrite`);
    process.exit(1);
  }
  emit(rel, absPath, next);
}

if (check && targets.length > 0) process.exit(1);

if (!check) {
  console.log(
    `\n🔁 ${version} synced. Regenerate the derived artifacts with \`pnpm build && pnpm ai:export\`\n` +
      '   (pnpm release:version does all four steps for you).',
  );
}
