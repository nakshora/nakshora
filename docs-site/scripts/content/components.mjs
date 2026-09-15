// ---------------------------------------------------------------------------
// Provider: design-paradigm components (glass, neon, brutalist, minimalist,
// skeletons, helpers) — version-aware.
// ---------------------------------------------------------------------------
import { article, p, h2, h3, code, list, table, callout, cards, cap } from '../lib/model.mjs';

export function componentArticles(V) {
  const A = [];
  const isV1 = V.id === 'v1.0';

  const comps = isV1
    ? [
        ['glass', 'Glass & glassmorphism', 'card-glass, glass, glass-light, navbar-glass — the v1 frosted surfaces.', '<div class="card-glass p-6 rounded-lg">Frosted v1 glass</div>'],
        ['neon', 'Neon components', 'btn-neon, card-neon, spinner-neon, neon glow helpers.', '<button class="btn-neon">Glow action</button>'],
        ['brutalist', 'Brutalist components', 'brutalist-card, brutalist-btn, brutal palettes.', '<div class="brutalist-card p-6">Loud & flat</div>'],
        ['minimalist', 'Minimalist components', 'minimalist-card, minimalist-btn, minimal-ice palette.', '<div class="minimalist-card p-6">Quiet</div>'],
        ['neumorphism', 'Neumorphism (neu-*)', 'neu-light soft-extrusion helpers.', '<div class="neu-light p-6 rounded-xl">Soft UI</div>'],
        ['skeletons', 'Skeletons', 'skeleton-rect, skeleton-circle, skeleton-text — loading shimmer.', '<div class="skeleton-rect h-32 rounded-lg"></div>'],
        ['buttons', 'Buttons (btn-*)', 'btn, btn-neon, btn-glass, btn-brutal, btn-minimal, btn-outline, btn-ghost.', '<button class="btn btn-neon">Action</button>'],
        ['cards', 'Cards (card-*)', 'card, card-glass, card-neon, card-hover.', '<div class="card p-6">Content</div>'],
        ['navigation', 'Navigation', 'navbar-glass, dropdown, accordion, tabs, pagination.', '<nav class="navbar-glass">…</nav>'],
        ['forms', 'Form controls', 'input-*, form groups and validation styling.', '<input class="input-neon" placeholder="Email" />'],
        ['feedback', 'Alerts, badges & progress', 'alert-*, badge-*, progress-* components.', '<div class="alert-neon">Saved!</div>'],
        ['hero', 'Hero sections', 'hero-* layouts and backgrounds.', '<section class="hero-neon">…</section>']
      ]
    : [
        ['glass', 'Glass (.glass, .glass-light, .glass-dark)', 'Backdrop-blurred frosted surfaces in three densities.', '<div class="glass p-6 rounded-xl">Frosted surface</div>'],
        ['neon', 'Neon (.neon-card, .neon-btn, .neon-glow, .neon-text)', 'The neon-cyber component family: glows, borders and text.', '<div class="neon-card p-6"><p class="neon-text">CYBER</p></div>'],
        ['brutalist', 'Brutalist (.brutalist-card, .brutalist-btn)', 'Hard shadows, thick borders, flat color.', '<div class="brutalist-card p-6">RAW</div>'],
        ['minimalist', 'Minimalist (.minimalist-card, .minimalist-btn)', 'Hairline borders and whitespace-first design.', '<div class="minimalist-card p-8">Clean</div>'],
        ['skeletons', 'Skeletons (.skeleton-rect, .skeleton-circle, .skeleton-text)', 'Loading shimmer states for every shape.', '<div class="skeleton-rect h-32 rounded-xl"></div>'],
        ['helpers', 'Helpers (.hover-lift, .gradient-*)', 'hover-lift, gradient-text, gradient-neon, gradient-pastel, gradient-nature, gradient-brutalist.', '<h1 class="gradient-text">Headline</h1>']
      ];

  A.push(article({
    slug: 'components/index',
    title: `Design components — ${V.label}`,
    section: 'components',
    category: 'Components',
    tags: ['components', 'design', 'reference'],
    keywords: ['components', 'glass', 'neon', 'brutalist', 'minimalist', 'skeleton', 'design paradigms'],
    summary: `${V.label} ships ready-made design paradigms — ${isV1 ? 'glass, neon, brutalist, minimalist, neumorphic, skeletons, buttons, cards, navigation and forms' : 'glassmorphism, neon cyber, brutalism, minimalism and skeleton loading'} — as drop-in classes you can restyle with utilities.`,
    order: 4,
    blocks: [
      p(`Nakshora's signature idea: frameworks should ship **design paradigms**, not just primitives. ${V.label} gives you complete visual languages as classes:`),
      cards(comps.map(([slug, title, desc]) => ({ slug: `components/${slug}`, title, desc }))),
      h2('Components vs utilities'),
      p('Components are *opinions*; utilities are *vocabulary*. Start from a component for speed, then override with utilities when the design demands it. Because components are plain CSS classes, every utility composes with them:'),
      code('html', `<div class="glass p-8 rounded-2xl max-w-md mx-auto mt-20">\n  <!-- component for the paradigm, utilities for placement & sizing -->\n</div>`),
      callout('tip', `Want these paradigms in your own components? Extract them with [[configuration/plugins|plugins]] (addComponents)${isV1 ? ' — or just copy the v1 rules you use' : ''}.`)
    ]
  }));

  for (const [slug, title, desc, example] of comps) {
    A.push(article({
      slug: `components/${slug}`,
      title: `${title} — ${V.label}`,
      section: 'components',
      category: 'Components',
      tags: ['components', slug],
      keywords: [slug, 'component', 'design paradigm', title.toLowerCase()],
      summary: `${desc} Complete guide to the ${slug} component family in ${V.label}: classes, composition, customization and accessibility.`,
      hub: 'components/index',
      blocks: [
        p(desc),
        h2('Usage'),
        code('html', example),
        h2('The classes'),
        table(['Class', 'Purpose'], componentTable(slug, isV1)),
        h2('Compose with utilities'),
        code('html', composeExample(slug)),
        h2('Customization'),
        p(componentCustom(slug, isV1)),
        h2('Accessibility'),
        list(componentA11y(slug)),
        h2('Related'),
        p(`[[components/index|Components hub]] · [[themes/index|Themes]] · [[recipes/index|Recipes]]`)
      ]
    }));
  }
  return A;
}

