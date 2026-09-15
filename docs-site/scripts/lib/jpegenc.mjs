// ---------------------------------------------------------------------------
// Nakshora Docs — dependency-free baseline JPEG encoder (JFIF, 4:4:4).
// Used only at build time for the article image library (~a few dozen files),
// keeping the deployed image payload ~10× smaller than PNG.
// ---------------------------------------------------------------------------

const ZIGZAG = [
  0, 1, 8, 16, 9, 2, 3, 10, 17, 24, 32, 25, 18, 11, 4, 5,
  12, 19, 26, 33, 40, 48, 41, 34, 27, 20, 13, 6, 7, 14, 21, 28,
  35, 42, 49, 56, 57, 50, 43, 36, 29, 22, 15, 23, 30, 37, 44, 51,
  58, 59, 52, 45, 38, 31, 39, 46, 53, 60, 61, 54, 47, 55, 62, 63
];

const QT_Y = [
  16, 11, 10, 16, 24, 40, 51, 61, 12, 12, 14, 19, 26, 58, 60, 55,
  14, 13, 16, 24, 40, 57, 69, 56, 14, 17, 22, 29, 51, 87, 80, 62,
  18, 22, 37, 56, 68, 109, 103, 77, 24, 35, 55, 64, 81, 104, 113, 92,
  49, 64, 78, 87, 103, 121, 120, 101, 72, 92, 95, 98, 112, 100, 103, 99
];
const QT_C = [
  17, 18, 24, 47, 99, 99, 99, 99, 18, 21, 26, 66, 99, 99, 99, 99,
  24, 26, 56, 99, 99, 99, 99, 99, 47, 66, 99, 99, 99, 99, 99, 99,
  99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99,
  99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99
];

const DC_Y_BITS = [0, 0, 1, 5, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0];
const DC_Y_VALS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const DC_C_BITS = [0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0];
const DC_C_VALS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const AC_Y_BITS = [0, 0, 2, 1, 3, 3, 2, 4, 3, 5, 5, 4, 4, 0, 0, 1, 125];
const AC_Y_VALS = [
  0x01, 0x02, 0x03, 0x00, 0x04, 0x11, 0x05, 0x12, 0x21, 0x31, 0x41, 0x06, 0x13, 0x51, 0x61, 0x07,
  0x22, 0x71, 0x14, 0x32, 0x81, 0x91, 0xa1, 0x08, 0x23, 0x42, 0xb1, 0xc1, 0x15, 0x52, 0xd1, 0xf0,
  0x24, 0x33, 0x62, 0x72, 0x82, 0x09, 0x0a, 0x16, 0x17, 0x18, 0x19, 0x1a, 0x25, 0x26, 0x27, 0x28,
  0x29, 0x2a, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3a, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49,
  0x4a, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59, 0x5a, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69,
  0x6a, 0x73, 0x74, 0x75, 0x76, 0x77, 0x78, 0x79, 0x7a, 0x83, 0x84, 0x85, 0x86, 0x87, 0x88, 0x89,
  0x8a, 0x92, 0x93, 0x94, 0x95, 0x96, 0x97, 0x98, 0x99, 0x9a, 0xa2, 0xa3, 0xa4, 0xa5, 0xa6, 0xa7,
  0xa8, 0xa9, 0xaa, 0xb2, 0xb3, 0xb4, 0xb5, 0xb6, 0xb7, 0xb8, 0xb9, 0xba, 0xc2, 0xc3, 0xc4, 0xc5,
  0xc6, 0xc7, 0xc8, 0xc9, 0xca, 0xd2, 0xd3, 0xd4, 0xd5, 0xd6, 0xd7, 0xd8, 0xd9, 0xda, 0xe1, 0xe2,
  0xe3, 0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9, 0xea, 0xf1, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xf8,
  0xf9, 0xfa
];
const AC_C_BITS = [0, 0, 2, 1, 2, 4, 4, 3, 4, 7, 5, 4, 4, 0, 1, 2, 119];
const AC_C_VALS = [
  0x00, 0x01, 0x02, 0x03, 0x11, 0x04, 0x05, 0x21, 0x31, 0x06, 0x12, 0x41, 0x51, 0x07, 0x61, 0x71,
  0x13, 0x22, 0x32, 0x81, 0x08, 0x14, 0x42, 0x91, 0xa1, 0xb1, 0xc1, 0x09, 0x23, 0x33, 0x52, 0xf0,
  0x15, 0x62, 0x72, 0xd1, 0x0a, 0x16, 0x24, 0x34, 0xe1, 0x25, 0xf1, 0x17, 0x18, 0x19, 0x1a, 0x26,
  0x27, 0x28, 0x29, 0x2a, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3a, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48,
  0x49, 0x4a, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59, 0x5a, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68,
  0x69, 0x6a, 0x73, 0x74, 0x75, 0x76, 0x77, 0x78, 0x79, 0x7a, 0x82, 0x83, 0x84, 0x85, 0x86, 0x87,
  0x88, 0x89, 0x8a, 0x92, 0x93, 0x94, 0x95, 0x96, 0x97, 0x98, 0x99, 0x9a, 0xa2, 0xa3, 0xa4, 0xa5,
  0xa6, 0xa7, 0xa8, 0xa9, 0xaa, 0xb2, 0xb3, 0xb4, 0xb5, 0xb6, 0xb7, 0xb8, 0xb9, 0xba, 0xc2, 0xc3,
  0xc4, 0xc5, 0xc6, 0xc7, 0xc8, 0xc9, 0xca, 0xd2, 0xd3, 0xd4, 0xd5, 0xd6, 0xd7, 0xd8, 0xd9, 0xda,
  0xe2, 0xe3, 0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9, 0xea, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xf8,
  0xf9, 0xfa
];

