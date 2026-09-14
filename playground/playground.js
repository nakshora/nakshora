// Nakshora Playground — runs @nakshora/core in the browser.
//
// The engine is platform-neutral (no Node built-ins), so the very same ESM
// bundle the CLI / PostCSS / Vite plugins consume is loaded here. Locally the
// repo checkout serves it; on a CDN-hosted copy of this page the npm release
// is used instead.

const ENGINE_SOURCES = [
  '../packages/@nakshora/core/dist/index.js',
  'https://cdn.jsdelivr.net/npm/@nakshora/core@3/dist/index.js',
];

import { PRESETS } from './presets.js';

const $ = (id) => document.getElementById(id);
const els = {
  html: $('html'),
  css: $('css'),
  preview: $('preview'),
  output: $('output'),
  outputWrap: $('output-wrap'),
  stats: $('stats'),
  error: $('error'),
  minify: $('minify'),
  preset: $('preset'),
  share: $('share'),
  copy: $('copy'),
  inspect: $('inspect'),
  inspectOut: $('inspect-out'),
};

let core;
let gen;
let lastConfigKey = '';
let timer;

async function loadEngine() {
  let lastErr;
  for (const src of ENGINE_SOURCES) {
    try {
      core = await import(src);
      return src;
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr;
}

function fmtBytes(n) {
  return n >= 1024 ? `${(n / 1024).toFixed(1)} KB` : `${n} B`;
}

function showError(msg) {
  els.error.textContent = msg;
  els.error.classList.toggle('hidden', !msg);
}

function compile() {
  if (!core) return;
  const html = els.html.value;
  let author = els.css.value;
  const minify = els.minify.checked;
  showError('');
  const t0 = performance.now();
  let css;
  try {
    let config = { content: [] };
    let rootVars = '';
    if (author && core.hasCssConfig(author)) {
      const extracted = core.extractCssConfig(author);
      author = extracted.css;
      rootVars = extracted.rootVars;
      config = core.mergeCssConfig(config, extracted.config);
    }
    const key = JSON.stringify(config);
    if (key !== lastConfigKey || !gen) {
      gen = new core.CSSGenerator(config);
      lastConfigKey = key;
    }
    const candidates = core.extractClasses([html, author]);
    css = gen.generateJITFromCandidates(candidates, { minify });
    if (author.trim()) {
      const processed = gen.processCss(author);
      css += minify ? core.minifyCss(processed) : `\n/* ─── Author CSS ─── */\n${processed}\n`;
    }
    if (rootVars) css = (minify ? core.minifyCss(rootVars) : rootVars) + css;
  } catch (err) {
    showError(String(err && err.message ? err.message : err));
    return;
  }
  const ms = performance.now() - t0;
  const classes = (css.match(/^\s*\.[^\s{,]+/gm) || []).length;
  els.stats.textContent = `${classes} rules · ${fmtBytes(core.byteLength(css))} · ${ms.toFixed(1)} ms`;
  els.output.textContent = css;
  renderPreview(html, css);
  inspect();
}

function renderPreview(html, css) {
  const doc = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${html}</body></html>`;
  els.preview.srcdoc = doc;
}

function inspect() {
  const cls = els.inspect.value.trim();
  if (!cls || !gen) {
    els.inspectOut.classList.add('hidden');
    return;
  }
  const out = gen.compileClass(cls);
  els.inspectOut.textContent = out || `/* "${cls}" is not a Nakshora class */`;
  els.inspectOut.classList.toggle('text-emerald-300', Boolean(out));
  els.inspectOut.classList.toggle('text-rose-300', !out);
  els.inspectOut.classList.remove('hidden');
}

function schedule() {
  clearTimeout(timer);
  timer = setTimeout(compile, 120);
}

function setTab(name) {
  els.preview.classList.toggle('hidden', name !== 'preview');
  els.outputWrap.classList.toggle('hidden', name !== 'output');
  els.outputWrap.classList.toggle('flex', name === 'output');
  for (const b of document.querySelectorAll('.tab')) {
    const on = b.dataset.tab === name;
    b.setAttribute('aria-selected', String(on));
    b.classList.toggle('bg-slate-800', on);
    b.classList.toggle('text-slate-100', on);
    b.classList.toggle('text-slate-400', !on);
  }
}

function encodeState() {
  const state = { h: els.html.value, c: els.css.value, m: els.minify.checked ? 1 : 0 };
  const json = JSON.stringify(state);
  return btoa(unescape(encodeURIComponent(json)));
}

function decodeState(hash) {
  try {
    const json = decodeURIComponent(escape(atob(hash)));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function loadPreset(name) {
  const p = PRESETS[name] || PRESETS.card;
  els.html.value = p.html;
  els.css.value = p.css;
  compile();
}

async function main() {
  const shared = location.hash.length > 1 ? decodeState(location.hash.slice(1)) : null;
  if (shared) {
    els.html.value = shared.h || '';
    els.css.value = shared.c || '';
    els.minify.checked = Boolean(shared.m);
  } else {
    loadPreset(els.preset.value);
  }

  els.html.addEventListener('input', schedule);
  els.css.addEventListener('input', schedule);
  els.minify.addEventListener('change', compile);
  els.inspect.addEventListener('input', inspect);
  els.preset.addEventListener('change', () => loadPreset(els.preset.value));
  for (const b of document.querySelectorAll('.tab'))
    b.addEventListener('click', () => setTab(b.dataset.tab));
  els.copy.addEventListener('click', async () => {
    await navigator.clipboard.writeText(els.output.textContent);
    els.copy.textContent = 'Copied';
    setTimeout(() => (els.copy.textContent = 'Copy'), 1200);
  });
  els.share.addEventListener('click', async () => {
    location.hash = encodeState();
    try {
      await navigator.clipboard.writeText(location.href);
      els.share.textContent = 'Link copied';
    } catch {
      els.share.textContent = 'URL updated';
    }
    setTimeout(() => (els.share.textContent = 'Share'), 1500);
  });

  try {
    const src = await loadEngine();
    els.stats.title = `engine: ${src} (v${core.version})`;
    compile();
  } catch (err) {
    showError(`Could not load @nakshora/core: ${err && err.message ? err.message : err}`);
    els.stats.textContent = 'engine failed to load';
  }
}

main();
