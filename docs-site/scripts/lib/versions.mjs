// ---------------------------------------------------------------------------
// Nakshora Docs — version manifests. Facts sourced from the framework repo:
// CHANGELOGs, ai/corpus.json, minified-version/v1.0.0.css, docs/archive.
// ---------------------------------------------------------------------------

export const SITE = {
  name: 'Nakshora Docs',
  framework: 'Nakshora CSS Framework',
  url: 'https://docs.nakshora.bsdc.info.bd',
  mainSite: 'https://nakshora.bsdc.info.bd',
  repo: 'https://github.com/nakshora/nakshora',
  npm: 'https://www.npmjs.com/package/@nakshora/core',
  playground: 'https://nakshora.bsdc.info.bd/playground/',
  owner: 'Rizwan Rahim Chowdhury',
  ownerEmail: 'rizwan@bsdc.info.bd',
  company: 'RRC Development',
  companyEmail: 'rrc@bsdc.info.bd',
  companyUrl: 'https://rrc.bsdc.info.bd',
  license: 'MIT',
  description:
    'Official documentation for Nakshora — the modern, ultra-fast, utility-first CSS framework with a JIT compiler by Rizwan Rahim Chowdhury (RRC Development). Guides, complete utility reference, recipes and tutorials for every version from 1.0 to 3.1.'
};

const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

const PALETTES_22 = [
  'slate', 'gray', 'zinc', 'neutral', 'stone', 'red', 'orange', 'amber',
  'yellow', 'lime', 'emerald', 'green', 'teal', 'cyan', 'sky', 'blue',
  'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose'
];

// Representative hex approximations used only for documentation swatches.
export const SWATCH_HEX = {
  slate: ['#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1', '#94a3b8', '#64748b', '#475569', '#334155', '#1e293b', '#0f172a', '#020617'],
  gray: ['#f9fafb', '#f3f4f6', '#e5e7eb', '#d1d5db', '#9ca3af', '#6b7280', '#4b5563', '#374151', '#1f2937', '#111827', '#030712'],
  zinc: ['#fafafa', '#f4f4f5', '#e4e4e7', '#d4d4d8', '#a1a1aa', '#71717a', '#52525b', '#3f3f46', '#27272a', '#18181b', '#09090b'],
  neutral: ['#fafafa', '#f5f5f5', '#e5e5e5', '#d4d4d4', '#a3a3a3', '#737373', '#525252', '#404040', '#262626', '#171717', '#0a0a0a'],
  stone: ['#fafaf9', '#f5f5f4', '#e7e5e4', '#d6d3d1', '#a8a29e', '#78716c', '#57534e', '#44403c', '#292524', '#1c1917', '#0c0a09'],
  red: ['#fef2f2', '#fee2e2', '#fecaca', '#fca5a5', '#f87171', '#ef4444', '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d', '#450a0a'],
  orange: ['#fff7ed', '#ffedd5', '#fed7aa', '#fdba74', '#fb923c', '#f97316', '#ea580c', '#c2410c', '#9a3412', '#7c2d12', '#431407'],
  amber: ['#fffbeb', '#fef3c7', '#fde68a', '#fcd34d', '#fbbf24', '#f59e0b', '#d97706', '#b45309', '#92400e', '#78350f', '#451a03'],
  yellow: ['#fefce8', '#fef9c3', '#fef08a', '#fde047', '#facc15', '#eab308', '#ca8a04', '#a16207', '#854d0e', '#713f12', '#422006'],
  lime: ['#f7fee7', '#ecfccb', '#d9f99d', '#bef264', '#a3e635', '#84cc16', '#65a30d', '#4d7c0f', '#3f6212', '#365314', '#1a2e05'],
  emerald: ['#ecfdf5', '#d1fae5', '#a7f3d0', '#6ee7b7', '#34d399', '#10b981', '#059669', '#047857', '#065f46', '#064e3b', '#022c22'],
  green: ['#f0fdf4', '#dcfce7', '#bbf7d0', '#86efac', '#4ade80', '#22c55e', '#16a34a', '#15803d', '#166534', '#14532d', '#052e16'],
  teal: ['#f0fdfa', '#ccfbf1', '#99f6e4', '#5eead4', '#2dd3bf', '#14b8a6', '#0d9488', '#0f766e', '#115e59', '#134e4a', '#042f2e'],
  cyan: ['#ecfeff', '#cffafe', '#a5f3fc', '#67e8f9', '#22d3ee', '#06b6d4', '#0891b2', '#0e7490', '#155e75', '#164e63', '#083344'],
  sky: ['#f0f9ff', '#e0f2fe', '#bae6fd', '#7dd3fc', '#38bdf8', '#0ea5e9', '#0284c7', '#0369a1', '#075985', '#0c4a6e', '#082f49'],
  blue: ['#eff6ff', '#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a', '#172554'],
  indigo: ['#eef2ff', '#e0e7ff', '#c7d2fe', '#a5b4fc', '#818cf8', '#6366f1', '#4f46e5', '#4338ca', '#3730a3', '#312e81', '#1e1b4b'],
  violet: ['#f5f3ff', '#ede9fe', '#ddd6fe', '#c4b5fd', '#a78bfa', '#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6', '#4c1d95', '#2e1065'],
  purple: ['#faf5ff', '#f3e8ff', '#e9d5ff', '#d8b4fe', '#c084fc', '#a855f7', '#9333ea', '#7e22ce', '#6b21a8', '#581c87', '#3b0764'],
  fuchsia: ['#fdf4ff', '#fae8ff', '#f5d0fe', '#f0abfc', '#e879f9', '#d946ef', '#c026d3', '#a21caf', '#86198f', '#701a75', '#4a044e'],
  pink: ['#fdf2f8', '#fce7f3', '#fbcfe8', '#f9a8d4', '#f472b6', '#ec4899', '#db2777', '#be185d', '#9d174d', '#831843', '#500724'],
  rose: ['#fff1f2', '#ffe4e6', '#fecdd3', '#fda4af', '#fb7185', '#f43f5e', '#e11d48', '#be123c', '#9f1239', '#881337', '#4c0519']
};

