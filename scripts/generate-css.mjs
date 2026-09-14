#!/usr/bin/env node
// Generates the repository-level static CSS bundles served via the
// GitHub CDN (jsdelivr gh):
//   dist/css/nakshora.css       pretty full build
//   dist/css/nakshora.min.css   minified full build
//   min.main.css                the historical CDN entry point — byte-identical
//                               to dist/css/nakshora.min.css (drift-tested)
//   dist/css/nakshora.min.css.br / .gz   precompressed (brotli 11 / gzip 9) for
//                               static hosts that serve sidecar files
//                               (nginx gzip_static/brotli_static, Netlify,
//                               Cloudflare Pages, S3+CloudFront). jsDelivr
//                               compresses on the fly and ignores them.
// The frozen v1.0.0 stylesheet lives on at minified-version/v1.0.0.css.
//
// Usage: node scripts/generate-css.mjs   (run `pnpm build:core` first)

import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { brotliCompressSync, constants, gzipSync } from 'node:zlib';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = join(root, 'packages', '@nakshora', 'core', 'dist');
const outDir = join(root, 'dist', 'css');

if (!existsSync(join(srcDir, 'nakshora.min.css'))) {
  console.error('❌ core dist missing — run `pnpm build:core` first.');
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
cpSync(join(srcDir, 'nakshora.css'), join(outDir, 'nakshora.css'));
cpSync(join(srcDir, 'nakshora.min.css'), join(outDir, 'nakshora.min.css'));
cpSync(join(srcDir, 'nakshora.min.css'), join(root, 'min.main.css'));

const min = readFileSync(join(outDir, 'nakshora.min.css'));
const br = brotliCompressSync(min, {
  params: {
    [constants.BROTLI_PARAM_QUALITY]: 11,
    [constants.BROTLI_PARAM_SIZE_HINT]: min.length,
    [constants.BROTLI_PARAM_MODE]: constants.BROTLI_MODE_TEXT,
  },
});
const gz = gzipSync(min, { level: 9 });
writeFileSync(join(outDir, 'nakshora.min.css.br'), br);
writeFileSync(join(outDir, 'nakshora.min.css.gz'), gz);

console.log('✅ dist/css/nakshora.css');
console.log('✅ dist/css/nakshora.min.css');
console.log('✅ min.main.css (= dist/css/nakshora.min.css)');
console.log(
  `✅ dist/css/nakshora.min.css.br (${br.length} B) / .gz (${gz.length} B) — from ${min.length} B`,
);
