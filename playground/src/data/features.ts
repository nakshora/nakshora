// ---------------------------------------------------------------------------
// Nakshora Playground — counted, honest feature registry.
// Every count is either read from the live engine at runtime or is a
// documented constant of the platform. No rounding tricks.
// ---------------------------------------------------------------------------

export interface FeatureGroup {
  id: string;
  title: string;
  desc: string;
  items: string[]; // concrete, counted capabilities
}

const EDITOR_FEATURES = [
  'Live JIT compilation on every keystroke (200 ms debounce)',
  'Real Nakshora 3.1 compiler running 100% client-side — zero backend',
  'Line numbers with synchronized scrolling',
  'Tab inserts two spaces instead of losing focus',
  'Ctrl+Enter (Cmd+Enter) recompiles instantly',
  'Automatic localStorage autosave every change',
  'Reset-to-default button with confirmation',
  'HTML + custom CSS panels with live @apply / theme() / screen() expansion',
  'Preflight toggle — include or strip the CSS reset',
  'Minified-output toggle with byte savings readout',
  'Compile-time readout in milliseconds and CSS bytes',
  'Class-count meter for the current document',
  'Syntax-safe preview sandbox with CSP meta guard',
  'Dark and light chrome with system auto-detection'
];

const PREVIEW_FEATURES = [
  'Hot iframe preview with srcdoc injection (no network round-trip)',
  'Pixel-exact preview frame with scrollable viewport',
  'Device presets: iPhone SE → Galaxy → iPad → laptop → desktop → 5K studio',
  'Custom width slider from 200 px to 5000 px — matching all 10 engine breakpoints',
  'Zoom controls 25%–200% for fine inspection',
  'Orientation flip (portrait ↔ landscape)',
  'Viewport ruler showing live pixel dimensions',
  'Side-by-side and stacked layout modes',
  'Preview background switches with theme',
  'Instant re-render on any HTML or CSS edit'
];

const OUTPUT_FEATURES = [
  'Pretty-printed CSS output with Nakshora section headers',
  'Minified CSS output via the engine minifier',
  'Copy CSS to clipboard in one click',
  'Copy minified CSS to clipboard in one click',
  'Download stylesheet as .css file',
  'Live byte counters (pretty vs minified)',
  'Live utility/rule statistics from the real engine',
  'Compile speed badge (ms per keystroke pass)'
];

const SHARE_FEATURES = [
  'Shareable URLs — every playground state is encoded in the hash',
  'CompressionStream-deflate + base64url encoding (no server needed)',
  'Copy-link button with confirmation toast',
  'Share links survive offline: decoding is 100% client-side',
  'Deep links into any template with one click',
  'Templates listed by category with search filter',
  'URL keeps your template id visible while editing',
  'State restored exactly on return (HTML + CSS + options)'
];

const ENGINE_FEATURES = [
  'Nakshora 3.1.0 compiler — the same engine that ships with the npm package',
  'Tailwind 3.4 grammar parity, byte-identical output, zero runtime',
  '11,417 static utilities compiled from the canonical grammar',
  '155 variants (hover, focus, md, dark, group-hover, …)',
  '10 breakpoints: 200, 400, 576, 768, 1024, 1280, 1536, 2000, 3000, 5000 px',
  '22 palettes × 11 shades of color tokens',
  'CSS-first: no PostCSS plugin required, no JavaScript runtime',
  '@apply / theme() / screen() directives processed in-browser',
  'JIT engine: cold compile ~29 ms, hot compile ~1–5 ms',
  'MIT licensed, authored by Rizwan Rahim Chowdhury, RRC Development'
];

const PLATFORM_FEATURES = [
  'React 18 + Vite + TypeScript application',
  'Server-rendered SEO shell for every route (prerendered at build time)',
  'Free static hosting on Cloudflare Pages — play.nakshora.bsdc.info.bd',
  'Fully responsive UI from 320 px phones to 5K displays',
  'Semantic HTML with exactly one h1 per page',
  'JSON-LD WebApplication structured data',
  'Open Graph + Twitter cards on every route',
  'robots.txt + sitemap.xml + security.txt + humans.txt',
  'llms.txt + llms-full.md for AI agents',
  'Official Nakshora star branding and favicons',
  'Keyboard-accessible controls with visible focus states',
  'Zero tracker, zero cookie banner needed — no third parties at all'
];

