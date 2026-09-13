#!/usr/bin/env node
// Nakshora performance benchmarks
// Usage: node scripts/benchmark.mjs   (run `pnpm build:core` first)

import { CSSGenerator, minifyCss } from '../packages/@nakshora/core/dist/index.js';

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

function bench(name, fn) {
  // warm-up
  fn();
  const runs = 20;
  const start = process.hrtime.bigint();
  for (let i = 0; i < runs; i++) fn();
  const elapsed = Number(process.hrtime.bigint() - start) / 1e6 / runs;
  return { name, ms: elapsed };
}

const generator = new CSSGenerator({
  content: [SAMPLE_HTML],
});

const fullCss = generator.generate({ mode: 'full' });
const fullMin = minifyCss(fullCss);
const jitCss = generator.generate({ mode: 'jit' });
const jitMin = minifyCss(jitCss);

const results = [
  bench('full build (all utilities, unminified)', () => generator.generate({ mode: 'full' })),
  bench('full build + minify', () => minifyCss(fullCss)),
  bench('JIT build (200 lines of HTML)', () => generator.generate({ mode: 'jit' })),
  bench('JIT build + minify', () => minifyCss(jitCss)),
];

console.log('\n📊 Nakshora benchmarks\n');
console.log('Operation'.padEnd(42), 'ms/run');
console.log('─'.repeat(56));
for (const r of results) {
  console.log(r.name.padEnd(42), r.ms.toFixed(2));
}
console.log('─'.repeat(56));
console.log(
  '\nSizes: full',
  (fullCss.length / 1024).toFixed(0) + 'KB →',
  (fullMin.length / 1024).toFixed(0) + 'KB min · JIT',
  (jitCss.length / 1024).toFixed(1) + 'KB →',
  (jitMin.length / 1024).toFixed(1) + 'KB min',
);
