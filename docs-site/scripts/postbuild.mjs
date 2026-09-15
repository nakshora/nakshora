#!/usr/bin/env node
// ---------------------------------------------------------------------------
// Nakshora Docs — postbuild. Emits the machine-facing layer on top of dist/:
// search indexes, robots.txt, sitemap index + per-version sitemaps,
// llms.txt + per-version llms-full.md, humans.txt, webmanifest,
// Cloudflare _redirects/_headers, security.txt.
// ---------------------------------------------------------------------------
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE } from './lib/versions.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA = path.join(ROOT, '.data');
const DIST = path.join(ROOT, 'dist');
const HOST = SITE.url;
const today = new Date().toISOString().slice(0, 10);

const site = JSON.parse(fs.readFileSync(path.join(DATA, 'site.json'), 'utf8'));
const urls = JSON.parse(fs.readFileSync(path.join(DATA, 'urls.json'), 'utf8'));

// ------------------------------------------------------------ search data
fs.mkdirSync(path.join(DIST, 'search'), { recursive: true });
for (const f of fs.readdirSync(path.join(DATA, 'search'))) {
  fs.copyFileSync(path.join(DATA, 'search', f), path.join(DIST, 'search', f));
}

// ------------------------------------------------------------ robots.txt
fs.writeFileSync(
  path.join(DIST, 'robots.txt'),
  `User-agent: *
Allow: /
Disallow: /search/

Sitemap: ${HOST}/sitemap.xml

# Nakshora Docs — ${SITE.description.slice(0, 120)}
`
);