function buildHuff(bits, vals) {
  const codes = new Map();
  let code = 0;
  let k = 0;
  for (let len = 1; len <= 16; len++) {
    for (let i = 0; i < bits[len]; i++) {
      codes.set(vals[k++], [code++, len]);
    }
    code <<= 1;
  }
  return codes;
}

function scaleQT(base, quality) {
  const q = Math.min(100, Math.max(1, quality));
  const s = q < 50 ? Math.floor(5000 / q) : 200 - q * 2;
  return base.map((v) => Math.max(1, Math.min(255, Math.floor((v * s + 50) / 100))));
}

class BitWriter {
  constructor() {
    this.bytes = [];
    this.acc = 0;
    this.nbits = 0;
  }
  write(code, len) {
    for (let i = len - 1; i >= 0; i--) {
      this.acc = (this.acc << 1) | ((code >> i) & 1);
      this.nbits++;
      if (this.nbits === 8) {
        this.bytes.push(this.acc);
        if (this.acc === 0xff) this.bytes.push(0x00);
        this.acc = 0;
        this.nbits = 0;
      }
    }
  }
  flush() {
    if (this.nbits > 0) {
      this.write((1 << (8 - this.nbits)) - 1, 8 - this.nbits);
    }
  }
  buffer() {
    return Buffer.from(this.bytes);
  }
}

const COS = (() => {
  const t = new Float64Array(64);
  for (let u = 0; u < 8; u++) for (let x = 0; x < 8; x++) t[u * 8 + x] = Math.cos(((2 * x + 1) * u * Math.PI) / 16);
  return t;
})();
const CU = [Math.SQRT1_2, 1, 1, 1, 1, 1, 1, 1];

function fdct(block) {
  const out = new Float64Array(64);
  const tmp = new Float64Array(64);
  for (let x = 0; x < 8; x++) {
    for (let v = 0; v < 8; v++) {
      let s = 0;
      for (let y = 0; y < 8; y++) s += block[x * 8 + y] * COS[v * 8 + y];
      tmp[x * 8 + v] = s * CU[v];
    }
  }
  for (let u = 0; u < 8; u++) {
    for (let v = 0; v < 8; v++) {
      let s = 0;
      for (let x = 0; x < 8; x++) s += tmp[x * 8 + v] * COS[u * 8 + x];
      out[u * 8 + v] = 0.25 * CU[u] * s;
    }
  }
  return out;
}

