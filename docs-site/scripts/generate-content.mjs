#!/usr/bin/env node
// ---------------------------------------------------------------------------
// Nakshora Docs — content orchestrator.
// Generates every article for every version, computes the internal-link
// graph (hubs, prev/next, related, tags), builds search indexes and writes
// the .data/ payload consumed by prerender + the client app.
// ---------------------------------------------------------------------------
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { VERSIONS, SITE } from './lib/versions.mjs';
import { article, p, h2, h3, code, list, table, callout, cards, cap, stripMarkdown } from './lib/model.mjs';

import { guideArticles } from './content/guides.mjs';
import { integrationArticles } from './content/integrations.mjs';
import { utilityArticles } from './content/utilities.mjs';
import { colorArticles } from './content/colors.mjs';
import { componentArticles } from './content/components.mjs';
import { variantArticles, responsiveArticles } from './content/variants-responsive.mjs';
import { learningArticles } from './content/learning.mjs';
import { deepdiveArticles } from './content/deepdives.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO = path.resolve(ROOT, '..');
const OUT = path.join(ROOT, '.data');
const TARGET_PER_VERSION = 2050;

export const SECTIONS = [
  ['getting-started', 'Getting Started', 0],
  ['concepts', 'Core Concepts', 1],
  ['installation-group', 'Installation', 2],
  ['configuration', 'Configuration', 3],
  ['utilities', 'Utilities Reference', 4],
  ['colors', 'Colors', 5],
  ['variants', 'Variants', 6],
  ['responsive', 'Responsive Design', 7],
  ['components', 'Design Components', 8],
  ['themes', 'Themes', 9],
  ['recipes', 'Recipes', 10],
  ['patterns', 'Layout Patterns', 11],
  ['tutorials', 'Tutorials', 12],
  ['cookbook', 'Cookbook', 13],
  ['integrations', 'Integrations', 14],
  ['editors', 'Editors', 15],
  ['cli', 'CLI', 16],
  ['api', 'JavaScript API', 17],
  ['performance', 'Performance', 18],
  ['accessibility', 'Accessibility', 19],
  ['design', 'Design Guides', 20],
  ['blueprints', 'Blueprints', 21],
  ['lookbook', 'Lookbooks', 22],
  ['qa', 'Q&A', 23],
  ['faq', 'FAQ', 24],
  ['troubleshooting', 'Troubleshooting', 25],
  ['comparisons', 'Comparisons', 26],
  ['spotlight', 'Class Spotlight', 27],
  ['cheatsheets', 'Cheat Sheets', 28],
  ['glossary', 'Glossary', 29],
  ['teams', 'Teams & Ops', 30],
  ['deployment', 'Deployment', 31],
  ['ai', 'AI & LLMs', 32],
  ['releases', 'Releases & Migration', 33],
  ['features', 'Feature Notes', 34],
  ['tokens', 'Tokens', 35],
  ['v1-originals', 'v1 Originals', 36],
  ['v2-engine', 'v2 Engine', 37],
  ['v3-monorail', 'v3.0 Deep Dives', 38],
  ['parity', '3.1 Deep Dives', 39]
];
export const sectionLabel = (id) => SECTIONS.find(([s]) => s === id)?.[1] || cap(id);
export const sectionOrder = (id) => SECTIONS.find(([s]) => s === id)?.[2] ?? 90;

// ---------------------------------------------------------------- sources
function loadCorpus() {
  try {
    const raw = JSON.parse(fs.readFileSync(path.join(REPO, 'ai/corpus.json'), 'utf8'));
    return raw.categories || [];
  } catch {
    return [];
  }
}
function loadV1Classes() {
  try {
    const css = fs.readFileSync(path.join(REPO, 'minified-version/v1.0.0.css'), 'utf8');
    const classes = new Set();
    const re = /\.([a-zA-Z][\w\-:\\/[\].%]*)/g;
    let m;
    while ((m = re.exec(css))) classes.add(m[1]);
    return [...classes];
  } catch {
    return [];
  }
}

