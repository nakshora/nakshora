// ---------------------------------------------------------------------------
// Provider: color system — palettes, shade profiles, usage families.
// ---------------------------------------------------------------------------
import { article, p, h2, h3, code, list, table, callout, cards, swatches, cap } from '../lib/model.mjs';
import { SWATCH_HEX, V1_PALETTES } from '../lib/versions.mjs';

const V1_HEX = {
  'neon-purple': '#b366ff', 'neon-pink': '#ff66cc', 'neon-cyan': '#33ffff', 'neon-lime': '#ccff33', 'neon-orange': '#ff9933',
  'pastel-rose': '#f4a7b9', 'pastel-lavender': '#c9b3e6', 'pastel-mint': '#b3e6c9', 'pastel-peach': '#ffd9b3', 'pastel-sky': '#b3d9f2',
  mono: '#8a93a6', 'minimal-ice': '#dbe7f0', forest: '#4a7c59', earth: '#8a6d4b', ocean: '#2b6f8f', sunset: '#d9703f',
  'brutal-red': '#ff3333', 'brutal-yellow': '#ffdd33', 'brutal-blue': '#3366ff'
};

const SHADE_ROLE = {
  50: 'Lightest tint — page backgrounds, subtle fills, hover backgrounds for rows and list items.',
  100: 'Very light — section backgrounds, badges on light UI, tinted code blocks.',
  200: 'Light — borders on light themes, dividers with personality, chip backgrounds.',
  300: 'Soft — secondary borders, disabled states with color, placeholder decorations.',
  400: 'Medium-light — icons on dark surfaces, decorative accents, chart lines.',
  500: 'The primary step — buttons, links, brand fills, key interactive elements.',
  600: 'Hover step — hover states for 500 elements, or primary on very light UIs.',
  700: 'Active step — pressed states, emphasized text on light tinted backgrounds.',
  800: 'Dark — text on light palettes, headers in tinted sections, dark UI fills.',
  900: 'Very dark — deep section backgrounds, high-contrast text carriers.',
  950: 'Darkest — near-black tinted backgrounds, hero surfaces, footer tones.'
};

