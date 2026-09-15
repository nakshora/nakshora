// ---------------------------------------------------------------------------
// Provider: variants (state prefixes) and the responsive system.
// ---------------------------------------------------------------------------
import { article, p, h2, code, list, table, callout, cards, cap } from '../lib/model.mjs';

export function variantArticles(V) {
  const A = [];
  const isV1 = V.id === 'v1.0';
  const isV2 = V.id === 'v2.0';

  A.push(article({
    slug: 'variants/index',
    title: `Variants — ${V.label}`,
    section: 'variants',
    category: 'Variants',
    tags: ['variants', 'reference'],
    keywords: ['variants', 'hover', 'focus', 'dark', 'group', 'peer', 'state'],
    summary: `${V.variantCount ? `${V.variantCount} variants` : 'State and screen variants'} in ${V.label}: prefix any utility to target hover, focus, dark mode, parents, siblings and more.`,
    order: 8,
    blocks: [
      p(`Variants are prefixes that add a condition to a utility: \`hover:bg-blue-600\` applies only on hover. ${isV1 ? 'v1 ships only responsive prefixes — state styling is component-baked.' : isV2 ? 'v2 supports responsive prefixes plus a small state set.' : `${V.label} ships **${V.variantCount || V.variants.length}+ variants**, and they stack without limit: \`md:dark:group-hover:text-white\`.`}`),
      h2('The stacking order'),
      code('text', '[screens] [conditions] utility\nmd: dark: group-hover: bg-blue-500\n│    │      │            └─ what\n│    │      └─ under what state\n│    └─ under what scheme\n└─ above what width'),
      h2('Families'),
      cards(
        isV1
          ? [{ slug: 'variants/responsive-prefixes', title: 'Responsive prefixes', desc: 'In v1 the screens ARE the variants — state styling is component-baked.' }]
          : [
              { slug: 'variants/hover', title: 'hover', desc: 'The workhorse interaction state.' },
              { slug: 'variants/focus', title: 'focus & focus-visible', desc: 'Keyboard and mouse focus.' },
              { slug: 'variants/dark', title: 'dark', desc: 'Scheme variants.' },
              ...(V.id === 'v2.0'
                ? []
                : [
                    { slug: 'variants/group', title: 'group-*', desc: 'Parent-driven states.' },
                    { slug: 'variants/peer', title: 'peer-*', desc: 'Sibling-driven states.' },
                    { slug: 'variants/structural', title: 'first / last / odd / even', desc: 'Position-based styling.' }
                  ])
            ]
      ),
      callout('tip', 'If you can say it in CSS, you can prefix it in Nakshora. Arbitrary variants `[&>*]:p-2` cover everything else (3.x).')
    ]
  }));

  if (isV1) {
    A.push(article({
      slug: 'variants/responsive-prefixes',
      title: 'Responsive prefixes in v1',
      section: 'variants',
      category: 'Variants',
      tags: ['variants', 'responsive', 'v1'],
      keywords: ['responsive prefixes', 'v1', 'screens'],
      summary: 'v1 variants are its screens: sm:, md:, lg:, xl:, xxl:, uhd:, k8: — mobile-first, stackable.',
      hub: 'variants/index',
      blocks: [
        p('v1 has no state variants; its variant system is its **screen prefixes**.'),
        code('html', '<div class="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">…</div>'),
        p('See [[responsive/index|Responsive design]] for the full screen table.'),
        callout('note', 'State styling in v1 lives inside components (`btn-neon` includes its own hover) or your own CSS.')
      ]
    }));
    return A;
  }

  const varFams = [
    ['hover', 'hover:', 'Applies while the pointer is over the element.', '<button class="bg-blue-500 hover:bg-blue-600 transition">Save</button>', ['Combine with `transition` for smoothness', '`group-hover` styles children when the PARENT is hovered — see [[variants/group|group]]'], ['Hover-only affordances hide functionality from touch and keyboard users — always pair with focus/visible states']],
    ['focus', 'focus: & focus-visible:', 'focus = any focus; focus-visible = keyboard-only focus (the browser decides).', '<input class="focus:ring-2 focus:ring-blue-500 rounded-lg" />\n<button class="focus-visible:outline focus-visible:outline-2">Tab to me</button>', ['Use `focus-visible` for buttons, `focus` for inputs', 'Never `outline-none` without a visible replacement'], ['Removing focus styles breaks keyboard users (WCAG 2.4.7)']],
    ['focus-within', 'focus-within:', 'Matches when ANY descendant has focus — perfect for field wrappers.', '<label class="flex border rounded-lg focus-within:ring-2 focus-within:ring-blue-500">\n  <span class="px-3 py-2 bg-slate-100">$</span>\n  <input class="flex-1 px-2 py-2 outline-none" placeholder="Amount" />\n</label>', ['Field-group highlighting without JS'], []],
    ['active', 'active:', 'While the element is being pressed.', '<button class="active:scale-95 transition">Press</button>', ['active:scale-95 = tactile press feedback'], []],
    ['disabled-checked', 'disabled: / checked: / required:', 'Form control states.', '<input disabled class="disabled:opacity-50 disabled:cursor-not-allowed" />\n<input type="checkbox" class="checked:bg-blue-500" />', ['Style disabled rather than hide — users learn what exists'], []],
    ['dark', 'dark:', 'Applies in dark scheme (class or media strategy).', '<body class="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">', ['Systematize: surfaces 950/900, text 100/300, borders 800', 'Read [[concepts/dark-mode-strategies|Dark mode strategies]]'], ['Forgetting images/shadows in dark mode glares']],
    ['group', 'group & group-*:', 'Mark a parent `group`; children react to ITS state.', '<a class="group flex items-center gap-2">\n  <span>Docs</span>\n  <span class="opacity-0 group-hover:opacity-100 transition">→</span>\n</a>', ['Reveal-on-hover affordances', 'group-hover, group-focus, group-active, group-disabled' + (V.id === 'v3.1' ? ', and named groups `group/name`' : '')], []],
    ['peer', 'peer & peer-*:', 'Mark a sibling `peer`; later siblings react to ITS state.', '<input id="tos" type="checkbox" class="peer sr-only" />\n<label for="tos" class="peer-checked:bg-blue-500 block w-10 h-6 rounded-full"></label>', ['Custom checkboxes/toggles with zero JS', 'peer must come BEFORE the styled sibling in DOM order'], []],
    ['structural', 'first / last / only / odd / even:', 'Position among siblings.', '<ul class="divide-y">\n  <li class="first:pt-0 last:pb-0 odd:bg-slate-50">Row</li>\n</ul>', ['odd:/even: replace zebra-striping CSS', 'first:/last: fix edge padding in divided lists'], []],
    ['pseudo-elements', 'before: / after: / selection: / marker:', 'Pseudo-element variants (content comes from the content utility).', '<span class="before:content-[\'★\'] before:text-amber-400">Rated</span>', ['Arbitrary content: before:content-[\'→\']', 'selection: brands your text highlight'], []],
    ['aria-data', 'aria-* & data-*:', 'Match ARIA state or data attributes.', '<button aria-expanded="true" class="aria-expanded:bg-blue-50">Menu</button>\n<div data-state="open" class="data-[state=open]:block hidden">', ['Style by semantic state, not JS class juggling', V.id === 'v3.1' ? 'aria-hidden:, aria-selected:, data-[anything]:' : 'Attribute variants'], []],
    ['has', 'has-*:', 'The parent selector — style a parent by its children.', '<label class="has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 border rounded-lg p-4">\n  <input type="checkbox" /> Selectable card\n</label>', ['Selectable cards without JS', 'has-[.error] for form validation styling'], []],
    ['supports', 'supports-*:', 'Feature queries as variants.', '<div class="supports-[backdrop-filter]:bg-white/50 bg-white">Progressive</div>', ['Progressive enhancement one-liners'], []],
    ['motion', 'motion-safe / motion-reduce:', 'prefers-reduced-motion as a variant.', '<div class="motion-safe:animate-bounce">Respects user motion preference</div>', ['Gate ALL animations behind motion-safe:', 'motion-reduce:transition-none kills transitions globally'], []],
    ['print', 'print:', 'Print stylesheet variants.', '<nav class="print:hidden">Hidden on paper</nav>', ['print:hidden for chrome; print:block for print-only content'], []],
    ['not-star', 'not-* & *:', 'Negation and the universal variant.', '<div class="*:p-2 not-last:border-b">All children padded; all but last bordered</div>', ['*: applies the utility to every child', V.id === 'v3.1' ? 'not-hover:, not-focus: — invert any variant' : ''], []],
    ['arbitrary-variants', 'Arbitrary variants', 'Any selector as a variant: [&>*], [&:nth-child(3)].', '<ul class="[&>li]:py-2 [&>li:nth-child(3)]:font-bold">\n  <li>targeted</li>\n</ul>', ['Escape hatch when no named variant fits'], []]
  ];

  const include = isV2
    ? varFams.filter(([slug]) => ['hover', 'focus', 'dark'].includes(slug))
    : V.id === 'v3.0'
      ? varFams.filter(([slug]) => !['has', 'supports', 'not-star', 'arbitrary-variants', 'aria-data'].includes(slug))
      : varFams;

  for (const [slug, title, desc, example, tips, mistakes] of include) {
    A.push(article({
      slug: `variants/${slug}`,
      title: `${title} — ${V.label}`,
      section: 'variants',
      category: 'Variants',
      tags: ['variants', slug],
      keywords: [title.toLowerCase(), 'variant', 'prefix'],
      summary: `${desc} Complete guide to these variants in ${V.label} with examples, stacking rules and pitfalls.`,
      hub: 'variants/index',
      blocks: [
        p(desc),
        h2('Example'),
        code('html', example),
        h2('Stacking'),
        p(`Prefix order is screens → variants → utility. These variants combine with every screen (${V.screens.map((s) => `\`${s.name}:\``).slice(0, 4).join(' ')}…) and with each other.`),
        ...(tips.length ? [h2('Best practices'), list(tips)] : []),
        ...(mistakes.length ? [h2('Common mistakes'), list(mistakes)] : []),
        h2('Related'),
        p('[[variants/index|Variants hub]] · [[responsive/index|Responsive]] · [[utilities/index|Utilities]]')
      ]
    }));
  }
  return A;
}

export function responsiveArticles(V) {
  const A = [];
  const isV1 = V.id === 'v1.0';
  const maxVariants = V.id === 'v3.1';
  const containerQueries = V.id === 'v3.1';

  A.push(article({
    slug: 'responsive/index',
    title: `Responsive design — ${V.label}`,
    section: 'responsive',
    category: 'Responsive',
    tags: ['responsive', 'reference', 'mobile-first'],
    keywords: ['responsive', 'breakpoints', 'media queries', 'mobile first', 'screens'],
    summary: `The ${V.label} responsive system: ${V.screenCount} screens from ${V.screens[0].name}:${V.screens[0].min}px${maxVariants ? ', max-* variants and container queries' : ''} — mobile-first by design.`,
    order: 6,
    blocks: [
      p(`Nakshora is mobile-first: unprefixed utilities apply everywhere, and each screen prefix layers an override **from that width up**. No media-query code, ever.`),
      h2('The screens'),
      table(['Prefix', 'Min width', 'Targets', 'Example'], V.screens.map((s) => [`\`${s.name}:\``, `${s.min}px`, s.desc, `\`${s.name}:grid-cols-2\``])),
      h2('Mental model'),
      code('html', `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">\n  <!--\n    base : 1 column   (< ${V.screens[1]?.min || 640}px)\n    sm:  : 2 columns  (≥ ${V.screens[1]?.min || 640}px)\n    lg:  : 4 columns  (≥ ${V.screens.find((s) => s.name === 'lg')?.min || 1024}px)\n  -->\n</div>`),
      h2('The three rules'),
      list([
        'Style the smallest screen first (no prefix).',
        'Each prefix ADDS from its width up — you never undo.',
        'Test at the breakpoints between screens, not only on them.'
      ]),
      ...(maxVariants
        ? [
            h2('Beyond min-width'),
            cards([
              { slug: 'responsive/max-variants', title: 'max-* variants', desc: 'Target BELOW a breakpoint.' },
              { slug: 'responsive/container-queries', title: 'Container queries', desc: '@container, @md: component queries.' },
              { slug: 'responsive/custom-breakpoints', title: 'Custom breakpoints', desc: 'theme.breakpoints extension.' }
            ])
          ]
        : []),
      callout('tip', `Design content-first: let YOUR content choose breakpoints. The defaults cover 95% of products — see [[responsive/breakpoint-strategy|breakpoint strategy]].`)
    ]
  }));

  // per-screen articles
  for (const s of V.screens) {
    if (s.name === 'base') continue;
    A.push(article({
      slug: `responsive/${sanitize(s.name)}`,
      title: `The ${s.name}: screen (${s.min}px)`,
      section: 'responsive',
      category: 'Responsive · Screens',
      tags: ['responsive', 'screens', s.name],
      keywords: [`${s.name} breakpoint`, `${s.min}px`, 'screen', s.name],
      summary: `The ${s.name}: prefix in ${V.label}: applies from ${s.min}px up. Targets ${s.desc}. Examples, patterns and what typically changes at this width.`,
      hub: 'responsive/index',
      blocks: [
        p(`\`${s.name}:\` targets **${s.desc}** — everything from **${s.min}px** wide. ${screenEssay(s.name)}`),
        h2('What usually changes here'),
        list(screenChanges(s.name)),
        h2('Example'),
        code('html', `<div class="${screenExample(s.name, V)}">…</div>`),
        h2('Combining'),
        p(`Stack with the other screens and with variants: \`${s.name}:hover:bg-blue-600\`${V.jit ? ', `dark:' + s.name + ':bg-slate-900`' : ''}. Order: screen first, then state.`),
        h2('Related screens'),
        p(neighborScreens(s.name, V))
      ]
    }));
  }

  if (maxVariants) {
    A.push(article({
      slug: 'responsive/max-variants',
      title: 'max-* variants — below a breakpoint',
      section: 'responsive',
      category: 'Responsive',
      tags: ['responsive', 'max-variants'],
      keywords: ['max-md', 'max-width variant', 'below breakpoint'],
      summary: 'max-sm:, max-md:, max-lg:… apply BELOW a breakpoint — the complement of min-width screens, compiled at px-0.02 for gapless coverage.',
      hub: 'responsive/index',
      blocks: [
        p('Sometimes a rule is genuinely "small screens only" — `max-*` variants express that directly.'),
        code('html', '<nav class="hidden max-md:flex">Mobile-only nav element</nav>\n<div class="p-2 max-sm:p-1">Tighter on the smallest phones</div>'),
        h2('How it compiles'),
        code('css', '/* max-md:p-2 */\n@media (max-width: 767.98px) { .max-md\\:p-2 { padding: 0.5rem } }'),
        h2('When to use which'),
        table(['Goal', 'Use'], [
          ['Add style as screens grow', 'min-width prefixes (`md:`)'],
          ['Remove/simplify below a width', '`max-*` prefixes'],
          ['Hide on phones', '`max-md:hidden` OR `hidden md:block` — pick one convention']
        ]),
        callout('warn', 'Do not mix both conventions for the same element — teams pick ONE and document it.')
      ]
    }));
    A.push(article({
      slug: 'responsive/container-queries',
      title: 'Container queries (@container)',
      section: 'responsive',
      category: 'Responsive',
      tags: ['responsive', 'container-queries'],
      keywords: ['container queries', '@container', 'component responsive'],
      summary: 'Component-level responsiveness: @container marks a sizing context, @md:/@min-*/@max-* respond to the CONTAINER, not the viewport.',
      hub: 'responsive/index',
      blocks: [
        p('Viewport breakpoints lie inside sidebars and split panes. Container queries fix it: styles respond to the **nearest container\'s width**.'),
        code('html', '<aside class="@container">\n  <div class="grid grid-cols-1 @md:grid-cols-2 gap-4">\n    <!-- two columns when the SIDEBAR is ≥ 768px, whatever the viewport -->\n  </div>\n</aside>'),
        h2('The grammar'),
        table(['Syntax', 'Meaning'], [
          ['`@container`', 'Establish a container context'],
          ['`@md:flex`', 'From container width 768px (screen names reused)'],
          ['`@min-[400px]:grid`', 'Arbitrary min container width'],
          ['`@max-lg:hidden`', 'Below container width 1024px']
        ]),
        h2('When to use'),
        list(['Widgets embedded at multiple widths (cards, sidebars)', 'Design-system components that must adapt to their slot', 'Anywhere `md:` would be wrong inside a narrow column']),
        callout('note', 'Container queries are the modern answer to "the component should be responsive, not the page."')
      ]
    }));
    A.push(article({
      slug: 'responsive/custom-breakpoints',
      title: 'Custom breakpoints',
      section: 'responsive',
      category: 'Responsive',
      tags: ['responsive', 'configuration'],
      keywords: ['custom breakpoints', 'theme.breakpoints', 'extend screens'],
      summary: 'Add or replace screens through theme.breakpoints — naming, ordering and the px-0.02 rule.',
      hub: 'responsive/index',
      blocks: [
        p('The built-in scale covers most products. When your content demands a custom width:'),
        code('js', `export default {\n  theme: {\n    extend: {\n      screens: {\n        'tall': { raw: '(min-height: 800px)' },\n        '3col': '1440px',\n      },\n    },\n  },\n};`, 'nakshora.config.js'),
        list(['Keep names short and ordered (`xs` < `sm` < `md`…)', 'Custom screens stack with all variants', 'Raw media queries support height, orientation, prefers-*']),
        h2('Historical note'),
        p('v1\'s `uhd:`/`k8:` screens became unnecessary: 3.1 ships `4xl:2560` and `5xl:5000` built in.')
      ]
    }));
  }

  A.push(article({
    slug: 'responsive/breakpoint-strategy',
    title: 'Breakpoint strategy',
    section: 'responsive',
    category: 'Responsive',
    tags: ['responsive', 'strategy', 'best-practices'],
    keywords: ['breakpoint strategy', 'when to add breakpoints', 'responsive patterns'],
    summary: 'How to choose breakpoints like a professional: content-first sizing, the three-device myth, and audit techniques.',
    hub: 'responsive/index',
    blocks: [
      p('Amateurs pick breakpoints from device lists. Professionals pick them from **content breakpoints** — the widths where YOUR layout becomes uncomfortable.'),
      h2('The workflow'),
      list([
        'Build the mobile layout completely (no prefixes).',
        'Grow the viewport; note where it breaks.',
        'Fix THAT break with the nearest screen prefix.',
        'Repeat until 2560px.',
        'Only then check real analytics widths.'
      ]),
      h2('The three-device myth'),
      p('There are not three screen sizes. There are hundreds. The Nakshora scale (ten screens) exists so you almost never need a custom one — but the workflow above is what keeps markup clean.'),
      h2('Audit'),
      code('text', 'Questions per breakpoint:\n- Does navigation collapse/expand here?\n- Do cards reflow here?\n- Does type scale here?\n- Does padding breathe here?'),
      callout('pro', 'Keep a WRITTEN breakpoint contract in your design system docs: what changes at each screen. This page is a template.')
    ]
  }));
  return A;
}