/** encodeJPEG({width,height,rgba}, quality=82) → Buffer */
export function encodeJPEG(img, quality = 82) {
  const { width, height, rgba } = img;
  const qtY = scaleQT(QT_Y, quality);
  const qtC = scaleQT(QT_C, quality);
  const huffDCY = buildHuff(DC_Y_BITS, DC_Y_VALS);
  const huffDCc = buildHuff(DC_C_BITS, DC_C_VALS);
  const huffACY = buildHuff(AC_Y_BITS, AC_Y_VALS);
  const huffACc = buildHuff(AC_C_BITS, AC_C_VALS);

  // RGB → YCbCr planes
  const n = width * height;
  const Y = new Float64Array(n);
  const Cb = new Float64Array(n);
  const Cr = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const r = rgba[i * 4];
    const g = rgba[i * 4 + 1];
    const b = rgba[i * 4 + 2];
    Y[i] = 0.299 * r + 0.587 * g + 0.114 * b;
    Cb[i] = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
    Cr[i] = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;
  }

  const bw = new BitWriter();
  const prevDC = [0, 0, 0];

  function encodeBlock(get, plane, qt, huffDC, huffAC) {
    const blk = new Float64Array(64);
    for (let i = 0; i < 64; i++) blk[i] = get(i) - 128;
    const dct = fdct(blk);
    const q = new Int32Array(64);
    for (let i = 0; i < 64; i++) q[i] = Math.round(dct[i] / qt[i]);
    const zz = ZIGZAG.map((i) => q[i]);

    // DC
    const diff = zz[0] - prevDC[plane];
    prevDC[plane] = zz[0];
    let cat = 0;
    let av = Math.abs(diff);
    while (av > 0) { cat++; av >>= 1; }
    const [dcCode, dcLen] = huffDC.get(cat);
    bw.write(dcCode, dcLen);
    if (cat > 0) {
      const bits = diff >= 0 ? diff : diff + (1 << cat) - 1;
      bw.write(bits, cat);
    }
    // AC
    let zeroRun = 0;
    for (let k = 1; k < 64; k++) {
      if (zz[k] === 0) { zeroRun++; continue; }
      while (zeroRun > 15) {
        const [zc, zl] = huffAC.get(0xf0);
        bw.write(zc, zl);
        zeroRun -= 16;
      }
      let acat = 0;
      let v = Math.abs(zz[k]);
      while (v > 0) { acat++; v >>= 1; }
      const sym = (zeroRun << 4) | acat;
      const [ac, al] = huffAC.get(sym);
      bw.write(ac, al);
      const bits = zz[k] >= 0 ? zz[k] : zz[k] + (1 << acat) - 1;
      bw.write(bits, acat);
      zeroRun = 0;
    }
    if (zeroRun > 0) {
      const [ec, el] = huffAC.get(0x00);
      bw.write(ec, el);
    }
  }

  const bx = Math.ceil(width / 8);
  const by = Math.ceil(height / 8);
  for (let byi = 0; byi < by; byi++) {
    for (let bxi = 0; bxi < bx; bxi++) {
      const at = (x, y) => {
        const cx = Math.min(width - 1, bxi * 8 + x);
        const cy = Math.min(height - 1, byi * 8 + y);
        return cy * width + cx;
      };
      encodeBlock((i) => Y[at(i % 8, (i / 8) | 0)], 0, qtY, huffDCY, huffACY);
      encodeBlock((i) => Cb[at(i % 8, (i / 8) | 0)], 1, qtC, huffDCc, huffACc);
      encodeBlock((i) => Cr[at(i % 8, (i / 8) | 0)], 2, qtC, huffDCc, huffACc);
    }
  }
  bw.flush();

  // ---- headers
  const parts = [];
  const u16 = (v) => Buffer.from([v >> 8, v & 0xff]);
  parts.push(Buffer.from([0xff, 0xd8])); // SOI
  // APP0
  parts.push(Buffer.from([0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00]));
  // DQT
  for (const [id, qt] of [[0, qtY], [1, qtC]]) {
    const body = Buffer.concat([Buffer.from([id]), Buffer.from(qt)]);
    parts.push(Buffer.from([0xff, 0xdb]), u16(body.length + 2), body);
  }
  // SOF0
  const sof = Buffer.concat([
    Buffer.from([8, 3]),
    u16(height), u16(width),
    Buffer.from([
      1, 0x11, 0,
      2, 0x11, 1,
      3, 0x11, 1
    ])
  ]);
  parts.push(Buffer.from([0xff, 0xc0]), u16(sof.length + 2), sof);
  // DHT
  const dhts = [
    [0x00, DC_Y_BITS, DC_Y_VALS],
    [0x10, AC_Y_BITS, AC_Y_VALS],
    [0x01, DC_C_BITS, DC_C_VALS],
    [0x11, AC_C_BITS, AC_C_VALS]
  ];
  for (const [id, bits, vals] of dhts) {
    const body = Buffer.concat([Buffer.from([id]), Buffer.from(bits.slice(1)), Buffer.from(vals)]);
    parts.push(Buffer.from([0xff, 0xc4]), u16(body.length + 2), body);
  }
  // SOS
  const sos = Buffer.from([3, 1, 0x00, 2, 0x11, 3, 0x11, 0, 63, 0]);
  parts.push(Buffer.from([0xff, 0xda]), u16(sos.length + 2), sos);
  parts.push(bw.buffer());
  parts.push(Buffer.from([0xff, 0xd9])); // EOI
  return Buffer.concat(parts);
}
