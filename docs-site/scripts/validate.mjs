#!/usr/bin/env node
// ---------------------------------------------------------------------------
// Nakshora Docs — link validator. Crawls every pre-rendered HTML file in
// dist/ and verifies that all internal hrefs resolve to real files.
// ---------------------------------------------------------------------------
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');

function* walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.name.endsWith('.html')) yield p;
  }
}

const existsCache = new Set();
function resolves(href) {
  if (existsCache.has(href)) return true;
  let rel = href.split('#')[0].split('?')[0];
  if (!rel || rel.startsWith('mailto:') || rel.startsWith('http')) return null; // external/null
  if (!rel.endsWith('/')) {
    // file-style href
    if (fs.existsSync(path.join(DIST, rel))) return true;
  }
  if (rel.endsWith('/')) rel += 'index.html';
  if (fs.existsSync(path.join(DIST, rel))) {
    existsCache.add(href);
    return true;
  }
  return false;
}

let pages = 0;
let bad = 0;
const badSamples = [];
const sample = parseInt(process.argv[2] || '0', 10); // 0 = all
let seen = 0;
for (const file of walk(DIST)) {
  seen++;
  if (sample && seen > sample) break;
  pages++;
  const html = fs.readFileSync(file, 'utf8');
  const re = /href="([^"]+)"/g;
  let m;
  while ((m = re.exec(html))) {
    const href = m[1];
    const r = resolves(href);
    if (r === false) {
      bad++;
      if (badSamples.length < 40) badSamples.push(`${path.relative(DIST, file)} -> ${href}`);
    }
  }
}
console.log(`checked ${pages} pages; bad internal hrefs: ${bad}`);
if (badSamples.length) console.log(badSamples.join('\n'));
process.exit(bad ? 1 : 0);
