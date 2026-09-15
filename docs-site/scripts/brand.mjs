#!/usr/bin/env node
// ---------------------------------------------------------------------------
// Nakshora Docs — brand asset generator.
// Hand-rolled rasterizer + PNG/ICO encoder (no image deps). Produces:
//   favicon.svg, favicon.ico (16/32/48), PNG favicons 16..512,
//   apple-touch-icon, maskable icon, og.png + per-version OG cards.
// The mark: an eight-point nakshatra (star) on a deep-space tile.
// ---------------------------------------------------------------------------
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import zlib from 'node:zlib';
import { decodePNG, scaleRGBA, overRGBA } from './lib/pngio.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUB = path.join(ROOT, 'public');
fs.mkdirSync(PUB, { recursive: true });

// ------------------------------------------------------------- PNG encoder
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}
function encodePNG(width, height, rgba) {
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0; // filter: none
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 6;  // RGBA
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0))
  ]);
}
function encodeICO(pngs) {
  // pngs: [{size, buf}] — PNG-in-ICO is valid for all modern browsers.
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  let offset = 6 + pngs.length * 16;
  const entries = [];
  for (const { size, buf } of pngs) {
    const e = Buffer.alloc(16);
    e[0] = size >= 256 ? 0 : size;
    e[1] = size >= 256 ? 0 : size;
    e.writeUInt16LE(1, 4);   // planes
    e.writeUInt16LE(32, 6);  // bpp
    e.writeUInt32LE(buf.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += buf.length;
    entries.push(e);
  }
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.buf)]);
}

// ------------------------------------------------------------- rasterizer
const BG_TOP = [16, 20, 58];
const BG_BOT = [36, 22, 84];
const STAR_A = [255, 214, 90];   // gold
const STAR_B = [255, 122, 190];  // rose

function lerp(a, b, t) {
  return a + (b - a) * t;
}
function lerpC(a, b, t) {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}
function starPolygon(cx, cy, R, r, n, rot = -Math.PI / 2) {
  const pts = [];
  for (let i = 0; i < n * 2; i++) {
    const rad = i % 2 === 0 ? R : r;
    const a = rot + (i * Math.PI) / n;
    pts.push([cx + rad * Math.cos(a), cy + rad * Math.sin(a)]);
  }
  return pts;
}
function pointInPoly(x, y, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
function sdRoundBox(px, py, hw, hh, r) {
  const qx = Math.abs(px) - (hw - r);
  const qy = Math.abs(py) - (hh - r);
  const ox = Math.max(qx, 0);
  const oy = Math.max(qy, 0);
  return Math.hypot(ox, oy) + Math.min(Math.max(qx, qy), 0) - r;
}

/** Render the Nakshora mark at size×size. pad shrinks the mark (for maskable). */
function renderMark(size, pad = 0) {
  const rgba = Buffer.alloc(size * size * 4);
  const SS = 3; // 3×3 supersampling
  const star = starPolygon(size / 2, size / 2, size * (0.34 - pad * 0.1), size * (0.135 - pad * 0.04), 8);
  const dots = [
    [size * 0.82, size * 0.2, size * 0.028],
    [size * 0.16, size * 0.3, size * 0.02],
    [size * 0.8, size * 0.78, size * 0.022]
  ];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let r = 0, g = 0, b = 0, a = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const px = x + (sx + 0.5) / SS;
          const py = y + (sy + 0.5) / SS;
          let cr = 0, cg = 0, cb = 0, ca = 0;
          // rounded-square tile
          const dBox = sdRoundBox(px - size / 2, py - size / 2, size / 2, size / 2, size * 0.22);
          if (dBox <= 0) {
            const t = py / size;
            [cr, cg, cb] = lerpC(BG_TOP, BG_BOT, t);
            ca = 1;
            // star with vertical gold→rose gradient
            if (pointInPoly(px, py, star)) {
              const st = Math.min(1, Math.max(0, (py - size * 0.14) / (size * 0.72)));
              [cr, cg, cb] = lerpC(STAR_A, STAR_B, st);
            }
            // constellation dots
            for (const [dx, dy, dr] of dots) {
              if (Math.hypot(px - dx, py - dy) <= dr) [cr, cg, cb] = [255, 236, 170];
            }
          }
          r += cr; g += cg; b += cb; a += ca;
        }
      }
      const n = SS * SS;
      const i = (y * size + x) * 4;
      rgba[i] = Math.round(r / n);
      rgba[i + 1] = Math.round(g / n);
      rgba[i + 2] = Math.round(b / n);
      rgba[i + 3] = Math.round((a / n) * 255);
    }
  }
  return encodePNG(size, size, rgba);
}