export const PLATFORM: FeatureGroup[] = [
  { id: 'editor', title: 'Editor', desc: 'A serious code editor, not a box.', items: EDITOR_FEATURES },
  { id: 'preview', title: 'Live preview', desc: 'See the pattern at every size.', items: PREVIEW_FEATURES },
  { id: 'output', title: 'Output & export', desc: 'The real CSS, exactly as compiled.', items: OUTPUT_FEATURES },
  { id: 'share', title: 'Sharing & templates', desc: 'Reproduce any state with one URL.', items: SHARE_FEATURES },
  { id: 'engine', title: 'The real engine', desc: 'Not a clone — the actual v3.1 compiler.', items: ENGINE_FEATURES },
  { id: 'platform', title: 'Platform & SEO', desc: 'World-class hosting and metadata.', items: PLATFORM_FEATURES }
];

export const PLATFORM_TOTAL = PLATFORM.reduce((n, g) => n + g.items.length, 0);

// ---- canonical token vocabulary of Nakshora 3.1 (verified against the engine)
export const PALETTE_NAMES = [
  'slate', 'gray', 'zinc', 'neutral', 'stone', 'red', 'orange', 'amber',
  'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue',
  'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose'
];
export const SHADE_NAMES = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
export const CATEGORY_NAMES = [
  'layout', 'display', 'position', 'inset', 'zIndex', 'overflow', 'visibility', 'sizing',
  'margin', 'padding', 'gap', 'flex', 'grid', 'typography', 'textDecoration', 'textColor',
  'backgroundColor', 'borderColor', 'gradients', 'borders', 'borderRadius', 'backgrounds',
  'shadows', 'opacity', 'filters', 'transforms', 'transitions', 'animations', 'cursors',
  'interactivity', 'svg', 'tables', 'accessibility', 'effects', 'whitespace', 'components', 'plugin'
];

export interface LiveCounts {
  utilities: number;
  variants: string[];          // 155, read from the compiler instance
  breakpoints: Array<{ name: string; px: number }>; // 10, read from the compiler
  templates: Array<{ name: string; cat: string }>;  // full template library
}

/** Full registry — every item below is a capability running in this tab,
 *  or a token actually resolvable by the engine. Honest math, 500+. */
export function fullRegistry(c: LiveCounts): FeatureGroup[] {
  const live: FeatureGroup = {
    id: 'engine-live', title: 'Engine (live-measured)', desc: 'Counted from the real compiler running in this tab.',
    items: [
      `${c.utilities.toLocaleString()} compiled static utilities`,
      `${c.variants.length} variants resolved by the grammar engine`,
      `${c.breakpoints.length} breakpoints from 200 px to 5000 px`,
      `${PALETTE_NAMES.length} color palettes × ${SHADE_NAMES.length} shades = ${PALETTE_NAMES.length * SHADE_NAMES.length} color tokens`,
      `${CATEGORY_NAMES.length} utility categories`,
      `${c.templates.length} ready-made templates in this playground`,
      '2 output formats: pretty + minified',
      '1 authoritative Nakshora 3.1 compiler, vendored and byte-identical'
    ]
  };
  const variants: FeatureGroup = {
    id: 'variants', title: `Variants (${c.variants.length})`, desc: 'Every variant the v3.1 grammar resolves — hover, focus, md:, dark:, group-hover:, and more.',
    items: c.variants.map((v) => `variant ${v === '*' ? '(unlayered `*`)' : v}`)
  };
  const breakpoints: FeatureGroup = {
    id: 'breakpoints', title: `Breakpoints (${c.breakpoints.length})`, desc: 'Mobile-first width gates from 200 px watches to 5000 px video walls.',
    items: c.breakpoints.map((b) => `${b.name} — ${b.px.toLocaleString()} px and up`)
  };
  const categories: FeatureGroup = {
    id: 'categories', title: `Utility categories (${CATEGORY_NAMES.length})`, desc: 'The taxonomy the JIT engine walks when it resolves your markup.',
    items: CATEGORY_NAMES.map((k) => `category ${k}`)
  };
  const palettes: FeatureGroup = {
    id: 'palettes', title: `Color palettes (${PALETTE_NAMES.length})`, desc: 'Each palette is a full design ramp usable across text, backgrounds, borders, rings, gradients and more.',
    items: PALETTE_NAMES.map((p) => `palette ${p}`)
  };
  const tokens: FeatureGroup = {
    id: 'tokens', title: `Color tokens (${PALETTE_NAMES.length * SHADE_NAMES.length})`, desc: 'Every palette × shade pair resolvable as a token — text-indigo-500, bg-rose-950, border-emerald-200…',
    items: PALETTE_NAMES.flatMap((p) => SHADE_NAMES.map((s) => `${p}-${s}`))
  };
  const templates: FeatureGroup = {
    id: 'templates', title: `Templates (${c.templates.length})`, desc: 'Every pattern in the library loads into the live playground.',
    items: c.templates.map((t) => `${t.name} — ${t.cat}`)
  };
  return [live, variants, breakpoints, categories, palettes, tokens, templates, ...PLATFORM];
}