// ------------------------------------------------------------- collection
function collectVersion(V, ctx) {
  let arts = [
    ...guideArticles(V, ctx),
    ...integrationArticles(V, ctx),
    ...utilityArticles(V, ctx),
    ...colorArticles(V, ctx),
    ...componentArticles(V, ctx),
    ...variantArticles(V, ctx),
    ...responsiveArticles(V, ctx),
    ...learningArticles(V, ctx)
  ];
  // de-duplicate by slug
  const seen = new Map();
  for (const a of arts) if (!seen.has(a.slug)) seen.set(a.slug, a);
  arts = [...seen.values()];
  // repair internal links so no page can dangle
  const slugSet = new Set(arts.map((a) => a.slug));
  const resolve = makeResolver(slugSet);
  for (const a of arts) repairArticleLinks(a, resolve, slugSet);
  // fill with version-honest deep dives past the target
  const need = TARGET_PER_VERSION - arts.length;
  if (need > 0) {
    const fill = deepdiveArticles(V, ctx, need + 40);
    for (const a of fill) {
      if (arts.length >= TARGET_PER_VERSION) break;
      if (!seen.has(a.slug)) {
        seen.set(a.slug, a);
        arts.push(a);
      }
    }
  }
  return arts;
}

// ------------------------------------------------------------- link repair
function makeResolver(set) {
  const all = [...set];
  return (slug) => {
    if (set.has(slug)) return slug;
    if (slug.startsWith('../')) return slug; // cross-version; validated later
    const [, dir, sub] = slug.split('/');
    if (dir === 'utilities' && sub) {
      const fam = all.find((s) => s.startsWith(`utilities/${sub}/`));
      if (fam) return fam;
    }
    if (dir === 'glossary' && sub) {
      const g = all.find((s) => s.startsWith('glossary/') && (s === `glossary/${sub}` || s.endsWith(`-${sub}`) || s.includes(`-${sub}-`)));
      if (g) return g;
    }
    const idx = `${dir}/index`;
    if (set.has(idx)) return idx;
    const hub = dir === 'getting-started' ? 'guides-hub' : `hub/${dir}`;
    if (set.has(hub)) return hub;
    return null; // strip the link, keep the label
  };
}
function repairArticleLinks(a, resolve, set) {
  const fix = (s) =>
    s
      .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, (m, slug, label) => {
        const r = resolve(slug);
        if (r === null) return label;
        return r === slug ? m : `[[${r}|${label}]]`;
      })
      .replace(/\[\[([^\]]+)\]\]/g, (m, slug) => {
        const r = resolve(slug);
        if (r === null) return slug;
        return r === slug ? m : `[[${r}]]`;
      });
  const fallback = set.has(`${a.section}/index`) ? `${a.section}/index` : 'index';
  const walk = (node) => {
    if (!node || typeof node !== 'object') return;
    if (node.t === 'cards' && Array.isArray(node.items)) {
      node.items = node.items.map((it) => ({ ...it, slug: resolve(it.slug) ?? fallback }));
    }
    for (const k of Object.keys(node)) {
      const v = node[k];
      if (typeof v === 'string') node[k] = fix(v);
      else if (v && typeof v === 'object') walk(v);
    }
  };
  a.blocks.forEach(walk);
  a.summary = fix(a.summary);
}

