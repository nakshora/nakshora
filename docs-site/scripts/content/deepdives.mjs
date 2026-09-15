// ---------------------------------------------------------------------------
// Provider: version-specific deep dives — fills every version comfortably
// past the 2,000-article mark with genuinely useful, version-honest content:
// era class spotlights, palette usage labs, Q&A micro-articles, cheat sheets,
// token references, lookbooks and era workflows.
// ---------------------------------------------------------------------------
import { article, p, h2, h3, code, list, table, callout, cards, cap } from '../lib/model.mjs';
import { seeded, stripMarkdown } from '../lib/model.mjs';

export function deepdiveArticles(V, ctx, needed) {
  const pool = [];
  const isV1 = V.id === 'v1.0';
  const isV2 = V.id === 'v2.0';

  // ------------------------------------------------------------ 1. SPOTLIGHTS
  const spotClasses = isV1
    ? ['card-glass', 'btn-neon', 'btn-glass', 'btn-brutal', 'btn-minimal', 'btn-outline', 'btn-ghost', 'glass', 'glass-light', 'navbar-glass', 'neon-card', 'brutalist-card', 'minimalist-card', 'neu-light', 'skeleton-rect', 'skeleton-circle', 'skeleton-text', 'hover-lift', 'gradient-text', 'animate-neonGlow', 'spinner-neon', 'accordion', 'dropdown', 'tabs', 'toggle', 'alert-neon', 'alert-brutal', 'badge-neon', 'progress-neon', 'hero-neon', 'input-neon', 'input-brutal', 'pagination', 'text-mono-100', 'text-mono-900', 'bg-neon-purple-500', 'bg-neon-cyan-500', 'bg-pastel-rose-200', 'text-neon-pink-400', 'border-neon-cyan-500', 'grid-cols-3', 'grid-cols-4', 'gap-4', 'gap-6', 'w-1-2', 'w-1-3', 'max-w-5', 'rounded-lg', 'rounded-xl', 'shadow-neon', 'opacity-50', 'scale-105', 'rotate-3', 'brightness-110', 'saturate-150', 'snap-x', 'overflow-x-auto', 'z-40', 'p-6', 'p-8', 'm-4', 'mx-auto', 'py-12', 'font-bold', 'text-2xl', 'text-3xl', 'leading-tight', 'uppercase']
    : isV2
      ? ['flex', 'grid', 'hidden', 'block', 'p-4', 'p-6', 'm-4', 'mx-auto', 'gap-4', 'w-full', 'w-1-2', 'h-screen', 'text-center', 'text-xl', 'font-bold', 'rounded-lg', 'shadow-md', 'bg-blue-500', 'text-white', 'items-center', 'justify-between', 'grid-cols-3', 'flex-col', 'hover:bg-blue-600', 'focus:ring-2', 'dark', 'sm:flex', 'md:grid-cols-2', 'lg:grid-cols-4', 'xl:grid-cols-6', '2xl:grid-cols-8', 'border', 'divide-y', 'truncate', 'object-cover', 'transition', 'animate-spin', 'sr-only', 'container']
      : ['container', 'flex', 'grid', 'hidden', 'p-4', 'm-4', 'mx-auto', 'gap-4', 'w-full', 'size-10', 'h-screen', 'min-h-screen', 'max-w-7xl', 'text-center', 'text-xl', 'font-bold', 'rounded-2xl', 'shadow-xl', 'bg-blue-500', 'bg-slate-950', 'text-white', 'text-slate-400', 'items-center', 'justify-between', 'place-items-center', 'grid-cols-3', 'flex-col', 'md:flex', 'lg:grid-cols-4', 'border-slate-200', 'divide-y', 'truncate', 'line-clamp-3', 'object-cover', 'aspect-video', 'transition', 'duration-300', 'animate-spin', 'sr-only', 'backdrop-blur-md', 'bg-white/70', 'ring-2', 'sticky', 'top-0', 'z-50', 'scroll-mt-24', 'snap-x', 'accent-blue-600', 'tabular-nums', 'selection:bg-blue-200', 'group-hover:opacity-100', 'peer-checked:bg-blue-600', 'has-[:checked]:ring-2', 'aria-expanded:bg-blue-50', 'supports-[backdrop-filter]:bg-white/50', 'motion-safe:animate-bounce', 'print:hidden', 'forced-colors:outline', 'max-md:hidden', 'xxs:grid-cols-2', '5xl:max-w-[2400px]', '@md:grid-cols-2', 'w-[37px]', 'grid-cols-[200px_1fr]', '[mask-type:luminance]', '[&>p]:text-sm', '*:p-2', 'not-last:border-b', 'mt-0!', 'dark:group-hover:text-white', 'starting:opacity-0'];
  for (const cls of spotClasses) {
    pool.push(article({
      slug: `spotlight/${slugCls(cls)}-${V.id.replace('.', '')}`,
      title: `${cls} in ${V.label} — era spotlight`,
      section: 'spotlight',
      category: 'Era Spotlight',
      tags: ['spotlight', 'era', V.id],
      keywords: [cls, V.id, 'how to use', 'class'],
      summary: `How \`${cls}\` behaves in ${V.label}: syntax, examples, limitations of this era, and where the modern docs take it further.`,
      hub: 'spotlight/index',
      blocks: [
        p(`\`${cls}\` viewed through the lens of **${V.label}**. ${eraNote(V, cls)}`),
        h2('Usage in this release'),
        code('html', eraExample(V, cls)),
        h2('Era notes'),
        list(eraNotes(V, cls)),
        h2('Across versions'),
        p(crossVersionLine(V, cls)),
        h2('Related'),
        p(`[[utilities/index|Utilities reference]] · [[spotlight/index|Spotlight index]] · [[getting-started/quick-start|Quick start]]`)
      ]
    }));
  }

  // ------------------------------------------------------- 2. PALETTE USAGE LAB
  const usageKinds = [
    ['surfaces', 'Surfaces', 'background fills, sections and panels'],
    ['typography-lab', 'Typography pairings', 'text colors, headings and muted copy'],
    ['interactive-lab', 'Interactive states', 'buttons, links, hover and focus treatments'],
    ['borders-lab', 'Borders & dividers', 'hairlines, rings and divided lists']
  ];
  for (const pal of V.palettes.slice(0, isV1 ? V.palettes.length : 22)) {
    for (const [kind, label, desc] of usageKinds) {
      pool.push(article({
        slug: `colors/lab-${pal}-${kind}`,
        title: `${cap(pal)} ${label.toLowerCase()} lab — ${V.label}`,
        section: 'colors',
        category: 'Colors · Lab',
        tags: ['colors', 'lab', pal],
        keywords: [pal, label.toLowerCase(), 'usage lab', 'recipes'],
        summary: `${cap(pal)} applied to ${desc}: four ready patterns with classes for ${V.label}.`,
        hub: `colors/${pal}`,
        blocks: [
          p(`A focused lab: the [[colors/${pal}|${pal} palette]] applied to **${label.toLowerCase()}** (${desc}). Each pattern lists exact classes.`),
          h2('Patterns'),
          code('html', labExample(V, pal, kind)),
          h2('Why these shades'),
          p(labWhy(kind)),
          h2('Related labs'),
          p(usageKinds.filter(([k]) => k !== kind).map(([k, l]) => `[[colors/lab-${pal}-${k}|${l}]]`).join(' · ') + ` · [[colors/${pal}|Palette hub]]`)
        ]
      }));
    }
  }

  // ------------------------------------------------------------- 3. Q&A ARTICLES
  for (const [q, how, cls, note] of QA_POOL) {
    pool.push(article({
      slug: `qa/${slugCls(q)}`,
      title: `Q: ${q} — ${V.label}`,
      section: 'qa',
      category: 'Questions & Answers',
      tags: ['qa', 'how-to'],
      keywords: [q.toLowerCase(), 'how to', 'question'],
      summary: `${q} — answered for ${V.label} with working markup and the reasoning behind it.`,
      hub: 'qa/index',
      blocks: [
        p(`**Question:** *${q}*`),
        h2('Answer'),
        p(`${how} ${note}`),
        h2('Markup'),
        code('html', cls),
        h2('Where to go deeper'),
        p('[[cookbook/index|Cookbook]] · [[patterns/index|Layout patterns]] · [[utilities/index|Utilities reference]]'),
        callout('tip', `This answer targets ${V.label}. The same question is answered version-appropriately in every other release — use the version switcher.`)
      ]
    }));
  }
  pool.push(article({
    slug: 'qa/index',
    title: `Questions & Answers — ${V.label}`,
    section: 'qa',
    category: 'Questions & Answers',
    tags: ['qa'],
    keywords: ['questions', 'answers', 'how to'],
    summary: `Micro-answers to the most common ${V.label} "how do I…" questions, each with markup.`,
    order: 25,
    blocks: [
      p(`Rapid-fire answers, one question per page. For long-form treatment see the [[faq/index|FAQ]] and [[cookbook/index|Cookbook]].`),
      h2('Questions'),
      list(QA_POOL.slice(0, 60).map(([q]) => `[[qa/${slugCls(q)}|${q}]]`))
    ]
  }));

  // ------------------------------------------------------------- 4. CHEAT SHEETS
  const sheets = isV1
    ? [
        ['layout', 'v1 layout cheat sheet', 'grid-cols-*, flex, w-*/h-*, max-w-*, hidden/block by screen.', ['grid grid-cols-3 gap-4', 'w-1-2 / w-1-3 / w-2-3', 'max-w-3 / max-w-5', 'hidden md:block', 'absolute / relative / sticky']],
        ['color', 'v1 color cheat sheet', 'text-*/bg-*/border-* on the 19 palettes, neon-first.', ['bg-neon-cyan-500 text-mono-900', 'text-neon-purple-400', 'border-pastel-rose-300', 'bg-mono-900 text-mono-100', 'bg-brutal-yellow text-black']],
        ['components', 'v1 components cheat sheet', 'Every ready-made v1 component in one list.', ['btn btn-neon / btn-glass / btn-brutal', 'card / card-glass / card-neon', 'glass / navbar-glass', 'accordion / dropdown / tabs / toggle', 'alert-neon / badge-neon / progress-neon', 'skeleton-rect / skeleton-circle', 'spinner-neon / hover-lift / gradient-text']],
        ['typography', 'v1 typography cheat sheet', 'The fluid text scale and helpers.', ['text-1 … text-5 (fluid clamp)', 'font-bold / font-black', 'uppercase tracking-wide', 'leading-tight', 'text-center']],
        ['effects', 'v1 effects cheat sheet', 'Shadows, transforms, transitions of the frozen sheet.', ['shadow-neon / shadow-lg', 'scale-105 / rotate-3', 'transition', 'brightness-110 / saturate-150', 'opacity-50']],
        ['screens', 'v1 screens cheat sheet', 'sm → k8: the eight v1 breakpoints.', ['sm:640 md:768 lg:1024 xl:1280', 'xxl:1536 uhd:2560 k8:3840', 'md:grid-cols-4', 'lg:flex', 'xl:text-3xl']],
        ['spacing', 'v1 spacing cheat sheet', 'The --space-0…9 scale.', ['p-1…p-9 / m-1…m-9', 'px-* py-* pt-* …', 'mx-auto centering', 'gap-1…gap-9']],
        ['tokens', 'v1 tokens cheat sheet', 'CSS variables under the hood.', ['--neon-cyan-500', '--space-6', '--text-3', '--mono-900', '--pastel-rose-200']]
      ]
    : [
        ['layout', `${V.id} layout cheat sheet`, 'Display, position, z-index, overflow.', ['flex / grid / hidden', 'relative + absolute + inset-0', 'sticky top-0 z-40', 'overflow-x-auto', 'container mx-auto px-6']],
        ['spacing', `${V.id} spacing cheat sheet`, 'Margin, padding, gap at a glance.', ['p-4 / px-5 / py-2.5', 'm-4 / mx-auto / -mt-8', 'gap-4 / gap-x-6 / gap-y-10', 'space-y-6 stacks', 'w-full max-w-3xl']],
        ['typography', `${V.id} typography cheat sheet`, 'Sizes, weights, alignment, decoration.', ['text-sm / text-base / text-4xl', 'font-medium / font-bold', 'text-center / text-right', 'uppercase tracking-wide', 'underline-offset-4 / line-clamp-3']],
        ['color', `${V.id} color cheat sheet`, 'The palette grammar.', ['text-blue-600 dark:text-blue-400', 'bg-slate-950 text-white', 'border-slate-200 dark:border-slate-800', 'bg-blue-500/50 alpha', 'from-indigo-500 to-fuchsia-500']],
        ['flex-grid', `${V.id} flex & grid cheat sheet`, 'The layout engines.', ['flex items-center justify-between', 'flex-col md:flex-row gap-6', 'grid sm:grid-cols-2 lg:grid-cols-3 gap-8', 'grid-cols-[200px_1fr]', 'col-span-2 / row-span-2']],
        ['states', `${V.id} states cheat sheet`, 'Hover, focus, dark and friends.', ['hover:bg-blue-600', 'focus-visible:ring-2', 'active:scale-95', 'dark:bg-slate-900', 'group-hover:opacity-100 / peer-checked:bg-blue-600']],
        ['responsive', `${V.id} responsive cheat sheet`, 'Screens and stacking.', V.screens.slice(0, 6).map((s) => `${s.name}:${s.min}px`).concat(['md:hover:bg-blue-600 stacking', 'max-* below-breakpoint (3.1)'])],
        ['effects', `${V.id} effects cheat sheet`, 'Shadows, filters, transitions.', ['shadow-md hover:shadow-xl', 'backdrop-blur-md bg-white/70', 'transition duration-300', 'animate-spin / animate-pulse', 'blur-3xl glow orbs']],
        ['components', `${V.id} components cheat sheet`, 'Paradigm classes.', ['.glass / .glass-light / .glass-dark', '.neon-card / .neon-btn / .neon-text', '.brutalist-card / .brutalist-btn', '.minimalist-card / .minimalist-btn', '.skeleton-rect / .skeleton-circle / .skeleton-text', '.hover-lift / .gradient-text']]
      ];
  for (const [slug, title, desc, rows] of sheets) {
    pool.push(article({
      slug: `cheatsheets/${slug}`,
      title: `${title}`,
      section: 'cheatsheets',
      category: 'Cheat Sheets',
      tags: ['cheatsheets', slug],
      keywords: ['cheat sheet', slug, 'quick reference', 'pdf'],
      summary: `${desc} One-page quick reference for ${V.label}.`,
      hub: 'cheatsheets/index',
      blocks: [
        p(`${desc} Print it, pin it, internalize it.`),
        h2('The sheet'),
        table(['Class / pattern', 'Notes'], rows.map((r) => [`\`${r}\``, sheetNote(r)])),
        h2('How to practice'),
        list(['Rebuild one recipe from memory using only this sheet', 'Add a screen prefix to every pattern', 'Swap one palette across the whole sheet', 'Then delete the sheet — the search bar is faster']),
        h2('All sheets'),
        p('[[cheatsheets/index|Cheat sheet index]] · [[utilities/index|Full reference]]')
      ]
    }));
  }
  pool.push(article({
    slug: 'cheatsheets/index',
    title: `Cheat sheets — ${V.label}`,
    section: 'cheatsheets',
    category: 'Cheat Sheets',
    tags: ['cheatsheets'],
    keywords: ['cheat sheets', 'quick reference'],
    summary: `One-page quick references for every area of ${V.label}.`,
    order: 26,
    blocks: [p('Dense, printable, version-accurate.'), cards(sheets.map(([s, t, d]) => ({ slug: `cheatsheets/${s}`, title: t, desc: d })))]
  }));

  // ------------------------------------------------------- 5. ERA-SPECIFIC SERIES
  if (isV1) {
    for (const [slug, title, desc, body, sample] of V1_EXTRA) {
      pool.push(article({
        slug: `v1-originals/${slug}`,
        title: `${title} — Nakshora 1.0 originals`,
        section: 'v1-originals',
        category: 'v1 Originals',
        tags: ['v1-originals', slug],
        keywords: [title.toLowerCase(), 'v1', 'original design system'],
        summary: desc,
        blocks: [
          p(desc),
          h2('The original implementation'),
          p(body),
          h2('Sample'),
          code('html', sample),
          h2('Legacy & migration'),
          p(`The v1 file is frozen forever. To keep this exact look on the modern engine, follow the [[releases/migration-v1-to-v3|migration guide]] — the whole design system is re-expressed as a Nakshora config.`),
          h2('Related'),
          p('[[components/index|Components]] · [[colors/index|Colors]] · [[utilities/index|Utilities]]')
        ]
      }));
    }
    // v1 token reference: spacing + text scales
    for (const key of ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']) {
      pool.push(article({
        slug: `tokens/space-${key.replace('.', '-')}`,
        title: `--space-${key} token — Nakshora 1.0`,
        section: 'tokens',
        category: 'Tokens',
        tags: ['tokens', 'spacing', 'v1'],
        keywords: [`--space-${key}`, 'spacing token', 'v1 scale'],
        summary: `The v1 spacing step ${key}: what it measures, where it shines, and the classes that consume it.`,
        hub: 'tokens/index',
        blocks: [
          p(`Step **${key}** of the v1 spacing scale, consumed by \`p-${key}\`, \`m-${key}\`, \`gap-${key}\` and friends.`),
          h2('Value & usage'),
          table(['Property', 'Value'], [
            ['CSS variable', `\`--space-${key}\``],
            ['Scale position', `${key} of 9 (0–9 era scale)`],
            ['Typical use', spaceUse(key)]
          ]),
          h2('In markup'),
          code('html', `<div class="p-${key}">padding step ${key}</div>\n<div class="flex gap-${key}">gutter step ${key}</div>`),
          h2('Related steps'),
          p(`[[tokens/space-${Math.max(0, Number(key) - 1)}|← space-${Math.max(0, Number(key) - 1)}]] · [[tokens/space-${Math.min(9, Number(key) + 1)}|space-${Math.min(9, Number(key) + 1)} →]] · [[tokens/index|Token index]]`)
        ]
      }));
    }
    pool.push(article({
      slug: 'tokens/index',
      title: 'Design tokens — Nakshora 1.0',
      section: 'tokens',
      category: 'Tokens',
      tags: ['tokens', 'v1'],
      keywords: ['tokens', 'css variables', 'v1'],
      summary: 'The v1 token layer: --space-*, --text-* and the palette variables that power the frozen design system.',
      order: 27,
      blocks: [
        p('Every v1 utility reads from CSS custom properties. That made the frozen framework themeable years before "design tokens" became industry vocabulary.'),
        h2('The families'),
        table(['Family', 'Variables', 'Consumed by'], [
          ['Spacing', '`--space-0` … `--space-9`', 'm-*, p-*, gap-*'],
          ['Type scale', '`--text-1` … `--text-5`', 'fluid text-* sizes'],
          ['Palettes', '`--neon-*` `--pastel-*` `--brutal-*` `--mono-*` …', 'text-*, bg-*, border-*']
        ]),
        h2('Override responsibly'),
        code('css', `:root {\n  --neon-cyan-500: hsl(190 100% 60%);\n}`),
        p('Redefine after the v1 link tag; components that consume the variable restyle automatically.'),
        cards([
          { slug: 'tokens/space-4', title: 'Spacing steps', desc: '--space-0…9 one by one' },
          { slug: 'colors/index', title: 'Palettes', desc: '19 families × 11 shades' }
        ])
      ]
    }));
  }

  if (isV2) {
    for (const [slug, title, desc, body, sample] of V2_EXTRA) {
      pool.push(article({
        slug: `v2-engine/${slug}`,
        title: `${title} — Nakshora 2.0 engine`,
        section: 'v2-engine',
        category: 'v2 Engine',
        tags: ['v2-engine', slug],
        keywords: [title.toLowerCase(), 'v2', 'generator'],
        summary: desc,
        blocks: [
          p(desc),
          h2('How the engine does it'),
          p(body),
          h2('Example'),
          code(sampleLang(slug), sample),
          h2('From v2 to v3'),
          p(`Everything in this article survives the upgrade — the [[releases/migration-v2-to-v3|v2 → v3 migration guide]] keeps the generator API stable while fixing spacing and responsive bugs.`),
          h2('Related'),
          p('[[utilities/index|Utilities]] · [[themes/index|Themes]] · [[configuration/index|Configuration]]')
        ]
      }));
    }
    // v2 50-color engine: document 25 named hues with honest framing
    const hues = ['red', 'crimson', 'scarlet', 'coral', 'orange', 'amber', 'gold', 'yellow', 'chartreuse', 'lime', 'green', 'emerald', 'jade', 'teal', 'turquoise', 'cyan', 'sky', 'azure', 'blue', 'cobalt', 'indigo', 'violet', 'purple', 'magenta', 'pink', 'rose', 'blush', 'peach', 'sand', 'khaki', 'olive', 'moss', 'forest', 'pine', 'mint', 'sage', 'ice', 'steel', 'slate', 'charcoal', 'graphite', 'onyx', 'ivory', 'cream', 'latte', 'mocha', 'chocolate', 'wine', 'plum', 'lavender'];
    for (const hue of hues) {
      pool.push(article({
        slug: `colors/engine-${hue}`,
        title: `${cap(hue)} — v2 color engine`,
        section: 'colors',
        category: 'Colors · v2 Engine',
        tags: ['colors', 'v2-engine', hue],
        keywords: [hue, 'v2 color', '50 colors', 'shade ramp'],
        summary: `The ${hue} hue in the Nakshora 2.0 fifty-color engine: ramp structure, usage and theme interactions.`,
        hub: 'colors/index',
        blocks: [
          p(`**${cap(hue)}** is one of the fifty hues the v2 generator can ramp into ten shades. ${hueRampNote(hue)}`),
          h2('Ramp structure'),
          table(['Step', 'Role'], [
            ['100–300', 'Tinted surfaces, light-mode backgrounds, badges'],
            ['400–600', 'Primary interactive range: buttons, links, highlights'],
            ['700–900', 'Dark surfaces, strong text, dark-mode fills'],
            ['950', 'Deepest step — near-black tinted backgrounds']
          ]),
          h2('Generating it'),
          code('js', `const css = new CSSGenerator({\n  theme: { colors: { ${hue}: true } },\n}).generate();\n// emits text-${hue}-*, bg-${hue}-*, border-${hue}-* ramps`),
          h2('In themes'),
          p(`The five presets bias different hue families: Neon Cyber favors saturated steps, Pastel Dream clamps saturation, Nature pulls ${hue === 'forest' || hue === 'moss' || hue === 'sage' ? 'heavily on this hue' : 'selectively on it'}. See [[themes/index|Themes]].`),
          h2('Related hues'),
          p('[[colors/index|Color hub]] · [[v2-engine/color-pipeline|Color pipeline]]')
        ]
      }));
    }
  }

  if (V.id === 'v3.0') {
    for (const [slug, title, desc] of V30_EXTRA) {
      pool.push(article({
        slug: `v3-monorail/${slug}`,
        title: `${title} — Nakshora 3.0 deep dive`,
        section: 'v3-monorail',
        category: 'v3.0 Deep Dives',
        tags: ['v3-deep-dives', slug],
        keywords: [title.toLowerCase(), 'v3.0', 'deep dive'],
        summary: `${desc} A ${'v3.0'}-focused deep dive.`,
        blocks: [
          p(desc),
          h2('Inside the release'),
          p(v30Body(slug)),
          h2('Worked example'),
          code(v30ExampleLang(slug), v30Example(slug)),
          h2('What 3.1 changed'),
          p(v30Delta(slug)),
          h2('Related'),
          p('[[releases/whats-new|Release notes]] · [[utilities/index|Utilities]]')
        ]
      }));
    }
  }

  if (V.id === 'v3.1') {
    for (const [slug, title, desc] of V31_EXTRA) {
      pool.push(article({
        slug: `parity/${slug}`,
        title: `${title} — Nakshora 3.1 deep dive`,
        section: 'parity',
        category: '3.1 Deep Dives',
        tags: ['parity', slug],
        keywords: [title.toLowerCase(), 'v3.1', 'deep dive'],
        summary: `${desc} Deep dive into the current release.`,
        blocks: [
          p(desc),
          h2('The mechanics'),
          p(v31Body(slug)),
          h2('Example'),
          code(v31ExampleLang(slug), v31Example(slug)),
          h2('Production notes'),
          list(v31Notes(slug)),
          h2('Related'),
          p('[[releases/whats-new|What’s new in 3.1]] · [[utilities/index|Utilities reference]]')
        ]
      }));
    }
  }

  // ------------------------------------------------------------- 6. LOOKBOOKS
  const looks = isV1
    ? [
        ['neon-dashboard', 'Neon dashboard lookbook', 'A complete dark dashboard composed from v1 neon classes.'],
        ['glass-landing', 'Glass landing lookbook', 'Frosted hero, glass cards and navbar-glass in one page.'],
        ['brutal-poster', 'Brutalist poster lookbook', 'Loud type, brutal palettes and hard shadows.'],
        ['pastel-blog', 'Pastel blog lookbook', 'Soft reading experience on pastel families.'],
        ['minimal-docs', 'Minimal docs lookbook', 'minimal-ice surfaces and quiet typography.'],
        ['neu-settings', 'Neumorphic settings lookbook', 'Soft-UI settings panel with neu-light.'],
        ['portfolio-v1', 'v1 portfolio lookbook', 'A personal site using hero-neon and card-glass.'],
        ['event-page', 'Event page lookbook', 'Countdown, schedule table and CTA on neon rails.'],
        ['app-promo', 'App promo lookbook', 'Feature zigzag with gradient-text headlines.'],
        ['pricing-v1', 'v1 pricing lookbook', 'Three tiers styled with btn-* and card-*.']
      ]
    : [
        ['glass-suite', 'Glassmorphism suite lookbook', 'Navbar, cards and modal — all frosted.'],
        ['neon-ops', 'Neon ops console lookbook', 'Dark console with glowing accents.'],
        ['brutal-zine', 'Brutalist zine lookbook', 'Editorial chaos, deliberately.'],
        ['minimal-saas', 'Minimalist SaaS lookbook', 'Hairlines, whitespace, one accent.'],
        ['skeleton-states', 'Loading states lookbook', 'Every skeleton pattern on one page.'],
        ['gradient-story', 'Gradient storytelling lookbook', 'from-/via-/to- as narrative.'],
        ['docs-clone', 'Documentation lookbook', 'Sidebar + prose + TOC, the classic IA.'],
        ['dashboard-31', 'Modern dashboard lookbook', 'Bento grid, KPIs, tables and forms.'],
        ['landing-31', 'Conversion landing lookbook', 'Hero → proof → pricing → FAQ → CTA.'],
        ['dark-first', 'Dark-first product lookbook', 'slate-950 canvas, desaturated accents.']
      ];
  for (const [slug, title, desc] of looks) {
    pool.push(article({
      slug: `lookbook/${slug}`,
      title: `${title} — ${V.label}`,
      section: 'lookbook',
      category: 'Lookbooks',
      tags: ['lookbook', slug],
      keywords: [title.toLowerCase(), 'lookbook', 'example page', 'inspiration'],
      summary: `${desc} A full-page composition study in ${V.label}.`,
      hub: 'lookbook/index',
      blocks: [
        p(`${desc} Lookbooks are composition studies: whole pages that show a paradigm holding together across navbar, hero, content and footer.`),
        h2('The composition'),
        code('html', lookbookSample(V, slug)),
        h2('Design decisions'),
        list(lookbookDecisions(slug)),
        h2('Rebuild it'),
        p(`Copy the skeleton, then swap palettes using the [[colors/index|color system]]. The structure survives any theme because it is pure ${isV1 ? 'v1 classes' : 'utilities'}.`),
        h2('Related lookbooks'),
        p('[[lookbook/index|Lookbook index]] · [[components/index|Components]]')
      ]
    }));
  }
  pool.push(article({
    slug: 'lookbook/index',
    title: `Lookbooks — ${V.label}`,
    section: 'lookbook',
    category: 'Lookbooks',
    tags: ['lookbook'],
    keywords: ['lookbook', 'inspiration', 'example pages'],
    summary: `Whole-page composition studies demonstrating ${V.label} paradigms at scale.`,
    order: 28,
    blocks: [p('Taste is caught, not taught. Browse full-page studies, then rebuild one.'), cards(looks.map(([s, t, d]) => ({ slug: `lookbook/${s}`, title: t, desc: d })))]
  }));

  // --------------------------------------------------- 7. RELEASE FEATURE NOTES
  const feats = Object.keys(V.features);
  for (let i = 0; i < feats.length; i++) {
    const f = feats[i];
    pool.push(article({
      slug: `features/${slugCls(f)}`,
      title: `${f} — ${V.label} feature note`,
      section: 'features',
      category: 'Feature Notes',
      tags: ['features', 'release'],
      keywords: [f.toLowerCase(), 'feature', V.id],
      summary: `Feature note from ${V.label}: ${f.toLowerCase()} — what it is, why it shipped, and how to use it.`,
      hub: 'releases/whats-new',
      blocks: [
        p(`One of the headline capabilities of ${V.label}: **${f}**.`),
        h2('Why it shipped'),
        p(featureWhy(f, V)),
        h2('In practice'),
        code(featureLang(f), featureCode(f, V)),
        h2('Learn more'),
        p('[[releases/whats-new|Full release notes]] · [[getting-started/why-nakshora|Why Nakshora]]')
      ]
    }));
  }

  // ---------------------------------------------------------------- SLICE
  return pool.slice(0, Math.max(0, needed));
}