export function colorArticles(V) {
  const A = [];
  const isV1 = V.id === 'v1.0';
  const isV2 = V.id === 'v2.0';
  const palettes = isV1 ? V1_PALETTES : V.palettes;
  const hexOf = (pal, i) => (isV1 ? V1_HEX[pal] || '#888' : (SWATCH_HEX[pal] || [])[i] || '#888');

  // ------------------------------------------------------------- color hub
  A.push(article({
    slug: 'colors/index',
    title: `Color system — ${V.label}`,
    section: 'colors',
    category: 'Colors',
    tags: ['colors', 'reference', 'design'],
    keywords: ['colors', 'palette', 'shades', 'color system', 'design tokens', 'রঙ'],
    summary: `The ${V.label} color system: ${palettes.length} palettes${isV2 ? ' (from the 50-color v2 engine)' : ` × ${V.shades.length} shades`} with text, background, border and gradient utilities — plus pairing and accessibility guidance.`,
    order: 5,
    blocks: [
      p(`Color in ${V.label} follows one grammar: \`<utility>-<palette>-<shade>\`. \`text-blue-500\`, \`bg-slate-900\`, \`border-rose-200\`, \`from-indigo-400\` — once you know one, you know them all.`),
      h2(isV1 ? 'The v1 palette families' : isV2 ? 'The v2 color engine' : 'The 22 palettes'),
      isV2
        ? p('v2 generates from a **50-color engine with 10 shades each**, surfaced through the five theme presets. Pick a theme and its palettes come with it — see [[themes/index|Themes & presets]].')
        : table(['Palette', 'Character', 'Start here'], palettes.map((pal) => [`\`${pal}\``, paletteCharacter(pal), `[[colors/${pal}|${pal} →]]`])),
      h2('Every shade has a job'),
      table(['Shade', 'Role'], Object.entries(SHADE_ROLE).slice(0, isV1 ? 11 : 11).map(([s, r]) => [`\`${s}\``, r])),
      h2('Where colors plug in'),
      cards([
        { slug: 'colors/text-color', title: 'Text color', desc: 'text-<palette>-<shade> everywhere.' },
        { slug: 'colors/background-color', title: 'Background color', desc: 'bg-* with opacity modifiers.' },
        { slug: 'colors/border-color', title: 'Border color', desc: 'border-*, divide-*, ring-*.' },
        { slug: 'colors/gradient-color', title: 'Gradients', desc: 'from-/via-/to- stops.' }
      ]),
      h2('Accessibility'),
      p('Contrast is a property of *pairs*, not colors. The rule of thumb that keeps you WCAG AA: **50–400 shades carry dark text, 600–950 shades carry white text.** Each palette page lists the flip point. See [[accessibility/color-contrast|Color contrast]] for measurements.'),
      callout('tip', `Opacity modifiers work on every color utility: \`bg-blue-500/50\`, \`text-white/80\`, \`border-black/10\`${isV1 ? ' — not available in v1 (use the pre-blended pastel family instead)' : ''}.`)
    ]
  }));

  // usage families
  for (const [slug, title, util, desc, example] of [
    ['colors/text-color', 'Text color', 'text-', 'text-<palette>-<shade> — foreground color for any element.', '<p class="text-blue-600 dark:text-blue-400">Readable in both schemes</p>'],
    ['colors/background-color', 'Background color', 'bg-', 'bg-<palette>-<shade> — surfaces, fills, sections.', '<section class="bg-slate-900 text-white">Deep surface</section>'],
    ['colors/border-color', 'Border & divide color', 'border-', 'border-<palette>-<shade>, divide-*, ring-* colors.', '<div class="border border-slate-200 dark:border-slate-700">Adaptive</div>'],
    ['colors/gradient-color', 'Gradient stops', 'from-', 'from-/via-/to- stops for gradients in any palette.', '<div class="bg-gradient-to-r from-cyan-400 to-blue-600 h-16"></div>'],
    ['colors/fill-stroke-color', 'SVG fill & stroke', 'fill-', 'fill-*/stroke-* in every palette.', '<svg class="fill-emerald-500">…</svg>'],
    ['colors/caret-accent-color', 'Caret & accent', 'caret-', 'caret-* and accent-* color the text cursor and form controls.', '<input class="accent-violet-500 caret-violet-500" type="text" />']
  ]) {
    A.push(article({
      slug,
      title: `${title} — ${V.label}`,
      section: 'colors',
      category: 'Colors',
      tags: ['colors', slug.split('/')[1]],
      keywords: [title.toLowerCase(), util, 'color utility'],
      summary: `${desc} Every palette works here — syntax, examples and pairing advice for ${V.label}.`,
      hub: 'colors/index',
      blocks: [
        p(desc),
        h2('Syntax'),
        code('html', example),
        h2('All palettes apply'),
        p(`Every palette in the [[colors/index|color system]] generates a \`${util}*\` class: ${isV2 ? 'the theme palettes of your chosen preset' : palettes.slice(0, 8).map((x) => `\`${util}${x}-500\``).join(', ')}…`),
        h2('Patterns'),
        list(colorPatterns(slug)),
        h2('Related'),
        p('[[colors/index|Color hub]] · [[concepts/dark-mode-strategies|Dark mode]] · [[accessibility/color-contrast|Contrast]]')
      ]
    }));
  }

  // concepts
  A.push(article({
    slug: 'colors/opacity-modifiers',
    title: `Opacity modifiers — ${V.label}`,
    section: 'colors',
    category: 'Colors',
    tags: ['colors', 'opacity'],
    keywords: ['opacity modifier', 'alpha', 'transparency', 'slash'],
    summary: isV1 ? 'v1 has no opacity modifiers — use pre-blended palettes or custom CSS variables.' : 'bg-blue-500/50, text-white/80, border-black/10 — the slash syntax for alpha on any color.',
    hub: 'colors/index',
    blocks: isV1
      ? [
          p('Nakshora 1.0 predates the modifier syntax. For translucency, either pick a pre-blended shade or override the variable:'),
          code('css', `.my-overlay {\n  background: hsl(280 100% 55% / 0.5); /* neon-purple-500 at 50% */\n}`),
          p('The modern releases ([[../v3.1/colors/opacity-modifiers|v3.1 opacity modifiers]]) support `/0`–`/100` on every color utility.')
        ]
      : [
          p('Append `/N` to any color utility for alpha: the engine emits the correct color-mix/rgba.'),
          code('html', '<div class="bg-slate-900/75 backdrop-blur">Overlay</div>\n<p class="text-white/60">Secondary text</p>\n<div class="ring-1 ring-black/10">Hairline ring</div>'),
          h2('Canonical uses'),
          list([
            'Overlays: `bg-black/50` above modals',
            'Hairlines: `ring-black/10` (light) / `ring-white/10` (dark)',
            'Secondary text: `text-white/70` on dark heroes',
            'Tinted surfaces: `bg-blue-500/10` for info panels'
          ]),
          h2('Arbitrary alpha'),
          code('html', '<div class="bg-blue-500/[0.33]">Precise 33%</div>'),
          callout('warn', 'Alpha colors over images need a backdrop — test on real content, not white artboards.')
        ]
  }));
  A.push(article({
    slug: 'colors/color-pairing',
    title: 'Pairing palettes — recipes',
    section: 'colors',
    category: 'Colors',
    tags: ['colors', 'design', 'recipes'],
    keywords: ['color pairing', 'palette combinations', 'design recipes'],
    summary: 'Battle-tested palette pairings: which Nakshora palettes combine into professional schemes, with ratios.',
    hub: 'colors/index',
    blocks: [
      p('Great UIs use **one dominant palette, one neutral, one accent**. Here are pairings that always work with the Nakshora scale.'),
      h2('The pairings'),
      table(['Dominant', 'Neutral', 'Accent', 'Feel'], [
        ['`blue`', '`slate`', '`amber`', 'Trustworthy SaaS'],
        ['`violet`', '`zinc`', '`cyan`', 'Modern developer tool'],
        ['`emerald`', '`stone`', '`orange`', 'Organic / fintech'],
        ['`rose`', '`neutral`', '`indigo`', 'Consumer / lifestyle'],
        ['`indigo`', '`gray`', '`pink`', 'Creative platform'],
        ['`teal`', '`slate`', '`fuchsia`', 'Dashboard / data']
      ]),
      h2('The 60-30-10 rule'),
      p('60% neutral surfaces (`slate-50`/`slate-950`), 30% secondary (cards, borders at 100–300), 10% dominant+accent (buttons, links, highlights). The [[design/color-theory|color theory guide]] goes deeper.'),
      callout('pro', 'Commit your trio to theme.extend.colors as `primary`, `surface`, `accent` — then ban raw palette names in components.')
    ]
  }));

  // ------------------------------------------------------- palette articles
  const usages = [
    ['text', 'text-', 'Text'],
    ['background', 'bg-', 'Background'],
    ['border', 'border-', 'Border'],
    ['gradient', 'from-', 'Gradient']
  ];
  for (const pal of palettes) {
    const shadesArr = V.shades;
    const colorsArr = shadesArr.map((_, i) => hexOf(pal, i));
    A.push(article({
      slug: `colors/${pal}`,
      title: `${cap(pal)} palette — ${V.label}`,
      section: 'colors',
      category: 'Colors · Palettes',
      tags: ['colors', 'palette', pal],
      keywords: [`${pal} color`, `${pal} palette`, pal, 'রঙ'],
      summary: `The complete ${pal} palette in ${V.label}: ${shadesArr.length} shades with hex values, usage roles, contrast guidance and copy-paste examples.`,
      hub: 'colors/index',
      popularity: 0.6 + (isV1 ? 0 : ['blue', 'slate', 'indigo', 'emerald', 'rose'].includes(pal) ? 0.3 : 0),
      blocks: [
        p(`**${cap(pal)}** is ${paletteIntro(pal)} ${paletteCharacter(pal)}.`),
        h2('Shades'),
        swatches(pal, shadesArr, colorsArr),
        h2('Palette table'),
        table(['Shade', 'Class fragment', 'Value', 'Best role'], shadesArr.map((s, i) => [`\`${s}\``, `\`${pal}-${s}\``, `\`${colorsArr[i]}\``, shadeRoleText(s)])),
        h2('Use it'),
        code('html', `<div class="bg-${pal}-500 text-white p-6 rounded-xl">${cap(pal)} surface</div>\n<p class="text-${pal}-600 dark:text-${pal}-400">Adaptive text</p>\n<div class="border border-${pal}-200 dark:border-${pal}-800 bg-${pal}-50 dark:bg-${pal}-950 p-4 rounded-lg">Panel</div>`),
        h2('Per-usage guides'),
        cards(usages.map(([uSlug, util, label]) => ({ slug: `colors/${pal}-${uSlug}`, title: `${cap(pal)} ${label.toLowerCase()}s`, desc: `${util}${pal}-* in practice.` }))),
        h2('Contrast'),
        p(`**Flip point:** shades 50–400 want dark text (\`text-slate-900\`); shades 500+${isV1 ? '' : ' (approx.)'} want white text. Verify with the [[accessibility/color-contrast|contrast guide]].`),
        h2('Related palettes'),
        p(neighborLine(pal, palettes))
      ]
    }));
    for (const [uSlug, util, label] of usages) {
      A.push(article({
        slug: `colors/${pal}-${uSlug}`,
        title: `${cap(pal)} ${label.toLowerCase()} colors — ${V.label}`,
        section: 'colors',
        category: 'Colors · Palettes',
        tags: ['colors', 'palette', pal, uSlug],
        keywords: [`${pal} ${uSlug}`, `${util}${pal}`, 'color'],
        summary: `Using the ${pal} palette for ${label.toLowerCase()}s in ${V.label}: recommended shades, examples and dark-mode variants.`,
        hub: `colors/${pal}`,
        blocks: [
          p(`${label} usage for the [[colors/${pal}|${pal} palette]] — the shades that earn their place.`),
          h2('Recommended shades'),
          table(['Shade', `Use it for`], usageShades(uSlug, pal)),
          h2('Example'),
          code('html', usageExample(uSlug, pal, util)),
          h2('Dark mode'),
          p(uSlug === 'text' ? `On dark surfaces, shift two shades lighter: \`text-${pal}-600\` in light mode becomes \`dark:text-${pal}-400\`.` : uSlug === 'background' ? `Darken surfaces in dark mode: \`bg-${pal}-50\` → \`dark:bg-${pal}-950\`.` : `Borders go deeper in dark mode: \`border-${pal}-200\` → \`dark:border-${pal}-800\`.`),
          h2('Related'),
          p(`[[colors/${pal}|${cap(pal)} hub]] · [[colors/index|Color system]]`)
        ]
      }));
    }
    // shade profiles
    for (let i = 0; i < shadesArr.length; i++) {
      const s = shadesArr[i];
      A.push(article({
        slug: `colors/${pal}-${s}`,
        title: `${cap(pal)} ${s} — shade profile`,
        section: 'colors',
        category: 'Colors · Shades',
        tags: ['colors', 'palette', pal, 'shade'],
        keywords: [`${pal} ${s}`, `${pal}-${s}`, hexOf(pal, i), 'shade'],
        summary: `${cap(pal)}-${s} (\`${hexOf(pal, i)}\`): where this shade of the ${pal} palette shines — roles, pairings, contrast and examples in ${V.label}.`,
        hub: `colors/${pal}`,
        blocks: [
          p(`\`${pal}-${s}\` is step ${s} of the [[colors/${pal}|${pal} palette]]${isV1 ? ' in the v1 design system' : ''} — ${shadeRoleText(s).toLowerCase()}`),
          h2('Token'),
          table(['Property', 'Value'], [
            ['Class fragment', `\`${pal}-${s}\``],
            ['Approximate value', `\`${hexOf(pal, i)}\``],
            ['CSS variable', isV1 ? `\`--${pal}-${s}\`` : `\`--color-${pal}-${s}\``],
            ['Text on top', Number(s) <= 400 ? '`text-slate-900` (dark text)' : '`text-white`'],
            ['Role', shadeRoleText(s)]
          ]),
          h2('In a layout'),
          code('html', shadeExample(pal, s)),
          h2('Neighbors'),
          p(`Darker: [[colors/${pal}-${shadesArr[Math.min(i + 1, shadesArr.length - 1)]}|${pal}-${shadesArr[Math.min(i + 1, shadesArr.length - 1)]}]] · Lighter: [[colors/${pal}-${shadesArr[Math.max(i - 1, 0)]}|${pal}-${shadesArr[Math.max(i - 1, 0)]}]] · [[colors/${pal}|Palette hub]]`)
        ]
      }));
    }
  }
  return A;
}

