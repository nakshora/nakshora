#!/usr/bin/env node
// Core build step: emit the static full-build CSS bundles into dist/
//   dist/nakshora.css      (readable)
//   dist/nakshora.min.css  (minified)
// These ship with the npm package and can be served from any CDN.

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CSSGenerator, minifyCss } from '../dist/index.js';

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
mkdirSync(dist, { recursive: true });

const generator = new CSSGenerator();
const css = generator.generate({ mode: 'full', minify: false });
const min = minifyCss(css);

writeFileSync(join(dist, 'nakshora.css'), css, 'utf-8');
writeFileSync(join(dist, 'nakshora.min.css'), min, 'utf-8');

console.log(
  `   ⬢ dist/nakshora.css (${(css.length / 1024).toFixed(0)} KB) · nakshora.min.css (${(min.length / 1024).toFixed(0)} KB)`,
);