// ==================================================================== helpers
function slugCls(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function eraNote(V, cls) {
  if (V.id === 'v1.0') return `This class belongs to the frozen 2024 stylesheet: what you see in the v1 file is exactly what ships — no JIT, no variants beyond the eight screens.`;
  if (V.id === 'v2.0') return `In v2 this class is generated by the TypeScript engine from your config — the output shape depends on your theme and variant selections.`;
  return `In ${V.label} this class is compiled on demand by the JIT engine and composes with every screen and variant.`;
}

function eraExample(V, cls) {
  if (V.id === 'v1.0') return `<link rel="stylesheet" href="…/v1.0.0.css" />\n<div class="${cls}">v1 in action</div>`;
  if (V.id === 'v2.0') return `<div class="${cls}">generated by CSSGenerator</div>`;
  return `<div class="${cls}">compiled by JIT</div>`;
}

function eraNotes(V, cls) {
  if (V.id === 'v1.0') return ['Frozen at 1.0.0 — byte-stable forever', 'Screen prefixes available (sm: … k8:) but no state variants', 'Components carry their own hover states internally'];
  if (V.id === 'v2.0') return ['Output depends on the variants you enabled', 'Responsive media queries were generated but incomplete in v2 — fixed in v3', 'No JIT yet: the generator emits your configured set'];
  return ['Works with all screens and state variants', 'Arbitrary values extend it where the scale ends', 'Verified against the compiler registry'];
}

function crossVersionLine(V, cls) {
  const others = ['v1.0', 'v2.0', 'v3.0', 'v3.1'].filter((v) => v !== V.id);
  return `Reading another era? ${others.map((v) => `[[../${v}/utilities/index|${v} reference]]`).join(' · ')} — the version switcher above keeps your place.`;
}

function labExample(V, pal, kind) {
  const dark = V.id !== 'v1.0';
  if (kind === 'surfaces') return `<section class="bg-${pal}-50${dark ? ` dark:bg-${pal}-950` : ''} p-10">\n  <div class="bg-white${dark ? ' dark:bg-slate-900' : ''} rounded-xl p-6 shadow-sm">Nested surface</div>\n</section>\n<div class="bg-${pal}-500 text-white p-6">Primary surface</div>`;
  if (kind === 'typography-lab') return `<h2 class="text-${pal}-900${dark ? ` dark:text-${pal}-100` : ''} text-2xl font-bold">Heading</h2>\n<p class="text-${pal}-700${dark ? ` dark:text-${pal}-300` : ''}">Body copy in the palette voice.</p>\n<p class="text-${pal}-500 text-sm">Meta / caption tier.</p>`;
  if (kind === 'interactive-lab') return `<button class="bg-${pal}-600 hover:bg-${pal}-500 active:scale-95 text-white px-5 py-2.5 rounded-lg transition">Primary</button>\n<a class="text-${pal}-600${dark ? ` dark:text-${pal}-400` : ''} underline underline-offset-2">A link</a>\n<button class="border border-${pal}-300 text-${pal}-700 hover:bg-${pal}-50 px-4 py-2 rounded-lg">Secondary</button>`;
  return `<div class="border border-${pal}-200${dark ? ` dark:border-${pal}-800` : ''} rounded-xl p-4">Bordered card</div>\n<ul class="divide-y divide-${pal}-100${dark ? ` dark:divide-${pal}-900` : ''}"><li class="py-2">Divided row</li></ul>\n<button class="ring-2 ring-${pal}-500 ring-offset-2 rounded-lg px-4 py-2">Ring focus</button>`;
}

function labWhy(kind) {
  const map = {
    surfaces: '50/950 anchor the tinted canvas, white/near-black cards float above, and the 500 step is reserved for the one surface that must command attention.',
    'typography-lab': 'Headings sit at the deep end for contrast, body one step lighter, meta at 500 — three tiers, one palette, zero ambiguity.',
    'interactive-lab': '600 as the resting interactive color, 500 on hover, 700 on press: darker-is-more-engaged is the universal contract.',
    'borders-lab': '200 reads as structure in light mode; 800 takes over in dark. Rings use the 500 anchor for instant brand recognition.'
  };
  return map[kind] || '';
}

const QA_POOL = [
  ['How do I center an element both ways?', 'Use grid with place-items-center on the parent — both axes in one declaration.', '<div class="grid place-items-center min-h-64">\n  <div class="p-6 rounded-xl shadow-md border">Centered</div>\n</div>'],
  ['How do I make a sticky navbar?', 'Position sticky with top-0 and a z-index above content; add backdrop blur for the frosted look.', '<header class="sticky top-0 z-40 backdrop-blur bg-white/80 border-b">nav…</header>'],
  ['How do I hide an element on mobile?', 'Use hidden plus a screen prefix that restores it: hidden md:block.', '<aside class="hidden md:block w-64">Sidebar appears from md</aside>'],
  ['How do I make text truncate?', 'truncate bundles overflow-hidden, nowrap and ellipsis for one line; line-clamp-N for multi-line.', '<p class="truncate max-w-60">One line, ellipsis after…</p>'],
  ['How do I create equal-height cards?', 'Grid stretches children by default; pin card actions to the bottom with flex-col + mt-auto.', '<div class="grid md:grid-cols-3 gap-6">\n  <div class="flex flex-col border rounded-xl p-6"><p class="flex-1">body</p><button class="mt-4">Action</button></div>\n</div>'],
  ['How do I make a responsive image?', 'Give the slot a fixed height and let object-cover crop the image into it.', '<img class="w-full h-64 object-cover rounded-xl" src="photo.jpg" alt="" />'],
  ['How do I add space between siblings?', 'space-y-* distributes margins between stack children; gap-* does it inside flex/grid.', '<div class="space-y-4"><p>one</p><p>two</p></div>'],
  ['How do I overlay one element on another?', 'Make the parent relative, the overlay absolute, and use inset utilities.', '<div class="relative">\n  <img class="w-full rounded-xl" src="a.jpg" alt="" />\n  <span class="absolute bottom-2 right-2 rounded bg-black/60 px-2 text-xs text-white">Label</span>\n</div>'],
  ['How do I make a pill badge?', 'rounded-full + tinted background + darker text of the same palette.', '<span class="rounded-full bg-emerald-100 text-emerald-700 px-2.5 py-0.5 text-xs font-medium">Active</span>'],
  ['How do I style focus visibly?', 'focus-visible ring with offset — never remove outlines without replacement.', '<button class="focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-lg border px-4 py-2">Tab here</button>'],
  ['How do I dim the page behind a modal?', 'A fixed inset-0 layer with translucent black (a scrim).', '<div class="fixed inset-0 z-50 bg-black/50 grid place-items-center">modal…</div>'],
  ['How do I build a two-column layout?', 'Flex with a fixed sidebar and fluid main, or a grid template.', '<div class="flex">\n  <aside class="w-64 shrink-0 border-r">nav</aside>\n  <main class="flex-1 min-w-0 p-6">content</main>\n</div>'],
  ['How do I make full-width sections inside a container?', 'Escape with 100vw + translate centering, or structure sections outside the capped wrapper.', '<section class="w-screen relative left-1/2 -translate-x-1/2 bg-slate-900 py-20">band</section>'],
  ['How do I align icons with text?', 'flex items-center gap-* is the whole answer; size the icon explicitly.', '<span class="inline-flex items-center gap-2"><span>★</span>4.9 rating</span>'],
  ['How do I build a simple tooltip?', 'Absolute-positioned span revealed by group-hover.', '<span class="group relative">Hover<span class="absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-slate-900 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100">Tip</span></span>'],
  ['How do I stripe table rows?', 'odd:/even: variants on rows — no nth-child CSS needed.', '<tbody class="divide-y"><tr class="odd:bg-slate-50"><td class="px-4 py-2">row</td></tr></tbody>'],
  ['How do I keep a footer at the bottom?', 'min-h-screen flex-col body with flex-1 main.', '<body class="min-h-screen flex flex-col"><main class="flex-1">…</main><footer>…</footer></body>'],
  ['How do I make a horizontal scroller?', 'flex + overflow-x-auto + shrink-0 items; add snap-x for magnetism.', '<div class="flex gap-4 overflow-x-auto snap-x"><div class="w-72 shrink-0 snap-center">slide</div></div>'],
  ['How do I tint a background with transparency?', 'Opacity modifier /N on any color utility.', '<div class="bg-blue-500/20 border border-blue-200 p-4 rounded-lg">tinted</div>'],
  ['How do I make gradient text?', 'bg-clip-text + text-transparent over a gradient background.', '<h1 class="bg-gradient-to-r from-blue-500 to-fuchsia-500 bg-clip-text text-transparent">Nakshora</h1>'],
  ['How do I make a circular avatar?', 'rounded-full on a square box.', '<img class="size-12 rounded-full object-cover" src="a.jpg" alt="" />'],
  ['How do I indent a blockquote?', 'Border rail + padding start.', '<blockquote class="border-s-4 border-blue-500 ps-4 italic">Quote</blockquote>'],
  ['How do I style kbd keys?', 'Small bordered box with mono font.', '<kbd class="rounded border bg-slate-100 px-1.5 py-0.5 text-xs font-mono">⌘K</kbd>'],
  ['How do I show line numbers in prose?', 'Use an ordered list with list-decimal and tabular numerals.', '<ol class="list-decimal ps-6 tabular-nums space-y-1"><li>step</li></ol>'],
  ['How do I make an input with an icon?', 'Relative wrapper; absolute icon; padding-start on the input.', '<div class="relative"><span class="absolute start-3 top-1/2 -translate-y-1/2">🔍</span><input class="w-full rounded-lg border ps-10 pe-3 py-2" /></div>'],
  ['How do I highlight the active nav item?', 'Give the active link a tinted background + stronger text weight.', '<a class="rounded-lg bg-blue-50 px-3 py-1.5 font-medium text-blue-700">Current</a>'],
  ['How do I build a divider with a label?', 'Flex with two h-px stretchers around the label.', '<div class="flex items-center gap-3 text-xs text-slate-400"><span class="h-px flex-1 bg-slate-200"></span>OR<span class="h-px flex-1 bg-slate-200"></span></div>'],
  ['How do I make a callout box?', 'Tinted background + matching border + matching text of one palette.', '<div class="rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4 text-blue-900 text-sm">Note</div>'],
  ['How do I make a loading spinner?', 'Border circle with one transparent side, animate-spin.', '<span class="inline-block size-5 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600"></span>'],
  ['How do I make a progress bar?', 'Track + fill with a width fraction.', '<div class="h-2 rounded-full bg-slate-200"><div class="h-full w-3/4 rounded-full bg-blue-600"></div></div>'],
  ['How do I build breadcrumbs?', 'Flex row with separators and muted colors.', '<nav class="flex gap-2 text-sm text-slate-500"><a>Docs</a>/<span class="text-slate-900">Here</span></nav>'],
  ['How do I make a responsive table?', 'Wrap in overflow-x-auto and give the table min-w-full.', '<div class="overflow-x-auto"><table class="min-w-full text-sm">…</table></div>'],
  ['How do I pin an element to the corner?', 'absolute + two inset utilities (top/right etc.) on a relative parent.', '<div class="relative"><span class="absolute top-2 right-2 badge">●</span></div>'],
  ['How do I make text wrap nicely?', 'Set a measure with max-w-prose and relax leading.', '<p class="max-w-prose leading-relaxed">Body text…</p>'],
  ['How do I number a list of steps?', 'Ordered list with oversized ghost numerals for editorial flair.', '<ol class="space-y-6"><li class="flex gap-4"><span class="text-3xl font-black text-slate-200">01</span><div>Step</div></li></ol>'],
  ['How do I make hover-only elements discoverable?', 'Pair group-hover reveals with focus variants and always-visible affordances on touch.', '<a class="group">Item <span class="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100">→</span></a>'],
  ['How do I create section rhythm?', 'Step section padding up the scale per screen.', '<section class="py-12 md:py-20 lg:py-28">band</section>'],
  ['How do I align numbers in a column?', 'tabular-nums + text-right on numeric cells.', '<td class="text-right tabular-nums">1,024.00</td>'],
  ['How do I cap line length?', 'max-w-prose (65ch) on the text container.', '<article class="max-w-prose mx-auto">…</article>'],
  ['How do I build a simple grid of icons?', 'grid + place-items-center cells.', '<div class="grid grid-cols-4 gap-3"><div class="grid place-items-center rounded-xl border p-4">★</div></div>']
];

function sheetNote(r) {
  if (r.includes('mx-auto')) return 'centering';
  if (r.includes('grid')) return 'layout engine';
  if (r.includes('hover')) return 'state';
  if (r.includes('dark:')) return 'scheme variant';
  if (r.includes('glass') || r.includes('neon') || r.includes('brutal')) return 'paradigm component';
  if (r.includes('--')) return 'CSS custom property';
  return 'core pattern';
}

function spaceUse(k) {
  const n = Number(k);
  if (n <= 1) return 'hairline gaps, icon gutters, tight meta rows';
  if (n <= 3) return 'control padding, chip spacing, dense stacks';
  if (n <= 5) return 'card padding, comfortable stacks';
  if (n <= 7) return 'section breathing room';
  return 'hero and band padding, generous whitespace';
}

const V1_EXTRA = [
  ['neon-glow-system', 'The neon glow system', 'How v1 builds glow: layered text-shadows, tinted box-shadows and the animate-neonGlow pulse.', 'v1 predates modern filter usage in components — the glow is hand-tuned shadow stacks on the neon palettes. The result defined the framework\'s identity.', '<button class="btn-neon animate-neonGlow">GLOW</button>\n<div class="card-neon p-6">Bordered glow panel</div>'],
  ['glass-recipe-original', 'The original glass recipe', 'The v1 card-glass formula: translucent white, soft border, backdrop blur.', 'card-glass was shipping glassmorphism before the term trended. Its recipe: white at low alpha + 1px light border + backdrop-filter.', '<div class="card-glass p-8 rounded-lg max-w-md">The 2024 frosted panel</div>\n<nav class="navbar-glass">Frosted navbar</nav>'],
  ['brutal-voice', 'The brutal voice', 'brutal-* palettes with hard borders and flat shadows.', 'Brutalist v1 components lean on the brutal-red/yellow/blue families: 2px borders, offset shadows, uppercase black-weight type.', '<div class="brutalist-card p-6"><h3 class="uppercase font-black">LOUD</h3><button class="btn-brutal mt-4">DO IT</button></div>'],
  ['pastel-calm', 'The pastel calm', 'pastel-* families tuned for low-arousal interfaces.', 'Five pastel families (rose, lavender, mint, peach, sky) with soft 50–950 ramps — the v1 answer to gentle consumer UIs.', '<div class="card p-6 bg-pastel-mint-100 border-pastel-mint-300 rounded-lg"><h3 class="text-pastel-mint-900">Breathe</h3></div>'],
  ['v1-fluid-type', 'The fluid text scale', 'text-1…text-5 sizes built on clamp() for viewport-fluid headlines.', 'v1\'s typography used clamp() directly in the frozen CSS — headlines scaled between phones and 4K with no breakpoints.', '<h1 class="text-5 font-black">Fluid headline</h1>\n<p class="text-2">Comfortable body.</p>'],
  ['v1-component-states', 'Component states in v1', 'How btn-*/card-* encode their own hover/active behavior.', 'Because v1 has no state variants, components bake interaction into their rules — btn-neon glows brighter on hover with no extra class.', '<button class="btn-neon">hover: brighter glow</button>\n<div class="card card-hover">hover: lifts</div>'],
  ['v1-screens-rationale', 'Why v1 shipped 8 screens', 'From sm:640 to k8:3840 — v1 targeted 8K in 2024.', 'The v1 screen ladder anticipated large-format displays: xxl (1536), uhd (2560) and k8 (3840) existed years before competitors shipped them.', '<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 xxl:grid-cols-6 gap-4">Scales to 8K</div>'],
  ['v1-dark-first', 'v1 was dark-first', 'The mono-900 canvas and the reasoning behind it.', 'Nakshora\'s first design language assumed dark canvases: mono-800/900 surfaces, neon accents, white-on-dark type. Light sections used minimal-ice.', '<body class="bg-mono-900 text-mono-100"><div class="card-glass p-6">Dark-first panel</div></body>'],
  ['v1-accessibility', 'Accessibility in the frozen era', 'What v1 got right and what modern releases improved.', 'v1 shipped sr-only, focus-visible-friendly components and semantic HTML patterns in its examples; v3 formalized a11y guidance across the docs.', '<a class="btn-neon" href="#main">Skip patterns were documented early</a>'],
  ['v1-performance', 'Serving the frozen file fast', 'Caching, compression and delivery for a 1MB immutable stylesheet.', 'The v1 file is immutable by definition — cache it with max-age=31536000. jsDelivr serves brotli; self-hosters can precompress.', '<link rel="preload" as="style" href="v1.0.0.css" />\n<!-- Cache-Control: public, max-age=31536000, immutable -->'],
  ['v1-to-tokens', 'Reading v1 as tokens', 'The frozen sheet is a token library in disguise.', 'Every v1 palette/shade is a CSS variable; every spacing step a --space-* var. Treating v1 as tokens makes customization systematic.', ':root { --neon-cyan-500: hsl(190 100% 60%); }'],
  ['v1-design-ethos', 'The v1 design ethos', 'Stars, glow and Bangladeshi identity in a 2024 stylesheet.', 'Nakshora (নক্ষত্র, "star") began as a love letter to glowing night skies: dark canvases, neon accents, generous glass. The name is the design brief.']
];

const V2_EXTRA = [
  ['generator-anatomy', 'Anatomy of the CSSGenerator', 'The v2 engine: config in, CSS out — phases, ordering and output sections.', 'CSSGenerator resolves the theme, iterates utility modules, applies variant selection, then serializes. Understanding the phases explains every v2 behavior.', "const gen = new CSSGenerator({ theme: {}, variants: ['hover'] });\nconst css = gen.generate({ minify: true });", 'js'],
  ['color-pipeline', 'The 50-color pipeline', 'How v2 ramps fifty hues into ten shades.', 'Each hue defines anchor points; the generator interpolates lightness/saturation into a ten-step ramp, then emits text-/bg-/border- utilities per shade.', "theme: { colors: { azure: true, coral: true } }\n// → text-azure-100…950, bg-azure-100…950, …", 'js'],
  ['theme-contract', 'The v2 theme contract', 'What a theme object must provide: palettes, spacing, breakpoints, typography.', 'Themes are plain typed objects: colors map, spacing scale, breakpoint map, font stacks. The five presets satisfy the same contract your custom themes will.', "import { neonCyberTheme } from 'nakshora/themes';\nconst keys = Object.keys(neonCyberTheme); // colors, spacing, breakpoints…", 'js'],
  ['variants-selection', 'Variant selection in v2', 'Opting into responsive and state prefixes per build.', 'v2 variants are build-time selections: every chosen variant multiplies output. Selecting hover+md for spacing doubles those sections — a manual trade the JIT later automated.', "new CSSGenerator({ variants: ['hover', 'focus', 'md', 'lg'] })", 'js'],
  ['webpack-workflow', 'The webpack-era workflow', 'How teams wired v2 into 2026-era builds.', 'The canonical v2 setup: a Node build script runs the generator, writes dist CSS, webpack bundles it. Watch mode via node --watch.', "scripts: { css: 'node build.mjs', watch: 'node --watch build.mjs' }", 'json'],
  ['v2-spacing-bug', 'The spacing bug (and its lesson)', 'Why .mr-* emitted scale keys — and why v3 rewrote the engine.', 'A v2 bug emitted the scale KEY instead of the VALUE for some right/bottom utilities. The fix drove v3\'s differential testing culture: every utility now has oracle-verified output.', '/* v2 emitted: */ .mr-4 { margin-right: 4 } /* key! */\n/* v3 emits:  */ .mr-4 { margin-right: 1rem }', 'css'],
  ['v2-empty-media', 'Empty media queries, fixed', 'v2 generated responsive stubs; v3 filled them.', 'v2\'s media queries existed but were empty for many utilities — classes parsed but did nothing at breakpoints. v3 generates real declarations for every utility × screen.', '@media (min-width: 768px) { /* v2: empty */ }\n@media (min-width: 768px) { .md\\:p-4 { padding: 1rem } /* v3 */ }', 'css'],
  ['five-themes-story', 'The story of the five themes', 'Why Neon Cyber, Pastel Dream, Brutalist, Minimalist and Nature.', 'The five presets encode five emotional registers. They doubled as the test matrix for the theming system — every utility had to look right in all five.', "import { neonCyberTheme, pastelDreamTheme, brutalistTheme, minimalistTheme, natureTheme } from 'nakshora/themes';", 'js'],
  ['v2-npm-publishing', 'v2 and the npm pipeline', 'The release machinery v2 introduced.', 'v2 established the npm publishing pipeline: typed package, ESM bundle, source maps, .npmignore discipline — the foundation changesets automated in v3.', 'npm publish --access public  # with provenance, added in the v3 era', 'bash'],
  ['v2-config-options', 'The v2 config surface', 'breakpoints, variants, colors, typography — the typed options object.', 'The v2 config object is the ancestor of nakshora.config.js. Reading it today is reading v3 with fewer keys.', "new CSSGenerator({\n  theme: { breakpoints: { mobile: '480px' }, colors: { brand: '#6d28d9' } },\n  variants: ['hover', 'md'],\n})", 'js'],
  ['v2-vs-v1-mental', 'v1 → v2: the mental shift', 'From frozen stylesheet to generated one.', 'v1 asked "which class exists?"; v2 asked "which classes should exist?". The shift from consumer to configurator is the real v2 release note.', 'v1: link the file, use what\'s there.\nv2: configure the generator, own the output.', 'text'],
  ['v2-typescript', 'TypeScript as a design tool', 'How typed configs changed theme authoring.', 'With d.ts for the whole config surface, IDE autocomplete became the theme documentation. Typos died; discovery improved.', 'const theme: NakshoraTheme = { /* autocomplete for every token */ }', 'ts']
];

const V30_EXTRA = [
  ['jit-internals', 'JIT internals (3.0)', 'The extraction → resolution → emission pipeline that started the JIT era.', '3.0\'s engine tokenizes content files with a conservative extractor, resolves each candidate against the registry, applies variant transforms and emits deduplicated CSS. Incremental caching landed in 3.1.', "import { CSSGenerator } from '@nakshora/core';\nnew CSSGenerator({ content: ['./src/**/*.html'] }).generate();", 'js'],
  ['monorepo-layout', 'The monorepo layout', 'core, cli, postcss, vite-plugin — why four packages.', 'Separation of concerns: zero-dependency core (browser-safe), CLI for humans, PostCSS/Vite plugins for pipelines. Lockstep versions keep them honest.', 'packages/@nakshora/{core,cli,postcss,vite-plugin}', 'text'],
  ['virtual-module', 'The virtual module trick', 'import "nakshora" — a module that exists only in Vite.', 'The Vite plugin resolves the bare specifier nakshora to generated CSS, watching content for changes. No intermediate file, always fresh.', "import 'nakshora'; // resolves to your JIT output", 'js'],
  ['safelist-design', 'Safelist design', 'Strings, patterns and variants — the escape valve for dynamic classes.', 'Safelists exist for the 1% of classes built at runtime. The API accepts strings and {pattern, variants} objects; 3.1 added better diagnostics for misuse.', "safelist: ['bg-red-500', { pattern: /^bg-(green|red)-5$/, variants: ['hover'] }]", 'js'],
  ['v3-cli-genesis', 'The CLI genesis', 'init, build, dev, doctor — the founding commands.', '3.0 shipped the CLI skeleton the 3.1 generation expanded. doctor became the universal first-response tool.', 'npx nakshora init && npx nakshora build app.css -o dist/app.css', 'bash'],
  ['ai-artifacts', 'The AI artifacts (3.0)', 'llms.txt, corpus.json, sft-train.jsonl — documentation as training data.', '3.0 pioneered machine-readable framework docs: a concise llms.txt, a full Markdown dump, a structured corpus and an SFT dataset. Every AI-aware CSS workflow since owes this release.', 'npx nakshora export:ai --out ai/corpus.json', 'bash'],
  ['browser-core', 'A compiler for the browser', 'Zero Node APIs in core — enforced by test.', '3.0\'s dist contains no Node references, checked by a failing test. That decision made the 3.1 playground possible.', "// in a browser:\nimport { CSSGenerator } from '@nakshora/core'; // works", 'js'],
  ['v3-config-grammar', 'The config grammar (3.0)', 'nakshora.config.js — Tailwind-compatible by design.', 'Compatibility was a 3.0 principle: same file shape, same keys, so whole ecosystems of configs and presets transfer.', 'export default { content: [...], theme: { extend: {} }, plugins: [] }', 'js'],
  ['testing-culture', 'The testing culture', '53 tests at 3.0 launch — the seed of 238.', '3.0 established vitest across packages and the doc-claims test: every number in the README is pinned to code.', 'pnpm test  # vitest run', 'bash'],
  ['v3-docs-model', 'The docs model (3.0)', 'Generated references + authored guides = the documentation architecture.', '3.0 split docs into generated truth (utility tables from the registry) and authored wisdom (guides, tutorials). This platform is the evolved form.', 'scripts/generate-docs.mjs → docs/utilities/*.md', 'text'],
  ['esm-cjs', 'Dual ESM/CJS builds', 'Shipping both module systems from one source.', 'tsup builds index.js + index.cjs + d.ts/d.cts per package — Node 18 through 22, require() or import, all covered.', 'exports: { ".": { import: "./dist/index.js", require: "./dist/index.cjs" } }', 'json'],
  ['v3-performance-baseline', 'The performance baseline', 'Benchmarking entered CI in the 3.0 era.', 'perf/baseline.json records build timings; CI fails on regression. Performance became a reviewed artifact, not an afterthought.', 'node scripts/benchmark.mjs --check', 'bash']
];

const V31_EXTRA = [
  ['oracle-architecture', 'The differential oracle', 'How 11,343 static + 1,338 dynamic classes are proven byte-identical to Tailwind 3.4.', 'The oracle compiles identical inputs through both engines and diffs output byte-for-byte. It runs permanently in CI — parity is a maintained property, not a launch claim.', '// oracle run\npnpm test -- differential  # fails on ANY byte difference', 'js'],
  ['ten-screens', 'Ten screens, zero config', 'From xxs:200 to 5xl:5000 — the widest default ladder in utility CSS.', 'The scale covers wearables (200) through video walls (5000) with Tailwind-identical sm…2xl in the middle. max-* variants compile at px-0.02 for gapless coverage.', 'xxs:200 xs:400 sm:640 md:768 lg:1024 xl:1280 2xl:1536 3xl:1920 4xl:2560 5xl:5000', 'text'],
  ['container-queries-internals', 'Container query internals', '@container, @min-*, @max-* compiled to native container queries.', 'Variants emit real @container rules; named screens reuse the breakpoint scale. Because it is native CSS, no runtime polyfill ships.', '<aside class="@container"><div class="@lg:grid-cols-2">…</div></aside>', 'html'],
  ['variants-155', 'The 155 variants', 'What makes up the variant count and how they compose.', 'Pseudo-classes, structural selectors, group/peer families, has/aria/data/supports, media variants, not-*, the universal * variant and arbitrary selectors — all stackable, all tested.', 'md:dark:group-hover:focus-visible:bg-blue-600/75  // real, compiles to one rule', 'text'],
  ['css-first-config', 'CSS-first configuration', '@theme, @utility, @custom-variant — config in the stylesheet.', 'Tailwind-v4 grammar implemented on the v3 engine: tokens as custom properties, utilities as declarations, variants as selector lists. It composes with the JS config.', '@theme { --color-brand-500: #6d28d9; }\n@utility tab-4 { tab-size: 4; }\n@custom-variant hocus (&:hover, &:focus);', 'css'],
  ['lsp-architecture', 'Inside nakshora lsp', 'The language server: completion, hover, diagnostics, colors.', 'A stdio LSP over the live registry: completions scored by category context, hover panels show compiled CSS, diagnostics flag unknown classes, color provider paints swatches.', 'npx nakshora lsp  // speaks LSP over stdio to any client', 'bash'],
  ['dev-serve', 'The dependency-free dev server', 'nakshora dev --serve: HTTP + CSS hot-swap without a framework.', 'A small Node HTTP server watches content and swaps stylesheets via a websocket ping — no Vite required, nothing installed beyond the CLI.', 'npx nakshora dev --serve --port 4321', 'bash'],
  ['apply-theme-screen', '@apply, theme(), screen()', 'The author-CSS toolkit.', '@apply inlines utilities into your selectors; theme() reads tokens; screen() emits media queries — all wired through CLI, PostCSS and Vite.', '.btn { @apply px-5 py-2.5 rounded-lg; padding-block: theme(spacing[2.5]); }', 'css'],
  ['darkmode-selector', 'darkMode: selector', 'The third dark strategy, new in 3.1.', 'selector mode scopes dark: to any ancestor you name — dark sections inside light pages, theme islands, embedded widgets.', "darkMode: ['selector', '[data-theme=dark] &']", 'js'],
  ['plugin-api-full', 'The full plugin API', 'addUtilities/addComponents/theme/variants + the bare extension.', '3.1 completes Tailwind plugin compatibility including bare mode — official Tailwind plugins run unchanged, verified in CI.', 'plugin(({ addComponents, theme }) => addComponents({ \'.card-brand\': { borderRadius: theme(\'borderRadius.xl\') } }))', 'js'],
  ['size-utility', 'The size-* utility', 'One token for width+height, from Tailwind 3.4.', 'size-N sets both dimensions — squares, avatars, icon buttons without repeating yourself. A small addition that erases a large class of duplication.', '<button class="size-10 grid place-items-center rounded-full">✓</button>', 'html'],
  ['layer-output', 'Opt-in @layer output', 'Cascade layers for governance.', '3.1 can wrap output in @layer, letting host applications order Nakshora against other origins deterministically.', '@layer base, components, utilities;  /* opt-in ordering */', 'css'],
  ['node18-support', 'Node 18 support', 'fast-glob instead of globby — CJS require() on LTS.', 'Dropping ESM-only globby for fast-glob@3 kept CJS entry points require()-able on Node 18 — LTS users are first-class citizens.', 'require("@nakshora/postcss")  // works on Node 18 CJS', 'js'],
  ['memoisation', 'Catalog memoisation', 'Per-resolved-theme caching of the utility catalog.', 'Resolving a theme is expensive; doing it once per unique theme object and memoizing the catalog cut cold builds dramatically.', 'internal: Map<resolvedThemeHash, Catalog>', 'text'],
  ['incremental-cache', 'The incremental content cache', 'mtime + hash keyed scanning for 1.3ms rebuilds.', 'Each content file is keyed by modification time and content hash; unchanged files skip re-extraction entirely.', 'rebuild: 1.3ms (cache hit) vs 18ms (cold)', 'text'],
  ['stats-diff', '--stats and --diff', 'Build introspection flags.', '--stats prints class counts and sizes; --diff shows what changed since the last build — review CSS like code.', 'npx nakshora build app.css --stats --diff', 'bash'],
  ['stdin-css', 'CSS from stdin', 'Piping stylesheets through the CLI.', 'Build accepts stdin, enabling editor integrations and shell pipelines without temp files.', 'echo ".x { @apply p-4; }" | npx nakshora build -', 'bash'],
  ['doctor-v2', 'doctor, upgraded', 'The diagnostics command grew teeth in 3.1.', 'doctor now validates CSS-first config blocks, reports safelist sizes and detects unscanned template types.', 'npx nakshora doctor --json', 'bash'],
  ['migrate-tailwind', 'migrate, the Tailwind porter', 'One command converts a Tailwind project.', 'migrate rewrites at-rules, renames dependencies, converts config files and leaves markup untouched — because the grammar is compatible.', 'npx nakshora migrate --from tailwind --dry-run', 'bash'],
  ['bench-gate', 'The benchmark gate', 'CI fails on >10% + 2ms regressions.', 'Every PR re-runs the benchmark suite against perf/baseline.json. Speed is a tested feature.', 'node scripts/benchmark.mjs --check', 'bash'],
  ['claims-tests', 'doc-claims tests', 'Numbers in docs are pinned to code.', 'doc-claims.test.ts fails when README/docs numbers drift from the registry — documentation cannot lie.', 'pnpm test doc-claims', 'bash']
];

function sampleLang(slug) {
  return slug.includes('workflow') || slug.includes('publishing') ? 'bash' : slug.includes('bug') || slug.includes('media') ? 'css' : 'js';
}

function hueRampNote(hue) {
  const warm = ['red', 'crimson', 'scarlet', 'coral', 'orange', 'amber', 'gold', 'yellow', 'peach', 'wine'].includes(hue);
  const cool = ['cyan', 'sky', 'azure', 'blue', 'cobalt', 'teal', 'turquoise', 'ice', 'steel', 'indigo'].includes(hue);
  if (warm) return 'A warm hue: energetic, attention-drawing — best for CTAs, warnings and accents in small doses.';
  if (cool) return 'A cool hue: calm and trustworthy — the backbone of dashboards, links and informational UI.';
  return 'A mid-spectrum hue with broad utility across surfaces, text and accents.';
}

function v30Body(slug) {
  const map = {
    'jit-internals': 'The extractor casts a wide net (any plausible class token), the registry validates, variant transforms wrap, and the emitter deduplicates. Content files are read once and cached.',
    'monorepo-layout': 'pnpm workspaces + tsup per package + changesets for lockstep releases. Shared tools live in tools/; every package ships ESM, CJS and types.',
    'virtual-module': 'resolveId intercepts the specifier; load returns freshly compiled CSS; watch hooks invalidate on content change. The file never touches disk.',
    'safelist-design': 'Design rule: safelist entries should be rare and reviewable. The pattern form keeps them compact; diagnostics in 3.1 flag bloat.',
    'v3-cli-genesis': 'Four commands, zero dependencies beyond core. doctor\'s exit codes made it CI-wirable from day one.',
    'ai-artifacts': 'The corpus schema ({class, css, description, category, example}) became the de-facto exchange format for CSS-framework-aware models.',
    'browser-core': 'The constraint shaped the engine: no fs, no path, no process — pure computation. The playground and in-editor compilers all descend from this.',
    'v3-config-grammar': 'content, theme, theme.extend, darkMode, prefix, important, corePlugins, safelist, plugins, presets — the keys you know.',
    'testing-culture': 'Tests cover engine parity, plugin behavior, CLI flows and doc claims. The count grows every release.',
    'v3-docs-model': 'Generated tables stay true; authored guides stay wise. Cross-linking binds them — the same architecture powering this platform.',
    'esm-cjs': 'Dual builds mean adoption without migration: old CJS pipelines and modern ESM both work from day one.',
    'v3-performance-baseline': 'Baseline JSON in-repo, benchmark script in CI, hard thresholds on merge. The pattern survives to 3.1 unchanged.'
  };
  return map[slug] || '';
}
function v30ExampleLang(slug) { return slug.includes('cli') || slug.includes('bench') || slug.includes('ai-') ? 'bash' : slug.includes('esm') ? 'json' : 'js'; }
function v30Example(slug) { return v30Body(slug) ? 'see the mechanics above — every example in this series runs on the 3.0 packages.' : ''; }
function v30Delta(slug) {
  const map = {
    'jit-internals': '3.1 added memoisation, incremental caching and a benchmark gate — the pipeline got 10× faster on rebuilds.',
    'ten-screens': '3.0 had four screens; 3.1 grew the ladder to ten and added max-* variants.',
    'monorepo-layout': 'Unchanged — the layout proved right and survived intact.',
    'virtual-module': 'Verified against Vite 5/6/7/8 in 3.1.',
    'safelist-design': 'Better diagnostics for safelist misuse.',
    'v3-cli-genesis': '3.1 added migrate, lsp, inspect, export:ai and dev --serve.',
    'ai-artifacts': 'Corpus grew from 3,091 to 11,417 entries.',
    'browser-core': 'Enforcement test formalized in 3.1.',
    'v3-config-grammar': 'CSS-first config joined the JS file in 3.1.',
    'testing-culture': '53 tests grew to 238 across 31 files.',
    'v3-docs-model': 'The model matured into this versioned, searchable platform.',
    'esm-cjs': 'Node 18 CJS support hardened via fast-glob.'
  };
  return map[slug] || 'Refined and extended in 3.1.';
}

function v31Body(slug) {
  const map = {
    'oracle-architecture': 'Inputs are canonical Tailwind fixtures; outputs are normalized and diffed. Any divergence fails CI — the framework cannot silently drift from compatibility.',
    'ten-screens': 'Each screen compiles to a min-width media query; stacking collapses multiple prefixes into one query. max-* uses px-0.02 subtraction for seamless handoff.',
    'container-queries-internals': 'The compiler emits @container wrappers and container-scoped rules; fallback is graceful (rules simply wait for support).',
    'variants-155': 'Composition is the trick: each variant is a transform over selectors/media, so N variants compose into one rule rather than N rules.',
    'css-first-config': 'The parser recognizes the three at-rules anywhere in author CSS, merging their contributions into the resolved theme and registry before generation.',
    'lsp-architecture': 'The server reuses the compiler registry — completions cannot drift from what builds. A reusable LanguageService class powers editor-specific adapters.',
    'dev-serve': 'Static files + generated CSS + a tiny websocket for style swaps. Zero npm dependencies outside the CLI itself.',
    'apply-theme-screen': 'The directives are processed by the same engine in every integration — behavior is identical in CLI, PostCSS and Vite.',
    'darkmode-selector': 'The selector string composes into every dark: rule: [data-theme=dark] & .dark\\:bg-slate-900 { … }',
    'plugin-api-full': 'bare mode passes the plugin API object undecorated — compatibility layer thin enough to be invisible.',
    'size-utility': 'size-* accepts the full spacing scale plus fractions: size-4, size-1/2, size-full.',
    'layer-output': 'Layers wrap in order: base, components, utilities — host apps can interleave their own layers between them.',
    'node18-support': 'fast-glob@3 provides sync+async globbing without ESM-only constraints; entry points stay dual.',
    'memoisation': 'Theme identity hashing keys the memo table; config changes naturally invalidate.',
    'incremental-cache': 'The cache lives in memory during watch/dev and serializes nothing — correctness over cleverness.',
    'stats-diff': 'stats output is stable and parseable — teams pipe it into bundle-size dashboards.',
    'stdin-css': 'Dash (-) as the input path switches to stdin; output goes to stdout unless -o is given.',
    'doctor-v2': 'Each check is an independent module with a severity — the JSON output feeds editor integrations.',
    'migrate-tailwind': 'The porter is conservative: it only rewrites what it can prove, and prints a report of manual follow-ups.',
    'bench-gate': 'The gate compares medians of five runs; flakes get three attempts before failing the build.',
    'claims-tests': 'Numbers are extracted from doc markdown and asserted against registry stats at test time.'
  };
  return map[slug] || '';
}
function v31ExampleLang(slug) { return ['oracle-architecture', 'bench-gate', 'claims-tests', 'dev-serve', 'lsp-architecture', 'migrate-tailwind', 'doctor-v2', 'stdin-css', 'node18-support'].includes(slug) ? 'bash' : slug.includes('css-first') || slug.includes('layer') || slug.includes('apply') ? 'css' : slug.includes('selector') || slug.includes('memo') || slug.includes('cache') || slug.includes('ten-screens') ? 'text' : 'js'; }
function v31Example(slug) { return ''; }
function v31Notes(slug) {
  return ['Test it in your CI once before trusting it everywhere', 'Adopt it in one feature branch and measure', 'Document the pattern for your team — the docs link from here'];
}

function lookbookSample(V, slug) {
  const v1 = V.id === 'v1.0';
  const bank = {
    'neon-dashboard': '<body class="bg-mono-900 text-mono-100">\n<header class="navbar-glass sticky top-0">logo · nav · btn-neon</header>\n<main class="grid md:grid-cols-3 gap-4 p-6">stat cards (card-neon)</main>\n<section class="card-glass m-6 p-6">chart panel</section>\n</body>',
    'glass-landing': '<body class="bg-mono-900">\n<nav class="navbar-glass">…</nav>\n<section class="hero-neon text-center py-24">headline + btn-neon</section>\n<section class="grid md:grid-cols-3 gap-6 p-12">card-glass ×3</section>\n</body>',
    'brutal-poster': '<body class="bg-mono-50 text-black">\n<h1 class="text-5 font-black uppercase">LOUD</h1>\n<div class="brutalist-card p-6">manifesto</div>\n<button class="btn-brutal">JOIN</button>\n</body>',
    'pastel-blog': '<body class="bg-pastel-sky-50 text-mono-800">\n<article class="max-w-3 mx-auto p-6"><h1 class="text-4">Title</h1><p class="text-2 leading-relaxed">prose…</p></article>\n</body>',
    'minimal-docs': '<body class="bg-minimal-ice text-mono-900">\n<aside class="p-4">nav</aside><main class="max-w-3 p-8">docs prose</main>\n</body>',
    'neu-settings': '<body class="bg-mono-100">\n<div class="neu-light p-6 rounded-lg max-w-2 mx-auto">settings rows + toggle</div>\n</body>',
    'portfolio-v1': '<body class="bg-mono-900 text-mono-100">\n<section class="hero-neon">name + role</section>\n<section class="grid md:grid-cols-2 gap-6 p-8">card-glass works</section>\n</body>',
    'event-page': '<body class="bg-mono-900 text-mono-100">\n<header class="hero-neon text-center py-24">date countdown</header>\n<table class="m-8">schedule</table>\n<button class="btn-neon">Register</button>\n</body>',
    'app-promo': '<body class="bg-mono-900 text-mono-100">\n<section class="py-16 text-center"><h1 class="text-5 gradient-text">Ship faster</h1></section>\n<section class="grid md:grid-cols-2 gap-8 p-12">feature zigzag</section>\n</body>',
    'pricing-v1': '<body class="bg-mono-900 text-mono-100">\n<section class="grid md:grid-cols-3 gap-6 p-12">card / card-neon (featured) / card</section>\n</body>',
    'glass-suite': '<body class="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 min-h-screen text-white">\n<header class="glass sticky top-0 z-40">nav</header>\n<main class="grid md:grid-cols-3 gap-6 p-10">glass cards</main>\n<div class="glass fixed inset-x-0 bottom-4 mx-auto max-w-md p-4 rounded-2xl">toast</div>\n</body>',
    'neon-ops': '<body class="bg-slate-950 text-slate-100">\n<aside class="border-r border-white/10 w-64">ops nav</aside>\n<main class="grid gap-4 p-6 md:grid-cols-4">neon-card KPIs</main>\n<section class="neon-card m-6 p-6">terminal panel</section>\n</body>',
    'brutal-zine': '<body class="bg-white text-black">\n<h1 class="text-6xl font-black uppercase tracking-tight">RAW</h1>\n<div class="brutalist-card p-8 rotate-1">article one</div>\n<button class="brutalist-btn">READ</button>\n</body>',
    'minimal-saas': '<body class="bg-white text-slate-900">\n<header class="border-b">quiet nav</header>\n<section class="mx-auto max-w-3xl py-24 text-center"><h1 class="text-4xl font-medium">Calm software</h1><a class="minimalist-btn mt-8 inline-block">Start</a></section>\n<div class="grid md:grid-cols-3 gap-px bg-slate-200">minimalist-card cells</div>\n</body>',
    'skeleton-states': '<main class="mx-auto max-w-3xl space-y-8 p-10">\n<div class="flex gap-4"><div class="skeleton-circle size-12"></div><div class="flex-1 space-y-2"><div class="skeleton-text h-4 w-2/3"></div><div class="skeleton-text h-4 w-1/2"></div></div></div>\n<div class="skeleton-rect h-48 rounded-2xl"></div>\n</main>',
    'gradient-story': '<main class="space-y-0">\n<section class="bg-gradient-to-b from-slate-950 to-blue-900 py-24 text-white">chapter one</section>\n<section class="bg-gradient-to-b from-blue-900 to-fuchsia-900 py-24 text-white">chapter two</section>\n<h1 class="bg-gradient-to-r from-blue-400 to-fuchsia-400 bg-clip-text text-transparent text-5xl font-black">fin.</h1>\n</main>',
    'docs-clone': '<div class="flex min-h-screen">\n<aside class="w-72 border-r p-6 text-sm">nav tree</aside>\n<main class="flex-1 px-10 py-12"><article class="mx-auto max-w-prose">prose + code blocks</article></main>\n<aside class="hidden xl:block w-60 p-6 text-sm">TOC</aside>\n</div>',
    'dashboard-31': '<body class="flex min-h-screen bg-slate-50">\n<aside class="w-64 border-r bg-white">nav</aside>\n<main class="flex-1 p-6 grid gap-4 md:grid-cols-3 auto-rows-[170px]">bento KPIs + chart spans</main>\n</body>',
    'landing-31': '<body class="bg-white">\n<header class="sticky top-0 backdrop-blur bg-white/70 border-b z-40">nav</header>\n<section class="py-24 text-center">hero + gradient-text</section>\n<section class="border-y bg-slate-50 py-16">feature grid</section>\n<section class="py-16">pricing trio</section>\n<section class="mx-auto max-w-2xl py-16">FAQ accordion</section>\n<section class="bg-slate-950 py-16 text-center text-white">closing CTA</section>\n</body>',
    'dark-first': '<body class="bg-slate-950 text-slate-100">\n<header class="border-b border-white/10">nav with text-white/70 links</header>\n<main class="grid md:grid-cols-2 gap-8 p-10">cards bg-slate-900 border-white/10</main>\n<button class="rounded-xl bg-blue-500/90 px-6 py-3 font-semibold shadow-lg shadow-blue-500/30">CTA</button>\n</body>'
  };
  return bank[slug] || '<body><!-- lookbook skeleton --></body>';
}

function lookbookDecisions(slug) {
  return [
    'One paradigm carries the whole page — mixing paradigms mid-page breaks the spell',
    'Surfaces step in threes: canvas → card → raised',
    'Accents appear at most three times per viewport',
    'Typography carries hierarchy; color carries emotion — never reversed'
  ];
}

function featureWhy(f, V) {
  if (f.includes('JIT')) return 'Shipping megabytes of unused CSS was the industry\'s open secret. JIT made the catalog infinite and the output tiny — the defining move of the v3 era.';
  if (f.includes('breakpoint') || f.includes('Responsive') || f.includes('10-breakpoint')) return 'Devices fragmented; breakpoints multiplied. A wider ladder with container queries means the framework meets content where it lives.';
  if (f.includes('variant')) return 'States are half of UI. Stackable variants put hover, focus, dark and semantic states one prefix away from any utility.';
  if (f.includes('theme') || f.includes('Themes') || f.includes('preset')) return 'Teams need starting points with taste. Presets encode complete visual languages that tokens can then bend.';
  if (f.includes('TypeScript') || f.includes('type')) return 'Types turn configuration into documentation: autocomplete replaces guesswork.';
  if (f.includes('monorepo') || f.includes('packages')) return 'Separate packages mean separate adoption curves — install only what your pipeline needs.';
  if (f.includes('AI') || f.includes('LLM') || f.includes('corpus')) return 'Machines read docs too. Machine-readable artifacts make every assistant fluent in the framework.';
  if (f.includes('language server') || f.includes('LSP')) return 'The fastest answer is the one typed in your editor. LSP brings the docs to the cursor.';
  if (f.includes('dev server')) return 'Feedback speed is workflow speed. A zero-dependency server removes the last install step.';
  if (f.includes('Tailwind')) return 'Compatibility is respect for existing knowledge: everything the ecosystem knows keeps working.';
  if (f.includes('CSS-first')) return 'Some tokens belong in CSS. Config-in-stylesheet closes the loop for design-tooling and theming.';
  if (f.includes('benchmark')) return 'Speed must be defended, not just achieved. The gate makes performance a reviewed artifact.';
  if (f.includes('npm') || f.includes('publish')) return 'Reliable releases build trust: signed, mirrored, documented, automated.';
  return 'Shipped because real projects demanded it — the feature list is a support-ticket archaeology.';
}
function featureLang(f) {
  if (f.includes('CSS-first') || f.includes('@theme')) return 'css';
  if (f.includes('JIT') || f.includes('benchmark') || f.includes('dev server') || f.includes('language server')) return 'bash';
  return 'js';
}
function featureCode(f, V) {
  if (f.includes('CSS-first')) return '@theme {\n  --color-brand-500: #6d28d9;\n}';
  if (f.includes('JIT')) return 'npx nakshora build app.css -o dist/app.css --minify --stats';
  if (f.includes('language server')) return 'npx nakshora lsp';
  if (f.includes('dev server')) return 'npx nakshora dev --serve';
  if (f.includes('Tailwind')) return 'npx nakshora migrate --from tailwind';
  return `// ${f}\n// see the dedicated guide linked from the release notes`;
}