function componentTable(slug, isV1) {
  const t = {
    glass: [['`glass`', 'Standard frosted surface (backdrop blur + translucent bg)'], ['`glass-light`', 'Lighter frost for light UIs'], ['`glass-dark`', 'Deeper frost for dark UIs']],
    neon: [['`neon-card`', 'Glowing bordered card'], ['`neon-btn`', 'Button with neon glow'], ['`neon-glow`', 'Apply the glow to anything'], ['`neon-text`', 'Glowing text']],
    brutalist: [['`brutalist-card`', 'Hard-shadow card'], ['`brutalist-btn`', 'Offset-shadow button']],
    minimalist: [['`minimalist-card`', 'Hairline-border card'], ['`minimalist-btn`', 'Quiet button']],
    skeletons: [['`skeleton-rect`', 'Rectangle shimmer'], ['`skeleton-circle`', 'Avatar shimmer'], ['`skeleton-text`', 'Line shimmer']],
    neumorphism: [['`neu-light`', 'Soft raised surface'], ['`neu-*`', 'Inset/outset variations']],
    buttons: [['`btn`', 'Base button'], ['`btn-neon` / `btn-glass` / `btn-brutal` / `btn-minimal`', 'Paradigm buttons'], ['`btn-outline` / `btn-ghost`', 'Secondary emphasis']],
    cards: [['`card`', 'Base card'], ['`card-glass` / `card-neon`', 'Paradigm cards'], ['`card-hover`', 'Hover lift variant']],
    navigation: [['`navbar-glass`', 'Frosted navbar'], ['`dropdown` / `accordion` / `tabs`', 'Disclosure patterns'], ['`pagination`', 'Pager component']],
    forms: [['`input-*`', 'Paradigm inputs'], ['validation classes', 'error/success states']],
    feedback: [['`alert-*`', 'Paradigm alerts'], ['`badge-*`', 'Badges'], ['`progress-*`', 'Progress bars']],
    hero: [['`hero-neon`', 'Glowing hero layout']],
    helpers: [['`hover-lift`', 'Rise + shadow on hover'], ['`gradient-text`', 'Gradient-filled text'], ['`gradient-neon/pastel/nature/brutalist`', 'Paradigm gradient presets']]
  };
  return t[slug] || [['—', 'See usage']];
}

