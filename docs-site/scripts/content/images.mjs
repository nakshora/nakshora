// ---------------------------------------------------------------------------
// Nakshora Docs — editorial image library mapping.
// Every article receives a real, royalty-free (AI-produced, first-party)
// photograph ≥1200px wide — suitable for Google News / Discover large cards.
// Base images live in assets-src/ and ship as /img/{key}.jpg.
// ---------------------------------------------------------------------------

export const IMAGE_KEYS = [
  'night-sky', 'code-screen', 'pattern-textile', 'glass-ui', 'neon-city',
  'blueprint', 'workspace-tablet', 'color-paint', 'library-books', 'cloud-servers'
];

const SECTION_IMAGE = {
  'getting-started': 'code-screen',
  concepts: 'blueprint',
  configuration: 'blueprint',
  utilities: 'blueprint',
  colors: 'color-paint',
  variants: 'neon-city',
  responsive: 'blueprint',
  components: 'glass-ui',
  themes: 'glass-ui',
  recipes: 'color-paint',
  patterns: 'blueprint',
  tutorials: 'workspace-tablet',
  cookbook: 'workspace-tablet',
  integrations: 'workspace-tablet',
  editors: 'workspace-tablet',
  cli: 'code-screen',
  api: 'code-screen',
  performance: 'cloud-servers',
  accessibility: 'library-books',
  design: 'pattern-textile',
  blueprints: 'blueprint',
  lookbook: 'glass-ui',
  qa: 'library-books',
  faq: 'library-books',
  troubleshooting: 'code-screen',
  comparisons: 'neon-city',
  spotlight: 'neon-city',
  cheatsheets: 'blueprint',
  glossary: 'library-books',
  teams: 'cloud-servers',
  deployment: 'cloud-servers',
  ai: 'cloud-servers',
  releases: 'night-sky',
  features: 'code-screen',
  tokens: 'color-paint',
  'v1-originals': 'neon-city',
  'v2-engine': 'code-screen',
  'v3-monorail': 'code-screen',
  parity: 'code-screen',
  tags: 'pattern-textile',
  core: 'night-sky',
  story: 'night-sky'
};

const CATEGORY_IMAGE = [
  [/typography|font/i, 'pattern-textile'],
  [/spacing|margin|padding|gap/i, 'blueprint'],
  [/color|gradient|background|border|effect|shadow/i, 'color-paint'],
  [/grid|flex|layout|sizing|position/i, 'blueprint'],
  [/glass|neon|brutal|minimal|skeleton|card|button|component/i, 'glass-ui'],
  [/dark|night|theme/i, 'night-sky'],
  [/deploy|host|cloud|ci|cdn|cache/i, 'cloud-servers'],
  [/team|onboard|govern|support|ops/i, 'workspace-tablet'],
  [/ai|llm|machine|corpus/i, 'cloud-servers'],
  [/bangla|bengali|accessib|education|learn|glossar/i, 'library-books']
];

const SLUG_IMAGE = [
  [/glass/, 'glass-ui'],
  [/neon|dark/, 'neon-city'],
  [/color|palette|swatch/, 'color-paint'],
  [/deploy|cloudflare|netlify|vercel|s3/, 'cloud-servers'],
  [/lsp|editor|vscode|neovim|jetbrains|helix|zed/, 'workspace-tablet'],
  [/tutorial|cookbook|recipe/, 'workspace-tablet'],
  [/migration|release|whats-new|license/, 'night-sky'],
  [/nakshora|pattern|story|brand|press/, 'pattern-textile']
];

/** Pick the editorial image key for an article. Deterministic. */
export function imageKeyFor(a) {
  for (const [re, key] of SLUG_IMAGE) if (re.test(a.slug)) return key;
  const hay = `${a.category} ${a.title}`;
  for (const [re, key] of CATEGORY_IMAGE) if (re.test(hay)) return key;
  return SECTION_IMAGE[a.section] || 'night-sky';
}

export const imagePathFor = (a) => `/img/${imageKeyFor(a)}.jpg`;