// ------------------------------------------------------------ sitemaps
const byVersion = { core: [] };
for (const u of urls) {
  const m = u.match(/^\/(v\d\.\d)\//) || (u === '/v1.0' ? ['/v1.0/'] : null);
  const key = m ? m[1] : 'core';
  (byVersion[key] ||= []).push(u);
}
// normalize bare version homes
for (const v of site.versions) (byVersion[v.id] ||= []).push(`/${v.id}/`);
for (const v of site.versions) byVersion[v.id] = [...new Set(byVersion[v.id])];

const sitemapEls = [];
const children = [];
function writeSitemap(name, list) {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${list
  .map((u) => {
    const prio = u === '/' ? '1.0' : u.split('/').length <= 2 ? '0.8' : '0.6';
    return `  <url><loc>${HOST}${u === '/' ? '/' : u}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>${prio}</priority></url>`;
  })
  .join('\n')}
</urlset>`;
  fs.writeFileSync(path.join(DIST, name), body);
  return name;
}
children.push(writeSitemap('sitemap-core.xml', byVersion.core));
for (const v of site.versions) children.push(writeSitemap(`sitemap-${v.id}.xml`, byVersion[v.id]));
fs.writeFileSync(
  path.join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${children.map((c) => `  <sitemap><loc>${HOST}/${c}</loc><lastmod>${today}</lastmod></sitemap>`).join('\n')}
</sitemapindex>`
);

// ------------------------------------------------------------ llms.txt
const llmsHead = `# Nakshora Docs

> ${SITE.description}

Documentation platform for the Nakshora CSS framework by ${SITE.owner} (${SITE.company}). Four fully documented releases (v1.0 → v3.1), ${site.totalArticles.toLocaleString('en-US')}+ articles, generated from the framework source, optimized for humans and LLMs alike.

- Owner: ${SITE.owner} <${SITE.ownerEmail}>
- Company: ${SITE.company} <${SITE.companyEmail}> (${SITE.companyUrl})
- License: ${SITE.license}
- Main site: ${SITE.mainSite}
- Repository: ${SITE.repo}

## Docs`;
const llmsLines = [llmsHead];
for (const v of site.versions.slice().reverse()) {
  llmsLines.push(`- [Nakshora ${v.label} documentation home](${HOST}/${v.id}/): ${v.tagline} — ${v.count.toLocaleString('en-US')} articles.`);
}
llmsLines.push(
  '',
  '## Full corpora',
  ...site.versions.map((v) => `- [Nakshora ${v.label} full documentation (Markdown)](${HOST}/llms-full-${v.id}.md): every article title + summary with canonical URLs.`),
  '',
  '## Platform',
  `- [Platform features](${HOST}/features/): search, SEO, internal linking, LLM optimization.`,
  `- [About & brand](${HOST}/about/): author, company, principles.`
);
fs.writeFileSync(path.join(DIST, 'llms.txt'), llmsLines.join('\n') + '\n');

for (const v of site.versions) {
  const arts = JSON.parse(fs.readFileSync(path.join(DATA, 'content', `${v.id}.json`), 'utf8')).articles;
  const lines = [
    `# Nakshora ${v.label} — full documentation index`,
    '',
    `> ${v.tagline}. ${v.count.toLocaleString('en-US')} articles. Release date ${v.date}.`,
    ''
  ];
  for (const [slug, a] of Object.entries(arts)) {
    const u = slug === 'index' ? `/${v.id}/` : `/${v.id}/${slug}/`;
    lines.push(`- [${a.title}](${HOST}${u}): ${a.summary.replace(/\s+/g, ' ').slice(0, 220)}`);
  }
  fs.writeFileSync(path.join(DIST, `llms-full-${v.id}.md`), lines.join('\n') + '\n');
}

// ------------------------------------------------------------ humans.txt
fs.writeFileSync(
  path.join(DIST, 'humans.txt'),
  `/* TEAM */
Owner & author: ${SITE.owner}
Contact: ${SITE.ownerEmail}
Company: ${SITE.company}
Contact: ${SITE.companyEmail}
Site: ${SITE.companyUrl}
Location: Bangladesh

/* SITE */
Name: ${SITE.name}
Framework documented: ${SITE.framework}
Standards: HTML, CSS, JSON-LD, llms.txt
Software: React, Vite, TypeScript, Node
Hosted on: Cloudflare Pages (free tier)
Last update: ${today}

/* THANKS */
নক্ষত্র — "star" in Bangla. Every utility is a small star; together, a sky.
`
);

// ------------------------------------------------------------ webmanifest
fs.writeFileSync(
  path.join(DIST, 'site.webmanifest'),
  JSON.stringify(
    {
      name: SITE.name,
      short_name: 'Nakshora',
      description: SITE.description,
      start_url: '/',
      scope: '/',
      display: 'standalone',
      background_color: '#0d1026',
      theme_color: '#0d1026',
      lang: 'en',
      icons: [
        { src: '/brand/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: '/brand/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
        { src: '/brand/android-chrome-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' }
      ]
    },
    null,
    2
  )
);

// ------------------------------------------------------------ Cloudflare
fs.writeFileSync(
  path.join(DIST, '_redirects'),
  `# trailing-slash canonicalization is handled by real directories;
# everything else falls through to the branded 404.
/* /404.html 404
`
);
fs.writeFileSync(
  path.join(DIST, '_headers'),
  `/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Cross-Origin-Opener-Policy: same-origin

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/favicon.ico
  Cache-Control: public, max-age=604800
/favicon.svg
  Cache-Control: public, max-age=604800
/apple-touch-icon.png
  Cache-Control: public, max-age=604800

/search/*
  Cache-Control: public, max-age=3600

/*.html
  Cache-Control: public, max-age=0, must-revalidate
/llms-full-*.md
  Cache-Control: public, max-age=3600
`
);

fs.writeFileSync(
  path.join(DIST, 'security.txt'),
  `Contact: mailto:${SITE.ownerEmail}
Expires: 2027-12-31T23:59:59.000Z
Preferred-Languages: en, bn
Canonical: ${HOST}/security.txt
`
);

const sizes = fs.readdirSync(DIST).map((f) => {
  const s = fs.statSync(path.join(DIST, f));
  return `${f}: ${(s.size / 1024).toFixed(0)}KB`;
});
console.log('✔ postbuild done.', sizes.join(' | '));