function composeExample(slug) {
  const map = {
    glass: '<div class="glass p-8 rounded-2xl max-w-md mx-auto hover:scale-[1.02] transition">\n  <h3 class="text-lg font-bold">Composed</h3>\n</div>',
    neon: '<button class="neon-btn px-8 py-3 text-lg font-bold mt-6">Amplified</button>',
    brutalist: '<div class="brutalist-card p-6 rotate-1 hover:rotate-0 transition">Playful</div>',
    minimalist: '<div class="minimalist-card p-10 max-w-prose mx-auto">Reading room</div>',
    skeletons: '<div class="flex gap-4 items-center">\n  <div class="skeleton-circle h-12 w-12"></div>\n  <div class="flex-1 space-y-2">\n    <div class="skeleton-text h-3 w-3/4"></div>\n    <div class="skeleton-text h-3 w-1/2"></div>\n  </div>\n</div>',
    neumorphism: '<div class="neu-light p-6 rounded-2xl max-w-xs">Soft</div>',
    buttons: '<div class="flex gap-3">\n  <button class="btn btn-neon">Primary</button>\n  <button class="btn btn-ghost">Secondary</button>\n</div>',
    cards: '<div class="card card-hover p-6">Lifts on hover</div>',
    navigation: '<header class="navbar-glass sticky top-0 z-40">Site nav</header>',
    forms: '<form class="space-y-4">\n  <input class="input-neon w-full" placeholder="you@example.com" />\n</form>',
    feedback: '<div class="alert-neon p-4 rounded-lg">Deployed successfully</div>',
    hero: '<section class="hero-neon py-24 text-center">Launch</section>',
    helpers: '<a class="hover-lift inline-block p-6 glass rounded-xl" href="#">Lifts</a>'
  };
  return map[slug] || '<div class="glass p-6">…</div>';
}

function componentCustom(slug, isV1) {
  return isV1
    ? 'v1 components are frozen CSS — customize by overriding after the stylesheet, or by redefining the palette variables they consume.'
    : 'Every component is built from theme tokens (colors, blur radii, shadows). Redefine tokens in your config and the whole family restyles. For structural changes, copy the rules into your own layer and edit freely.';
}

function componentA11y(slug) {
  const map = {
    glass: ['Verify 4.5:1 contrast over the blur — translucent surfaces reduce effective contrast', 'prefers-reduced-transparency: provide a solid fallback'],
    neon: ['Glow is decorative — never the only state signal', 'Check glow contrast in light mode'],
    brutalist: ['Hard shadows must not be mistaken for focus rings — keep real focus styles'],
    minimalist: ['Hairline borders need 3:1 contrast (WCAG non-text)'],
    skeletons: ['Add aria-busy="true" and a text alternative for screen readers', 'Keep shimmer motion subtle (motion-reduce: stop it)'],
    neumorphism: ['Soft contrast fails in bright environments — test outdoors'],
    buttons: ['Buttons need visible focus + 3:1 boundary contrast'],
    cards: ['Whole-card links: keep focus styles on the link, not just hover'],
    navigation: ['Dropdowns need keyboard support (Esc closes, arrows navigate)'],
    forms: ['Associate labels; color is never the only error signal'],
    feedback: ['Alerts: role="alert" for dynamic ones'],
    hero: ['Hero videos need pause controls'],
    helpers: ['hover-lift must also be reachable by keyboard focus']
  };
  return map[slug] || ['Maintain contrast and focus visibility.'];
}