// ------------------------------------------------------ OG card rasterizer
const FONT = {
  A: [0b01110, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
  B: [0b11110, 0b10001, 0b10001, 0b11110, 0b10001, 0b10001, 0b11110],
  C: [0b01110, 0b10001, 0b10000, 0b10000, 0b10000, 0b10001, 0b01110],
  D: [0b11100, 0b10010, 0b10001, 0b10001, 0b10001, 0b10010, 0b11100],
  E: [0b11111, 0b10000, 0b10000, 0b11110, 0b10000, 0b10000, 0b11111],
  F: [0b11111, 0b10000, 0b10000, 0b11110, 0b10000, 0b10000, 0b10000],
  G: [0b01110, 0b10001, 0b10000, 0b10111, 0b10001, 0b10001, 0b01110],
  H: [0b10001, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
  I: [0b01110, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b01110],
  J: [0b00111, 0b00010, 0b00010, 0b00010, 0b00010, 0b10010, 0b01100],
  K: [0b10001, 0b10010, 0b10100, 0b11000, 0b10100, 0b10010, 0b10001],
  L: [0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b11111],
  M: [0b10001, 0b11011, 0b10101, 0b10101, 0b10001, 0b10001, 0b10001],
  N: [0b10001, 0b11001, 0b10101, 0b10011, 0b10001, 0b10001, 0b10001],
  O: [0b01110, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01110],
  P: [0b11110, 0b10001, 0b10001, 0b11110, 0b10000, 0b10000, 0b10000],
  Q: [0b01110, 0b10001, 0b10001, 0b10001, 0b10101, 0b10010, 0b01101],
  R: [0b11110, 0b10001, 0b10001, 0b11110, 0b10100, 0b10010, 0b10001],
  S: [0b01111, 0b10000, 0b10000, 0b01110, 0b00001, 0b00001, 0b11110],
  T: [0b11111, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100],
  U: [0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01110],
  V: [0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01010, 0b00100],
  W: [0b10001, 0b10001, 0b10001, 0b10101, 0b10101, 0b11011, 0b10001],
  X: [0b10001, 0b10001, 0b01010, 0b00100, 0b01010, 0b10001, 0b10001],
  Y: [0b10001, 0b10001, 0b01010, 0b00100, 0b00100, 0b00100, 0b00100],
  Z: [0b11111, 0b00001, 0b00010, 0b00100, 0b01000, 0b10000, 0b11111],
  '0': [0b01110, 0b10001, 0b10011, 0b10101, 0b11001, 0b10001, 0b01110],
  '1': [0b00100, 0b01100, 0b00100, 0b00100, 0b00100, 0b00100, 0b01110],
  '2': [0b01110, 0b10001, 0b00001, 0b00110, 0b01000, 0b10000, 0b11111],
  '3': [0b11110, 0b00001, 0b00001, 0b01110, 0b00001, 0b00001, 0b11110],
  '4': [0b00010, 0b00110, 0b01010, 0b10010, 0b11111, 0b00010, 0b00010],
  '5': [0b11111, 0b10000, 0b11110, 0b00001, 0b00001, 0b10001, 0b01110],
  '6': [0b01110, 0b10000, 0b10000, 0b11110, 0b10001, 0b10001, 0b01110],
  '7': [0b11111, 0b00001, 0b00010, 0b00100, 0b01000, 0b01000, 0b01000],
  '8': [0b01110, 0b10001, 0b10001, 0b01110, 0b10001, 0b10001, 0b01110],
  '9': [0b01110, 0b10001, 0b10001, 0b01111, 0b00001, 0b00001, 0b01110],
  ',': [0, 0, 0, 0, 0b01100, 0b01100, 0b10000],
  '.': [0, 0, 0, 0, 0, 0b01100, 0b01100],
  '-': [0, 0, 0, 0b11111, 0, 0, 0],
  ' ': [0, 0, 0, 0, 0, 0, 0],
  ':': [0, 0b01100, 0b01100, 0, 0b01100, 0b01100, 0],
  '×': [0, 0b10001, 0b01010, 0b00100, 0b01010, 0b10001, 0],
  '—': [0, 0, 0, 0b11111, 0, 0, 0]
};

let LOGO = null;
function logo() {
  if (!LOGO) LOGO = decodePNG(fs.readFileSync(path.join(PUB, 'brand/android-chrome-512x512.png')));
  return LOGO;
}

function renderOG({ title, subtitle, accent, file }) {
  const W = 1200, H = 630;
  const rgba = Buffer.alloc(W * H * 4);
  const miniStars = [
    [140, 90, 26, 10], [420, 120, 18, 7], [180, 520, 20, 8], [1040, 540, 26, 10], [620, 70, 16, 6]
  ].map(([x, y, R, r]) => starPolygon(x, y, R, r, 4));
  const dots = [[320, 120, 5], [760, 560, 4], [80, 320, 3], [1160, 380, 4]];

  const drawText = (text, x0, y0, scale, color) => {
    let x = x0;
    for (const ch of text.toUpperCase()) {
      const g = FONT[ch] || FONT[' '];
      for (let row = 0; row < 7; row++) {
        for (let col = 0; col < 5; col++) {
          if (g[row] & (1 << (4 - col))) {
            const px = x + col * scale, py = y0 + row * scale;
            for (let yy = 0; yy < scale; yy++) {
              for (let xx = 0; xx < scale; xx++) {
                const i = ((py + yy) * W + (px + xx)) * 4;
                if (py + yy >= 0 && py + yy < H && px + xx >= 0 && px + xx < W) {
                  rgba[i] = color[0]; rgba[i + 1] = color[1]; rgba[i + 2] = color[2]; rgba[i + 3] = 255;
                }
              }
            }
          }
        }
      }
      x += 6 * scale;
    }
  };

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const t = y / H;
      let [r, g, b] = lerpC([13, 16, 46], [40, 24, 92], t);
      // subtle diagonal nebula glow
      const glow = Math.max(0, 1 - Math.hypot(x - 1000, y - 180) / 520);
      [r, g, b] = lerpC([r, g, b], [86, 46, 128], glow * 0.5);
      for (const ms of miniStars) if (pointInPoly(x, y, ms)) [r, g, b] = [214, 205, 255];
      for (const [dx, dy, dr] of dots) if (Math.hypot(x - dx, y - dy) <= dr) [r, g, b] = [255, 236, 170];
      const i = (y * W + x) * 4;
      rgba[i] = Math.round(r); rgba[i + 1] = Math.round(g); rgba[i + 2] = Math.round(b); rgba[i + 3] = 255;
    }
  }
  const lg = logo();
  const lsz = 250;
  const lscaled = scaleRGBA(lg.rgba, lg.width, lg.height, lsz, lsz);
  overRGBA(rgba, W, H, lscaled, lsz, lsz, 905, 60);
  const subScale = Math.max(3, Math.min(6, Math.floor(1040 / (subtitle.length * 6))));
  drawText(title, 80, 300, 12, [255, 255, 255]);
  drawText(subtitle, 84, 430, subScale, [196, 190, 240]);
  drawText('DOCS.NAKSHORA.BSDC.INFO.BD', 84, 545, 3, [140, 132, 200]);
  fs.writeFileSync(file, encodePNG(W, H, rgba));
  console.log(`  ${path.relative(ROOT, file)}`);
}

