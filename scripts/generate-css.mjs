#!/usr/bin/env node
// Generates the repository-level static CSS bundles served via the
// GitHub CDN (jsdelivr gh): dist/css/nakshora.css + dist/css/nakshora.min.css
//
// Usage: node scripts/generate-css.mjs   (run `pnpm build:core` first)

import { cpSync, existsSync, mkdirSync } from 'node:fs';
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

console.log('✅ dist/css/nakshora.css');
console.log('✅ dist/css/nakshora.min.css');
