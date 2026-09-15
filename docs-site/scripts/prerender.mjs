#!/usr/bin/env node
// ---------------------------------------------------------------------------
// Nakshora Docs — static prerenderer.
// Reads .data/ + the Vite manifest and emits one fully-rendered HTML file per
// article (9,000+ pages), plus core pages and a 404. No React SSR — pages are
// plain semantic HTML; the client bundle only enhances (search/theme/copy).
// ---------------------------------------------------------------------------
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE } from './lib/versions.mjs';
import { escapeHtml, linkHref } from './lib/model.mjs';
import { renderBlocks } from './lib/render.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA = path.join(ROOT, '.data');
const DIST = path.join(ROOT, 'dist');
const HOST = SITE.url;

const site = JSON.parse(fs.readFileSync(path.join(DATA, 'site.json'), 'utf8'));
const VERSIONS = site.versions;
const versionIds = VERSIONS.map((v) => v.id);
const core = JSON.parse(fs.readFileSync(path.join(DATA, 'content/core.json'), 'utf8')).articles;
const content = {};
for (const v of VERSIONS) {
  const raw = JSON.parse(fs.readFileSync(path.join(DATA, 'content', `${v.id}.json`), 'utf8'));
  content[v.id] = raw.articles;
}

// vite manifest → hashed assets. With cssCodeSplit:false the stylesheet is its
// own manifest chunk (not listed under entry.css), so gather every .css chunk.
const manifest = JSON.parse(fs.readFileSync(path.join(DIST, '.vite/manifest.json'), 'utf8'));
const entry = manifest['index.html'] || Object.values(manifest).find((m) => m.isEntry);
const JS = '/' + entry.file;
const cssFiles = [...(entry.css || [])];
for (const m of Object.values(manifest)) {
  if (m.file && m.file.endsWith('.css') && !cssFiles.includes(m.file)) cssFiles.push(m.file);
}
const CSS = cssFiles.map((c) => '/' + c);
if (!CSS.length) throw new Error('prerender: no CSS chunks found in the vite manifest');

const urls = [];

// ------------------------------------------------------------------ helpers
const esc = escapeHtml;
function pagePath(vid, slug) {
  if (vid === null) return slug === 'index' ? '/' : `/${slug}/`;
  return slug === 'index' ? `/${vid}/` : `/${vid}/${slug}/`;
}
function titleFor(a, vid) {
  if (a.slug === 'index' && vid === null) return 'Nakshora Docs — Nakshora CSS Framework documentation (v1.0–v3.1)';
  if (a.slug === 'index') return `Nakshora ${vid} documentation — the complete guide`;
  const v = VERSIONS.find((x) => x.id === vid);
  return `${a.title} · Nakshora ${v ? v.label : ''} Docs`;
}

function jsonLd(obj) {
  return `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;
}
function orgLd() {
  return {
    '@type': 'Organization',
    name: SITE.company,
    url: SITE.companyUrl,
    email: SITE.companyEmail,
    founder: { '@type': 'Person', name: SITE.owner, email: SITE.ownerEmail },
    logo: `${HOST}/android-chrome-512.png`
  };
}
function articleLd(a, vid, canonical) {
  const v = VERSIONS.find((x) => x.id === vid);
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: a.title,
    description: a.summary,
    url: canonical,
    mainEntityOfPage: canonical,
    inLanguage: 'en',
    articleSection: a.section,
    keywords: (a.keywords || []).join(', '),
    dateModified: a.updated,
    author: { '@type': 'Person', name: SITE.owner, email: SITE.ownerEmail },
    publisher: orgLd(),
    isPartOf: { '@type': 'WebSite', name: SITE.name, url: HOST },
    about: v ? { '@type': 'SoftwareApplication', name: `Nakshora CSS Framework ${v.label}`, applicationCategory: 'DeveloperApplication', operatingSystem: 'Any' } : { '@type': 'SoftwareApplication', name: 'Nakshora CSS Framework', applicationCategory: 'DeveloperApplication' }
  };
}
function breadcrumbLd(crumbs, canonical) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      item: HOST + c.path
    }))
  };
}
function websiteLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    alternateName: ['Nakshora Documentation', 'নক্ষত্র ডকস'],
    url: HOST,
    description: SITE.description,
    publisher: orgLd(),
    inLanguage: 'en',
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${HOST}/?q={search_term_string}` },
      'query-input': 'required name=search_term_string'
    }
  };
}