function sanitize(n) {
  return n.replace(/[^a-z0-9]/gi, '');
}

function screenEssay(name) {
  const map = {
    xxs: 'Wearables, folded outer screens and embedded widgets. Rarely styled explicitly — but when you do, xxs: beats a magic-number media query.',
    xs: 'Small phones (400px+): the first place a two-up layout becomes thinkable, and where compact padding starts paying off.',
    sm: 'Large phones in landscape and small tablets. The classic "cards go two-up" breakpoint.',
    md: 'Tablets portrait — navigation often unfolds here, sidebars appear, and reading columns widen.',
    lg: 'Laptops. The desktop layout usually lands here: multi-column grids, persistent navbars, side panels.',
    xl: 'Desktops with room: wider containers, more columns, expanded dashboards.',
    '2xl': 'Large desktops. Watch line lengths — widen containers, not fonts.',
    '3xl': 'Full HD monitors and TVs: verify whitespace scales so layouts do not look stranded.',
    '4xl': 'QHD/2K: dashboards and data walls. Consider max-w caps for reading content.',
    '5xl': '4K+, video walls, ultra-wide. Mostly a guard rail: cap or center the layout.'
  };
  return map[name] || '';
}

function screenChanges(name) {
  const map = {
    xxs: ['Simplify to single columns', 'Enlarge tap targets'],
    xs: ['Chip rows wrap less aggressively', '2-column micro-grids become viable'],
    sm: ['Cards: 1 → 2 columns', 'Navbars may unfold partially', 'Padding steps up (p-4 → p-6)'],
    md: ['Hamburger → inline nav', 'Sidebars appear', 'Grids: 2 → 3 columns', 'Tables stop horizontal-scrolling'],
    lg: ['The canonical desktop layout', 'Grids: 3 → 4 columns', 'Hero sections go side-by-side'],
    xl: ['Wider containers (max-w-screen-xl)', 'Extra dashboard columns'],
    '2xl': ['Expanded rails and galleries', 'max-w-7xl containers'],
    '3xl': ['Whitespace rebalancing', 'TV-mode type bumps (optional)'],
    '4xl': ['Cap reading columns', 'Multi-pane app layouts'],
    '5xl': ['Center or cap; avoid stretching']
  };
  return map[name] || ['Layout adjustments appropriate to this width'];
}

