#!/usr/bin/env node
// Builds the landing page stylesheet: `index.html` is a JIT build of itself
// against the design-system config in `site/nakshora.config.mjs`.
//
//   node scripts/build-site.mjs           → writes site/index.min.css + playground/playground.min.css
//   node scripts/build-site.mjs --check   → exit 1 if a committed file drifted
//
// `playground/index.html` is likewise a JIT build of itself (default theme;
// the playground's own chrome only — user input is compiled live in the browser).
//
// Run `pnpm build:core` first (uses the built core package).

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
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

/** Playground chrome: JIT build of playground/index.html against the default config. */
export function buildPlaygroundCss() {
  const html = readFileSync(join(root, 'playground/index.html'), 'utf-8');
  // playground.js toggles a few classes at runtime (tabs); they live in the
  // same file so the extractor picks them up as well.
  const js = readFileSync(join(root, 'playground/playground.js'), 'utf-8');
  const generator = new CSSGenerator({ content: [] });
  const css = generator.generateJIT([html, js], { minify: false });
  return { css, min: generator.minify(css) };
}

const targets = [
  { out: join(root, 'site/index.min.css'), label: 'site/index.min.css', build: buildSiteCss },
  {
    out: join(root, 'playground/playground.min.css'),
    label: 'playground/playground.min.css',
    build: buildPlaygroundCss,
  },
];

let drifted = false;
for (const { out, label, build } of targets) {
  const { min } = build();
  if (process.argv.includes('--check')) {
    const current = existsSync(out) ? readFileSync(out, 'utf-8') : '';
    if (current !== min) {
      console.error(`❌ ${label} is out of date — run \`node scripts/build-site.mjs\``);
      drifted = true;
    } else console.log(`✅ ${label} is up to date`);
  } else {
    writeFileSync(out, min);
    console.log(`✅ ${label} — ${Buffer.byteLength(min)} B (${gzipSync(min).length} B gzip)`);
  }
}
if (drifted) process.exit(1);