// ------------------------------------------------------------- link graph
function computeGraph(arts) {
  const byTag = new Map();
  for (const a of arts) {
    for (const t of a.tags) {
      if (!byTag.has(t)) byTag.set(t, []);
      byTag.get(t).push(a);
    }
  }
  const bySlug = new Map(arts.map((a) => [a.slug, a]));

  // ordering: section order → category → title
  const sorted = [...arts].sort((x, y) => {
    const s = sectionOrder(x.section) - sectionOrder(y.section);
    if (s !== 0) return s;
    const c = String(x.category).localeCompare(String(y.category));
    if (c !== 0) return c;
    return String(x.title).localeCompare(String(y.title));
  });

  // prev/next within same section
  for (let i = 0; i < sorted.length; i++) {
    const a = sorted[i];
    const prev = sorted[i - 1];
    const next = sorted[i + 1];
    if (prev && prev.section === a.section) a.prev = { slug: prev.slug, title: prev.title };
    if (next && next.section === a.section) a.next = { slug: next.slug, title: next.title };
  }

  // related: tag overlap score, category bonus
  for (const a of arts) {
    const scores = new Map();
    for (const t of a.tags) {
      for (const b of byTag.get(t) || []) {
        if (b.slug === a.slug) continue;
        scores.set(b.slug, (scores.get(b.slug) || 0) + (a.category === b.category ? 2 : 1));
      }
    }
    a.related = [...scores.entries()]
      .sort((x, y) => y[1] - x[1] || y[0].length - x[0].length)
      .slice(0, 6)
      .map(([slug]) => ({ slug, title: bySlug.get(slug)?.title || slug }));
  }

  // section hubs (auto) + tag pages
  const hubs = [];
  const sectionsPresent = [...new Set(arts.map((a) => a.section))];
  for (const sec of sectionsPresent) {
    const inSec = sorted.filter((a) => a.section === sec);
    if (inSec.length === 0) continue;
    const cats = [...new Set(inSec.map((a) => a.category))];
    const rows = cats.map((c) => {
      const items = inSec.filter((a) => a.category === c).slice(0, 14);
      return [`**${c}**`, items.slice(0, 6).map((i) => `[[${i.slug}|${shortTitle(i.title, sec)}]]`).join(' · ') + (inSec.filter((a) => a.category === c).length > 6 ? ` (+${inSec.filter((a) => a.category === c).length - 6} more)` : '')];
    });
    hubs.push(article({
      slug: sec === 'getting-started' ? 'guides-hub' : `hub/${sec}`,
      title: `${sectionLabel(sec)} — hub`,
      section: sec,
      category: 'Hubs',
      tags: ['hub', sec],
      keywords: [sectionLabel(sec).toLowerCase(), 'hub', 'index', 'all pages'],
      summary: `Every ${sectionLabel(sec)} page in this release, organized by category. ${inSec.length} pages in this hub.`,
      hub: null,
      blocks: [
        p(`The complete **${sectionLabel(sec)}** collection for this release — **${inSec.length} pages** across ${cats.length} categories. This hub is the spoke-center: every page below links back here, and every page here links forward.`),
        h2('Browse by category'),
        table(['Category', 'Pages'], rows.slice(0, 40)),
        h2('How hubs work'),
        p('Nakshora Docs uses a hub-and-spoke internal linking model: hubs gather related detail pages, detail pages carry breadcrumbs back, and related-links connect siblings. Follow any chain — every path deepens.'),
        cards([
          { slug: inSec[0].slug, title: `Start: ${shortTitle(inSec[0].title, sec)}`, desc: 'The first page in this collection.' },
          { slug: 'utilities/index', title: 'Utilities reference', desc: 'The full class catalog.' },
          { slug: 'getting-started/introduction', title: 'Introduction', desc: 'Back to the beginning.' }
        ])
      ]
    }));
  }

  // tag pages
  const tagPages = [];
  const tagSlug = (t) => {
    const s = String(t).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    return s || 'tag';
  };
  const tags = [...byTag.entries()].sort((a, b) => b[1].length - a[1].length);
  for (const [tag, items] of tags) {
    tagPages.push(article({
      slug: `tags/${tagSlug(tag)}`,
      title: `#${tag} — tagged pages`,
      section: 'tags',
      category: 'Tags',
      tags: ['tags'],
      keywords: [tag, 'tag', 'topic'],
      summary: `${items.length} pages tagged “${tag}” in this release — a topic cluster of the Nakshora documentation.`,
      noindex: true,
      blocks: [
        p(`**${items.length} pages** carry the \`${tag}\` tag. Topic clusters like this one are how the documentation cross-connects beyond the sidebar.`),
        h2('Pages'),
        table(['Page', 'Section'], items.slice(0, 80).map((i) => [`[[${i.slug}|${shortTitle(i.title, i.section)}]]`, sectionLabel(i.section)])),
        items.length > 80 ? p(`…and ${items.length - 80} more — search for “${tag}” to see them all.`) : p(''),
        h2('More clusters'),
        p(`[[tags/index|All tags]] · [[utilities/index|Utilities]] · [[getting-started/introduction|Introduction]]`)
      ]
    }));
  }
  tagPages.push(article({
    slug: 'tags/index',
    title: 'All tags — topic clusters',
    section: 'tags',
    category: 'Tags',
    tags: ['tags'],
    keywords: ['tags', 'topics', 'clusters'],
    summary: `The full tag cloud for this release: ${tags.length} topic clusters interlinking the documentation.`,
    blocks: [
      p(`Tags form the second navigation layer: while the sidebar organizes by type, tags connect by **topic**. ${tags.length} clusters in this release.`),
      h2('Largest clusters'),
      table(['Tag', 'Pages'], tags.slice(0, 60).map(([t, items]) => [`[[tags/${tagSlug(t)}|#${t}]]`, String(items.length)])),
      h2('About internal linking'),
      p('Every article in these docs links to its hub, its siblings (previous/next), its related set, and every term it mentions that has its own page. That mesh is how both humans and crawlers discover depth.')
    ]
  }));

  return { sorted, hubs, tagPages, sectionsPresent };
}

