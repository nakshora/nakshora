#!/usr/bin/env node
// Builds the landing page stylesheet: `index.html` is a JIT build of itself
// against the design-system config in `site/nakshora.config.mjs`.
//
//   node scripts/build-site.mjs           → writes site/index.min.css
//   node scripts/build-site.mjs --check   → exit 1 if the committed file drifted
//
// Run `pnpm build:core` first (uses the built core package).

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { gzipSync } from 'node:zlib';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const { CSSGenerator } = await import(
  pathToFileURL(join(root, 'packages/@nakshora/core/dist/index.js')).href
);
const { default: config } = await import(
  pathToFileURL(join(root, 'site/nakshora.config.mjs')).href
);

export function buildSiteCss() {
  const html = readFileSync(join(root, 'index.html'), 'utf-8');
  const generator = new CSSGenerator(config);
  const css = generator.generateJIT(html, { minify: false });
  return { css, min: generator.minify(css) };
}

const out = join(root, 'site/index.min.css');
const { min } = buildSiteCss();
if (process.argv.includes('--check')) {
  const current = readFileSync(out, 'utf-8');
  if (current !== min) {
    console.error('❌ site/index.min.css is out of date — run `node scripts/build-site.mjs`');
    process.exit(1);
  }
  console.log('✅ site/index.min.css is up to date');
} else {
  writeFileSync(out, min);
  console.log(
    `✅ site/index.min.css — ${Buffer.byteLength(min)} B (${gzipSync(min).length} B gzip)`,
  );
}
