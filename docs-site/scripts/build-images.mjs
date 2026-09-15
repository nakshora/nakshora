#!/usr/bin/env node
// ---------------------------------------------------------------------------
// Nakshora Docs — image library builder.
// Copies the first-party editorial photographs (assets-src/, AI-produced and
// royalty-free, 1408×768 ≥ Discover's 1200px rule) into public/img/ and emits
// a dimension manifest consumed by the prerender for width/height attributes.
// ---------------------------------------------------------------------------
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { IMAGE_KEYS } from './content/images.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'assets-src');
const OUT = path.join(ROOT, 'public', 'img');
fs.mkdirSync(OUT, { recursive: true });

function jpegSize(buf) {
  let p = 2;
  while (p < buf.length - 8) {
    if (buf[p] !== 0xff) { p++; continue; }
    const m = buf[p + 1];
    if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) {
      return { height: buf.readUInt16BE(p + 5), width: buf.readUInt16BE(p + 7) };
    }
    p += 2 + buf.readUInt16BE(p + 2);
  }
  return { width: 1408, height: 768 };
}

const manifest = {};
for (const key of IMAGE_KEYS) {
  const srcFile = path.join(SRC, `${key}.jpg`);
  if (!fs.existsSync(srcFile)) {
    console.warn(`  ! missing assets-src/${key}.jpg — skipping`);
    continue;
  }
  const buf = fs.readFileSync(srcFile);
  fs.writeFileSync(path.join(OUT, `${key}.jpg`), buf);
  manifest[key] = jpegSize(buf);
  console.log(`  img/${key}.jpg ${manifest[key].width}×${manifest[key].height}`);
}
fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 1));
console.log(`✔ image library: ${Object.keys(manifest).length} photographs`);