function paletteCharacter(pal) {
  const map = {
    slate: 'Cool blue-gray — the default neutral for modern UIs.',
    gray: 'Pure neutral gray — maximally quiet.',
    zinc: 'Slightly cool metallic gray — great for developer tools.',
    neutral: 'True neutral — no hue at all.',
    stone: 'Warm gray with an earthy cast.',
    red: 'The alarm color — errors, destructive actions, urgency.',
    orange: 'Energetic and warm — warnings and bold CTAs.',
    amber: 'Golden — caution, highlights, rating stars.',
    yellow: 'Bright attention — markers, badges, sunlight.',
    lime: 'Electric green-yellow — energy and freshness.',
    emerald: 'Jewel green — success, money, growth.',
    green: 'Pure green — confirmation and nature.',
    teal: 'Blue-green balance — calm precision.',
    cyan: 'Aqua — technical clarity and cool accents.',
    sky: 'Daylight blue — openness and lightness.',
    blue: 'The classic UI blue — trust, links, primary actions.',
    indigo: 'Deep blue-violet — sophistication and focus.',
    violet: 'Royal purple — creativity and premium feel.',
    purple: 'Classic purple — imagination and luxury.',
    fuchsia: 'Magenta punch — bold highlights.',
    pink: 'Playful warmth — consumer and social.',
    rose: 'Red-pink romance — alerts with elegance.',
    // v1
    'neon-purple': 'Electric violet from the v1 neon family.',
    'neon-pink': 'Hot magenta glow of the v1 neon family.',
    'neon-cyan': 'The signature v1 accent — glowing aqua.',
    'neon-lime': 'Acid green energy from the v1 neon family.',
    'neon-orange': 'Burning amber from the v1 neon family.',
    'pastel-rose': 'Soft pink from the v1 pastel family.',
    'pastel-lavender': 'Dreamy violet from the v1 pastel family.',
    'pastel-mint': 'Fresh green from the v1 pastel family.',
    'pastel-peach': 'Warm apricot from the v1 pastel family.',
    'pastel-sky': 'Powder blue from the v1 pastel family.',
    mono: 'The v1 neutral workhorse — inks and surfaces.',
    'minimal-ice': 'Icy near-white for minimalist sections.',
    forest: 'Deep botanical green.',
    earth: 'Clay and soil browns.',
    ocean: 'Deep marine blue.',
    sunset: 'Golden-hour orange.',
    'brutal-red': 'Aggressive flat red for brutalist layouts.',
    'brutal-yellow': 'Warning-tape yellow.',
    'brutal-blue': 'Unapologetic primary blue.'
  };
  return map[pal] || 'A Nakshora palette.';
}