// -------------------------------------------------------------------- SVG
function starPath(cx, cy, R, r, n = 8) {
  const pts = starPolygon(cx, cy, R, r, n);
  return pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`).join(' ') + ' Z';
}
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#10143a"/><stop offset="1" stop-color="#241654"/>
    </linearGradient>
    <linearGradient id="star" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffd65a"/><stop offset="1" stop-color="#ff7abe"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="url(#bg)"/>
  <path d="${starPath(32, 32, 21.5, 8.6)}" fill="url(#star)"/>
  <circle cx="52.5" cy="12.8" r="1.8" fill="#ffecaa"/>
  <circle cx="10.2" cy="19.2" r="1.3" fill="#ffecaa"/>
  <circle cx="51.2" cy="50" r="1.4" fill="#ffecaa"/>
</svg>`;
fs.writeFileSync(path.join(PUB, 'favicon.svg'), svg);

// -------------------------------------------------------------------- run
console.log('brand: generating favicons…');
const sizes = {
  'favicon-16.png': 16,
  'favicon-32.png': 32,
  'favicon-48.png': 48,
  'apple-touch-icon.png': 180,
  'android-chrome-192.png': 192,
  'android-chrome-512.png': 512
};
const pngs = {};
for (const [name, size] of Object.entries(sizes)) {
  pngs[name] = renderMark(size);
  fs.writeFileSync(path.join(PUB, name), pngs[name]);
  console.log(`  public/${name}`);
}
fs.writeFileSync(path.join(PUB, 'maskable-512.png'), renderMark(512, 1));
console.log('  public/maskable-512.png');
fs.writeFileSync(
  path.join(PUB, 'favicon.ico'),
  encodeICO([
    { size: 16, buf: pngs['favicon-16.png'] },
    { size: 32, buf: pngs['favicon-32.png'] },
    { size: 48, buf: pngs['favicon-48.png'] }
  ])
);
console.log('  public/favicon.ico');

console.log('brand: generating OG cards…');
renderOG({ title: 'NAKSHORA', subtitle: 'THE UTILITY-FIRST CSS FRAMEWORK — DOCS', file: path.join(PUB, 'og.png') });
for (const [v, tag] of [
  ['v1.0', 'THE FROZEN DESIGN SYSTEM — 1,038 CLASSES'],
  ['v2.0', 'THE COLOR ENGINE — 500 COLORS, 5 THEMES'],
  ['v3.0', 'THE JIT ERA — COMPILE ONLY WHAT YOU USE'],
  ['v3.1', 'TAILWIND 3.4 PARITY — 11,417 UTILITIES']
]) {
  renderOG({
    title: `NAKSHORA ${v}`,
    subtitle: tag,
    accent: [[255, 214, 90], [150, 190, 255]],
    file: path.join(PUB, `og-${v}.png`)
  });
}
console.log('brand: done.');