function shortTitle(t, sec) {
  let s = t.replace(/ — .*$/, '').replace(/ — Nakshora.*$/, '');
  if (s.length > 70) s = s.slice(0, 67) + '…';
  return s;
}

// ------------------------------------------------------------- search index
function buildSearchIndex(arts) {
  const docs = [];
  const postings = new Map();
  const tokenize = (text) =>
    String(text)
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .split(/[^\p{L}\p{N}]+/u)
      .filter((w) => w.length >= 2);
  arts.forEach((a, i) => {
    const tokens = [
      ...tokenize(a.title), ...tokenize(a.title),
      ...tokenize(a.keywords.join(' ')), ...tokenize(a.keywords.join(' ')),
      ...tokenize(a.category),
      ...tokenize(a.tags.join(' ')),
      ...tokenize(sectionLabel(a.section)),
      ...tokenize(stripMarkdown(a.summary).slice(0, 400))
    ];
    docs.push({
      s: a.slug,
      t: a.title,
      c: a.category,
      sec: a.section,
      sn: stripMarkdown(a.summary).slice(0, 200),
      p: Math.round(a.popularity * 100)
    });
    const tf = new Map();
    for (const tk of tokens) tf.set(tk, (tf.get(tk) || 0) + 1);
    for (const [tk, n] of tf) {
      if (!postings.has(tk)) postings.set(tk, []);
      postings.get(tk).push([i, n]);
    }
  });
  return { docs, terms: Object.fromEntries(postings), total: docs.length };
}

