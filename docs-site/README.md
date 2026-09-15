# Nakshora Docs

The official documentation platform for the **Nakshora CSS framework** —
`https://docs.nakshora.bsdc.info.bd`. React + Vite + TypeScript, statically
pre-rendered, hosted free on Cloudflare Pages.

Every Nakshora release from **1.0 to 3.1** is documented completely:
**2,000+ articles per version (9,300+ pages total)** — utility references
generated from the framework source, color labs, tutorials, cookbooks,
recipes, lookbooks, cheat sheets, glossary, comparisons, migration guides,
team playbooks and per-version deep dives.

Owner: **Rizwan Rahim Chowdhury** · Company: **RRC Development** · License: MIT.

## Architecture

```
scripts/
  generate-content.mjs   orchestrator: providers → articles → link graph → search indexes → .data/
  brand.mjs              hand-rolled PNG/ICO rasterizer: favicons, maskable, OG cards, favicon.svg
  prerender.mjs          renders every article to static HTML (semantic, SEO-complete, JS-optional)
  postbuild.mjs          robots, sitemaps, llms.txt + llms-full-*.md, humans.txt, webmanifest,
                         Cloudflare _redirects/_headers, security.txt
  validate.mjs           crawls dist/ and fails on any broken internal href
  lib/                   article model, block renderer, version manifests
  content/               content providers (guides, utilities, colors, variants, components,
                         learning, integrations, deep dives)
src/                     React islands: search modal + engine (BM25, typo tolerance, multilingual),
                         theme, copy buttons, scrollspy — plus the hand-crafted chrome.css
public/                  brand assets (favicon suite, OG cards)
```

Build pipeline (`npm run build`):

1. `generate` — assembles ~9,400 articles, computes hubs / prev-next / related / tag clusters,
   repairs links (guaranteed zero dangling), writes `.data/` + per-version search indexes.
2. `brand` — regenerates every favicon/OG asset deterministically.
3. `build:vite` — bundles the interactive layer (React) with a manifest.
4. `prerender` — one HTML file per article into `dist/` (canonical URLs, Open Graph,
   JSON-LD TechArticle + BreadcrumbList, breadcrumbs, TOC, sidebar, pager, related).
5. `postbuild` — the machine layer (LLM/SEO artifacts).
6. `validate` — CI gate: every internal href in every page must resolve.

The client JS **only enhances**: without it every page is fully readable
(zero-runtime philosophy, matching the framework itself).

## URL scheme

```
https://docs.nakshora.bsdc.info.bd/                 version picker + platform home
https://docs.nakshora.bsdc.info.bd/v3.1/            release home
https://docs.nakshora.bsdc.info.bd/v3.1/SECTION/SLUG/   article
https://docs.nakshora.bsdc.info.bd/v1.0/…           legacy releases, same shape
```

## Search

`Ctrl K` / `⌘ K` / `/` opens the universal search: per-version inverted indexes with
BM25-style ranking, title and popularity boosts, prefix completion, edit-distance
“did you mean”, Unicode/NFKD normalization (Bangla-ready) and cross-version results.

## Deploy — Cloudflare Pages (free)

- Build command: `npm run build` (inside `docs-site/`)
- Output directory: `dist`
- Node: 18.17+ (build image default is fine)
- Custom domain: `docs.nakshora.bsdc.info.bd` (automatic TLS)
- `_redirects` ships a branded 404; `_headers` ships immutable caching for hashed
  assets plus security headers.

## SEO / LLM layer

- Unique title/description/canonical/OG/Twitter per page; JSON-LD `TechArticle`,
  `BreadcrumbList`, `WebSite` (with `SearchAction`), `Organization`.
- `sitemap.xml` index + per-version sitemaps (~9,400 URLs).
- `llms.txt` at the root and `llms-full-vX.X.md` per version — every article with
  canonical URL and summary, for AI agents.
- Hub-and-spoke internal linking: hubs ↔ detail pages, tag clusters, prev/next,
  related sets, glossary autolinks.

## Develop

```bash
npm install
npm run dev        # generate + vite dev server (islands against live data)
npm run build      # full static production build
npm run preview    # serve dist/
node scripts/validate.mjs   # link audit
```
