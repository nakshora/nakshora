# PRESS RELEASE

**FOR IMMEDIATE RELEASE**

## Nakshora CSS 3.1 Released: The Bangladeshi-Built CSS Framework Now Matches Tailwind 3.4, Utility for Utility — with Zero Runtime JavaScript

**Sylhet, Bangladesh — September 16, 2026** — RRC Development today announced the release of **Nakshora CSS v3.1**, the "parity release" of the open-source, utility-first CSS framework built in Bangladesh. Version 3.1 resolves **11,417 static utilities across 155 variants and 10 breakpoints**, matching the Tailwind CSS 3.4 utility grammar while remaining completely CSS-first: generated sites ship no framework JavaScript at all. Nakshora is MIT-licensed and free forever.

নকশোরা (Nakshora) takes its name from **নকশা**, the Bangla word for "pattern." The framework turns small, composable class names — `grid md:grid-cols-3 gap-4 rounded-xl` — into production CSS, giving teams Tailwind-style ergonomics with an even stricter guarantee: the runtime is pure CSS.

### What ships in v3.1

- **Tailwind 3.4 grammar parity.** Utility names, variants and responsive prefixes follow the Tailwind 3.4 vocabulary, making adoption and migration straightforward for existing teams.
- **11,417 utilities, 37 categories.** Layout, flexbox, grid, typography, color, borders, gradients, shadows, filters, transforms, transitions, animations, tables, SVG, accessibility and more — all compiled from one canonical grammar.
- **22 palettes × 11 shades — 242 color tokens.** A complete design-token color system from slate to rose.
- **10 breakpoints, from watches to video walls.** `xxs` at 200 px up to `5xl` at 5,000 px — unusually wide coverage for real-world device diversity.
- **155 variants.** `hover:`, `focus:`, `dark:`, `group-hover:`, `first:`, `before:`, `md:` and every other state and structural modifier.
- **CSS-first, zero runtime.** No JavaScript is required or shipped. Full static builds weigh 5,983 KB minified (133 KB Brotli), and JIT output for a typical page is measured in single-digit kilobytes.
- **A full toolchain.** JIT compilation via `@nakshora/cli`, plus first-class **Vite** and **PostCSS** plugins, all published on npm.
- **Fast by design.** In project benchmarks, the JIT engine compiles a 200-line document in ~18 ms cold and ~1.3 ms hot.
- **AI-ready documentation.** Releases ship `llms.txt`, `llms-full.md` and a structured corpus so AI agents can read the framework natively.

### An ecosystem, not just a stylesheet

Alongside the framework, RRC Development is releasing its complete documentation and tooling ecosystem:

- **docs.nakshora.bsdc.info.bd** — 9,400 prerendered documentation pages covering every version from 1.0 to 3.1, with deep per-utility reference pages and full-text search.
- **play.nakshora.bsdc.info.bd** — a real-time playground that runs the actual v3.1 compiler entirely in the browser: 102 ready-made templates, a 200–5,000 px device lab, one-link sharing, and 638 counted features — with no backend at all.
- Both properties are hosted **free on Cloudflare Pages**.

### "Trust the pattern"

"Nakshora began as a question: can world-class software craftsmanship come from anywhere — even from a school desk in Sylhet, on a tablet?" said **Rizwan Rahim Chowdhury**, creator of Nakshora and founder of RRC Development. Chowdhury, a Class 7 student at Border Guard Public School and College, Sylhet, builds the entire framework, documentation platform and playground on an Android tablet using Termux, code-server and SSH. "Version 3.1 is the answer: yes. The vocabulary is boring on purpose, the compiler is fast on purpose, and the license is free on purpose. Nakshora is Bangladesh's gift to the CSS community."

Chowdhury is also the founder of the **Bangladesh Software Development Community (BSDC)**, which provides free hosting, mentorship and livestreams for Bangladeshi student developers.

### Availability

Nakshora CSS v3.1 is available today:

- **npm:** `@nakshora/core`, `@nakshora/cli`, `@nakshora/postcss`, `@nakshora/vite-plugin`
- **CDN:** static preflight + utility builds for drop-in use
- **Source:** [github.com/nakshora/nakshora](https://github.com/nakshora/nakshora) (MIT)
- **Docs:** [docs.nakshora.bsdc.info.bd](https://docs.nakshora.bsdc.info.bd/)
- **Playground:** [play.nakshora.bsdc.info.bd](https://play.nakshora.bsdc.info.bd/)

### About RRC Development

RRC Development is a software studio founded by Rizwan Rahim Chowdhury in Sylhet, Bangladesh, building open-source frameworks, documentation platforms and community infrastructure — including BSDC Cloud, free hosting for Bangladeshi students. Its mission is to democratize world-class software craftsmanship for Bengali-speaking youth.

**Media contact:** Rizwan Rahim Chowdhury — rizwan@bsdc.info.bd · rrc@bsdc.info.bd

**###**