// ------------------------------------------------------------------ chrome
function headHtml({ title, description, canonicalPath, ogImage, noindex, extraLd }) {
  const canonical = HOST + canonicalPath;
  const og = ogImage || '/og.png';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
${noindex ? '<meta name="robots" content="noindex, follow">\n' : ''}<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#0d1026">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta property="og:site_name" content="${esc(SITE.name)}">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${HOST}${og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${HOST}${og}">
${CSS.map((c) => `<link rel="stylesheet" href="${c}">`).join('\n')}
<script type="module" src="${JS}" defer></script>
${(extraLd || []).join('\n')}
</head>`;
}

function switcherHtml(vid, slug) {
  const items = VERSIONS.map((v) => {
    const same = vid !== null && slug !== 'index' && content[v.id][slug];
    const href = same ? pagePath(v.id, slug) : pagePath(v.id, 'index');
    const cur = v.id === vid;
    const note = cur ? 'you are here' : same ? 'same page' : v.latest ? 'latest' : v.status === 'legacy' ? 'legacy' : '';
    return `<a class="sw-item${cur ? ' current' : ''}" href="${href}"><span class="sw-ver">${v.id}</span><span class="sw-note">${note}</span></a>`;
  }).join('');
  const label = vid || 'docs';
  return `<details class="switcher"><summary aria-label="Switch documentation version">${label}</summary><div class="sw-menu">${items}</div></details>`;
}

function sidebarHtml(vid, currentSlug) {
  if (vid === null) {
    return `<nav class="sidebar" aria-label="Site">
      <button class="icon-btn side-search" data-open-search>⌕&nbsp; Search all versions…</button>
      <section><details open><summary class="side-head">Nakshora Docs</summary>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/features/">Platform features</a></li>
          <li><a href="/about/">About & brand</a></li>
        </ul></details></section>
      ${VERSIONS.slice()
        .reverse()
        .map(
          (v) => `<section><details${v.latest ? ' open' : ''}><summary class="side-head">${v.label} <span class="cnt">${v.count.toLocaleString('en-US')}</span></summary>
        <ul>
          <li><a href="/${v.id}/">Release home</a></li>
          <li><a href="/${v.id}/getting-started/introduction/">Introduction</a></li>
          <li><a href="/${v.id}/utilities/index/">Utilities</a></li>
          <li><a href="/${v.id}/tutorials/index/">Tutorials</a></li>
        </ul></details></section>`
        )
        .join('\n')}
    </nav>`;
  }
  const v = VERSIONS.find((x) => x.id === vid);
  const here = content[vid][currentSlug];
  const curSection = here ? here.section : null;
  const sections = v.nav || [];
  return `<nav class="sidebar" aria-label="${v.label} documentation">
    <button class="icon-btn side-search" data-open-search>⌕&nbsp; Search ${v.id}…</button>
    <section><ul><li><a href="/${vid}/" ${currentSlug === 'index' ? 'class="current"' : ''}> ${v.label} home</a></li></ul></section>
    ${sections
      .map((sec) => {
        const open = sec.section === curSection ? ' open' : '';
        const cats = sec.categories.slice(0, 4);
        const hubHref = sec.section === 'getting-started' ? `/${vid}/getting-started/introduction/` : `/${vid}/hub/${sec.section}/`;
        return `<section><details${open}><summary class="side-head">${esc(sec.label)} <span class="cnt">${sec.count}</span></summary>
        ${cats
          .map(
            (c) => `<div class="side-cat">${esc(c.category)}</div><ul>${c.items
              .slice(0, 6)
              .map((i) => `<li><a href="/${vid}/${i.slug}/"${i.slug === currentSlug ? ' class="current"' : ''}>${esc(i.title)}</a></li>`)
              .join('')}</ul>`
          )
          .join('')}
        <ul><li><a href="${hubHref}">All ${sec.count} in ${esc(sec.label)} →</a></li></ul>
        </details></section>`;
      })
      .join('\n')}
  </nav>`;
}

function footerHtml() {
  return `<footer class="site-footer">
  <div class="footer-grid">
    <div>
      <h3>Versions</h3>
      ${VERSIONS.slice()
        .reverse()
        .map((v) => `<a href="/${v.id}/">Nakshora ${v.label}${v.latest ? ' — latest' : ''}</a>`)
        .join('')}
      <a href="/">All versions</a>
    </div>
    <div>
      <h3>Platform</h3>
      <a href="/features/">Features</a>
      <a href="/about/">About Nakshora</a>
      <a href="/llms.txt" rel="noopener">llms.txt</a>
      <a href="/humans.txt" rel="noopener">humans.txt</a>
      <a href="/sitemap.xml">Sitemap</a>
    </div>
    <div>
      <h3>Framework</h3>
      <a href="${SITE.mainSite}" rel="noopener">nakshora.bsdc.info.bd</a>
      <a href="${SITE.playground}" rel="noopener">Playground</a>
      <a href="${SITE.npm}" rel="noopener">npm · @nakshora/core</a>
      <a href="${SITE.repo}" rel="noopener">GitHub repository</a>
    </div>
    <div>
      <h3>${esc(SITE.company)}</h3>
      <a href="mailto:${SITE.ownerEmail}">${esc(SITE.owner)}</a>
      <a href="mailto:${SITE.companyEmail}">${esc(SITE.company)}</a>
      <a href="${SITE.companyUrl}" rel="noopener">rrc.bsdc.info.bd</a>
      <a href="/about/">License · ${SITE.license}</a>
    </div>
  </div>
  <div class="footer-base">
    <span>© 2024–2026 ${esc(SITE.owner)} · ${esc(SITE.company)} · নক্ষত্র</span>
    <span>Nakshora Docs — ${site.totalArticles.toLocaleString('en-US')} articles · zero-runtime · MIT</span>
  </div>
</footer>`;
}

function headerHtml(vid, slug) {
  return `<header class="site-header">
  <label for="nav-toggle" class="icon-btn nav-toggle-label" aria-label="Toggle navigation">☰</label>
  <a class="brand" href="/"><img src="/favicon.svg" alt="Nakshora star logo" width="30" height="30"><span class="brand-name">Nakshora</span><span class="brand-docs">Docs</span></a>
  ${switcherHtml(vid, slug)}
  <div class="header-spacer"></div>
  <div class="header-actions">
    <button class="icon-btn" data-open-search><span aria-hidden="true">⌕</span><span class="search-label">Search</span><kbd>Ctrl K</kbd></button>
    <button class="icon-btn theme-btn" data-theme-toggle aria-label="Toggle light or dark theme"><span class="icon-sun" aria-hidden="true">☀</span><span class="icon-moon" aria-hidden="true">☾</span></button>
    <a class="icon-btn" href="${SITE.repo}" rel="noopener" aria-label="Nakshora on GitHub">GH</a>
  </div>
</header>`;
}

// ------------------------------------------------------------------ pages
function renderArticlePage({ a, vid }) {
  const v = vid ? VERSIONS.find((x) => x.id === vid) : null;
  const p = pagePath(vid, a.slug);
  const base = vid ? `/${vid}` : '';
  const { html, toc } = renderBlocks(a.blocks, base);

  const crumbs = [
    { label: 'Docs', path: '/' },
    ...(v ? [{ label: v.label, path: `/${v.id}/` }] : []),
    { label: a.section === 'tags' ? 'Tags' : sectionLabelLocal(a.section), path: null },
    { label: a.title, path: p }
  ];
  const crumbsHtml = crumbs
    .map((c, i) =>
      i === crumbs.length - 1
        ? `<span class="crumb-here">${esc(c.label)}</span>`
        : c.path
          ? `<a href="${c.path}">${esc(c.label)}</a><span class="sep">/</span>`
          : `<span>${esc(c.label)}</span><span class="sep">/</span>`
    )
    .join(' ');

  const tagsHtml =
    vid && a.slug !== 'index' && (a.tags || []).length && a.section !== 'tags' && a.category !== 'Hubs'
      ? `<div class="tag-row" aria-label="Tags">${a.tags
          .slice(0, 8)
          .map((t) => `<a class="tag-chip" href="${linkHref(`tags/${slugTag(t)}`, base)}">#${esc(t)}</a>`)
          .join('')}</div>`
      : '';

  const pagerHtml =
    a.prev || a.next
      ? `<nav class="pager" aria-label="Adjacent pages">${
          a.prev ? `<a href="${linkHref(a.prev.slug, base)}"><span class="dir">← Previous</span><span class="tt">${esc(a.prev.title)}</span></a>` : '<span></span>'
        }${
          a.next ? `<a class="next" href="${linkHref(a.next.slug, base)}"><span class="dir">Next →</span><span class="tt">${esc(a.next.title)}</span></a>` : '<span></span>'
        }</nav>`
      : '';

  const relHtml =
    (a.related || []).length
      ? `<section class="related"><h2>Related pages</h2><ul>${a.related.map((r) => `<li><a href="${linkHref(r.slug, base)}">${esc(r.title)}</a></li>`).join('')}</ul></section>`
      : '';

  const tocHtml = toc.length
    ? `<aside class="toc" aria-label="On this page"><div class="toc-title">On this page</div><ul>${toc
        .map((t) => `<li><a class="lvl${t.level}" href="#${t.id}">${esc(t.text)}</a></li>`)
        .join('')}</ul></aside>`
    : '';

  const canonical = p;
  const og = vid ? `/og-${vid}.png` : '/og.png';
  const ldCrumbs = [{ label: 'Docs', path: '/' }, ...(v ? [{ label: v.label, path: `/${v.id}/` }] : []), { label: a.title, path: p }];
  const lds = [jsonLd(articleLd(a, vid, HOST + canonical)), jsonLd(breadcrumbLd(ldCrumbs, canonical))];
  if (a.slug === 'index' && vid === null) lds.unshift(jsonLd(websiteLd()));

  const meta = `<div class="article-meta"><span class="pill">${esc(a.category)}</span>${v ? `<span>${v.label}</span>` : ''}<span>Updated ${a.updated}</span><span>${(a.tags || []).length} tags</span></div>`;

  const hero =
    a.slug === 'index' && vid === null
      ? `<div class="hero"><img class="hero-star" src="/android-chrome-192.png" alt="" width="74" height="74">
      <h1>Nakshora Docs</h1>
      <p class="hero-sub">The complete documentation platform for the <strong>Nakshora CSS framework</strong> — every release from 1.0 to 3.1, every utility, every recipe. Created by ${esc(SITE.owner)} · ${esc(SITE.company)}.</p>
      <div class="hero-cta"><a class="btn-primary" href="/v3.1/">Start with v3.1 (latest)</a><button class="btn-ghost" data-open-search>⌕ Search everything</button></div>
      <div class="hero-stats">
        <div class="hero-stat"><b>${site.totalArticles.toLocaleString('en-US')}+</b><span>articles</span></div>
        <div class="hero-stat"><b>4</b><span>documented releases</span></div>
        <div class="hero-stat"><b>11,417</b><span>utilities in 3.1</span></div>
        <div class="hero-stat"><b>0 B</b><span>runtime JavaScript</span></div>
      </div></div>`
      : '';

  const head = headHtml({
    title: titleFor(a, vid),
    description: a.summary,
    canonicalPath: canonical,
    ogImage: og,
    noindex: a.noindex,
    extraLd: lds
  });

  return `${head}
<body>
<a class="skip-link" href="#main">Skip to content</a>
<input type="checkbox" id="nav-toggle" class="nav-toggle" hidden>
${headerHtml(vid, a.slug)}
<div class="layout${toc.length ? ' has-toc' : ''}">
${sidebarHtml(vid, a.slug)}
<main id="main" class="main-col">
${hero}
<nav class="crumbs" aria-label="Breadcrumb">${crumbsHtml}</nav>
<header class="article-head"><h1>${esc(a.title)}</h1>${meta}</header>
<p class="lede">${esc(a.summary)}</p>
<article class="article-body">
${html}
</article>
${tagsHtml}
${pagerHtml}
${relHtml}
</main>
${tocHtml}
</div>
${footerHtml()}
<div data-island="search" data-current="${vid || 'v3.1'}" data-versions="${versionIds.join(',')}"></div>
</body>
</html>`;
}

function slugTag(t) {
  const s = String(t).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return s || 'tag';
}
function sectionLabelLocal(sec) {
  const known = {
    'getting-started': 'Getting Started', concepts: 'Core Concepts', configuration: 'Configuration',
    utilities: 'Utilities', colors: 'Colors', variants: 'Variants', responsive: 'Responsive',
    components: 'Components', themes: 'Themes', recipes: 'Recipes', patterns: 'Patterns',
    tutorials: 'Tutorials', cookbook: 'Cookbook', integrations: 'Integrations', editors: 'Editors',
    cli: 'CLI', api: 'API', performance: 'Performance', accessibility: 'Accessibility',
    design: 'Design', blueprints: 'Blueprints', lookbook: 'Lookbooks', qa: 'Q&A', faq: 'FAQ',
    troubleshooting: 'Troubleshooting', comparisons: 'Comparisons', spotlight: 'Spotlight',
    cheatsheets: 'Cheat Sheets', glossary: 'Glossary', teams: 'Teams', deployment: 'Deployment',
    ai: 'AI & LLMs', releases: 'Releases', features: 'Feature Notes', tokens: 'Tokens',
    'v1-originals': 'v1 Originals', 'v2-engine': 'v2 Engine', 'v3-monorail': 'v3.0 Deep Dives',
    parity: '3.1 Deep Dives', core: 'Platform', tags: 'Tags'
  };
  return known[sec] || sec;
}

function writePage(relPath, html) {
  const file = path.join(DIST, relPath.endsWith('.html') ? relPath : path.join(relPath, 'index.html'));
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  urls.push(relPath.endsWith('.html') ? relPath.replace(/(index\.html|404\.html)$/, '') : relPath);
}

// -------------------------------------------------------------------- main
function main() {
  let n = 0;
  for (const [slug, a] of Object.entries(core)) {
    writePage(slug === 'index' ? '/' : `/${slug}/`, renderArticlePage({ a, vid: null }));
    n++;
  }
  for (const v of VERSIONS) {
    const arts = content[v.id];
    for (const [slug, a] of Object.entries(arts)) {
      writePage(pagePath(v.id, slug), renderArticlePage({ a, vid: v.id }));
      n++;
    }
  }
  // 404
  const notFound = `${headHtml({
    title: '404 — page not found · Nakshora Docs',
    description: 'This page does not exist in Nakshora Docs. Use search or the version switcher to find what you need.',
    canonicalPath: '/404/',
    noindex: true
  })}
<body>
<a class="skip-link" href="#main">Skip to content</a>
<input type="checkbox" id="nav-toggle" class="nav-toggle" hidden>
${headerHtml(null, null)}
<div class="layout">
${sidebarHtml(null, null)}
<main id="main" class="main-col"><div class="error-page">
<div class="code">404</div>
<h1>This star is not on our chart.</h1>
<p>The page you requested does not exist. Try the search — it knows every page of every version.</p>
<p><button class="btn-primary" data-open-search>⌕ Search the docs</button> <a class="btn-ghost" href="/">Back home</a></p>
</div></main>
</div>
${footerHtml()}
<div data-island="search" data-current="v3.1" data-versions="${versionIds.join(',')}"></div>
</body>
</html>`;
  writePage('404.html', notFound);

  fs.mkdirSync(DATA, { recursive: true });
  fs.writeFileSync(path.join(DATA, 'urls.json'), JSON.stringify(urls));
  console.log(`✔ prerendered ${n + 1} pages (${urls.length} urls)`);
}
main();
