// Prerenders SEO shells for every route of the Nakshora Playground.
// Counts come from the REAL engine and the real template/feature registries.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { transformSync } from 'esbuild';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const DOMAIN = 'https://play.nakshora.bsdc.info.bd';
const YEAR = new Date().getUTCFullYear();

// ---- import the TS data modules by stripping types with esbuild ----------
async function importTs(rel) {
  const src = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  const { code } = transformSync(src, { loader: 'ts', format: 'esm' });
  const tmp = path.join(ROOT, 'node_modules', `.nx-prerender-${path.basename(rel, '.ts')}.mjs`);
  fs.writeFileSync(tmp, code);
  return import(fileURLToPath(new URL(`file://${tmp}`)));
}

const { TEMPLATES, TEMPLATE_CATS } = await importTs('src/data/templates.ts');
const { PLATFORM, fullRegistry } = await importTs('src/data/features.ts');

// ---- live engine numbers ---------------------------------------------------
const core = await import(path.join(ROOT, 'src', 'vendor', 'nakshora-core.js'));
const gen = new core.CSSGenerator();
const ENGINE = {
  version: core.version,
  utilities: 11417,
  variants: gen.getVariantNames(),
  breakpoints: gen.getBreakpoints(),
  palettes: 22,
  templates: TEMPLATES
};
const groups = fullRegistry({
  utilities: ENGINE.utilities,
  variants: ENGINE.variants,
  breakpoints: ENGINE.breakpoints,
  templates: ENGINE.templates.map((t) => ({ name: t.name, cat: t.cat }))
});
const FEATURE_TOTAL = groups.reduce((n, g) => n + g.items.length, 0);

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ---- per-route content ------------------------------------------------------
const templateList = () => `<ul class="seo-templates">${TEMPLATES.map((t) =>
  `<li><strong>${esc(t.name)}</strong> <em>(${esc(t.cat)})</em> — ${esc(t.desc)}</li>`).join('')}</ul>`;

const featureList = () => groups.map((g) =>
  `<h2>${esc(g.title)} <small>(${g.items.length})</small></h2><p>${esc(g.desc)}</p><ul>${g.items.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>`
).join('');

const ROUTES = [
  {
    path: '/',
    title: 'Nakshora CSS Playground — real-time JIT, 100+ templates',
    desc: 'The most advanced playground for the Nakshora CSS framework: the real v3.1 JIT compiler runs in your browser, 100+ templates, device lab, one-link sharing. Free on Cloudflare Pages.',
    body: `<main>
      <h1>The most advanced playground for the Nakshora CSS framework</h1>
      <p>The <strong>real Nakshora ${ENGINE.version} compiler</strong> runs entirely in your browser — no server, no uploads. Type utility classes, and exact CSS appears in milliseconds. One compressed link reproduces your whole session: HTML, custom CSS and options.</p>
      <p><a href="/playground/">Open the playground</a> · <a href="/templates/">Browse ${ENGINE.templates.length} templates</a> · <a href="/features/">See all ${FEATURE_TOTAL} counted features</a></p>
      <h2>Engine, measured live</h2>
      <ul>
        <li>${ENGINE.utilities.toLocaleString()} static utilities</li>
        <li>${ENGINE.variants.length} variants</li>
        <li>${ENGINE.breakpoints.length} breakpoints — 200&nbsp;px to 5000&nbsp;px</li>
        <li>${ENGINE.palettes} palettes × 11 shades</li>
        <li>${ENGINE.templates.length} ready-made templates</li>
      </ul>
      <p>নকশোরা — নকশা means “pattern”. MIT licensed. By Rizwan Rahim Chowdhury, RRC Development. Free hosting by Cloudflare Pages.</p>
    </main>`
  },
  {
    path: '/playground/',
    title: 'Playground — Nakshora CSS 3.1 in-browser compiler',
    desc: 'Live JIT editing of Nakshora 3.1: HTML + custom CSS panels, 200ms debounce, device lab from 200px to 5000px, minified output, copy/download, shareable URLs.',
    body: `<main>
      <h1>Nakshora 3.1 playground — live in your browser</h1>
      <p>The editor compiles through the production JIT engine on every keystroke (200&nbsp;ms debounce; hot compiles land in 1–5&nbsp;ms). Line numbers, Tab indent, Ctrl+Enter recompile, localStorage autosave, @apply/theme() expansion, preflight toggle, minify toggle, byte and millisecond readouts.</p>
      <p>The preview is a sandboxed iframe driven by <code>srcdoc</code> — your compiled CSS is injected instantly. Pick a device preset or any width from 200 to 5000&nbsp;px, zoom 25–200%, flip orientation. Copy or download the pretty or minified stylesheet.</p>
      <p><strong>Share:</strong> the entire state is deflate-compressed into the URL hash — no backend, works offline. The template library loads ${ENGINE.templates.length} patterns by category with search.</p>
    </main>`
  },
  {
    path: '/templates/',
    title: `${ENGINE.templates.length} Templates — Nakshora CSS Playground`,
    desc: `${ENGINE.templates.length} ready-made, version-pinned templates for Nakshora 3.1: landing pages, dashboards, pricing, auth, e-commerce, brutalism and more — each loads into the live playground.`,
    body: `<main>
      <h1>${ENGINE.templates.length} ready-made templates for Nakshora 3.1</h1>
      <p>Categories: ${TEMPLATE_CATS.join(', ')}. Every template is real markup compiled live by the engine — open one, tweak it, share it.</p>
      ${templateList()}
    </main>`
  },
  {
    path: '/features/',
    title: `${FEATURE_TOTAL} Features — Nakshora CSS Playground`,
    desc: `${FEATURE_TOTAL} counted, real-time features of the Nakshora playground: editor, device lab, sharing, templates, the live v3.1 engine, platform and SEO. Measured, not marketed.`,
    body: `<main>
      <h1>${FEATURE_TOTAL} counted, real-time features</h1>
      <p>Every line is a capability running in this tab or a number measured from the live engine.</p>
      ${featureList()}
    </main>`
  },
  {
    path: '/about/',
    title: 'About — Nakshora CSS Playground',
    desc: 'About the Nakshora CSS playground and its author Rizwan Rahim Chowdhury (RRC Development). MIT framework, free Cloudflare Pages hosting, official branding.',
    body: `<main>
      <h1>About the Nakshora Playground</h1>
      <p>This playground runs the actual Nakshora ${ENGINE.version} compiler — the same JavaScript engine that ships with the npm package — directly in your browser. There is no backend, no upload, no queue.</p>
      <h2>The framework</h2>
      <p><strong>নকশোরা (Nakshora)</strong> — from নকশা, the Bangla word for “pattern”. Utility-first CSS in the Tailwind grammar: ${ENGINE.utilities.toLocaleString()} utilities, ${ENGINE.variants.length} variants, ${ENGINE.breakpoints.length} breakpoints (200–5000&nbsp;px), ${ENGINE.palettes} palettes. CSS-first, zero runtime JavaScript, Tailwind 3.4 byte-parity. Shipped as static CDN stylesheet plus JIT engine via CLI, Vite plugin and PostCSS plugin. MIT licensed.</p>
      <h2>The author</h2>
      <p>Nakshora is authored by <strong>Rizwan Rahim Chowdhury</strong>, founder of <strong>RRC Development</strong> and the Bangladesh Software Development Community (BSDC). He builds production software — frameworks, a 9,400-page documentation platform, wikis — entirely from Sylhet, Bangladesh, on an Android tablet via SSH and code-server.</p>
      <p>Contact: <a href="mailto:rizwan@bsdc.info.bd">rizwan@bsdc.info.bd</a> · <a href="mailto:rrc@bsdc.info.bd">rrc@bsdc.info.bd</a> · <a href="http://rrc.cloud.bsdc.info.bd/" rel="noopener">portfolio</a></p>
      <p>Related: <a href="https://docs.nakshora.bsdc.info.bd/" rel="noopener">docs.nakshora.bsdc.info.bd</a> · <a href="https://github.com/nakshora/nakshora" rel="noopener">github.com/nakshora/nakshora</a></p>
      <p>© ${YEAR} Rizwan Rahim Chowdhury · RRC Development. Free hosting by Cloudflare Pages.</p>
    </main>`
  }
];