function screenExample(name, V) {
  const ex = {
    xxs: 'grid grid-cols-1 xxs:grid-cols-2 gap-2',
    xs: 'flex flex-col xs:flex-row gap-4',
    sm: 'grid grid-cols-1 sm:grid-cols-2 gap-4',
    md: 'flex-col md:flex-row',
    lg: 'grid grid-cols-2 lg:grid-cols-4 gap-6',
    xl: 'container mx-auto px-6 xl:px-8',
    '2xl': 'max-w-7xl mx-auto 2xl:max-w-none 2xl:px-12',
    '3xl': 'py-16 3xl:py-24',
    '4xl': 'grid-cols-3 4xl:grid-cols-4',
    '5xl': 'container 5xl:max-w-[2400px]'
  };
  return ex[name] || 'p-4 md:p-8';
}

function neighborScreens(name, V) {
  const idx = V.screens.findIndex((s) => s.name === name);
  const prev = V.screens[idx - 1];
  const next = V.screens[idx + 1];
  const parts = [];
  if (prev) parts.push(`[[responsive/${sanitize(prev.name)}|${prev.name}: (${prev.min}px)]]`);
  if (next) parts.push(`[[responsive/${sanitize(next.name)}|${next.name}: (${next.min}px)]]`);
  parts.push('[[responsive/breakpoint-strategy|Breakpoint strategy]]');
  return parts.join(' · ');
}