export const V1_PALETTES = [
  'neon-purple', 'neon-pink', 'neon-cyan', 'neon-lime', 'neon-orange',
  'pastel-rose', 'pastel-lavender', 'pastel-mint', 'pastel-peach', 'pastel-sky',
  'mono', 'minimal-ice', 'forest', 'earth', 'ocean', 'sunset',
  'brutal-red', 'brutal-yellow', 'brutal-blue'
];

export const V1_SCREENS = [
  { name: 'base', min: 375, desc: 'default (mobile-first base)' },
  { name: 'sm', min: 640, desc: 'large phones' },
  { name: 'md', min: 768, desc: 'tablets' },
  { name: 'lg', min: 1024, desc: 'laptops' },
  { name: 'xl', min: 1280, desc: 'desktops' },
  { name: 'xxl', min: 1536, desc: 'large desktops' },
  { name: 'uhd', min: 2560, desc: 'UHD / 2K monitors' },
  { name: 'k8', min: 3840, desc: '4K / 8K walls' }
];

export const VERSIONS = [
  {
    id: 'v1.0',
    num: '1.0.0',
    label: 'Nakshora 1.0',
    date: '2024-11-20',
    status: 'legacy',
    latest: false,
    tagline: 'The original Nakshora design system — a single, batteries-included stylesheet.',
    summary:
      'Nakshora 1.0 is the original 2024 design system: one static CSS file with 1,038 hand-tuned classes, 19 HSL color palettes, ready-made components (neon buttons, glass cards, accordions, heroes) and 8 responsive screens from 375px to 4K.',
    install: '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/nakshora/nakshora@main/minified-version/v1.0.0.css" />',
    installKind: 'cdn',
    palettes: V1_PALETTES,
    paletteCount: 19,
    shades: SHADES,
    screens: V1_SCREENS,
    screenCount: 8,
    utilityCount: 1038,
    categoryCount: 14,
    jit: false,
    config: false,
    variants: ['sm', 'md', 'lg', 'xl', 'xxl', 'uhd', 'k8'],
    features: {
      'Static precompiled stylesheet': true,
      '19 hand-tuned HSL palettes (neon, pastel, brutal, nature, mono)': true,
      'Ready-made components: buttons, cards, glass, accordion, dropdown, tabs, alerts, heroes': true,
      'Neumorphism helpers (neu-light) and skeleton loaders': true,
      '8 responsive screens up to 8K (k8)': true,
      'CSS custom properties for every token': true,
      'Zero build step — one <link> tag': true,
      'Dark, neon-first visual language': true
    },
    highlights: [
      'One frozen CSS file — v1.0.0.css — with 1,038 classes and zero build tooling.',
      'Design-paradigm components shipped before they had names: glass, neon, brutalist, neumorphic.',
      '19 CSS-variable palettes (neon-*, pastel-*, brutal-*, mono, forest, earth, ocean, sunset).',
      'Screens from sm:640 to k8:3840 — v1 already targeted 8K displays.'
    ]
  },
  {
    id: 'v2.0',
    num: '2.0.0',
    label: 'Nakshora 2.0',
    date: '2026-09-12',
    status: 'legacy',
    latest: false,
    tagline: 'The TypeScript rewrite — programmatic CSS generation, five themes, npm-ready.',
    summary:
      'Nakshora 2.0 rewrote the framework in TypeScript: a programmatic CSSGenerator, five built-in themes (Neon Cyber, Pastel Dream, Brutalist, Minimalist, Nature), 50 colors × 10 shades, six breakpoints and first-class npm publishing.',
    install: 'npm install nakshora',
    installKind: 'npm',
    palettes: PALETTES_22.slice(0, 22),
    paletteCount: 50,
    shades: [100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
    screens: [
      { name: 'xs', min: 480, desc: 'small phones' },
      { name: 'sm', min: 640, desc: 'large phones' },
      { name: 'md', min: 768, desc: 'tablets' },
      { name: 'lg', min: 1024, desc: 'laptops' },
      { name: 'xl', min: 1280, desc: 'desktops' },
      { name: '2xl', min: 1536, desc: 'large desktops' }
    ],
    screenCount: 6,
    utilityCount: 3091,
    categoryCount: 20,
    jit: false,
    config: true,
    variants: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', 'hover', 'focus', 'active', 'disabled', 'dark'],
    features: {
      'Full TypeScript rewrite with type-safe configuration': true,
      'Programmatic CSSGenerator — build CSS from a config object': true,
      '5 built-in themes: Neon Cyber, Pastel Dream, Brutalist, Minimalist, Nature': true,
      '50 colors × 10 shades color engine': true,
      '6 responsive breakpoints (xs → 2xl)': true,
      'Utility system: display, spacing, typography, flexbox, grid, borders, shadows, effects, transforms, transitions': true,
      'First npm publishing pipeline with ESM bundles': true,
      'Webpack-based build system with source maps': true
    },
    highlights: [
      'First compiler-style Nakshora: CSS generated from a typed config instead of a static file.',
      'Five complete design themes shipped as first-class exports.',
      'Introduced the configuration API that v3 refined.',
      'Fixed-generation utilities: spacing, typography, flexbox, grid, colors, effects.'
    ]
  },
  {
    id: 'v3.0',
    num: '3.0.0',
    label: 'Nakshora 3.0',
    date: '2026-09-13',
    status: 'stable',
    latest: false,
    tagline: 'The modern monorepo — JIT engine, four packages, AI-ready docs.',
    summary:
      'Nakshora 3.0 is the ground-up modernization: a pnpm monorepo with @nakshora/core, cli, postcss and vite-plugin; a JIT compiler that emits only the classes you use (3,091 utilities); safelists; and machine-readable AI documentation.',
    install: 'npm install -D @nakshora/vite-plugin',
    installKind: 'npm',
    palettes: PALETTES_22,
    paletteCount: 22,
    shades: SHADES,
    screens: [
      { name: 'sm', min: 640, desc: 'large phones' },
      { name: 'md', min: 768, desc: 'tablets' },
      { name: 'lg', min: 1024, desc: 'laptops' },
      { name: 'xl', min: 1280, desc: 'desktops' }
    ],
    screenCount: 4,
    utilityCount: 3091,
    categoryCount: 28,
    jit: true,
    config: true,
    variants: ['sm', 'md', 'lg', 'xl', 'hover', 'focus', 'focus-visible', 'focus-within', 'active', 'visited', 'disabled', 'checked', 'first', 'last', 'odd', 'even', 'group-hover', 'peer-checked', 'dark', 'motion-reduce', 'print'],
    features: {
      'JIT compiler — compiles only the classes found in your content': true,
      'Modern pnpm monorepo: @nakshora/core, cli, postcss, vite-plugin': true,
      '3,091 utilities across 28 categories': true,
      'Tailwind-compatible config file (nakshora.config.js)': true,
      'Vite plugin with virtual `import "nakshora"` module and HMR': true,
      'PostCSS plugin with @nakshora source / utilities at-rules': true,
      'CLI: init, build, dev, doctor': true,
      'Safelist support for dynamic class names': true,
      'AI-ready: llms.txt, corpus.json, SFT dataset': true,
      'Zero-dependency core that runs in Node and the browser': true
    },
    highlights: [
      'The JIT era begins: kilobyte-sized CSS from a multi-thousand-utility catalog.',
      'Four published packages with dual ESM/CJS builds.',
      'Tailwind-compatible class grammar and configuration.',
      'Machine-readable documentation for LLM training and RAG.'
    ]
  },
  {
    id: 'v3.1',
    num: '3.1.0',
    label: 'Nakshora 3.1',
    date: '2026-09-14',
    status: 'latest',
    latest: true,
    tagline: 'Tailwind 3.4 parity, 10 breakpoints, 155 variants, LSP & CSS-first config.',
    summary:
      'Nakshora 3.1 is the current release: 11,417 utilities across 35 categories verified byte-identical against Tailwind 3.4, a 10-breakpoint responsive system (xxs → 5xl), 155 stackable variants, a language server, CSS-first configuration (@theme / @utility / @custom-variant) and a dependency-free dev server.',
    install: 'npm install -D @nakshora/vite-plugin',
    installKind: 'npm',
    palettes: PALETTES_22,
    paletteCount: 22,
    shades: SHADES,
    screens: [
      { name: 'xxs', min: 200, desc: 'tiny / folded screens, wearables' },
      { name: 'xs', min: 400, desc: 'small phones' },
      { name: 'sm', min: 640, desc: 'large phones' },
      { name: 'md', min: 768, desc: 'tablets' },
      { name: 'lg', min: 1024, desc: 'laptops' },
      { name: 'xl', min: 1280, desc: 'desktops' },
      { name: '2xl', min: 1536, desc: 'large desktops' },
      { name: '3xl', min: 1920, desc: 'Full HD monitors, TVs' },
      { name: '4xl', min: 2560, desc: 'QHD / 2K monitors' },
      { name: '5xl', min: 5000, desc: '4K+, video walls, ultra-wide' }
    ],
    screenCount: 10,
    utilityCount: 11417,
    categoryCount: 35,
    jit: true,
    config: true,
    variants: ['hover', 'focus', 'focus-visible', 'focus-within', 'active', 'visited', 'disabled', 'checked', 'first', 'last', 'only', 'odd', 'even', 'first-of-type', 'last-of-type', 'only-of-type', 'empty', 'target', 'placeholder', 'before', 'after', 'selection', 'marker', 'file', 'backdrop', 'group-hover', 'group-focus', 'group-active', 'group-disabled', 'peer-hover', 'peer-focus', 'peer-checked', 'peer-disabled', 'has-[…]', 'aria-*', 'data-*', 'supports-[…]', 'dark', 'rtl', 'ltr', 'portrait', 'landscape', 'print', 'motion-safe', 'motion-reduce', 'contrast-more', 'contrast-less', 'forced-colors', 'not-*', '*', 'starting', 'min-[…]', 'max-*', '@container'],
    variantCount: 155,
    features: {
      '11,417 utilities across 35 categories — Tailwind 3.4 parity, byte-identical oracle': true,
      '10-breakpoint responsive scale (xxs 200px → 5xl 5000px) with max-* variants': true,
      'Container queries: @container, @min-*, @max-*': true,
      '155 stackable variants incl. has-[], aria-*, data-*, supports-[], not-*, *': true,
      'CSS-first configuration: @theme, @utility, @custom-variant (Tailwind v4 syntax)': true,
      'Language server (nakshora lsp) for any LSP-capable editor': true,
      'Dependency-free dev server with CSS hot-swap (nakshora dev --serve)': true,
      'Arbitrary values w-[37px], arbitrary properties [mask-type:luminance], opacity modifiers /50': true,
      'Official Tailwind plugins run unchanged (typography, forms, aspect-ratio, container-queries)': true,
      '@apply, theme(), screen() in author CSS': true,
      'darkMode: class | media | selector': true,
      'Benchmarked CI gate — regressions fail the build': true
    },
    highlights: [
      'A differential oracle proves byte-identical output with Tailwind 3.4: 11,343 static + 1,338 dynamic classes.',
      'The responsive system grew from 4 to 10 screens, from wearables (200px) to video walls (5000px).',
      'nakshora lsp brings completion, hover, diagnostics and color previews to every editor.',
      'CSS-first config lets you extend the theme without touching JavaScript.'
    ]
  }
];

export const latestVersion = VERSIONS.find((v) => v.latest);
export function versionById(id) {
  return VERSIONS.find((v) => v.id === id);
}

export const SPACING_KEYS = ['0', 'px', '0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4', '5', '6', '7', '8', '9', '10', '11', '12', '14', '16', '20', '24', '28', '32', '36', '40', '44', '48', '56', '64', '72', '80', '96'];

export const SPACING_VALUES = {
  '0': '0px', px: '1px', '0.5': '0.125rem', '1': '0.25rem', '1.5': '0.375rem', '2': '0.5rem',
  '2.5': '0.625rem', '3': '0.75rem', '3.5': '0.875rem', '4': '1rem', '5': '1.25rem', '6': '1.5rem',
  '7': '1.75rem', '8': '2rem', '9': '2.25rem', '10': '2.5rem', '11': '2.75rem', '12': '3rem',
  '14': '3.5rem', '16': '4rem', '20': '5rem', '24': '6rem', '28': '7rem', '32': '8rem',
  '36': '9rem', '40': '10rem', '44': '11rem', '48': '12rem', '56': '14rem', '64': '16rem',
  '72': '18rem', '80': '20rem', '96': '24rem'
};