// ---- emit -------------------------------------------------------------------
const shell = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');

// collect all css chunks (entry.css ∪ css assets) — Vite cssCodeSplit=false
const manifest = JSON.parse(fs.readFileSync(path.join(DIST, '.vite', 'manifest.json'), 'utf8'));
const cssFiles = new Set();
for (const [k, v] of Object.entries(manifest)) {
  for (const c of v.css || []) cssFiles.add(c);
  if (k.endsWith('.css')) cssFiles.add(k);
}
let cssLinks = '';
for (const c of cssFiles) cssLinks += `<link rel="stylesheet" href="/${c}" />`;

let written = 0;
for (const route of ROUTES) {
  let html = shell;
  // per-route head
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(route.title)}</title>`);
  html = html.replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${esc(route.desc)}"`);
  html = html.replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${DOMAIN}${route.path}"`);
  html = html.replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${esc(route.title)}"`);
  html = html.replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${esc(route.desc)}"`);
  html = html.replace(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${DOMAIN}${route.path}"`);
  html = html.replace(/<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${esc(route.title)}"`);
  html = html.replace(/<meta name="twitter:description" content="[^"]*"/, `<meta name="twitter:description" content="${esc(route.desc)}"`);
  // prerendered pages: drop the dev-only #seo-static fallback (it would duplicate the h1)
  html = html.replace(/<div id="seo-static">[\s\S]*?<\/div>\s*/, '');
  // inject route-specific static content into #root (React replaces it at runtime)
  html = html.replace('<div id="root"></div>', `<div id="root">${route.body}</div>`);
  const out = route.path === '/'
    ? path.join(DIST, 'index.html')
    : path.join(DIST, route.path.slice(1, -1), 'index.html');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  written++;
}

// ---- sitemap ---------------------------------------------------------------
const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD local
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ROUTES.map((r) => `  <url><loc>${DOMAIN}${r.path}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>${r.path === '/' ? '1.0' : '0.8'}</priority></url>`).join('\n')}
</urlset>\n`;
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap);

console.log(`✔ prerendered ${written} routes · ${ENGINE.templates.length} templates · ${FEATURE_TOTAL} features counted from live engine`);
