#!/usr/bin/env node
// Nakshora performance benchmarks.
//
//   node scripts/benchmark.mjs                 → table on stdout
//   node scripts/benchmark.mjs --json out.json → also write machine-readable results
//   node scripts/benchmark.mjs --check         → fail (exit 1) when a metric regresses
//                                                > 10 % against perf/baseline.json
//   node scripts/benchmark.mjs --update        → rewrite perf/baseline.json
//   --baseline <file>                          → use another baseline file (CI measures
//                                                main and the PR on the same runner)
//
// Timings are medians of N runs after warm-up; sizes are exact bytes. Run
// `pnpm build:core` first (imports dist).

import { gzipSync, brotliCompressSync } from 'node:zlib';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  CSSGenerator,
  ContentCache,
  clearCatalogCache,
  minifyCss,
  scanSources,
} from '../packages/@nakshora/core/dist/index.js';

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const opt = (n) => (args.includes(n) ? args[args.indexOf(n) + 1] : undefined);
const BASELINE = resolve(opt('--baseline') ?? resolve(here, '../perf/baseline.json'));
const TOLERANCE = 0.1;
// timings must ALSO be at least this much slower in absolute terms, otherwise
// a 6 → 7 ms jitter on a shared CI runner would fail the gate
const MIN_ABS_MS = 2;

const SAMPLE_HTML = Array.from({ length: 200 }, (_, i) => {
  const n = i % 100;
  return [
    `<section class="flex flex-col md:grid md:grid-cols-${(i % 12) + 1} gap-4 p-6">`,
    `  <h2 class="text-2xl font-bold text-gray-900 tracking-tight">Section ${n}</h2>`,
    `  <div class="glass rounded-xl shadow-lg p-4 hover:shadow-2xl transition duration-300">`,
    `    <p class="text-sm text-gray-600 leading-relaxed">Content block ${n} with ` +
      `bg-blue-${(n % 9) * 100 + 100} and text-rose-${(n % 9) * 100 + 100}.`,
    `    <button class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 active:scale-95">Action</button>`,
    `    <span class="animate-pulse opacity-70">status</span>`,
    `  </div>`,
    `</section>`,
  ].join('\n');
}).join('\n');

function median(xs) {
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
}
function bench(fn, runs = 15, warm = 2) {
  for (let i = 0; i < warm; i++) fn();
  const times = [];
  for (let i = 0; i < runs; i++) {
    const t = performance.now();
    fn();
    times.push(performance.now() - t);
  }
  return median(times);
}

const metrics = {};

// ── engine start-up ──
clearCatalogCache();
metrics['ctor cold (ms)'] = bench(
  () => {
    clearCatalogCache();
    new CSSGenerator({});
  },
  25,
  3,
);
metrics['catalog cold (ms)'] = bench(
  () => {
    clearCatalogCache();
    new CSSGenerator({}).getUtilities();
  },
  15,
  2,
);
metrics['catalog memo hit: new generator + getUtilities (ms)'] = bench(
  () => new CSSGenerator({}).getUtilities(),
  15,
  2,
);

// ── JIT ──
const generator = new CSSGenerator({ content: [SAMPLE_HTML] });
metrics['JIT 200 lines cold (ms)'] = bench(
  () => new CSSGenerator({}).generateJIT([SAMPLE_HTML]),
  9,
  1,
);
metrics['JIT 200 lines warm (ms)'] = bench(() => generator.generateJIT([SAMPLE_HTML]));
const jitCss = generator.generateJIT([SAMPLE_HTML]);
metrics['JIT 200 lines minify (ms)'] = bench(() => minifyCss(jitCss));