// ------------------------------------------------------- version index
function versionIndexArticle(V, sorted) {
  const secs = [...new Set(sorted.map((a) => a.section))];
  const hubSlug = (sec) => (sec === 'getting-started' ? 'guides-hub' : `hub/${sec}`);
  const majors = ['utilities', 'colors', 'components', 'variants', 'responsive', 'tutorials', 'recipes', 'cookbook', 'glossary', 'faq', 'comparisons', 'spotlight', 'cheatsheets', 'patterns', 'integrations', 'cli', 'api', 'themes']
    .filter((s) => secs.includes(s));
  const countIn = (sec) => sorted.filter((a) => a.section === sec).length;
  return article({
    slug: 'index',
    title: `Nakshora ${V.label} documentation — ${sorted.length.toLocaleString('en-US')} articles`,
    section: 'getting-started',
    category: 'Start Here',
    order: 0,
    popularity: 1,
    tags: ['home', V.id, 'release'],
    keywords: [`nakshora ${V.id}`, `${V.label} documentation`, 'css framework', 'release docs'],
    summary: `The complete documentation home for Nakshora ${V.label} — ${V.tagline}. ${sorted.length.toLocaleString('en-US')} articles: utilities, colors, tutorials, recipes and more.`,
    blocks: [
      p(`Welcome to the **Nakshora ${V.label}** documentation — ${V.tagline.toLowerCase()} ${V.summary}`),
      table(['This release', ''], [
        ['Articles in this version', sorted.length.toLocaleString('en-US')],
        ['Utilities documented', V.utilityCount.toLocaleString('en-US')],
        ['Color palettes', String(V.paletteCount)],
        ['Responsive screens', String(V.screenCount)],
        ['Released', V.date]
      ]),
      h2('Start here'),
      cards(majors.slice(0, 8).map((sec) => ({
        slug: hubSlug(sec),
        title: sectionLabel(sec),
        desc: `${countIn(sec)} pages`
      }))),
      h2('Release highlights'),
      list(V.highlights.map((hhl) => `**${hhl}**`)),
      h2('Quick start'),
      V.jit
        ? code('bash', `npm install -D @nakshora/core@${V.num === 3.1 ? '3.1' : '3'}\nnpx nakshora init\nnpx nakshora build --content "./src/**/*.html"`, 'nakshora.config / terminal')
        : V.id === 'v2.0'
          ? code('bash', `npm install nakshora@2`, 'terminal')
          : code('html', `<link rel="stylesheet" href="https://cdn.nakshora.bsdc.info.bd/v1.0.0/nakshora.min.css" />`, 'index.html'),
      V.latest
        ? callout('new', `You are reading the docs of the **latest release**. New features land here first.`)
        : callout('tip', `A newer release exists — when you are ready to move forward, follow [[${V.id === 'v1.0' ? 'releases/migration-v1-to-v3' : V.id === 'v2.0' ? 'releases/migration-v2-to-v3' : 'releases/migration-v30-to-v31'}|the migration guide]].`),
      h2('Browse every collection'),
      table(['Collection', 'Pages', 'Hub'], secs
        .filter((s) => s !== 'tags')
        .map((s) => [sectionLabel(s), String(countIn(s)), `[[${hubSlug(s)}|open hub]]`]))
    ]
  });
}