function paletteIntro(pal) {
  return `one of the color families shipped with this release.`;
}

function shadeRoleText(s) {
  return SHADE_ROLE[Number(s)] || '';
}

function neighborLine(pal, palettes) {
  const i = palettes.indexOf(pal);
  const prev = palettes[(i - 1 + palettes.length) % palettes.length];
  const next = palettes[(i + 1) % palettes.length];
  return `[[colors/${prev}|${prev}]] · [[colors/${next}|${next}]] · [[colors/color-pairing|Pairing recipes]]`;
}

function usageShades(u, pal) {
  if (u === 'text') return [['100–300', 'Headlines on dark surfaces'], ['400–500', 'Secondary text on dark'], ['600–700', 'Body text on light surfaces'], ['800–900', 'Headings on light surfaces']];
  if (u === 'background') return [['50–100', 'Page and panel backgrounds'], ['200–300', 'Hover states, active rows'], ['500–600', 'Buttons and fills'], ['800–950', 'Dark sections and footers']];
  if (u === 'border') return [['100–200', 'Hairlines on light UI'], ['300–400', 'Visible borders on light'], ['700–800', 'Borders on dark UI'], ['500', 'Accent rings and focus borders']];
  return [['200–400', 'Soft gradient starts'], ['500', 'The midpoint stop'], ['600–800', 'Deep gradient ends']];
}

