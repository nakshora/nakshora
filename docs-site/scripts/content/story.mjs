// ---------------------------------------------------------------------------
// Nakshora Docs — "The Story" collection: 20 pages about the Nakshora CSS
// framework, its author Rizwan Rahim Chowdhury and RRC Development.
// Facts sourced from the author's engineering portfolio (rrc.cloud.bsdc.info.bd).
// ---------------------------------------------------------------------------
import { article, p, h2, h3, code, list, table, callout, cards } from '../lib/model.mjs';

const A = (f) => article({ section: 'story', category: 'Story', tags: ['story'], ...f });

export function storyArticles() {
  const pages = [
    A({
      slug: 'story/index',
      title: 'The Story of Nakshora — a pattern, a star, a framework',
      category: 'Story Hub',
      popularity: 1,
      tags: ['story', 'hub'],
      keywords: ['nakshora story', 'about nakshora', 'history', 'নকশোরা'],
      summary: 'Twenty pages on how Nakshora (নকশোরা — from নকশা, “pattern”) grew from a 2024 frozen stylesheet into a JIT compiler with Tailwind 3.4 parity, built by Rizwan Rahim Chowdhury of RRC Development.',
      blocks: [
        p('Nakshora is a utility-first CSS framework with a soul: a name drawn from **নকশা — pattern**, a logo drawn as a single confident stroke, and a release history that reads like a coming-of-age story. This collection tells it in twenty pages.'),
        h2('The twenty pages'),
        cards([
          { slug: 'story/what-is-nakshora', title: 'What is Nakshora?', desc: 'The framework in one page.' },
          { slug: 'story/the-name', title: 'The name: নকশোরা', desc: 'নকশা — pattern — and the star motif.' },
          { slug: 'story/rizwan-rahim-chowdhury', title: 'The author', desc: 'Rizwan Rahim Chowdhury, Sylhet.' },
          { slug: 'story/rrc-development', title: 'RRC Development', desc: 'The company behind the framework.' },
          { slug: 'story/tablet-workstation', title: 'Built on a tablet', desc: 'Termux + code-server engineering.' },
          { slug: 'story/timeline-2024-2026', title: 'Timeline 2024–2026', desc: 'v1.0 → v3.1, release by release.' },
          { slug: 'story/press-kit', title: 'Press kit', desc: 'Facts, badges and brand assets.' },
          { slug: 'story/roadmap-beyond', title: 'Beyond 3.1', desc: 'Where the pattern leads next.' }
        ]),
        h2('How to read it'),
        p('Start with [[story/what-is-nakshora|what Nakshora is]], meet [[story/rizwan-rahim-chowdhury|the author]], then follow the [[story/timeline-2024-2026|timeline]]. Engineers will enjoy [[story/zero-runtime-principle|the zero-runtime principle]] and [[story/compatibility-with-conviction|compatibility with conviction]]; writers and press should grab the [[story/press-kit|press kit]].'),
        callout('note', 'Every page in this collection is part of the platform corpus: indexed, sitemap’d, llms.txt-listed and cross-linked like the rest of the 9,300+ articles.')
      ]
    }),
    A({
      slug: 'story/what-is-nakshora',
      title: 'What is Nakshora? The framework in one page',
      tags: ['story', 'overview'],
      keywords: ['what is nakshora', 'css framework', 'utility-first', 'jit'],
      summary: 'Nakshora is a utility-first CSS framework: a documented vocabulary of single-purpose classes plus a JIT compiler that emits only the CSS you use. Zero runtime, MIT licensed, AI-ready.',
      blocks: [
        p('**Nakshora** is two things at once: a **design vocabulary** — thousands of small, single-purpose CSS classes like `p-4`, `md:grid-cols-2`, `hover:bg-blue-600` — and a **compiler** that scans your markup and emits exactly the CSS those classes need.'),
        h2('The shape of it'),
        list([
          '**Utilities** — 11,417 in the current engine, across 35 categories, verified byte-identical to Tailwind 3.4 grammar.',
          '**Variants** — 155 prefixes (hover, dark, group-*, max-*, @container…) that stack without limit.',
          '**Themes & palettes** — 22 color families × 11 shades, spacing scale, radii, shadows, fonts.',
          '**Tooling** — CLI (`init/build/dev/doctor/migrate/lsp`), PostCSS and Vite plugins, language server.',
          '**Zero runtime** — the output is pure CSS; your JavaScript budget is untouched.'
        ]),
        h2('Why it exists'),
        p('Because the author believes world-class tooling should be bottlenecked by mindset, never by metal — see [[story/why-a-css-framework|why a CSS framework]] and [[story/the-name|what the name means]].'),
        h2('Where to go next'),
        p('New to the methodology? [[../v3.1/getting-started/introduction|The introduction]]. Already fluent? [[../v3.1/utilities/index|The utilities reference]]. Curious about the human behind it? [[story/rizwan-rahim-chowdhury|The author]].')
      ]
    }),
    A({
      slug: 'story/the-name',
      title: 'নকশোরা — the name: নকশা means pattern',
      tags: ['story', 'brand', 'bangla'],
      keywords: ['nakshora name', 'নকশোরা', 'নকশা', 'pattern', 'bangla', 'etymology'],
      summary: 'Nakshora (নকশোরা) takes its soul from নকশা — “pattern” in Bangla. A CSS framework is exactly that: a system of patterns. The star motif in the brand completes the picture.',
      blocks: [
        p('Say it slowly: **নক-শো-রা**. The root is **নকশা (noksha)** — *pattern, design, motif* — the word Bangla speakers use for the embroidered geometry of a *nakshi kantha* as readily as for an architect’s drawing.'),
        p('A utility-first CSS framework is, distilled, **a library of patterns**: spacing patterns, color patterns, layout patterns. Naming it after the Bangla word for pattern was not decoration; it was definition.'),
        h2('The star in the mark'),
        p('The brand’s circular indigo badge carries a single calligraphic stroke, and the documentation platform surrounds it with constellations — because a pattern of stars is the oldest নকশা there is. See [[story/brand-guidelines|brand guidelines]] for the formal rules.'),
        h2('A Bangla-first heart'),
        p('The name commits the project to the Bangla web: Bangla-ready search normalization on this very platform, `hreflang` discipline across the author’s platforms, and a mission stated plainly in [[story/bangla-web-mission|the Bangla web mission]].'),
        callout('tip', 'নক্ষত্র (nokkhotro — *star*) is the framework’s companion word: the docs call every utility “a small star; together, a sky”. Pattern and star, grammar and poetry.')
      ]
    }),
    A({
      slug: 'story/rizwan-rahim-chowdhury',
      title: 'Rizwan Rahim Chowdhury — the author of Nakshora',
      tags: ['story', 'author', 'brand'],
      category: 'People',
      keywords: ['rizwan rahim chowdhury', 'author', 'developer', 'sylhet', 'seo architect'],
      summary: 'Rizwan Rahim Chowdhury — software developer, SEO architect and full-stack engineer from Sylhet, Bangladesh — is the author and owner of Nakshora. He builds production platforms from an Android tablet via Termux and code-server.',
      blocks: [
        p('**Rizwan Rahim Chowdhury** is a software developer, SEO architect and full-stack engineer from Sylhet, Bangladesh — the author and owner of the Nakshora CSS framework and the founder of **RRC Development**.'),
        p('His biography reads like a proof-of-concept for everything Nakshora stands for: world-class software is bottlenecked by mindset, never by metal. He architects and ships production platforms — DebateSylhetBD, the Bangladesh Software Development Community (BSDC), BSDC Cloud, Gyankosh Wiki and BanglaVerseWiki — from a self-built Linux workstation running on an Android tablet through Termux, code-server and OpenSSH.'),
        h2('In his own stack'),
        table(['Layer', 'Tool'], [
          ['Shell', 'Termux (Debian-class userland on Android)'],
          ['Editor', 'code-server (VS Code in the browser)'],
          ['Orchestration', 'OpenSSH with ControlMaster multiplexing'],
          ['Languages', 'PHP 8, Node.js, Express, Bash'],
          ['Data', 'MySQL 8 on Aiven-class clusters over TLS'],
          ['Delivery', 'Nginx + Cloudflare'],
          ['Discovery', 'JSON-LD, Schema.org, semantic HTML5']
        ]),
        h2('The mission'),
        p('Democratize world-class software craftsmanship for Bengali-speaking youth. Every platform he founds is designed as a public utility — lowering the activation energy for the next thousand engineers behind him. Nakshora’s [[story/education-first|education-first]] documentation and the free hosting of [[story/the-bsdC-ecosystem|BSDC Cloud]] are the same mission wearing different clothes.'),
        h2('Contact'),
        list(['Email: rizwan@bsdc.info.bd', 'Portfolio: rrc.cloud.bsdc.info.bd', 'Company: [[story/rrc-development|RRC Development]]']),
        callout('note', 'The same SEO doctrine that powers his wiki platforms — server-rendered semantics, exactly one `h1`, JSON-LD on every relevant route — is baked into this documentation platform. See [[story/seo-doctrine|the SEO doctrine]].')
      ]
    }),
    A({
      slug: 'story/rrc-development',
      title: 'RRC Development — the company behind Nakshora',
      tags: ['story', 'brand', 'company'],
      category: 'People',
      keywords: ['rrc development', 'company', 'rrc', 'software company bangladesh'],
      summary: 'RRC Development is the development company of Rizwan Rahim Chowdhury: the home of Nakshora, its documentation platform, release engineering and the BSDC family of community platforms.',
      blocks: [
        p('**RRC Development** is the company through which Rizwan Rahim Chowdhury authors, maintains and licenses his software: the Nakshora CSS framework, this documentation platform, and the community infrastructure of the BSDC ecosystem.'),
        h2('What RRC Development ships'),
        list([
          '**Nakshora** — the framework: core compiler, CLI, PostCSS & Vite plugins, language server.',
          '**Nakshora Docs** — this platform: 9,300+ pre-rendered articles, search, SEO/LLM layer.',
          '**BSDC Cloud** — free PHP/MySQL + Node hosting for verified Bangladeshi students and developers.',
          '**Gyankosh Wiki & BanglaVerseWiki** — clean-slate wiki engines built for the morphology of Bangla.',
          '**DebateSylhetBD** — the inter-school debate registry and knowledge graph of Sylhet.'
        ]),
        h2('Principles'),
        list([
          'MIT licensing by default — free for every use, attribution optional.',
          'Server-rendered, semantic, schema-annotated everything.',
          'Performance budgets reviewed like code: Lighthouse 95+ on mid-tier Android over 3G.',
          'Community platforms are public utilities, not funnels.'
        ]),
        p('Company contact: rrc@bsdc.info.bd · rrc.bsdc.info.bd. Brand and attribution rules live in [[story/brand-guidelines|brand guidelines]] and [[story/license-and-attribution|license & attribution]].')
      ]
    }),
    A({
      slug: 'story/tablet-workstation',
      title: 'Built on a tablet — the Nakshora workstation story',
      tags: ['story', 'engineering', 'termux'],
      keywords: ['termux', 'code-server', 'android tablet', 'workstation', 'engineering'],
      summary: 'Nakshora is engineered on an Android tablet: Termux shells, code-server in the browser, SSH-multiplexed remotes and battery-sacred git discipline. Mindset over metal.',
      blocks: [
        p('Most engineers begin on a desktop. The author of Nakshora began on a tablet — and never moved off it. What started as hardware limitation became philosophical statement: **world-class software is bottlenecked by mindset, never by metal**.'),
        h2('The workstation'),
        code('bash', `termux@rrc-tablet:~$ tmux attach -t nakshora
termux@rrc-tablet:~$ code-server --bind-addr 0.0.0.0:8443
termux@rrc-tablet:~$ git push origin main   # deferred to Wi-Fi; every milliamp is sacred`, 'the actual workflow'),
        list([
          '**Termux** provides the Debian-class userland: git, Node, PHP, MySQL clients.',
          '**code-server** is the IDE — extensions, terminal, debugging, Git UI in a browser tab.',
          '**OpenSSH multiplexing** keeps the radio idle; long compiles persist in tmux.',
          '**Aiven-class MySQL** over TLS means the tablet stays a thin compute surface.'
        ]),
        h2('Why it matters for Nakshora'),
        p('A compiler designed on battery power respects other people’s batteries: [[story/zero-runtime-principle|zero runtime]], 18 ms JIT builds, 1.3 ms incremental rebuilds. The framework’s performance culture is the workstation’s power culture, generalized.'),
        callout('pro', 'The docs you are reading were generated by scripts written in this environment. The [[../v3.1/cli/index|CLI]]’s `doctor` command exists because debugging on a tablet leaves no patience for mystery.')
      ]
    }),
    A({
      slug: 'story/why-a-css-framework',
      title: 'Why build a CSS framework in Bangladesh',
      tags: ['story', 'mission'],
      keywords: ['why nakshora', 'css framework', 'bangladesh', 'developers'],
      summary: 'Because tooling is infrastructure: a documented, testable, AI-ready CSS engine gives Bangladeshi teams the same footing as any Silicon Valley stack — without licensing costs or runtime taxes.',
      blocks: [
        p('Every ecosystem that takes itself seriously owns its tooling. Nakshora exists so that the Bangla web — and any web — can stand on a CSS engine that is **free (MIT), documented to the bone, and verifiable by machines**.'),
        h2('The gaps it fills'),
        list([
          '**Cost** — no Pro tier, no seat licensing; the [[story/license-and-attribution|MIT license]] is the business model.',
          '**Confidence** — differential oracles prove output byte-identical to the industry grammar ([[story/compatibility-with-conviction|compatibility with conviction]]).',
          '**Discovery** — AI-ready artifacts ([[story/ai-ready-by-default|llms.txt, corpora]]) make the framework learnable by the tools the next generation actually asks.',
          '**Education** — documentation written as a textbook ([[story/education-first|education-first]]), because in Sylhet the docs *are* the course.'
        ]),
        h2('The pattern'),
        p('It is the same pattern as [[story/the-bsdC-ecosystem|BSDC Cloud]]: remove the activation cost, and a thousand engineers appear. See [[story/the-name|the name]] for why the word for *pattern* was the only possible name.')
      ]
    }),
    A({
      slug: 'story/design-philosophy',
      title: 'The design philosophy — patterns all the way down',
      tags: ['story', 'design', 'philosophy'],
      keywords: ['design philosophy', 'utility-first', 'design tokens', 'patterns'],
      summary: 'Nakshora’s philosophy: utilities are vocabulary, tokens are grammar, components are essays. Predictable patterns beat clever exceptions; the docs are the specification.',
      blocks: [
        p('Nakshora treats CSS the way a language treats words: **utilities are vocabulary, tokens are grammar, and components are essays** written in that language. The framework’s job is to keep the vocabulary complete, the grammar regular and the essays optional.'),
        h2('Five commitments'),
        list([
          '**One purpose per class** — `mt-4` does one thing forever; surprises are bugs.',
          '**Tokens over literals** — every value traces to a scale ([[../v3.1/utilities/index|utility scales]]), so themes are systematic.',
          "**'+' composition over inheritance** — no cascade magic; classes add, they don’t override-by-mystery.",
          '**The docs are the spec** — if it isn’t documented with an example, it isn’t shipped.',
          '**Beauty is testable** — lookbooks and blueprints ([[../v3.1/design/index|lookbooks & design guides]]) are reviewed artifacts, not mood boards.'
        ]),
        h2('The aesthetic lineage'),
        p('v1’s neon glow and glass ([[story/timeline-2024-2026|2024]]) taught the framework taste; v3’s parity taught it discipline. Both survive: see [[../v3.1/components/index|design components]] for the living descendants of the v1 look.'),
        callout('tip', 'নকশা means pattern — and the philosophy is simply: **trust the pattern**. [[../v3.1/patterns/index|Layout patterns]] shows what that trust produces.')
      ]
    }),
    A({
      slug: 'story/bangla-web-mission',
      title: 'The Bangla web mission',
      tags: ['story', 'bangla', 'mission'],
      keywords: ['bangla web', 'bengali', 'localization', 'wiki', 'knowledge'],
      summary: 'Nakshora is part of a larger mission: a sovereign, discoverable Bangla knowledge layer — wiki engines built for Bangla morphology, hreflang discipline, and search that treats Bengali script as a first-class citizen.',
      blocks: [
        p('The author’s wiki engines — Gyankosh and BanglaVerseWiki — are clean-slate builds for the morphology of Bangla, not MediaWiki forks. Nakshora Docs inherits that conviction: **the Bangla web deserves first-class tooling, not translated afterthoughts**.'),
        h2('What that means here'),
        list([
          'Search on this platform is Unicode/NFKD-normalized and Bangla-aware — try `নক্ষত্র` in the search box.',
          '`hreflang` discipline (en ↔ bn) across the author’s estate; canonical URLs always absolute.',
          'Font stacks include Noto Sans Bengali by default in the chrome.',
          'Image alt text written as factual, indexable prose — in any language.'
        ]),
        h2('The civilizational objective'),
        p('Make Bengali knowledge **globally discoverable and AI-citable**. A framework whose docs are machine-readable ([[story/ai-ready-by-default|AI-ready by default]]) is the CSS-layer contribution to that goal.'),
        callout('note', 'নকশোরা — the name itself is the mission statement. [[story/the-name|Read the etymology]].')
      ]
    }),
    A({
      slug: 'story/timeline-2024-2026',
      title: 'Timeline 2024–2026 — v1.0 to v3.1, release by release',
      tags: ['story', 'history', 'releases'],
      keywords: ['nakshora history', 'timeline', 'releases', 'v1', 'v2', 'v3'],
      summary: '2024: a frozen 1,038-class design system. 2026-09: a JIT engine with Tailwind 3.4 parity. The Nakshora timeline, release by release, with the lessons each era left behind.',
      blocks: [
        p('Four releases in two years — each one a different answer to the question *what should a CSS framework be?*'),
        table(['Date', 'Release', 'Answer', 'Legacy'], [
          ['2024', '[[../v1.0|v1.0]]', 'A frozen stylesheet: 1,038 hand-tuned classes, 19 palettes, 8K-ready screens', 'Taste — neon, glass, brutalism'],
          ['2026-09-12', '[[../v2.0|v2.0]]', 'A generator: TypeScript CSSGenerator, 50 hues × 10 shades, npm packaging', 'Discipline — typed config'],
          ['2026', '[[../v3.0|v3.0]]', 'A compiler: pnpm monorepo, JIT, CLI, 3,091 utilities', 'Speed — 18 ms builds'],
          ['2026', '[[../v3.1|v3.1]]', 'A standard: Tailwind 3.4 parity, 11,417 utilities, LSP, CSS-first config', 'Trust — byte-identical oracles']
        ]),
        h2('The through-line'),
        p('Nothing was discarded; everything was recompiled. v1’s palettes live as configs, v2’s generator API survives in v3, and the docs platform you are reading is the evolved form of v3.0’s generated-reference idea ([[../v3.1/releases/whats-new|release notes]]).'),
        callout('new', 'The next chapter is unwritten — [[story/roadmap-beyond|beyond 3.1]].')
      ]
    }),
    A({
      slug: 'story/the-bsdC-ecosystem',
      title: 'The BSDC ecosystem — community as infrastructure',
      tags: ['story', 'community', 'ecosystem'],
      keywords: ['bsdC', 'bsdC cloud', 'debatesylhetbd', 'gyankosh', 'banglaversewiki'],
      summary: 'Nakshora grows inside an ecosystem: BSDC (the community), BSDC Cloud (free hosting), DebateSylhetBD (the debate knowledge graph), Gyankosh & BanglaVerseWiki (Bangla wikis).',
      blocks: [
        p('Nakshora is not a solo act; it is the framework-layer of a wider ecosystem built by the same author for the same mission.'),
        h2('The family'),
        list([
          '**BSDC — Bangladesh Software Development Community**: weekly livestreams, mentor matchmaking, code-review circles, a bilingual job board. Intentionally allergic to gatekeeping.',
          '**BSDC Cloud**: free PHP/MySQL + sandboxed Node hosting with daily backups and HTTPS for verified students — the activation cost of “going live”, removed.',
          '**DebateSylhetBD**: inter-school tournament registry, motion archives, adjudicator profiles — a knowledge graph targeting 60+ schools and 1,200+ speakers.',
          '**Gyankosh Wiki & BanglaVerseWiki**: custom wiki engines with Bangla tokenizers, JSON-LD article schemas and perfect Lighthouse scores on 3G.'
        ]),
        h2('Why it matters to the framework'),
        p('Every Nakshora decision is tested against this ecosystem first: does it work on 3G? Does a Class-7 student understand it? Does an LLM find it? That is the quality bar, and it is why the docs read the way they do ([[story/education-first|education-first]]).')
      ]
    }),
    A({
      slug: 'story/seo-doctrine',
      title: 'The SEO doctrine — discovery as a feature',
      tags: ['story', 'seo', 'doctrine'],
      keywords: ['seo', 'json-ld', 'schema.org', 'server-side rendering', 'discover'],
      summary: 'The author’s SEO doctrine, applied to Nakshora Docs: server-render every word, one h1 per page, JSON-LD on every relevant route, sitemaps + llms.txt, Lighthouse 95+ on 3G.',
      blocks: [
        p('In the author’s platforms, SEO is not marketing — it is **civility toward machines**: the same respect for crawlers and assistants that semantic HTML shows to screen readers.'),
        h2('The doctrine, itemized'),
        list([
          'Server-render every word; JavaScript enhances, never gates.',
          'Exactly one `h1` per page, hierarchical headings beneath.',
          'JSON-LD `Person`, `TechArticle`, `WebSite`, `Organization` on every relevant route.',
          'Canonical URLs always absolute; OpenGraph `site_name` enforced.',
          'sitemap.xml + robots.txt + llms.txt, always.',
          'Image alt text as factual, indexable prose; images ≥1200px for Discover.',
          'Lighthouse 95+ on mid-tier Android over 3G — performance is SEO.'
        ]),
        h2('Proof on this platform'),
        p('Inspect this page: unique title and description, canonical, breadcrumb + article JSON-LD, per-version sitemaps ([[features|platform features]]), and an editorial image on every article. The doctrine, executed.'),
        callout('pro', 'The same doctrine powers Gyankosh’s Bangla articles into Google’s knowledge surfaces — see [[story/bangla-web-mission|the Bangla web mission]].')
      ]
    }),
    A({
      slug: 'story/zero-runtime-principle',
      title: 'The zero-runtime principle',
      tags: ['story', 'performance', 'principles'],
      keywords: ['zero runtime', 'performance', 'css only', 'javascript budget'],
      summary: 'Nakshora compiles to CSS and ships no JavaScript. The zero-runtime principle: your JS budget is yours; the framework’s job ends at the stylesheet.',
      blocks: [
        p('Every kilobyte of JavaScript is a tax on someone’s battery, someone’s data plan, someone’s low-end phone — often in Sylhet, often on 3G. Nakshora’s answer is absolute: **the framework ships CSS, and nothing else**.'),
        h2('What zero-runtime buys'),
        list([
          '**No hydration** — pages are interactive at first paint.',
          '**No supply chain** — the core compiler has zero runtime dependencies.',
          '**No lock-in** — the output is plain CSS; leave whenever you like (MIT).',
          '**Honest budgets** — performance budgets ([[../v3.1/teams/performance-budgets|performance budgets]]) stay about *your* code.'
        ]),
        h2('Even the docs obey'),
        p('This platform is pre-rendered HTML; its small React island only enhances search and theme. Without JavaScript, every word still renders — the [[story/seo-doctrine|doctrine]] demands it.'),
        callout('tip', 'Measure it yourself: [[../v3.1/performance/index|performance numbers]] from CI, pinned by doc-claims tests.')
      ]
    }),
    A({
      slug: 'story/compatibility-with-conviction',
      title: 'Compatibility with conviction — the Tailwind parity story',
      tags: ['story', 'parity', 'principles'],
      keywords: ['tailwind parity', 'compatibility', 'differential testing', 'oracle'],
      summary: 'Nakshora 3.1 compiles Tailwind 3.4 grammar byte-identically, proven by a permanent differential oracle in CI. Compatibility as a maintained property, not a launch claim.',
      blocks: [
        p('Compatibility is usually a claim. In Nakshora it is a **test**: a differential oracle compiles identical inputs through both engines and fails CI on *any* byte difference. Parity is a maintained property.'),
        h2('Why bother'),
        list([
          '**Ecosystem transfer** — every Tailwind 3.4 config, plugin and tutorial works ([[../v3.1/integrations/index|integrations]]).',
          '**Hiring reality** — teams already speak the grammar; Nakshora adds speed and tooling, not retraining.',
          '**Escape hatches that work** — `nakshora migrate` ports projects in both directions.'
        ]),
        h2('Conviction, not imitation'),
        p('The grammar is shared; the engine is original: JIT extraction, incremental cache, LSP, CSS-first config. Nakshora speaks the industry’s language with its own accent — see [[story/design-philosophy|the design philosophy]].'),
        callout('note', 'Curious about the numbers? 11,343 static + 1,338 dynamic classes proven identical. [[../v3.1/comparisons/index|parity comparisons]].')
      ]
    }),
    A({
      slug: 'story/ai-ready-by-default',
      title: 'AI-ready by default — machines are readers too',
      tags: ['story', 'ai', 'llm'],
      keywords: ['llms.txt', 'ai ready', 'corpus', 'machine readable'],
      summary: 'Since v3.0, every Nakshora release ships machine-readable artifacts: llms.txt, a full Markdown dump, a structured corpus and an SFT dataset. Documentation as training data.',
      blocks: [
        p('v3.0 pioneered the idea that a framework’s docs are **training data**: `llms.txt` for orientation, `llms-full.md` for the whole corpus, `corpus.json` for structure, `sft-train.jsonl` for behavior. v3.1 and this platform extend it.'),
        h2('The artifacts'),
        table(['Artifact', 'For', 'Where'], [
          ['llms.txt', 'Agent orientation', '`/llms.txt`'],
          ['llms-full-*.md', 'Full-text ingestion per version', 'Linked from llms.txt'],
          ['corpus.json', 'Structured utilities + examples', 'Repository ai/'],
          ['sft-train.jsonl', 'Assistant fine-tuning', 'Repository ai/']
        ]),
        h2('The principle'),
        p('If a fact isn’t machine-readable, it doesn’t exist for the assistants the next generation asks. Nakshora writes for humans **and** crawlers **and** models — one source, three audiences. ([[story/seo-doctrine|The doctrine]] calls this civility toward machines.)'),
        callout('new', 'This documentation platform is the evolved form: every article here lands in per-version llms-full corpora automatically.')
      ]
    }),
    A({
      slug: 'story/community-and-mentorship',
      title: 'Community & mentorship — the human layer',
      tags: ['story', 'community'],
      keywords: ['community', 'mentorship', 'bsdC', 'code review'],
      summary: 'Nakshora’s community practice: BSDC livestreams, mentor matchmaking, code-review circles, beginner-friendly by design, bilingual by conviction.',
      blocks: [
        p('A framework is a promise of maintenance; a community is the proof. Nakshora’s community practice lives in **BSDC** — intentionally bilingual, intentionally beginner-friendly, intentionally allergic to gatekeeping.'),
        h2('The weekly rhythm'),
        list([
          'Engineering livestreams — real code, real bugs, real fixes.',
          'Mentor matchmaking — first-timers paired with reviewers.',
          'Code-review circles — utility markup reviewed like prose.',
          'A curated job board calibrated for Bangladeshi engineers.'
        ]),
        h2('How the docs participate'),
        p('Every tutorial series ([[../v3.1/tutorials/index|tutorials]]) is written to be taught live on a livestream; every troubleshooting page ([[../v3.1/troubleshooting/index|troubleshooting]]) began as a community question. The docs are the community’s memory.'),
        callout('tip', 'New here? [[../v3.1/teams/onboarding-developers|Onboarding developers]] is the week-one plan teams actually use.')
      ]
    }),
    A({
      slug: 'story/education-first',
      title: 'Education-first — docs as a textbook',
      tags: ['story', 'education', 'mission'],
      keywords: ['education', 'tutorials', 'learning', 'students'],
      summary: 'Written by a student, for students: Nakshora docs assume no prior setup, define every term in a glossary, and sequence tutorials like a syllabus. The docs are the course.',
      blocks: [
        p('The author is, factually, a student — Class 7 at BGPSC Sylhet. Nakshora’s documentation is written from that side of the desk: **assume nothing, define everything, sequence like a syllabus**.'),
        h2('Textbook habits'),
        list([
          'A [[../v3.1/glossary/index|glossary]] that defines every term the prose uses.',
          'Tutorial series that build one real project across chapters ([[../v3.1/tutorials/index|tutorials]]).',
          'Cookbook entries structured as problem → solution → why ([[../v3.1/cookbook/index|cookbook]]).',
          'FAQ answered in the voice of the question ([[../v3.1/faq/index|FAQ]]).',
          'Comparisons that say *when not to use us* ([[../v3.1/comparisons/index|comparisons]]).'
        ]),
        h2('The measure'),
        p('Can a motivated thirteen-year-old on a tablet go from zero to deployed with only these docs? That question is the acceptance test for every release — and so far, yes.'),
        callout('note', 'See [[story/rizwan-rahim-chowdhury|the author]] for why the tablet is the benchmark.')
      ]
    }),
    A({
      slug: 'story/brand-guidelines',
      title: 'Brand guidelines — logo, color, voice',
      tags: ['story', 'brand'],
      category: 'Brand',
      keywords: ['brand guidelines', 'logo', 'identity', 'nakshora brand'],
      summary: 'How to use the Nakshora brand: the indigo circle badge with the calligraphic stroke, the নকশোরা wordmark, constellation imagery, and a voice that is precise, warm and Bangla-proud.',
      blocks: [
        p('The Nakshora identity is small and strict: **one badge, one wordmark, one motif**.'),
        h2('The badge'),
        list([
          'A deep-indigo circle carrying a single white calligraphic stroke.',
          'Minimum size 16px; clear space = one stroke-width on all sides.',
          'Never recolor, outline, rotate or add effects. On dark surfaces use the badge as-is.',
          'Official assets ship in the framework repository (`img/`) and this platform’s `/brand/`.'
        ]),
        h2('The wordmark & name'),
        list([
          'Latin: “Nakshora”. Bangla: “নকশোরা”. Both are the name; use either, never a translation.',
          'First mention in prose: “Nakshora (নকশোরা) — from নকশা, pattern”.',
          'Companion word নক্ষত্র (*star*) may appear in poetic contexts only.'
        ]),
        h2('The motif & voice'),
        p('Constellations and embroidered-pattern imagery (nakshi kantha geometry) are the approved photographic motifs — see the editorial library on every article of this platform. Voice: precise like a compiler, warm like a mentor, proud of its Bangla roots. ([[story/the-name|The name]], [[story/press-kit|press kit]].)')
      ]
    }),
    A({
      slug: 'story/press-kit',
      title: 'Press kit — facts, badges and assets',
      tags: ['story', 'brand', 'press'],
      category: 'Brand',
      keywords: ['press kit', 'media', 'facts', 'badges'],
      summary: 'Ready-to-publish facts about Nakshora: one-paragraph boilerplate, key numbers, author bio line, logo and image assets, and contact addresses for RRC Development.',
      blocks: [
        p('Everything a journalist or podcaster needs, in one place.'),
        h2('Boilerplate'),
        p('Nakshora (নকশোরা — from নকশা, “pattern”) is a utility-first CSS framework with a JIT compiler, created by Rizwan Rahim Chowdhury and developed by RRC Development. Free and MIT-licensed, it compiles Tailwind-3.4-compatible grammar byte-identically, ships zero runtime JavaScript, and documents every one of its 11,417 utilities for humans and machines alike.'),
        h2('Key numbers'),
        table(['Metric', 'Value'], [
          ['Utilities (v3.1)', '11,417 across 35 categories'],
          ['Variants', '155, stackable'],
          ['Breakpoints', '10 (200px → 5000px)'],
          ['JIT build', '18 ms cold, 1.3 ms incremental'],
          ['Runtime JavaScript', '0 bytes'],
          ['Documentation', '9,300+ articles, 4 versions'],
          ['License', 'MIT']
        ]),
        h2('Assets & contacts'),
        list([
          'Logo: `/brand/android-chrome-512x512.png` (also 192px, ICO, apple-touch).',
          'Social cards: `/og.png` + per-version `/og-vX.X.png` (1200×630).',
          'Author: Rizwan Rahim Chowdhury — rizwan@bsdc.info.bd.',
          'Company: RRC Development — rrc@bsdc.info.bd · rrc.bsdc.info.bd.'
        ]),
        callout('note', 'Attribution is optional under [[story/license-and-attribution|MIT]] — but always appreciated.')
      ]
    }),
    A({
      slug: 'story/license-and-attribution',
      title: 'License & attribution — MIT, forever',
      tags: ['story', 'license'],
      category: 'Brand',
      keywords: ['license', 'mit', 'attribution', 'open source'],
      summary: 'Nakshora is MIT licensed: use it commercially, modify it, teach with it, ship it. Attribution is optional; the framework asks only that you keep the license notice.',
      blocks: [
        p('Nakshora — compiler, CLI, plugins, docs content — is licensed **MIT**. The entire text of the permission fits in a paragraph, and that is the point.'),
        h2('You can'),
        list([
          'Use it in commercial products without fees or seats.',
          'Modify the engine and keep your changes private.',
          'Teach with the docs, translate them, print them.',
          'Vendor compiled CSS under your own brand.'
        ]),
        h2('You should'),
        list(['Keep the license notice in redistributions of the source.', 'Not imply endorsement by the author or RRC Development when you fork the name.']),
        p('The brand (logo, “Nakshora”, “নকশোরা”) remains the author’s trademark — use it to refer to the framework, not to rebrand it. ([[story/brand-guidelines|Brand guidelines]].)')
      ]
    }),
    A({
      slug: 'story/roadmap-beyond',
      title: 'Beyond 3.1 — where the pattern leads',
      tags: ['story', 'roadmap'],
      keywords: ['roadmap', 'future', 'v4', 'what is next'],
      summary: 'The direction of travel after 3.1: deeper container-query ergonomics, richer LSP completions, a Bangla-first learning track, and an oracle that never sleeps.',
      blocks: [
        p('Roadmaps age badly; directions age well. Nakshora’s direction after 3.1:'),
        list([
          '**Container-first responsive** — more `@container` ergonomics until viewport queries feel legacy.',
          '**LSP depth** — completions that understand your theme, not just the registry.',
          '**Bangla learning track** — tutorials authored in Bangla first, English second ([[story/bangla-web-mission|mission]]).',
          '**Oracle expansion** — parity coverage that grows with every Tailwind point release.',
          '**Docs as classroom** — interactive exercises on top of the textbook ([[story/education-first|education-first]]).'
        ]),
        h2('What will not change'),
        p('Zero runtime. MIT. Mindset over metal. The name, the badge, and the promise that a thirteen-year-old on a tablet can ship with it.'),
        callout('new', 'Watch the [[../v3.1/releases/whats-new|release notes]] — every era of Nakshora began as a quiet entry there.')
      ]
    })
  ];
  return pages;
}