// ------------------------------------------------------------------ core
function coreArticles() {
  const latest = VERSIONS.find((v) => v.latest);
  const totalArticles = VERSIONS.reduce((n, v) => n + (v._count || 0), 0);
  return [
    article({
      slug: 'index',
      title: 'Nakshora Docs — the complete documentation platform for the Nakshora CSS framework',
      section: 'core',
      category: 'Platform',
      tags: ['platform', 'home'],
      keywords: ['nakshora docs', 'css framework documentation', 'utility-first css', 'নক্ষত্র', 'নক্ষত্র ডকস'],
      summary: `${SITE.description} Four fully-documented releases (1.0 → 3.1), ${totalArticles.toLocaleString('en-US')}+ articles, instant search, AI-ready artifacts.`,
      blocks: [
        p(`**Welcome to Nakshora Docs** — the official documentation platform for the **Nakshora CSS framework**, the modern, ultra-fast, utility-first CSS framework with a JIT compiler. Created by **Rizwan Rahim Chowdhury**, developed by **RRC Development**.`),
        p('নক্ষত্র — *“star”* in Bangla. Every release below is documented completely: every utility, every variant, every config option, with working examples, recipes, tutorials and honest comparisons.'),
        h2('Choose your version'),
        cards(VERSIONS.slice().reverse().map((v) => ({ slug: v.id, title: `${v.label} ${v.latest ? '(latest)' : v.status === 'legacy' ? '(legacy)' : ''}`, desc: `${(v._count || 0).toLocaleString('en-US')} articles · ${v.tagline}` }))),
        h2('The platform in numbers'),
        table(['Measure', 'Value'], [
          ['Documented releases', '4 (v1.0 → v3.1)'],
          ['Articles on this platform', `${totalArticles.toLocaleString('en-US')}+`],
          ['Utilities in the current engine', latest.utilityCount.toLocaleString('en-US')],
          ['Color palettes × shades', `${latest.paletteCount} × ${latest.shades.length}`],
          ['Responsive screens (3.1)', String(latest.screenCount)],
          ['Variants (3.1)', String(latest.variantCount || '—')],
          ['Runtime JavaScript required', 'Zero']
        ]),
        h2('Why these docs rank'),
        list([
          '**Generated from source** — utility tables compile from the engine registry; they cannot drift.',
          '**Internally linked** — hub-and-spoke structure with related links, breadcrumbs, prev/next and tag clusters.',
          '**AI-ready** — llms.txt, per-version llms-full.md and structured corpora for machines.',
          '**Searchable in any language** — Unicode-normalized instant search with suggestions and ranking.',
          '**SEO to the bones** — semantic HTML, structured data, canonical URLs, sitemaps.'
        ]),
        callout('tip', 'Press **Ctrl K** (⌘ K) anywhere to search all versions at once.')
      ]
    }),
    article({
      slug: 'features',
      title: 'Platform features — what this documentation system ships',
      section: 'core',
      category: 'Platform',
      tags: ['platform', 'features'],
      keywords: ['features', 'documentation platform', 'search', 'seo', 'llm'],
      summary: 'The complete feature list of the Nakshora documentation platform: versioned docs, universal search, internal linking, SEO, LLM optimization and more.',
      blocks: [
        p('This platform is itself a product. Every capability below is live on the site you are reading.'),
        h2('Content'),
        table(['Feature', 'Detail'], [
          ['Versioned documentation', 'Four complete releases, each 2,000+ articles, cross-linked'],
          ['Source-generated reference', 'Utility tables emitted from the compiler registry'],
          ['Hub-and-spoke IA', 'Every topic has a hub; every page links home'],
          ['Tag clusters', 'Topic-based cross-links beyond the sidebar'],
          ['Tutorial series', 'Multi-chapter builds from zero to production'],
          ['Cookbook', 'Problem → solution recipes with variants'],
          ['Lookbooks', 'Whole-page composition studies per paradigm'],
          ['Glossary', 'Every term defined and interlinked']
        ]),
        h2('Search & discovery'),
        list([
          'Instant client-side search over every version',
          'BM25-style ranking with field weights, prefix boost and popularity priors',
          'Typo tolerance and “did you mean” suggestions',
          'Keyboard-first: Ctrl K / ⌘ K, arrow keys, Enter',
          'Unicode & multilingual normalization (including Bangla queries)'
        ]),
        h2('SEO & machines'),
        list([
          'Pre-rendered static HTML for every single page',
          'Unique titles, descriptions, canonicals, Open Graph & Twitter cards',
          'JSON-LD: WebSite, Organization, TechArticle, BreadcrumbList, FAQPage',
          'XML sitemap index + per-version sitemaps',
          'llms.txt + per-version llms-full.md for LLM agents',
          'Favicon suite: SVG + PNG + maskable + apple-touch + webmanifest'
        ]),
        h2('Experience'),
        list([
          'Light & dark themes with system sync',
          'Responsive from 320px to 5xl',
          'Copy buttons on every code block',
          'Version switcher with cross-version equivalents',
          'Zero-runtime philosophy: JS enhances, never gates'
        ])
      ]
    }),
    article({
      slug: 'about',
      title: 'About Nakshora — the framework, the author, the company',
      section: 'core',
      category: 'Platform',
      tags: ['platform', 'about', 'brand'],
      keywords: ['about nakshora', 'rizwan rahim chowdhury', 'rrc development', 'brand'],
      summary: 'Nakshora (নক্ষত্র, “star”) is a utility-first CSS framework by Rizwan Rahim Chowdhury, developed by RRC Development. MIT licensed, AI-ready, zero-runtime.',
      blocks: [
        p('**Nakshora** (নক্ষত্র — *star*) is a utility-first CSS framework: a fixed, documented vocabulary of single-purpose classes plus a JIT compiler that emits only the CSS you use.'),
        h2('Author'),
        p('**Rizwan Rahim Chowdhury** — owner and author of Nakshora. Contact: rizwan@bsdc.info.bd.'),
        h2('Company'),
        p('**RRC Development** — the development company behind Nakshora, its documentation and its release engineering. rrc@bsdc.info.bd · https://rrc.bsdc.info.bd'),
        h2('Principles'),
        list([
          '**Zero runtime** — Nakshora compiles to CSS; your JS budget stays yours.',
          '**Compatibility with conviction** — Tailwind 3.4 grammar, verified byte-identical.',
          '**AI-ready by default** — machine-readable artifacts ship with every release.',
          '**Docs as product** — this platform is maintained like the framework itself.',
          '**MIT, forever** — free for every use, attribution optional.'
        ]),
        h2('The estate'),
        table(['Property', 'Home'], [
          ['Main site', 'https://nakshora.bsdc.info.bd'],
          ['Documentation', 'https://docs.nakshora.bsdc.info.bd'],
          ['Playground', 'https://nakshora.bsdc.info.bd/playground/'],
          ['Source', 'https://github.com/nakshora/nakshora'],
          ['npm', 'https://www.npmjs.com/package/@nakshora/core']
        ])
      ]
    })
  ];
}