function usageExample(u, pal, util) {
  if (u === 'text') return `<p class="text-${pal}-700 dark:text-${pal}-300">Adaptive copy</p>\n<a class="text-${pal}-600 hover:text-${pal}-500 underline">A link</a>`;
  if (u === 'background') return `<div class="bg-${pal}-600 hover:bg-${pal}-500 text-white px-4 py-2 rounded-lg">Action</div>\n<section class="bg-${pal}-50 dark:bg-${pal}-950 p-8">Tinted section</section>`;
  if (u === 'border') return `<div class="border border-${pal}-200 dark:border-${pal}-800 rounded-xl p-4">Card</div>`;
  return `<div class="bg-gradient-to-r from-${pal}-400 to-${pal}-700 h-20 rounded-xl"></div>`;
}

function shadeExample(pal, s) {
  const n = Number(s);
  if (n <= 100) return `<section class="bg-${pal}-${s} text-slate-900 p-10">Tinted surface</section>`;
  if (n <= 400) return `<span class="bg-${pal}-${s} text-slate-900 px-3 py-1 rounded-full text-sm">Badge</span>`;
  if (n <= 600) return `<button class="bg-${pal}-${s} hover:bg-${pal}-${Math.min(n + 100, 900)} text-white px-5 py-2.5 rounded-lg">Primary</button>`;
  return `<footer class="bg-${pal}-${s} text-white p-8">Deep surface</footer>`;
}

function colorPatterns(slug) {
  const map = {
    'colors/text-color': ['Body text: `text-slate-600 dark:text-slate-400`', 'Links: the dominant palette at 600, hover 500', 'Never pure black — `text-slate-950` is softer'],
    'colors/background-color': ['Page: `bg-white dark:bg-slate-950`', 'Sections alternate: `bg-slate-50 dark:bg-slate-900`', 'CTAs: dominant 500 → hover 600'],
    'colors/border-color': ['Hairlines: `border-slate-200 dark:border-slate-800`', 'Focus: `ring-2 ring-blue-500`', 'Dividers: `divide-y divide-slate-100`'],
    'colors/gradient-color': ['Buttons: `from-blue-500 to-indigo-600`', 'Text: bg-clip-text + transparent', 'Keep gradients ≤3 stops'],
    'colors/fill-stroke-color': ['Icons inherit via fill-current', 'Charts: one palette, shades for series'],
    'colors/caret-accent-color': ['Match accent to the primary palette', 'caret for brand-flavored inputs']
  };
  return map[slug] || [];
}
