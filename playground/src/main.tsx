/* Nakshora CSS Playground — the most advanced Nakshora playground.
 * React 18 + Vite + TS. The REAL Nakshora 3.1 compiler runs in the browser:
 * every keystroke is JIT-compiled client-side and rendered instantly. */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { compile, ENGINE_VERSION, VARIANT_COUNT, VARIANT_NAMES, BREAKPOINTS, formatBytes } from './engine';
import type { CompileResult } from './engine';
import { TEMPLATES, TEMPLATE_CATS, type Template } from './data/templates';
import { fullRegistry } from './data/features';
import './chrome.css';

// ------------------------------------------------------------------- utils
const cn = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(' ');

function useRoute() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    const onNav = () => setPath(window.location.pathname);
    window.addEventListener('nx-nav', onNav);
    return () => { window.removeEventListener('popstate', onPop); window.removeEventListener('nx-nav', onNav); };
  }, []);
  return path;
}
function navigate(to: string) {
  window.history.pushState({}, '', to);
  window.dispatchEvent(new Event('nx-nav'));
}
function Link({ to, className, children, onClick }: { to: string; className?: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <a href={to} className={className} onClick={(e) => { e.preventDefault(); onClick?.(); navigate(to); }}>
      {children}
    </a>
  );
}

// ------------------------------------------------------- share codec (hash)
async function b64urlFromBytes(bytes: Uint8Array): Promise<string> {
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
async function bytesFromB64url(s: string): Promise<Uint8Array> {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}
async function encodeState(obj: unknown): Promise<string> {
  const json = new TextEncoder().encode(JSON.stringify(obj));
  const cs = new CompressionStream('deflate');
  const stream = new Blob([json.buffer as ArrayBuffer]).stream().pipeThrough(cs);
  const buf = new Uint8Array(await new Response(stream).arrayBuffer());
  return b64urlFromBytes(buf);
}
async function decodeState<T>(code: string): Promise<T | null> {
  try {
    const bytes = await bytesFromB64url(code);
    const ds = new DecompressionStream('deflate');
    const stream = new Blob([bytes.buffer as ArrayBuffer]).stream().pipeThrough(ds);
    const json = await new Response(stream).text();
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

interface SharedState { html: string; css?: string; preflight?: boolean; min?: boolean; t?: string }

// ------------------------------------------------------------------- data
const DEFAULT_HTML = `<body class="min-h-screen grid place-items-center bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-6">
  <main class="max-w-xl rounded-2xl border border-white/30 bg-white/10 backdrop-blur p-10 text-center text-white space-y-4 shadow-2xl">
    <span class="rounded-full bg-white/15 px-3 py-1 text-xs font-black uppercase tracking-widest">নকশোরা 3.1</span>
    <h1 class="text-4xl md:text-5xl font-black tracking-tight">Type classes. Get CSS.</h1>
    <p class="text-white/70">Edit the HTML on the left — the real compiler generates your stylesheet live, in your browser.</p>
    <div class="flex flex-wrap justify-center gap-3">
      <button class="rounded-xl bg-white text-indigo-700 px-6 py-2.5 font-black hover:scale-105 active:scale-95 transition shadow-lg">Load a template</button>
      <span class="rounded-xl border border-white/30 px-6 py-2.5 font-bold">Share it</span>
    </div>
  </main>
</body>`;

const DEVICES: Array<{ name: string; w: number; h: number }> = [
  { name: 'iPhone SE', w: 375, h: 667 },
  { name: 'Galaxy S24', w: 360, h: 780 },
  { name: 'iPhone 15 Pro', w: 393, h: 852 },
  { name: 'iPad Mini', w: 768, h: 1024 },
  { name: 'iPad Pro 13', w: 1024, h: 1366 },
  { name: 'Laptop', w: 1366, h: 768 },
  { name: 'Desktop FHD', w: 1920, h: 1080 },
  { name: '4K Studio', w: 3840, h: 2160 }
];

const STORAGE_KEY = 'nakshora-playground-v1';

// ------------------------------------------------------------- PlaygroundApp
function PlaygroundApp({ initial }: { initial: SharedState | null }) {
  const [html, setHtml] = useState(initial?.html ?? DEFAULT_HTML);
  const [css, setCss] = useState(initial?.css ?? '');
  const [showCss, setShowCss] = useState(!!(initial?.css && initial.css.trim()));
  const [preflight, setPreflight] = useState(initial?.preflight ?? true);
  const [min, setMin] = useState(initial?.min ?? false);
  const [split, setSplit] = useState<'split' | 'stack'>('split');
  const [width, setWidth] = useState(1280);
  const [zoom, setZoom] = useState(1);
  const [portrait, setPortrait] = useState(true);
  const [device, setDevice] = useState('Custom');
  const [editorMode, setEditorMode] = useState<'html' | 'css'>('html');
  const [result, setResult] = useState<CompileResult | null>(null);
  const [copied, setCopied] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const [tFilter, setTFilter] = useState('All');
  const [tSearch, setTSearch] = useState('');
  const htmlRef = useRef<HTMLTextAreaElement>(null);
  const cssRef = useRef<HTMLTextAreaElement>(null);

  // JIT compile with debounce (200 ms) — the real compiler, every keystroke.
  useEffect(() => {
    const t = window.setTimeout(() => {
      try { setResult(compile(html, { preflight, css: showCss ? css : undefined })); } catch { /* keep last */ }
    }, 200);
    return () => window.clearTimeout(t);
  }, [html, css, preflight, showCss]);

  // autosave
  useEffect(() => {
    const t = window.setTimeout(() => {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ html, css, preflight, min })); } catch { /* private mode */ }
    }, 500);
    return () => window.clearTimeout(t);
  }, [html, css, preflight, min]);

  const doc = useMemo(() => {
    const out = result ? (min ? result.minCss : result.css) : '';
    return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>${out}</style></head>${html}</html>`;
  }, [result, html, min]);

  const copy = useCallback(async (text: string, label: string) => {
    try { await navigator.clipboard.writeText(text); } catch { /* ignore */ }
    setCopied(label);
    window.setTimeout(() => setCopied(''), 1600);
  }, []);

  const download = useCallback(() => {
    if (!result) return;
    const blob = new Blob([min ? result.minCss : result.css], { type: 'text/css' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'nakshora-playground.css';
    a.click();
    URL.revokeObjectURL(a.href);
  }, [result, min]);

  const share = useCallback(async () => {
    const code = await encodeState({ html, css, preflight, min });
    const url = `${location.origin}${location.pathname}#s=${code}`;
    history.replaceState({}, '', `#s=${code}`);
    await copy(url, 'Link copied!');
  }, [html, css, preflight, min, copy]);

  const loadTemplate = useCallback((t: Template) => {
    setHtml(t.html);
    setShowTemplates(false);
    history.replaceState({}, '', `#t=${t.id}`);
  }, []);

  const reset = useCallback(() => {
    if (!window.confirm('Reset to the starter document? Your edits will be lost.')) return;
    setHtml(DEFAULT_HTML); setCss(''); setPreflight(true); setMin(false);
    history.replaceState({}, '', location.pathname);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  }, []);

  const onKey = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const el = e.currentTarget;
      const { selectionStart: s, selectionEnd: en } = el;
      const val = el.value;
      el.value = val.slice(0, s) + '  ' + val.slice(en);
      el.setSelectionRange(s + 2, s + 2);
      const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
      if (setter) setter.call(el, el.value);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.setSelectionRange(s + 2, s + 2);
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      try { setResult(compile(html, { preflight, css: showCss ? css : undefined })); } catch { /* ignore */ }
    }
  }, [html, css, preflight, showCss]);

  const frameH = useMemo(() => {
    const d = DEVICES.find((x) => x.name === device);
    if (!d) return 640;
    const h = portrait ? d.h : d.w;
    return Math.min(h * zoom, 760);
  }, [device, portrait, zoom]);

  const filteredTemplates = useMemo(() => TEMPLATES.filter((t) =>
    (tFilter === 'All' || t.cat === tFilter) &&
    (!tSearch || (t.name + t.desc + t.cat).toLowerCase().includes(tSearch.toLowerCase()))
  ), [tFilter, tSearch]);

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 3.5rem)' }}>
      {/* toolbar */}
      <div className="toolbar">
        <div className="toolbar-left">
          <button className={cn('tool-btn', editorMode === 'html' && 'tool-btn-on')} onClick={() => setEditorMode('html')}>HTML</button>
          <button className={cn('tool-btn', editorMode === 'css' && 'tool-btn-on')} onClick={() => { setShowCss(true); setEditorMode('css'); }}>CSS</button>
          <span className="tool-sep" />
          <label className="tool-check"><input type="checkbox" checked={preflight} onChange={(e) => setPreflight(e.target.checked)} /> Preflight</label>
          <label className="tool-check"><input type="checkbox" checked={min} onChange={(e) => setMin(e.target.checked)} /> Minify</label>
          <span className="tool-sep hidden md:inline-block" />
          <button className="tool-btn" onClick={reset} title="Reset to starter">Reset</button>
        </div>
        <div className="toolbar-right">
          {result && (
            <span className="stats-badge" title="Last JIT compile by Nakshora 3.1 in the browser">
              ⚡ {result.stats.ms.toFixed(1)} ms · {result.stats.classes} classes · {formatBytes(min ? result.minCss.length : result.css.length)}
            </span>
          )}
          <button className="tool-btn" onClick={() => setShowTemplates(true)}>Templates ({TEMPLATES.length})</button>
          <button className="tool-btn tool-btn-accent" onClick={share}>Share</button>
        </div>
      </div>

      {/* device bar */}
      <div className="device-bar">
        <select className="device-select" value={device} onChange={(e) => {
          setDevice(e.target.value);
          const d = DEVICES.find((x) => x.name === e.target.value);
          if (d) setWidth(portrait ? d.w : d.h);
        }} aria-label="Device preset">
          <option>Custom</option>
          {DEVICES.map((d) => <option key={d.name}>{d.name}</option>)}
        </select>
        <input type="range" min={200} max={5000} step={5} value={width} onChange={(e) => { setWidth(+e.target.value); setDevice('Custom'); }} className="device-range" aria-label="Viewport width" />
        <span className="device-w">{width} px</span>
        <div className="zoom-group" role="group" aria-label="Zoom">
          <button className="tool-btn" onClick={() => setZoom(Math.max(0.25, +(zoom - 0.25).toFixed(2)))}>−</button>
          <span className="device-w">{Math.round(zoom * 100)}%</span>
          <button className="tool-btn" onClick={() => setZoom(Math.min(2, +(zoom + 0.25).toFixed(2)))}>+</button>
        </div>
        <button className="tool-btn" onClick={() => { setPortrait(!portrait); const d = DEVICES.find((x) => x.name === device); if (d) setWidth(portrait ? d.h : d.w); }} title="Flip orientation">⟳</button>
        <span className="tool-sep hidden lg:inline-block" />
        <div className="split-group hidden lg:flex" role="group" aria-label="Layout">
          <button className={cn('tool-btn', split === 'split' && 'tool-btn-on')} onClick={() => setSplit('split')}>Split</button>
          <button className={cn('tool-btn', split === 'stack' && 'tool-btn-on')} onClick={() => setSplit('stack')}>Stack</button>
        </div>
      </div>

      {/* workspace */}
      <div className={cn('workspace', split === 'stack' && 'workspace-stack')}>
        {/* editor panel */}
        <section className="pane pane-editor" aria-label="Editor">
          <div className="editor-wrap">
            <LineGutter target={editorMode === 'html' ? htmlRef : cssRef} text={editorMode === 'html' ? html : css} />
            <textarea
              ref={editorMode === 'html' ? htmlRef : cssRef}
              className="editor-area"
              value={editorMode === 'html' ? html : css}
              onChange={(e) => (editorMode === 'html' ? setHtml(e.target.value) : setCss(e.target.value))}
              onKeyDown={onKey}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              aria-label={editorMode === 'html' ? 'HTML source' : 'Custom CSS source'}
              placeholder={editorMode === 'css' ? '/* Author CSS — @apply, theme(), screen() are expanded live */\n.card {\n  @apply rounded-xl border border-slate-200 p-6;\n}' : undefined}
            />
          </div>
          <div className="pane-foot">
            <span>Nakshora v{ENGINE_VERSION} JIT</span>
            <span className="hidden sm:inline">Ctrl+Enter recompiles · Tab indents</span>
          </div>
        </section>

        {/* preview panel */}
        <section className="pane pane-preview" aria-label="Live preview">
          <div className="preview-scroll">
            <div className="preview-frame-outer" style={{ width: width * zoom, height: frameH + 8 }}>
              <iframe title="Live preview" className="preview-frame" srcDoc={doc} sandbox="" style={{ width, height: frameH, transform: `scale(${zoom})` }} />
            </div>
          </div>
          <div className="pane-foot pane-foot-between">
            <span>{device} · {width}px viewport</span>
            <div className="out-actions">
              <button className="tool-btn" onClick={() => copy(min ? result?.minCss ?? '' : result?.css ?? '', 'CSS copied!')}>Copy CSS</button>
              <button className="tool-btn" onClick={download}>Download .css</button>
            </div>
          </div>
        </section>
      </div>

      {copied && <div className="toast" role="status">{copied}</div>}

      {showTemplates && (
        <div className="modal-backdrop" onClick={() => setShowTemplates(false)}>
          <div className="modal" role="dialog" aria-modal="true" aria-label="Template library" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2>Template library · {TEMPLATES.length}</h2>
              <button className="tool-btn" onClick={() => setShowTemplates(false)} aria-label="Close">✕</button>
            </div>
            <div className="modal-controls">
              <input className="modal-search" value={tSearch} onChange={(e) => setTSearch(e.target.value)} placeholder={`Search ${TEMPLATES.length} templates…`} aria-label="Search templates" />
              <div className="chip-row">
                {['All', ...TEMPLATE_CATS].map((c) => (
                  <button key={c} className={cn('chip', tFilter === c && 'chip-on')} onClick={() => setTFilter(c)}>{c}</button>
                ))}
              </div>
            </div>
            <div className="template-grid">
              {filteredTemplates.map((t) => (
                <button key={t.id} className="template-card" onClick={() => loadTemplate(t)}>
                  <span className="template-cat">{t.cat}</span>
                  <strong>{t.name}</strong>
                  <span className="template-desc">{t.desc}</span>
                </button>
              ))}
              {filteredTemplates.length === 0 && <p className="muted px-4 py-8 text-center">No templates match — clear the filter.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LineGutter({ target, text }: { target: React.RefObject<HTMLTextAreaElement | null>; text: string }) {
  const [lines, setLines] = useState(1);
  const [top, setTop] = useState(0);
  useEffect(() => { setLines(text.split('\n').length); }, [text]);
  useEffect(() => {
    const el = target.current;
    if (!el) return;
    const onScroll = () => setTop(el.scrollTop);
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [target]);
  return (
    <div className="line-gutter" aria-hidden="true" style={{ transform: `translateY(${-top}px)` }}>
      {Array.from({ length: lines }, (_, i) => <div key={i}>{i + 1}</div>)}
    </div>
  );
}

// ------------------------------------------------------------------- pages
function HomePage({ goPlay }: { goPlay: () => void }) {
  const counts = { utilities: 11417, variants: VARIANT_NAMES, breakpoints: BREAKPOINTS, templates: TEMPLATES };
  const groups = fullRegistry(counts);
  const total = groups.reduce((n, g) => n + g.items.length, 0);
  return (
    <main className="page">
      <section className="hero">
        <span className="hero-eyebrow">play.nakshora.bsdc.info.bd · Nakshora {ENGINE_VERSION} · real-time, 100% in-browser</span>
        <h1>The most advanced playground for the Nakshora CSS framework</h1>
        <p className="hero-sub">The <strong>real</strong> Nakshora 3.1 compiler runs inside your browser tab — no server, no uploads, no waiting. Type utility classes, watch exact CSS appear in milliseconds, and share any state with a single link.</p>
        <div className="hero-ctas">
          <button className="btn btn-primary" onClick={goPlay}>Open the playground →</button>
          <Link to="/templates/" className="btn btn-ghost">Browse {TEMPLATES.length} templates</Link>
        </div>
        <dl className="hero-stats" aria-label="Engine counts">
          {[['11,417', 'utilities'], [String(VARIANT_COUNT), 'variants'], [String(BREAKPOINTS.length), 'breakpoints'], ['22', 'palettes'], [String(TEMPLATES.length), 'templates'], [String(total), 'features']].map(([n, l]) => (
            <div key={l}><dt className="stat-n">{n}</dt><dd className="stat-l">{l}</dd></div>
          ))}
        </dl>
      </section>
      <section className="section" aria-labelledby="why-h">
        <h2 id="why-h" className="section-title">Everything a world-class playground needs</h2>
        <div className="card-grid">
          {[
            ['⚡', 'Real-time JIT', 'Every keystroke compiles through the production v3.1 engine with a 200 ms debounce — hot compiles land in 1–5 ms.'],
            ['🔗', 'Instant sharing', 'Your full state (HTML + CSS + options) is compressed into the URL hash. Copy one link; it opens anywhere, offline.'],
            ['🧩', `${TEMPLATES.length} templates`, 'Landing pages, dashboards, e-commerce, auth, brutalism and more — each one live-compilable and tweakable.'],
            ['📱', 'Device lab', 'From 200 px watches to 5000 px walls: presets, a width slider, zoom and orientation flip mirror the engine’s 10 breakpoints.'],
            ['📦', 'Real output', 'Pretty or minified CSS, byte counts, compile milliseconds — copy or download exactly what shipped.'],
            ['🆓', 'Free & open', 'MIT framework, free Cloudflare Pages hosting, zero trackers, official brand by Rizwan Rahim Chowdhury, RRC Development.']
          ].map(([i, t, d]) => (
            <article key={t} className="card"><span className="card-icon" aria-hidden="true">{i}</span><h3>{t}</h3><p>{d}</p></article>
          ))}
        </div>
      </section>
      <section className="section" aria-labelledby="feat-h">
        <h2 id="feat-h" className="section-title">{total} counted features — measured, not marketed</h2>
        <p className="section-sub">The engine rows are read live from the compiler instance running in this tab.</p>
        <div className="feature-grid">
          {groups.map((g) => (
            <details key={g.id} className="feature-group" open={g.id === 'engine-live'}>
              <summary><strong>{g.title}</strong><span className="feature-count">{g.items.length}</span></summary>
              <p className="feature-desc">{g.desc}</p>
              <ul>{g.items.map((f) => <li key={f}>{f}</li>)}</ul>
            </details>
          ))}
        </div>
      </section>
      <section className="section cta-strip">
        <h2 className="section-title">Start typing classes.</h2>
        <p className="section-sub">নকশোরা — নকশা means pattern. Compile yours now.</p>
        <button className="btn btn-primary" onClick={goPlay}>Enter the playground</button>
      </section>
    </main>
  );
}

function TemplatesPage({ onUse }: { onUse: (t: Template) => void }) {
  const [cat, setCat] = useState('All');
  const [q, setQ] = useState('');
  const list = useMemo(() => TEMPLATES.filter((t) =>
    (cat === 'All' || t.cat === cat) && (!q || (t.name + t.desc).toLowerCase().includes(q.toLowerCase()))
  ), [cat, q]);
  return (
    <main className="page">
      <header className="page-head">
        <h1>{TEMPLATES.length} ready-made templates for Nakshora 3.1</h1>
        <p className="page-sub">Every card is real, version-pinned to v3.1 and loads into the live playground — edit, share, download.</p>
      </header>
      <div className="modal-controls">
        <input className="modal-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search templates…" aria-label="Search templates" />
        <div className="chip-row">{['All', ...TEMPLATE_CATS].map((c) => <button key={c} className={cn('chip', cat === c && 'chip-on')} onClick={() => setCat(c)}>{c}</button>)}</div>
      </div>
      <div className="template-grid page-templates">
        {list.map((t) => (
          <button key={t.id} className="template-card" onClick={() => onUse(t)}>
            <span className="template-cat">{t.cat}</span>
            <strong>{t.name}</strong>
            <span className="template-desc">{t.desc}</span>
            <span className="template-go">Open in playground →</span>
          </button>
        ))}
      </div>
    </main>
  );
}

function FeaturesPage() {
  const counts = { utilities: 11417, variants: VARIANT_NAMES, breakpoints: BREAKPOINTS, templates: TEMPLATES };
  const groups = fullRegistry(counts);
  const total = groups.reduce((n, g) => n + g.items.length, 0);
  return (
    <main className="page">
      <header className="page-head">
        <h1>{total} counted, real-time features</h1>
        <p className="page-sub">Every line below is a capability running in this tab or a number measured from the live engine — no marketing math.</p>
      </header>
      <div className="feature-grid">
        {groups.map((g) => (
          <details key={g.id} className="feature-group" open>
            <summary><strong>{g.title}</strong><span className="feature-count">{g.items.length}</span></summary>
            <p className="feature-desc">{g.desc}</p>
            <ul>{g.items.map((f) => <li key={f}>{f}</li>)}</ul>
          </details>
        ))}
      </div>
    </main>
  );
}

function AboutPage() {
  return (
    <main className="page prose">
      <header className="page-head">
        <h1>About the Nakshora Playground</h1>
        <p className="page-sub">Built by the same hands as the framework — and hosted free on Cloudflare Pages.</p>
      </header>
      <p>This playground runs the <strong>actual Nakshora {ENGINE_VERSION} compiler</strong> (the same JavaScript engine that ships with the npm package) directly in your browser. When you type <code>class="grid md:grid-cols-3 gap-4"</code>, the very grammar engine resolves the variants, walks the token map and emits exactly the CSS your markup asks for — nothing more, nothing less. There is no backend, no upload, no queue.</p>
      <h2>The framework</h2>
      <p><strong>নকশোরা (Nakshora)</strong> — from <strong>নকশা</strong>, the Bangla word for “pattern”. It is a utility-first CSS framework in the Tailwind grammar: 11,417 static utilities, {VARIANT_COUNT} variants, {BREAKPOINTS.length} breakpoints from 200 px to 5000 px and 22 palettes — all CSS-first, with zero runtime JavaScript and byte-identical Tailwind 3.4 compatibility. It ships as a static CDN stylesheet and as a JIT engine via CLI, Vite plugin and PostCSS plugin. MIT licensed.</p>
      <h2>The author</h2>
      <p>Nakshora is authored by <strong>Rizwan Rahim Chowdhury</strong>, founder of <strong>RRC Development</strong> and the Bangladesh Software Development Community (BSDC). He builds production software — frameworks, documentation platforms, wikis — entirely from Sylhet, Bangladesh, on an Android tablet over SSH and code-server. Contact: <a href="mailto:rizwan@bsdc.info.bd">rizwan@bsdc.info.bd</a> · <a href="mailto:rrc@bsdc.info.bd">rrc@bsdc.info.bd</a> · <a href="http://rrc.cloud.bsdc.info.bd/" rel="noopener">portfolio</a>.</p>
      <h2>Related</h2>
      <ul>
        <li><a href="https://docs.nakshora.bsdc.info.bd/" rel="noopener">docs.nakshora.bsdc.info.bd</a> — 9,400 pages of full documentation for v1.0–v3.1</li>
        <li><a href="https://github.com/nakshora/nakshora" rel="noopener">github.com/nakshora/nakshora</a> — framework source (MIT)</li>
      </ul>
      <p className="muted">© 2026 Rizwan Rahim Chowdhury · RRC Development. Free hosting by Cloudflare Pages.</p>
    </main>
  );
}

// ------------------------------------------------------------------- shell
function App() {
  const path = useRoute();
  const [dark, setDark] = useState(() => window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false);
  const [initial, setInitial] = useState<SharedState | null>(null);
  const [pendingTemplate, setPendingTemplate] = useState<Template | null>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  }, [dark]);

  // parse hash: #s=<shared> or #t=<template-id>; else restore autosave
  useEffect(() => {
    (async () => {
      const h = window.location.hash;
      if (h.startsWith('#s=')) {
        const st = await decodeState<SharedState>(h.slice(3));
        if (st) setInitial(st);
      } else if (h.startsWith('#t=')) {
        const t = TEMPLATES.find((x) => x.id === h.slice(3));
        if (t) setInitial({ html: t.html });
      } else {
        try {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) { const st = JSON.parse(saved); if (st && typeof st.html === 'string') setInitial(st); }
        } catch { /* ignore */ }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const titles: Record<string, string> = {
    '/': 'Nakshora CSS Playground — real-time JIT, 100+ templates',
    '/playground/': 'Playground — Nakshora CSS 3.1 in-browser compiler',
    '/templates/': '100+ Templates — Nakshora CSS Playground',
    '/features/': 'Features — Nakshora CSS Playground',
    '/about/': 'About — Nakshora CSS Playground'
  };
  useEffect(() => { document.title = titles[path] ?? titles['/']; }, [path]); // eslint-disable-line react-hooks/exhaustive-deps

  const goPlay = (t?: Template) => {
    if (t) setPendingTemplate(t);
    navigate('/playground/');
    window.scrollTo(0, 0);
  };

  // playground is a standalone fullscreen route (own chrome, no page container)
  if (path === '/playground/') {
    const init = pendingTemplate ? { html: pendingTemplate.html } : initial;
    return (
      <div className="app">
        <TopNav dark={dark} onDark={() => setDark(!dark)} />
        <PlaygroundApp initial={init} />
      </div>
    );
  }
  if (path === '/templates/') return <div className="app"><TopNav dark={dark} onDark={() => setDark(!dark)} /><TemplatesPage onUse={(t) => goPlay(t)} /></div>;
  if (path === '/features/') return <div className="app"><TopNav dark={dark} onDark={() => setDark(!dark)} /><FeaturesPage /></div>;
  if (path === '/about/') return <div className="app"><TopNav dark={dark} onDark={() => setDark(!dark)} /><AboutPage /></div>;
  return <div className="app"><TopNav dark={dark} onDark={() => setDark(!dark)} /><HomePage goPlay={() => goPlay()} /></div>;
}

function TopNav({ dark, onDark }: { dark: boolean; onDark: () => void }) {
  return (
    <nav className="topnav" aria-label="Primary">
      <Link to="/" className="brand">
        <img src="/brand/favicon-32x32.png" alt="Nakshora star logo" width="26" height="26" loading="eager" />
        <span>Nakshora <em>Playground</em></span>
      </Link>
      <div className="nav-links">
        <Link to="/templates/">Templates</Link>
        <Link to="/features/">Features</Link>
        <a href="https://docs.nakshora.bsdc.info.bd/" rel="noopener">Docs</a>
        <Link to="/about/">About</Link>
        <Link to="/playground/" className="nav-cta">Play →</Link>
        <button className="tool-btn theme-toggle" onClick={onDark} aria-label="Toggle color theme">{dark ? '☀️' : '🌙'}</button>
      </div>
    </nav>
  );
}

// --------------------------------------------------------------- SEO cleanup
function cleanSeoShell() {
  document.querySelectorAll('#seo-static').forEach((el) => el.remove());
}

// -------------------------------------------------------------------- boot
const rootEl = document.getElementById('root');
if (rootEl) {
  cleanSeoShell();
  createRoot(rootEl).render(<App />);
}