// ------------------------------------------------------------------- run
function main() {
  const corpus = loadCorpus();
  const v1Classes = loadV1Classes();
  const ctx = { corpus, v1Classes };

  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(path.join(OUT, 'content'), { recursive: true });
  fs.mkdirSync(path.join(OUT, 'search'), { recursive: true });

  const versionsOut = [];
  let grand = 0;

  for (const V of VERSIONS) {
    const arts = collectVersion(V, ctx);
    const { sorted, hubs, tagPages } = computeGraph(arts);
    const all = [...sorted, ...hubs, ...tagPages, versionIndexArticle(V, sorted)];
    const dedup = new Map();
    for (const a of all) if (!dedup.has(a.slug)) dedup.set(a.slug, a);
    const finalArts = [...dedup.values()];
    V._count = finalArts.length;
    grand += finalArts.length;

    const manifest = {};
    for (const a of finalArts) {
      manifest[a.slug] = {
        title: a.title,
        section: a.section,
        category: a.category,
        tags: a.tags,
        summary: a.summary,
        hub: a.hub,
        prev: a.prev,
        next: a.next,
        related: a.related,
        popularity: a.popularity,
        updated: a.updated
      };
    }
    fs.writeFileSync(path.join(OUT, 'content', `${V.id}.json`), JSON.stringify({ version: V.id, count: finalArts.length, articles: Object.fromEntries(finalArts.map((a) => [a.slug, a])) }));
    fs.writeFileSync(path.join(OUT, 'search', `${V.id}.json`), JSON.stringify(buildSearchIndex(finalArts)));

    // nav tree
    const nav = [];
    for (const [sec, label] of SECTIONS) {
      const inSec = sorted.filter((a) => a.section === sec);
      if (!inSec.length) continue;
      const cats = [...new Set(inSec.map((a) => a.category))].map((c) => ({
        category: c,
        items: inSec.filter((a) => a.category === c).slice(0, 60).map((a) => ({ slug: a.slug, title: shortTitle(a.title, sec) }))
      }));
      nav.push({ section: sec, label, count: inSec.length, categories: cats });
    }
    versionsOut.push({
      id: V.id, num: V.num, label: V.label, status: V.status, latest: V.latest, date: V.date,
      tagline: V.tagline, summary: V.summary, highlights: V.highlights,
      utilityCount: V.utilityCount, paletteCount: V.paletteCount, screenCount: V.screenCount,
      variantCount: V.variantCount || null, features: V.features,
      count: finalArts.length, nav
    });
    console.log(`  ${V.id}: ${finalArts.length} articles`);
  }

  const core = coreArticles();
  fs.writeFileSync(path.join(OUT, 'content', 'core.json'), JSON.stringify({ count: core.length, articles: Object.fromEntries(core.map((a) => [a.slug, a])) }));
  fs.writeFileSync(path.join(OUT, 'site.json'), JSON.stringify({ site: SITE, generatedAt: new Date().toISOString(), versions: versionsOut, totalArticles: grand + core.length }, null, 1));

  console.log(`✔ generated ${grand + core.length} total articles across ${VERSIONS.length} versions + core pages`);
}

main();