// ── incremental scan (500 synthetic files, in-memory fs) ──
{
  const files = {};
  for (let i = 0; i < 500; i++)
    files[`/f${i}.html`] = {
      mtime: 1,
      text: Array.from(
        { length: 40 },
        (_, j) =>
          `<div class="flex p-${(j % 12) + 1} md:grid-cols-${(i % 12) + 1} hover:bg-blue-${((i + j) % 9) * 100 + 100} rounded-${['md', 'lg', 'xl'][i % 3]}">`,
      ).join('\n'),
    };
  const fs = {
    stat: (p) => (files[p] ? { mtimeMs: files[p].mtime, size: files[p].text.length } : null),
    read: (p) => files[p].text,
  };
  const paths = Object.keys(files);
  const g = new CSSGenerator({});
  metrics['500 files cold: scan + JIT (ms)'] = bench(
    () => {
      const c = new ContentCache();
      g.generateJITFromCandidates(scanSources(c, fs, paths));
    },
    5,
    1,
  );
  const cache = new ContentCache();
  g.generateJITFromCandidates(scanSources(cache, fs, paths));
  let tick = 2;
  metrics['500 files warm, 1 changed: scan + JIT (ms)'] = bench(() => {
    files['/f7.html'] = { mtime: tick++, text: files['/f7.html'].text + ' ' };
    g.generateJITFromCandidates(scanSources(cache, fs, paths));
  });
}

// ── full build ──
const full = new CSSGenerator({});
metrics['full build pretty (ms)'] = bench(() => full.generate({ mode: 'full' }), 5, 1);
const fullCss = full.generate({ mode: 'full' });
metrics['full build minify (ms)'] = bench(() => minifyCss(fullCss), 5, 1);
const fullMin = minifyCss(fullCss);
metrics['full build pretty (bytes)'] = Buffer.byteLength(fullCss);
metrics['full build min (bytes)'] = Buffer.byteLength(fullMin);
metrics['full build min gzip (bytes)'] = gzipSync(fullMin).length;
metrics['full build min brotli (bytes)'] = brotliCompressSync(fullMin).length;
metrics['JIT 200 lines (bytes)'] = Buffer.byteLength(jitCss);
metrics['JIT 200 lines min (bytes)'] = Buffer.byteLength(minifyCss(jitCss));
metrics['catalog size (utilities)'] = full.getUtilities().length;

// ── report ──
console.log('\n📊 Nakshora benchmarks (medians)\n');
const w = Math.max(...Object.keys(metrics).map((k) => k.length)) + 2;
for (const [k, v] of Object.entries(metrics))
  console.log(k.padEnd(w), k.includes('ms') ? v.toFixed(2) : String(v));

if (opt('--json')) {
  mkdirSync(dirname(resolve(opt('--json'))), { recursive: true });
  writeFileSync(
    resolve(opt('--json')),
    JSON.stringify({ date: new Date().toISOString(), node: process.version, metrics }, null, 2),
  );
}
if (flag('--update')) {
  mkdirSync(dirname(BASELINE), { recursive: true });
  const rounded = Object.fromEntries(
    Object.entries(metrics).map(([k, v]) => [k, k.includes('ms') ? Number(v.toFixed(2)) : v]),
  );
  writeFileSync(
    BASELINE,
    JSON.stringify({ node: process.version, metrics: rounded }, null, 2) + '\n',
  );
  console.log(`\nbaseline written → ${BASELINE}`);
}
if (flag('--check')) {
  const base = JSON.parse(readFileSync(BASELINE, 'utf-8')).metrics;
  const failures = [];
  console.log(
    `\nRegression check: fail when > ${TOLERANCE * 100} % slower/larger (timings also need > ${MIN_ABS_MS} ms absolute)\n`,
  );
  for (const [k, v] of Object.entries(metrics)) {
    if (!(k in base)) continue;
    const b = base[k];
    const delta = b === 0 ? 0 : (v - b) / b;
    const bad = delta > TOLERANCE && (!k.includes('ms') || v - b > MIN_ABS_MS);
    console.log(
      `${bad ? '✗' : '✓'} ${k.padEnd(w)} ${String(b).padStart(10)} → ${String(k.includes('ms') ? v.toFixed(2) : v).padStart(10)}  ${(delta * 100).toFixed(1)} %`,
    );
    if (bad) failures.push(k);
  }
  if (failures.length) {
    console.error(`\n${failures.length} metric(s) regressed > 10 %: ${failures.join(', ')}`);
    process.exit(1);
  }
  console.log('\nno regression');
}
