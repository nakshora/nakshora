// ---------------------------------------------------------------------------
// Nakshora Docs — dependency-free PNG decode/encode + raster helpers.
// Decode supports 8-bit color types 0/2/3/4/6 (the official brand PNGs and
// every generate_image output). Encode is the build-time raster writer.
// ---------------------------------------------------------------------------
import zlib from 'node:zlib';

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

export function encodePNG(width, height, rgba) {
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0;
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

/** decodePNG(Buffer) → { width, height, rgba: Buffer } (always RGBA8). */
export function decodePNG(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error('not a PNG');
  let pos = 8;
  let ihdr = null;
  const idat = [];
  let plte = null;
  let trns = null;
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + len);
    if (type === 'IHDR') ihdr = data;
    else if (type === 'IDAT') idat.push(data);
    else if (type === 'PLTE') plte = data;
    else if (type === 'tRNS') trns = data;
    else if (type === 'IEND') break;
    pos += 12 + len;
  }
  if (!ihdr) throw new Error('PNG missing IHDR');
  const width = ihdr.readUInt32BE(0);
  const height = ihdr.readUInt32BE(4);
  const depth = ihdr[8];
  const color = ihdr[9];
  if (depth !== 8) throw new Error(`unsupported PNG bit depth ${depth}`);
  const channels = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[color];
  if (!channels) throw new Error(`unsupported PNG color type ${color}`);
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = width * channels;
  const out = Buffer.alloc(height * stride);

  const paeth = (a, b, c) => {
    const p = a + b - c;
    const pa = Math.abs(p - a);
    const pb = Math.abs(p - b);
    const pc = Math.abs(p - c);
    if (pa <= pb && pa <= pc) return a;
    if (pb <= pc) return b;
    return c;
  };

  let rp = 0;
  for (let y = 0; y < height; y++) {
    const f = raw[rp++];
    const row = y * stride;
    const prev = row - stride;
    for (let x = 0; x < stride; x++) {
      const cur = raw[rp++];
      const a = x >= channels ? out[row + x - channels] : 0;
      const b = y > 0 ? out[prev + x] : 0;
      const c = y > 0 && x >= channels ? out[prev + x - channels] : 0;
      let v;
      switch (f) {
        case 0: v = cur; break;
        case 1: v = cur + a; break;
        case 2: v = cur + b; break;
        case 3: v = cur + ((a + b) >> 1); break;
        case 4: v = cur + paeth(a, b, c); break;
        default: throw new Error(`bad PNG filter ${f}`);
      }
      out[row + x] = v & 0xff;
    }
  }

  const rgba = Buffer.alloc(width * height * 4);
  for (let i = 0, n = width * height; i < n; i++) {
    let r = 255, g = 255, b = 255, a = 255;
    if (color === 0) { r = g = b = out[i]; }
    else if (color === 2) { r = out[i * 3]; g = out[i * 3 + 1]; b = out[i * 3 + 2]; }
    else if (color === 4) { r = g = b = out[i * 2]; a = out[i * 2 + 1]; }
    else if (color === 6) { r = out[i * 4]; g = out[i * 4 + 1]; b = out[i * 4 + 2]; a = out[i * 4 + 3]; }
    else if (color === 3) {
      const p = out[i] * 3;
      r = plte[p]; g = plte[p + 1]; b = plte[p + 2];
      a = trns ? trns[out[i]] ?? 255 : 255;
    }
    rgba[i * 4] = r; rgba[i * 4 + 1] = g; rgba[i * 4 + 2] = b; rgba[i * 4 + 3] = a;
  }
  return { width, height, rgba };
}

/** Bilinear scale of an RGBA buffer. */
export function scaleRGBA(src, sw, sh, dw, dh) {
  const out = Buffer.alloc(dw * dh * 4);
  const xr = sw / dw;
  const yr = sh / dh;
  for (let y = 0; y < dh; y++) {
    const fy = (y + 0.5) * yr - 0.5;
    const y0 = Math.max(0, Math.floor(fy));
    const y1 = Math.min(sh - 1, y0 + 1);
    const ty = fy - y0;
    for (let x = 0; x < dw; x++) {
      const fx = (x + 0.5) * xr - 0.5;
      const x0 = Math.max(0, Math.floor(fx));
      const x1 = Math.min(sw - 1, x0 + 1);
      const tx = fx - x0;
      const o = (y * dw + x) * 4;
      for (let ch = 0; ch < 4; ch++) {
        const s00 = src[(y0 * sw + x0) * 4 + ch];
        const s01 = src[(y0 * sw + x1) * 4 + ch];
        const s10 = src[(y1 * sw + x0) * 4 + ch];
        const s11 = src[(y1 * sw + x1) * 4 + ch];
        const top = s00 + (s01 - s00) * tx;
        const bot = s10 + (s11 - s10) * tx;
        out[o + ch] = Math.round(top + (bot - top) * ty);
      }
    }
  }
  return out;
}

/** Cover-scale src into dw×dh (center crop), like CSS background-size: cover. */
export function coverRGBA(src, sw, sh, dw, dh) {
  const s = Math.max(dw / sw, dh / sh);
  const cw = Math.round(dw / s);
  const chh = Math.round(dh / s);
  const ox = Math.floor((sw - cw) / 2);
  const oy = Math.floor((sh - chh) / 2);
  const cropped = Buffer.alloc(cw * chh * 4);
  for (let y = 0; y < chh; y++) {
    src.copy(cropped, y * cw * 4, ((oy + y) * sw + ox) * 4, ((oy + y) * sw + ox + cw) * 4);
  }
  if (cw === dw && chh === dh) return cropped;
  return scaleRGBA(cropped, cw, chh, dw, dh);
}

/** Alpha-composite `fg` (fw×fh) onto `bg` (bw×bh) at (ox, oy). */
export function overRGBA(bg, bw, bh, fg, fw, fh, ox, oy) {
  for (let y = 0; y < fh; y++) {
    for (let x = 0; x < fw; x++) {
      const dx = ox + x;
      const dy = oy + y;
      if (dx < 0 || dy < 0 || dx >= bw || dy >= bh) continue;
      const fi = (y * fw + x) * 4;
      const bi = (dy * bw + dx) * 4;
      const a = fg[fi + 3] / 255;
      bg[bi] = Math.round(fg[fi] * a + bg[bi] * (1 - a));
      bg[bi + 1] = Math.round(fg[fi + 1] * a + bg[bi + 1] * (1 - a));
      bg[bi + 2] = Math.round(fg[fi + 2] * a + bg[bi + 2] * (1 - a));
      bg[bi + 3] = 255;
    }
  }
  return bg;
}
