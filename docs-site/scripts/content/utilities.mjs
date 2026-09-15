// ---------------------------------------------------------------------------
// Provider: utility reference — per family, data-driven.
// v3.x tables come from ai/corpus.json (the real compiler registry).
// v1 tables come from the frozen v1.0.0.css scan; v2 from documented scales.
// ---------------------------------------------------------------------------
import { article, p, h2, h3, code, list, table, callout, cap } from '../lib/model.mjs';

export function utilityArticles(V, ctx) {
  const A = [];
  const corpus = ctx.corpus; // categories: [{name, utilities:[{class,css}]}]
  const byCategory = {};
  if (corpus) for (const c of corpus) byCategory[c.name] = c.utilities || [];

  const classesMatching = (re, limit = 60) => {
    const out = [];
    for (const cat of Object.values(byCategory)) {
      for (const u of cat) if (re.test(u.class)) out.push([`\`${u.class}\``, `\`${u.css.split('{')[1]?.replace('}', '').trim() || u.css}\``]);
      if (out.length > limit * 2) break;
    }
    return out.slice(0, limit);
  };

  const countMatching = (re) => {
    let n = 0;
    for (const cat of Object.values(byCategory)) for (const u of cat) if (re.test(u.class)) n++;
    return n;
  };

  // ------------------------------------------------------------------- hub
  A.push(article({
    slug: 'utilities/index',
    title: `Utilities reference — ${V.label}`,
    section: 'utilities',
    category: 'Utilities',
    tags: ['utilities', 'reference'],
    keywords: ['utilities', 'classes', 'reference', 'css classes', 'list'],
    summary: `The complete ${V.label} utilities reference: ${V.utilityCount.toLocaleString('en-US')} classes across ${V.categoryCount} categories, each with generated CSS, examples, responsive patterns and pitfalls.`,
    order: 1,
    blocks: [
      p(`This reference documents **every utility ${V.label} can produce**${V.jit ? ' — the tables are generated from the compiler registry itself, so they can never drift from the engine' : ''}. ${V.utilityCount.toLocaleString('en-US')} classes, ${V.categoryCount} categories.`),
      h2('How to read this reference'),
      list([
        'Each family page lists its classes with the exact CSS they compile to.',
        'Responsive: prefix any class with a screen (`' + (V.id === 'v1.0' ? 'lg:' : 'md:') + 'p-4`) — see [[responsive/index|Responsive design]].',
        V.jit ? 'State variants prefix the same way (`hover:bg-blue-500`) — see [[variants/index|Variants]].' : 'State styling in this release: see the variants section.',
        'Every page ends with related links — follow them; they are how the reference connects.'
      ]),
      h2('Categories'),
      table(['Category', 'Start here'], categoryHubRows(V)),
      callout('tip', `Looking for one specific class? Use search (Ctrl K / ⌘ K) — it matches class names, CSS properties and concepts in every language.`)
    ]
  }));

  if (V.id === 'v3.0' || V.id === 'v3.1') {
    for (const fam of FAMILY_SPECS) {
      A.push(familyArticle(V, fam, classesMatching, countMatching));
    }
  } else if (V.id === 'v1.0') {
    for (const fam of v1Families(ctx.v1Classes)) {
      A.push(v1FamilyArticle(V, fam));
    }
  } else {
    for (const fam of v2Families()) {
      A.push(v2FamilyArticle(V, fam));
    }
  }
  return A;
}

function categoryHubRows(V) {
  if (V.id === 'v1.0') {
    return [
      ['Layout & display', '`display` `grid` `flex` `w-*` `h-*` `max-w-*` — [[utilities/layout/display|Display]]'],
      ['Spacing', '`m-*` `p-*` `gap-*` with the --space-0…9 scale — [[utilities/spacing/padding|Padding]]'],
      ['Colors', '19 palettes as `text-*`/`bg-*`/`border-*` — [[colors/index|Colors]]'],
      ['Typography', 'fluid `text-*` scale, weights, leading — [[utilities/typography/font-size|Font size]]'],
      ['Components', 'buttons, cards, glass, accordion… — [[components/index|Design components]]'],
      ['Effects', 'opacity, scale, rotate, brightness, saturate, shadows — [[utilities/effects/shadows|Shadows]]']
    ];
  }
  return [
    ['Layout', '[[utilities/layout/display|Display]] · [[utilities/layout/position|Position]] · [[utilities/layout/z-index|Z-index]] · [[utilities/layout/overflow|Overflow]]'],
    ['Spacing', '[[utilities/spacing/padding|Padding]] · [[utilities/spacing/margin|Margin]] · [[utilities/spacing/gap|Gap]]'],
    ['Sizing', '[[utilities/sizing/width|Width]] · [[utilities/sizing/height|Height]] · [[utilities/sizing/size|Size]]'],
    ['Flexbox & Grid', '[[utilities/flexbox/flex-direction|Flex direction]] · [[utilities/grid/grid-template-columns|Grid columns]]'],
    ['Typography', '[[utilities/typography/font-size|Font size]] · [[utilities/typography/font-weight|Weight]] · [[utilities/typography/text-align|Alignment]]'],
    ['Colors', '[[colors/index|22 palettes × 11 shades]] with text, background, border, gradient uses'],
    ['Backgrounds', '[[utilities/backgrounds/gradients|Gradients]] · [[utilities/backgrounds/background-size|Size]]'],
    ['Borders', '[[utilities/borders/border-width|Width]] · [[utilities/borders/border-radius|Radius]] · [[utilities/borders/divide|Divide]]'],
    ['Effects', '[[utilities/effects/shadows|Shadows]] · [[utilities/effects/opacity|Opacity]] · [[utilities/effects/filters|Filters]]'],
    ['Transforms', '[[utilities/transforms/scale|Scale]] · [[utilities/transforms/rotate|Rotate]] · [[utilities/transforms/translate|Translate]]'],
    ['Transitions & animations', '[[utilities/transitions/transition-property|Transitions]] · [[utilities/animations/keyframes|Keyframes]]'],
    ['Interactivity', '[[utilities/interactivity/cursor|Cursor]] · [[utilities/interactivity/scroll-snap|Scroll snap]]']
  ];
}

// --------------------------------------------------------------------------
// v3.x family specs: slug, title, category, class regex for corpus table,
// summary, example, tips, mistakes.
// --------------------------------------------------------------------------
const FAMILY_SPECS = [
  // --- layout
  { slug: 'utilities/layout/display', title: 'Display', cat: 'Layout', re: /^(block|inline-block|inline|flex|inline-flex|grid|inline-grid|flow-root|contents|list-item|hidden)$/, summary: 'Control the outer display box of an element: block, inline, flex, grid or none.', example: '<div class="hidden md:flex items-center gap-4">\n  <!-- hidden on phones, flex from md up -->\n</div>', tips: ['`hidden` + a responsive prefix is the canonical show/hide pattern', 'Use `flow-root` to contain floats without clearfix hacks'], mistakes: ['Setting `display: flex` and wondering why `text-align` stopped centering (flex alignment is justify/align, not text-align)'] },
  { slug: 'utilities/layout/position', title: 'Position', cat: 'Layout', re: /^(static|fixed|absolute|relative|sticky)$/, summary: 'Choose the positioning scheme: static, relative, absolute, fixed or sticky.', example: '<div class="relative">\n  <span class="absolute top-0 right-0 badge">NEW</span>\n</div>', tips: ['`relative` on the parent establishes the containing block for `absolute` children', '`sticky` needs a scroll container and an inset utility like `top-0`'], mistakes: ['`absolute` without a positioned ancestor escapes to the viewport-sized initial containing block', '`sticky` inside an `overflow: hidden` parent never sticks'] },
  { slug: 'utilities/layout/inset', title: 'Inset (top / right / bottom / left)', cat: 'Layout', re: /^(-?inset[xy]?-|-?top-|-?right-|-?bottom-|-?left-)/, summary: 'Offset positioned elements with top-*, right-*, bottom-*, left-*, inset-* and the x/y shorthands — including negatives.', example: '<button class="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-xs text-white">3</button>', tips: ['`inset-0` pins an element to all four edges — perfect overlays', 'Negative insets (`-top-4`) build badges, close buttons and overlaps'], mistakes: ['Inset utilities do nothing on `static` elements — set position first'] },
  { slug: 'utilities/layout/z-index', title: 'Z-index & stacking', cat: 'Layout', re: /^z-/, summary: 'Stacking order utilities z-0 through z-50 plus z-auto — and the stacking-context rules that actually decide.', example: '<header class="sticky top-0 z-50">…</header>\n<dialog class="z-[100]">…</dialog>', tips: ['Reserve bands: 0–10 content, 20–30 dropdowns, 40–50 headers, 100+ modals', 'Arbitrary values (`z-[60]`) escape the scale when governance demands it'], mistakes: ['Raising z-index to fight a stacking context created by transform/opacity — fix the context instead'] },
  { slug: 'utilities/layout/overflow', title: 'Overflow', cat: 'Layout', re: /^(overflow|overscroll)-/, summary: 'Control clipping and scrolling per axis: overflow-auto, hidden, visible, scroll, plus overscroll behavior.', example: '<div class="overflow-x-auto">\n  <table class="min-w-full">…</table>\n</div>', tips: ['`overflow-x-auto` is the standard responsive-table wrapper', '`overscroll-contain` stops scroll chaining on modals and drawers'], mistakes: ['`overflow: hidden` on body breaks `position: sticky` descendants'] },
  { slug: 'utilities/layout/float-clear', title: 'Float & clear', cat: 'Layout', re: /^(float|clear)-/, summary: 'Legacy float layout: float-left/right/none with clear utilities and flow-root containment.', example: '<img class="float-left mr-4 mb-2" src="fig.jpg" alt="" />\n<p>Text wraps around the figure…</p>\n<div class="clear-both"></div>', tips: ['Prefer flex/grid for layout; keep floats for text-wrap-around-image effects', '`flow-root` on the parent contains floats without a clear element'], mistakes: ['Floating removes the element from normal flow — siblings slide underneath if not cleared'] },
  { slug: 'utilities/layout/object-fit', title: 'Object fit & object position', cat: 'Layout', re: /^object-/, summary: 'Control how replaced elements (img, video) fill their box: cover, contain, fill, none, scale-down — and where they anchor.', example: '<img class="h-64 w-full object-cover object-center" src="hero.jpg" alt="Sunset over Dhaka" />', tips: ['`object-cover` + fixed height is the canonical card image pattern', 'Pair with `aspect-video` for predictable media slots'], mistakes: ['object-* only affects replaced elements — it does nothing on a div'] },
  { slug: 'utilities/layout/columns', title: 'Multi-column layout', cat: 'Layout', re: /^(columns-|break-before|break-after|break-inside|box-decoration)/, summary: 'CSS multi-column utilities: columns-1 through columns-12, break control and box-decoration-break.', example: '<article class="columns-2 gap-8 [&>p]:break-inside-avoid">\n  <p>Long-form text flows into two columns…</p>\n</article>', tips: ['`break-inside-avoid` keeps cards whole inside columns', 'Column counts respond to breakpoints: `columns-1 md:columns-2 lg:columns-3`'], mistakes: ['Expecting column layout to behave like grid — content flows top-to-bottom per column'] },
  { slug: 'utilities/layout/aspect-ratio', title: 'Aspect ratio', cat: 'Layout', re: /^aspect-/, summary: 'Fixed aspect boxes: aspect-auto, aspect-square, aspect-video and arbitrary ratios like aspect-[4/3].', example: '<iframe class="w-full aspect-video rounded-xl" src="…"></iframe>', tips: ['`aspect-video` (16/9) is the embed standard', 'Combine with `object-cover` children for gallery tiles'], mistakes: ['Setting both height and aspect-ratio — the explicit height wins'] },
  { slug: 'utilities/layout/container', title: 'The container class', cat: 'Layout', re: /^container$/, summary: 'The responsive max-width container: .container centers content and caps width at each breakpoint.', example: '<div class="container mx-auto px-4">\n  <!-- capped width, centered, breathing room -->\n</div>', tips: ['mx-auto centers; px-4 prevents edge-touching on phones', 'From 3.1, container max-widths follow sm…2xl screens'], mistakes: ['Nesting containers — one per layout level is enough'] },
  { slug: 'utilities/layout/isolation', title: 'Isolation & visibility', cat: 'Layout', re: /^(isolate|isolation-auto|visible|invisible|collapse)$/, summary: 'isolate creates a stacking context on demand; invisible/collapse hide while preserving layout.', example: '<div class="isolate">\n  <div class="absolute z-10">…</div>\n</div>', tips: ['`invisible` keeps the box (layout stable); `hidden` removes it', '`isolate` is the surgical alternative to z-index arms races'], mistakes: ['Using `invisible` when you meant `hidden` (or vice versa) — check layout impact'] },

  // --- spacing
  { slug: 'utilities/spacing/spacing-scale', title: 'The spacing scale', cat: 'Spacing', re: null, summary: 'The rem-based scale behind every margin and padding: 0, px, 0.5 … 96 — and how to extend it.', example: 'p-4  →  padding: 1rem\nmt-2.5 → margin-top: 0.625rem\nw-16 → width: 4rem', tips: ['Stay on-scale: 4, 6, 8, 12, 16, 24 are the rhythm points', 'Extend, don\'t fork: theme.extend.spacing keeps the scale coherent'], mistakes: ['Arbitrary pixel values everywhere defeats the design system'] },
  { slug: 'utilities/spacing/padding', title: 'Padding', cat: 'Spacing', re: /^p-[0-9px]/, summary: 'Padding on all sides: p-* with the full spacing scale, responsive and state-aware.', example: '<section class="p-6 md:p-12">\n  <h2 class="pb-4">Room to breathe</h2>\n</section>', tips: ['Section rhythm: p-6 on phones, md:p-12 on desktop', 'padding never collapses — when margins collapse, pad instead'], mistakes: ['Padding on an element with a background you didn\'t intend to enlarge — use margin'] },
  { slug: 'utilities/spacing/padding-x', title: 'Horizontal padding (px)', cat: 'Spacing', re: /^px-/, summary: 'px-* sets padding-left + padding-right in one class.', example: '<button class="px-5 py-2.5 rounded-lg">Balanced button</button>', tips: ['px pairs with py for button rhythm: px-5 py-2.5', 'Use px alone to widen a chip without growing its height'], mistakes: [] },
  { slug: 'utilities/spacing/paddingy', title: 'Vertical padding (py)', cat: 'Spacing', re: /^py-/, summary: 'py-* sets padding-top + padding-bottom in one class.', example: '<header class="py-4 border-b">Compact header</header>', tips: ['Headers live at py-3…py-5; hero sections at py-16…py-24'], mistakes: [] },
  { slug: 'utilities/spacing/padding-top', title: 'Padding top (pt)', cat: 'Spacing', re: /^pt-/, summary: 'pt-* — single-side padding for top edges.', example: '<main class="pt-20">…</main> <!-- clears a fixed header -->', tips: ['pt-16…pt-24 clears fixed navbars'], mistakes: [] },
  { slug: 'utilities/spacing/padding-right', title: 'Padding right (pr)', cat: 'Spacing', re: /^pr-/, summary: 'pr-* — single-side padding for right edges.', example: '<input class="pr-10" /> <!-- room for a trailing icon -->', tips: ['Reserve icon gutters with pr-10'], mistakes: [] },
  { slug: 'utilities/spacing/padding-bottom', title: 'Padding bottom (pb)', cat: 'Spacing', re: /^pb-/, summary: 'pb-* — single-side padding for bottom edges.', example: '<h2 class="pb-2 border-b">Section title</h2>', tips: ['pb-2 + border-b = classic underlined heading'], mistakes: [] },
  { slug: 'utilities/spacing/padding-left', title: 'Padding left (pl)', cat: 'Spacing', re: /^pl-/, summary: 'pl-* — single-side padding for left edges.', example: '<blockquote class="pl-4 border-l-4 border-blue-500">…</blockquote>', tips: ['pl-4 + border-l-4 = instant blockquote styling'], mistakes: [] },
  { slug: 'utilities/spacing/margin', title: 'Margin', cat: 'Spacing', re: /^(-?m-[0-9px])/, summary: 'Margin on all sides: m-* including negatives (-m-*) and auto.', example: '<div class="mx-auto max-w-3xl m-4">Centered with margin</div>', tips: ['`mx-auto` centers block elements with a max-width', 'Margin collapsing: vertical margins merge — padding never does'], mistakes: ['Double vertical spacing from collapsed margins — check before adding'] },
  { slug: 'utilities/spacing/marginx', title: 'Horizontal margin (mx)', cat: 'Spacing', re: /^(-?mx-)/, summary: 'mx-* sets margin-left + margin-right; mx-auto centers.', example: '<figure class="mx-auto max-w-md">…</figure>', tips: ['mx-auto is the centering workhorse', 'Negative mx can create full-bleed inside padded parents'], mistakes: [] },
  { slug: 'utilities/spacing/marginy', title: 'Vertical margin (my)', cat: 'Spacing', re: /^(-?my-)/, summary: 'my-* sets margin-top + margin-bottom.', example: '<hr class="my-8 border-slate-200" />', tips: ['my-8 between sections; my-2 between tight list items'], mistakes: ['Vertical margin collapse surprises — see [[utilities/spacing/margin|Margin]]'] },
  { slug: 'utilities/spacing/margin-top', title: 'Margin top (mt)', cat: 'Spacing', re: /^(-?mt-)/, summary: 'mt-* — the most-used spacing utility: space above an element.', example: '<button class="mt-6">Continue</button>', tips: ['Flow spacing: give children mt-* rather than parent gaps when order varies'], mistakes: [] },
  { slug: 'utilities/spacing/margin-right', title: 'Margin right (mr)', cat: 'Spacing', re: /^(-?mr-)/, summary: 'mr-* — space to the right of an element.', example: '<span class="mr-2">→</span> Next', tips: ['In flex, prefer gap over mr — gap handles both axes'], mistakes: [] },
  { slug: 'utilities/spacing/margin-bottom', title: 'Margin bottom (mb)', cat: 'Spacing', re: /^(-?mb-)/, summary: 'mb-* — space below an element.', example: '<h2 class="mb-4 text-2xl font-bold">Heading rhythm</h2>', tips: ['Headings: mb-2…mb-4 depending on size'], mistakes: [] },
  { slug: 'utilities/spacing/margin-left', title: 'Margin left (ml)', cat: 'Spacing', re: /^(-?ml-)/, summary: 'ml-* — space to the left; ml-auto pushes elements right in flex.', example: '<nav class="flex">\n  <a class="mr-4">Home</a>\n  <button class="ml-auto">Login</button>\n</nav>', tips: ['`ml-auto` in a flex row is the classic right-align trick'], mistakes: [] },
  { slug: 'utilities/spacing/negative-margin', title: 'Negative margins', cat: 'Spacing', re: /^-(m|p)/, summary: 'Every spacing utility has a negative twin (-m-4, -mt-2…) for overlaps and optical corrections.', example: '<div class="grid grid-cols-2 gap-4">\n  <div class="-mt-8">Overlaps the row above</div>\n</div>', tips: ['Negative margins + z-index build stacked card effects', 'Optical alignment: nudge icons -mt-px'], mistakes: ['Negative margins leak outside parents — contain with overflow or padding'] },
  { slug: 'utilities/spacing/auto-margins', title: 'Auto margins', cat: 'Spacing', re: /^[mp][trblxy]?-auto$/, summary: 'm-auto, mx-auto, my-auto, ml-auto… — auto margins absorb free space in block and flex/grid layouts.', example: '<div class="flex h-screen">\n  <div class="m-auto">Perfectly centered</div>\n</div>', tips: ['`m-auto` inside flex centers on BOTH axes — no justify/align needed', '`ml-auto`/`mt-auto` push siblings away (spacer pattern)'], mistakes: [] },
  { slug: 'utilities/spacing/space-between', title: 'Space between (space-x / space-y)', cat: 'Spacing', re: /^space-[xy]-/, summary: 'space-x-* and space-y-* add margin BETWEEN siblings without touching their outer edges.', example: '<div class="space-y-4">\n  <p>One</p>\n  <p>Two</p>\n  <p>Three — 1rem between each</p>\n</div>', tips: ['space-y-* is the stack primitive for vertical rhythm', 'In new code, gap often replaces space-between — compare in [[comparisons/gap-vs-space-between|Gap vs space-between]]'], mistakes: ['space-* fights with grid layout — use gap there'] },
  { slug: 'utilities/spacing/gap', title: 'Gap (flex & grid)', cat: 'Spacing', re: /^gap-[0-9px]/, summary: 'gap-* sets the gutter between flex/grid children — both axes at once.', example: '<div class="flex flex-wrap gap-3">…chips…</div>', tips: ['gap beats margin in every flex/grid situation', 'gap accepts the full spacing scale + breakpoints: md:gap-6'], mistakes: [] },
  { slug: 'utilities/spacing/gapx', title: 'Column gap (gap-x)', cat: 'Spacing', re: /^gap-x-/, summary: 'gap-x-* — horizontal gutters only.', example: '<div class="grid grid-cols-3 gap-x-6 gap-y-10">…</div>', tips: ['Editorial grids often want gap-x < gap-y'], mistakes: [] },
  { slug: 'utilities/spacing/gapy', title: 'Row gap (gap-y)', cat: 'Spacing', re: /^gap-y-/, summary: 'gap-y-* — vertical gutters only.', example: '<div class="flex flex-col gap-y-2">…</div>', tips: [], mistakes: [] },

  // --- sizing
  { slug: 'utilities/sizing/width', title: 'Width', cat: 'Sizing', re: /^w-[0-9px]/, summary: 'Fixed widths from the spacing scale: w-0 through w-96.', example: '<div class="w-64 p-4">16rem wide</div>', tips: ['Sidebar standards: w-64 (16rem) or w-72', 'Avatars: w-8…w-16'], mistakes: ['Fixed widths on phones — pair with max-w-full'] },
  { slug: 'utilities/sizing/width-fractions', title: 'Fractional & fluid widths', cat: 'Sizing', re: /^w-(full|screen|min|max|fit|auto|svw|lvw|dvw|\d+\/\d+)/, summary: 'w-full, w-1/2, w-screen, w-fit — fractions and intrinsic sizing.', example: '<div class="w-full md:w-1/2 lg:w-1/3">Responsive thirds</div>', tips: ['Fractions go to twelfths: w-5/12 etc.', 'w-fit shrinks to content; w-min to the minimum'], mistakes: ['w-screen adds a horizontal scrollbar when body has padding'] },
  { slug: 'utilities/sizing/height', title: 'Height', cat: 'Sizing', re: /^h-[0-9px]/, summary: 'Fixed heights from the spacing scale plus h-full, h-screen, h-fit.', example: '<section class="h-screen flex items-center">Full-viewport hero</section>', tips: ['Hero sections: h-screen or min-h-screen', 'Prefer min-h to h so content can grow'], mistakes: ['Fixed heights clipping growing content'] },
  { slug: 'utilities/sizing/size', title: 'Size (width + height together)', cat: 'Sizing', re: /^size-/, summary: 'size-* sets width AND height in one class — squares in one token.', example: '<button class="size-10 rounded-full">✓</button>', tips: ['Perfect for icon buttons, avatars, swatches', 'New in 3.1 (from Tailwind 3.4 parity)'], mistakes: [] },
  { slug: 'utilities/sizing/minmax-width', title: 'Min & max width', cat: 'Sizing', re: /^(min|max)-w-/, summary: 'min-w-* and max-w-* constrain widths: max-w-sm through max-w-7xl, max-w-prose, min-w-full…', example: '<article class="max-w-prose mx-auto">Readable line length</article>', tips: ['max-w-prose ≈ 65ch — the reading-width standard', 'max-w-screen-xl centers wide layouts'], mistakes: [] },
  { slug: 'utilities/sizing/minmax-height', title: 'Min & max height', cat: 'Sizing', re: /^(min|max)-h-/, summary: 'min-h-screen for sticky footers; max-h-* for scrollable regions.', example: '<body class="min-h-screen flex flex-col">\n  <main class="flex-1">…</main>\n</body>', tips: ['min-h-screen + flex column + flex-1 main = sticky footer (see [[cookbook/sticky-footer|the cookbook]])'], mistakes: [] },
  { slug: 'utilities/sizing/viewport-units', title: 'Viewport & intrinsic units', cat: 'Sizing', re: /[sd]v[hw]|svh|lvh|dvh/, summary: 'svh/lvh/dvh dynamic viewport heights and intrinsic keywords explained.', example: '<section class="min-h-dvh">Ignores mobile browser chrome jumps</section>', tips: ['dvh tracks the dynamic (collapsed-chrome) viewport — best for mobile heroes'], mistakes: [] },

  // --- flexbox
  { slug: 'utilities/flexbox/flex-direction', title: 'Flex direction', cat: 'Flexbox', re: /^flex-(row|col)/, summary: 'flex-row, flex-col and their reverse variants — the axis switch.', example: '<div class="flex flex-col md:flex-row gap-6">Stacks, then rows</div>', tips: ['The responsive stack pattern: flex-col md:flex-row', 'Reverse variants fix visual-order vs DOM-order needs'], mistakes: ['Forgetting children re-order across the NEW axis'] },
  { slug: 'utilities/flexbox/flex-wrap', title: 'Flex wrap', cat: 'Flexbox', re: /^flex-(wrap|nowrap)/, summary: 'flex-wrap lets items flow to new lines; nowrap keeps one line.', example: '<div class="flex flex-wrap gap-2">…tags…</div>', tips: ['Tag clouds and chip rows want flex-wrap + gap'], mistakes: [] },
  { slug: 'utilities/flexbox/flex', title: 'Flex shorthand (flex-1, flex-auto…)', cat: 'Flexbox', re: /^flex-(1|auto|initial|none)$/, summary: 'flex-1 grows+shrinks equally; flex-none opts out; flex-initial/auto fine-tune.', example: '<div class="flex">\n  <aside class="flex-none w-64">Sidebar</aside>\n  <main class="flex-1">Fills the rest</main>\n</div>', tips: ['Sidebar layouts: flex-none sidebar + flex-1 main', 'Equal columns: flex-1 on each child'], mistakes: ['flex-1 children overflowing with long words — add min-w-0'] },
  { slug: 'utilities/flexbox/flex-grow', title: 'Flex grow', cat: 'Flexbox', re: /^grow/, summary: 'grow / grow-0 — how a child absorbs free space.', example: '<div class="flex"><div class="grow">expands</div></div>', tips: [], mistakes: [] },
  { slug: 'utilities/flexbox/flex-shrink', title: 'Flex shrink', cat: 'Flexbox', re: /^shrink/, summary: 'shrink / shrink-0 — whether a child may compress.', example: '<div class="flex">\n  <img class="shrink-0 h-12 w-12" src="a.jpg" alt="" />\n  <p class="truncate">Long text…</p>\n</div>', tips: ['shrink-0 protects avatars/icons from squashing in media rows'], mistakes: [] },
  { slug: 'utilities/flexbox/flex-basis', title: 'Flex basis', cat: 'Flexbox', re: /^basis-/, summary: 'basis-* sets the starting size before grow/shrink — the full spacing scale + fractions.', example: '<div class="flex flex-wrap">\n  <div class="basis-1/3">…</div>\n</div>', tips: [], mistakes: [] },
  { slug: 'utilities/flexbox/justify-content', title: 'Justify content', cat: 'Flexbox', re: /^justify-/, summary: 'Main-axis distribution: justify-start/center/end/between/around/evenly/stretch.', example: '<nav class="flex justify-between items-center">Logo … Links</nav>', tips: ['justify-between = logo left, actions right', 'justify-evenly for equal gutters including edges'], mistakes: ['Confusing justify (main axis) with items (cross axis) — the #1 flex mistake'] },
  { slug: 'utilities/flexbox/align-items', title: 'Align items', cat: 'Flexbox', re: /^items-/, summary: 'Cross-axis alignment: items-start/center/end/baseline/stretch.', example: '<div class="flex items-center gap-3">Centered row</div>', tips: ['items-center is the most-used flex utility in existence', 'items-baseline aligns text across mixed sizes'], mistakes: [] },
  { slug: 'utilities/flexbox/align-content', title: 'Align content', cat: 'Flexbox', re: /^content-/, summary: 'Distribute wrapped lines as a group: content-start/center/between/around/evenly.', example: '<div class="flex flex-wrap content-between h-64">…</div>', tips: ['Only matters when items wrap to multiple lines'], mistakes: [] },
  { slug: 'utilities/flexbox/align-self', title: 'Align self', cat: 'Flexbox', re: /^self-/, summary: 'Override one child\'s cross-axis alignment: self-start/center/end/stretch/auto.', example: '<div class="flex items-start">\n  <div>top</div>\n  <div class="self-end">bottom</div>\n</div>', tips: [], mistakes: [] },
  { slug: 'utilities/flexbox/order', title: 'Order', cat: 'Flexbox', re: /^order-/, summary: 'order-first/last/none/1…12 — reorder flex & grid children visually.', example: '<div class="flex">\n  <button class="order-last">Save</button>\n  <button>Cancel</button>\n</div>', tips: ['Keep DOM order semantic; use order only visually', 'order-first/-last beat numeric ordering for common cases'], mistakes: ['Reordering breaks keyboard tab order — screen readers and keyboards follow DOM'] },
  { slug: 'utilities/flexbox/place', title: 'Place items / content / self', cat: 'Flexbox', re: /^place-/, summary: 'place-* aligns both axes at once — the two-value shorthand for center-everything.', example: '<div class="grid place-items-center h-48">Dead center</div>', tips: ['place-items-center = the one-class centering answer'], mistakes: [] },

  // --- grid
  { slug: 'utilities/grid/grid-template-columns', title: 'Grid columns', cat: 'Grid', re: /^grid-cols-/, summary: 'grid-cols-1…12, none, subgrid and arbitrary templates like grid-cols-[200px_1fr].', example: '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">\n  <div class="glass p-6">Card</div> ×6\n</div>', tips: ['The responsive card grid: 1 → 2 → 3 columns', 'Arbitrary templates unlock sidebar layouts: grid-cols-[16rem_1fr]'], mistakes: ['grid-cols-12 everywhere out of Bootstrap habit — semantic counts read better'] },
  { slug: 'utilities/grid/grid-column-span', title: 'Column span', cat: 'Grid', re: /^col-(span|auto|start|end)/, summary: 'col-span-1…12, col-start-*, col-end-* — stretch items across tracks.', example: '<div class="grid grid-cols-4 gap-4">\n  <header class="col-span-4">Full width</header>\n  <div class="col-span-3">Main</div>\n  <aside>Side</aside>\n</div>', tips: ['Hero-in-grid: col-span-full spans everything'], mistakes: [] },
  { slug: 'utilities/grid/grid-template-rows', title: 'Grid rows', cat: 'Grid', re: /^grid-rows-/, summary: 'grid-rows-1…12 and arbitrary row templates.', example: '<div class="grid grid-rows-[auto_1fr_auto] min-h-screen">Header / main / footer</div>', tips: ['grid-rows-[auto_1fr_auto] = the app-shell grid'], mistakes: [] },
  { slug: 'utilities/grid/grid-row-span', title: 'Row span', cat: 'Grid', re: /^row-(span|start|end)/, summary: 'row-span-* stretches items across rows — magazine layouts.', example: '<div class="grid grid-cols-3 grid-rows-2 gap-4">\n  <div class="row-span-2">Tall feature</div>\n  <div>a</div><div>b</div><div>c</div><div>d</div>\n</div>', tips: [], mistakes: [] },
  { slug: 'utilities/grid/grid-auto-flow', title: 'Grid auto flow', cat: 'Grid', re: /^grid-flow-/, summary: 'grid-flow-row/col/dense — direction and hole-filling for implicit tracks.', example: '<div class="grid grid-flow-col auto-cols-max gap-4">Horizontal scroller</div>', tips: ['grid-flow-col + auto-cols-max = horizontal snap rails', 'dense backfills gaps at the cost of visual order'], mistakes: [] },
  { slug: 'utilities/grid/grid-auto-size', title: 'Auto columns & rows sizing', cat: 'Grid', re: /^auto-(cols|rows)-/, summary: 'auto-cols-* / auto-rows-* size implicitly created tracks (auto, min, max, fr).', example: '<div class="grid auto-rows-fr gap-4">Equal-height rows</div>', tips: ['auto-rows-fr equalizes row heights automatically'], mistakes: [] },
  { slug: 'utilities/grid/grid-vs-flex', title: 'Grid or flexbox?', cat: 'Grid', re: null, summary: 'Decision guide: when to reach for grid vs flexbox, with the same layout built both ways.', example: '<!-- one axis of content → flex. two axes → grid. -->', tips: ['Rows of things (nav, chips): flex', 'Layouts with rows AND columns: grid', 'Both compose: grid for page, flex for components'], mistakes: [] },

  // --- typography
  { slug: 'utilities/typography/font-family', title: 'Font family', cat: 'Typography', re: /^font-(sans|serif|mono)$/, summary: 'font-sans, font-serif, font-mono — the three stacks, fully themeable.', example: '<p class="font-sans">UI text</p>\n<code class="font-mono">snippet()</code>', tips: ['Code blocks: font-mono + text-sm', 'Override stacks via theme.fontFamily'], mistakes: [] },
  { slug: 'utilities/typography/font-size', title: 'Font size', cat: 'Typography', re: /^text-(xs|sm|base|lg|xl|[2-9]xl)$/, summary: 'text-xs through text-9xl — the complete type scale with matching line-heights.', example: '<h1 class="text-4xl md:text-6xl font-bold">Fluid headline</h1>', tips: ['Body: text-base (16px); small print: text-sm/xs', 'Headline ladder: 4xl → 6xl across breakpoints'], mistakes: ['Stacking text-* utilities (text-red-500 + text-xl are both text-* — order matters, keep one of each kind)'] },
  { slug: 'utilities/typography/font-weight', title: 'Font weight', cat: 'Typography', re: /^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/, summary: 'font-thin…font-black (100–900) — the nine standard weights.', example: '<p class="font-medium">Emphasis without size changes</p>', tips: ['UI standard: font-medium (500) for labels, font-semibold (600) for headings', 'Your font must ship the weight or the browser fakes it'], mistakes: ['Loading a 9-weight font for 2 used weights — subset!'] },
  { slug: 'utilities/typography/letter-spacing', title: 'Letter spacing (tracking)', cat: 'Typography', re: /^tracking-/, summary: 'tracking-tighter…tracking-widest — seven tracking steps.', example: '<p class="uppercase tracking-widest text-xs">Kicker label</p>', tips: ['Uppercase labels love tracking-wide/wider', 'Large display type often wants tracking-tight'], mistakes: [] },
  { slug: 'utilities/typography/line-height', title: 'Line height (leading)', cat: 'Typography', re: /^leading-/, summary: 'leading-none…leading-loose plus numeric leading-3…10.', example: '<h1 class="text-5xl leading-tight">Headlines want tight leading</h1>\n<p class="leading-relaxed">Body wants room.</p>', tips: ['Headlines: leading-tight (1.25); body: leading-relaxed/normal'], mistakes: [] },
  { slug: 'utilities/typography/text-align', title: 'Text alignment', cat: 'Typography', re: /^text-(left|center|right|justify|start|end)$/, summary: 'text-left/center/right/justify/start/end.', example: '<div class="text-center">\n  <h2>Centered hero copy</h2>\n</div>', tips: ['Logical start/end beat left/right for RTL support', 'Justify needs hyphenation to avoid rivers'], mistakes: ['text-center on a flex container does nothing — use justify-*'] },
  { slug: 'utilities/typography/text-transform', title: 'Text transform', cat: 'Typography', re: /^(uppercase|lowercase|capitalize|normal-case)$/, summary: 'uppercase, lowercase, capitalize, normal-case.', example: '<span class="uppercase text-xs font-semibold tracking-wide">Badge</span>', tips: ['Pair uppercase with tracking-wide for legibility'], mistakes: ['capitalize capitalizes EVERY word — usually not what titles want'] },
  { slug: 'utilities/typography/text-decoration', title: 'Text decoration', cat: 'Typography', re: /^(underline|overline|line-through|no-underline|decoration-)/, summary: 'Underline, overline, strike — plus decoration color, style, thickness and offset.', example: '<a class="underline decoration-blue-500 decoration-2 underline-offset-4">Styled link</a>', tips: ['underline-offset-2/4 lifts underlines off descenders', 'decoration-wavy for editorial flourishes'], mistakes: [] },
  { slug: 'utilities/typography/text-overflow', title: 'Text overflow & truncation', cat: 'Typography', re: /^(truncate|text-ellipsis|text-clip|line-clamp-)/, summary: 'truncate (one line), line-clamp-2…6 (multi-line) — graceful text cutoffs.', example: '<p class="line-clamp-3">Long article excerpt…</p>', tips: ['truncate needs overflow-hidden + whitespace-nowrap (included)', 'line-clamp needs a block/inline-block box'], mistakes: ['truncate in flex children needs min-w-0'] },
  { slug: 'utilities/typography/whitespace', title: 'Whitespace & word breaking', cat: 'Typography', re: /^(whitespace-|break-|hyphens-|text-wrap)/, summary: 'whitespace-nowrap/pre/pre-line, break-words/normal, hyphens — text flow control.', example: '<pre class="whitespace-pre-wrap font-mono text-sm">code…</pre>', tips: ['URLs bursting layouts? break-all on the container', 'whitespace-pre-line keeps your \\n line breaks'], mistakes: [] },
  { slug: 'utilities/typography/vertical-align', title: 'Vertical alignment', cat: 'Typography', re: /^align-/, summary: 'align-baseline/middle/top/bottom/text-top/text-bottom for inline & table cells.', example: '<img class="align-middle inline-block h-5 w-5" src="i.svg" alt="" /> inline', tips: ['align-middle fixes icon-vs-text jank'], mistakes: [] },
  { slug: 'utilities/typography/lists', title: 'List styles', cat: 'Typography', re: /^list-/, summary: 'list-disc/decimal/none/inside/outside plus list-image-[].', example: '<ul class="list-disc pl-6 space-y-1">\n  <li>Disc bullets, indented</li>\n</ul>', tips: ['preflight resets lists — add list-disc pl-6 to restore', 'list-inside moves the marker inside the text box'], mistakes: [] },
  { slug: 'utilities/typography/font-smoothing', title: 'Font smoothing & variants', cat: 'Typography', re: /^(antialiased|subpixel-antialiased|font-variant|ordinal|tabular|diagonal|lining|oldstyle|slashed)/, summary: 'antialiased rendering, tabular numerals, ordinals and numeric font variants.', example: '<body class="antialiased">\n<span class="tabular-nums">1,024.00</span>', tips: ['tabular-nums stops price/timer jitter', 'antialiased matches modern OS rendering'], mistakes: [] },
  { slug: 'utilities/typography/text-indent', title: 'Text indent', cat: 'Typography', re: /^(indent-|-indent-)/, summary: 'indent-* / -indent-* — first-line indentation from the spacing scale.', example: '<p class="indent-8">Classical paragraph indent.</p>', tips: [], mistakes: [] },
  { slug: 'utilities/typography/content-select', title: 'Selection styling', cat: 'Typography', re: /^selection:/, summary: 'The selection: variant styles highlighted text: selection:bg-blue-500 selection:text-white.', example: '<p class="selection:bg-fuchsia-300 selection:text-fuchsia-900">Highlight me</p>', tips: ['Brand your selection color — subtle, delightful detail'], mistakes: [] },

  // --- backgrounds
  { slug: 'utilities/backgrounds/background-color', title: 'Background color', cat: 'Backgrounds', re: /^bg-[a-z]+-[0-9]/, summary: 'bg-<palette>-<shade> across all 22 palettes, with opacity modifiers bg-blue-500/50.', example: '<div class="bg-blue-500 hover:bg-blue-600 transition">Surface</div>', tips: ['See [[colors/index|Colors]] for every palette', 'Opacity modifiers: bg-slate-900/50 = rgba at 50%'], mistakes: [] },
  { slug: 'utilities/backgrounds/gradients', title: 'Gradients (from / via / to)', cat: 'Backgrounds', re: /^(bg-gradient-|from-|via-|to-)/, summary: 'bg-gradient-to-r/b/t/l/tr…, from-*, via-*, to-* — directional gradients from any palette.', example: '<div class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-24 rounded-xl"></div>', tips: ['Two stops minimum (from + to); via adds the midpoint', 'Gradient text: bg-clip-text + text-transparent ([[utilities/typography/gradient-text|guide]])'], mistakes: ['Setting bg-gradient-to-r without from/to stops — nothing visible'] },
  { slug: 'utilities/typography/gradient-text', title: 'Gradient text', cat: 'Typography', re: null, summary: 'The bg-clip-text technique: gradient-filled headlines in three classes.', example: '<h1 class="bg-gradient-to-r from-blue-500 to-fuchsia-500 bg-clip-text text-transparent">\n  Nakshora\n</h1>', tips: ['Always pair with a solid fallback color for print/forced-colors'], mistakes: [] },
  { slug: 'utilities/backgrounds/background-size', title: 'Background size', cat: 'Backgrounds', re: /^bg-(auto|cover|contain)$/, summary: 'bg-cover, bg-contain, bg-auto — how images scale inside the box.', example: '<div class="bg-cover bg-center" style="background-image:url(hero.jpg)"></div>', tips: ['bg-cover + bg-center is the hero standard', 'For <img>, use [[utilities/layout/object-fit|object-fit]] instead'], mistakes: [] },
  { slug: 'utilities/backgrounds/background-position', title: 'Background position', cat: 'Backgrounds', re: /^bg-(center|top|bottom|left|right)(-(top|bottom|left|right))?$/, summary: 'Nine keyword positions: bg-center, bg-top, bg-left-bottom…', example: '<div class="bg-no-repeat bg-center bg-cover">…</div>', tips: ['Arbitrary positions: bg-[center_20%]'], mistakes: [] },
  { slug: 'utilities/backgrounds/background-repeat', title: 'Background repeat', cat: 'Backgrounds', re: /^bg-(repeat|no-repeat|repeat-x|repeat-y|repeat-round|repeat-space)$/, summary: 'bg-repeat, bg-no-repeat and the x/y/round/space variants.', example: '<div class="bg-no-repeat">…</div>', tips: ['Patterns: bg-repeat with tiny tiles; heroes: bg-no-repeat'], mistakes: [] },
  { slug: 'utilities/backgrounds/background-attachment', title: 'Background attachment', cat: 'Backgrounds', re: /^bg-(fixed|local|scroll)$/, summary: 'bg-fixed (parallax), bg-local, bg-scroll.', example: '<section class="bg-fixed bg-cover" style="background-image:url(mtn.jpg)">Parallax</section>', tips: ['bg-fixed is janky on iOS Safari — test before shipping'], mistakes: [] },
  { slug: 'utilities/backgrounds/background-clip', title: 'Background clip', cat: 'Backgrounds', re: /^bg-clip-/, summary: 'bg-clip-border/padding/content/text — where the background paints.', example: '<p class="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">Clipped</p>', tips: ['bg-clip-text powers gradient text'], mistakes: [] },
  { slug: 'utilities/backgrounds/background-origin', title: 'Background origin', cat: 'Backgrounds', re: /^bg-origin-/, summary: 'bg-origin-border/padding/content — where the background starts measuring.', example: '<div class="border-4 border-dotted bg-origin-border bg-clip-border p-4">…</div>', tips: [], mistakes: [] },

  // --- borders
  { slug: 'utilities/borders/border-width', title: 'Border width', cat: 'Borders', re: /^border(-[trbl])?(-[0248])?$|^border$/, summary: 'border, border-0/2/4/8 plus per-side border-t/r/b/l widths.', example: '<div class="border-2 border-blue-500 p-4">Boxed</div>\n<div class="border-l-4 border-red-500 pl-4">Alert rail</div>', tips: ['The 1px default `border` needs a border-color to be visible', 'border-t on list items = hairline dividers'], mistakes: [] },
  { slug: 'utilities/borders/border-style', title: 'Border style', cat: 'Borders', re: /^border-(solid|dashed|dotted|double|hidden|none)$/, summary: 'solid, dashed, dotted, double, hidden, none.', example: '<div class="border-2 border-dashed p-6 rounded-lg">Drop zone</div>', tips: ['Drop zones: border-dashed + border-2', 'Preflight strips borders — style is explicit'], mistakes: [] },
  { slug: 'utilities/borders/border-color', title: 'Border color', cat: 'Borders', re: /^border-[a-z]+-[0-9]/, summary: 'border-<palette>-<shade> for every palette, with opacity modifiers.', example: '<div class="border border-slate-200 dark:border-slate-700 rounded-lg">Adaptive border</div>', tips: ['Dark borders: dark:border-slate-700 pattern', 'Subtle: *-200 light / *-800 dark'], mistakes: [] },
  { slug: 'utilities/borders/border-radius', title: 'Border radius', cat: 'Borders', re: /^rounded/, summary: 'rounded-none…rounded-full, per-corner (rounded-tl-*) and per-side (rounded-t-*) radii.', example: '<button class="rounded-lg px-4 py-2">Standard</button>\n<img class="rounded-full" src="a.jpg" alt="" />', tips: ['Standard scale: sm(2px) md(6px) lg(8px) xl(12px) 2xl(16px) 3xl(24px)', 'rounded-full = circles on square boxes, pills on rectangles'], mistakes: [] },
  { slug: 'utilities/borders/divide', title: 'Divide (between children)', cat: 'Borders', re: /^divide-/, summary: 'divide-x/y with widths, colors, styles and reverse — borders BETWEEN siblings.', example: '<ul class="divide-y divide-slate-200">\n  <li class="py-3">Row</li>\n</ul>', tips: ['divide-y = the table-less list pattern', 'divide-x for horizontal nav separation'], mistakes: ['divide-* on grid with gaps looks doubled — prefer borders on cells'] },
  { slug: 'utilities/borders/outline', title: 'Outline', cat: 'Borders', re: /^outline/, summary: 'outline, outline-2, outline-offset-2, outline-dashed… — focus rings and offset borders.', example: '<button class="focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2">\n  Accessible focus\n</button>', tips: ['Never remove focus outlines without replacement — accessibility requires them', 'outline-offset-2 gives the modern floating ring'], mistakes: ['outline-none without a custom visible focus state fails WCAG'] },
  { slug: 'utilities/borders/ring', title: 'Ring', cat: 'Borders', re: /^ring/, summary: 'ring, ring-2/4/8, ring-<color>, ring-offset-* — box-shadow-based focus rings.', example: '<button class="focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg">Ring focus</button>', tips: ['Rings are box-shadows: they follow border-radius, outlines don\'t', 'ring-offset-2 + ring-offset-white prevents color bleed'], mistakes: [] },

  // --- effects
  { slug: 'utilities/effects/shadows', title: 'Box shadows', cat: 'Effects', re: /^shadow/, summary: 'shadow-sm…shadow-2xl, shadow-inner, shadow-none — plus colored shadows.', example: '<div class="shadow-lg hover:shadow-xl transition p-6 rounded-xl">Elevated card</div>', tips: ['Elevation ladder: sm → md → lg → xl; hover raises one step', 'Colored shadows: shadow-blue-500/40 for glowing CTAs'], mistakes: ['Shadow on a transparent-bg element looks dirty — give it a surface'] },
  { slug: 'utilities/effects/opacity', title: 'Opacity', cat: 'Effects', re: /^opacity-/, summary: 'opacity-0…opacity-100 in 5-step increments.', example: '<div class="opacity-50 hover:opacity-100 transition">Reveal on hover</div>', tips: ['Fade patterns: opacity + transition', 'opacity-0 + pointer-events-none = hidden overlays ready to toggle'], mistakes: [] },
  { slug: 'utilities/effects/mix-blend-mode', title: 'Mix blend mode', cat: 'Effects', re: /^mix-blend-/, summary: 'All 16 blend modes: multiply, screen, overlay, difference, exclusion, hue…', example: '<div class="mix-blend-multiply bg-fuchsia-500">Duotone layer</div>', tips: ['mix-blend-difference for always-contrast overlays', 'Blend modes need an opaque backdrop to read predictably'], mistakes: [] },
  { slug: 'utilities/effects/background-blend', title: 'Background blend', cat: 'Effects', re: /^bg-blend-/, summary: 'bg-blend-* blends an element\'s backgrounds with its background-color.', example: '<div class="bg-blend-multiply bg-fuchsia-600" style="background-image:url(hero.jpg)">Tinted photo</div>', tips: ['Photo tinting without an extra overlay element'], mistakes: [] },
  { slug: 'utilities/effects/filters', title: 'Filters (blur, brightness, contrast…)', cat: 'Effects', re: /^(blur|brightness|contrast|grayscale|hue-rotate|invert|saturate|sepia|drop-shadow|filter)/, summary: 'The complete filter toolkit: blur-sm…3xl, brightness-0…200, contrast, grayscale, hue-rotate, invert, saturate, sepia, drop-shadow.', example: '<img class="grayscale hover:grayscale-0 transition duration-500" src="team.jpg" alt="" />', tips: ['grayscale → hover:grayscale-0 = the classic team grid', 'drop-shadow follows transparency; box-shadow doesn\'t'], mistakes: ['Filters create a stacking context — z-index behavior may change'] },
  { slug: 'utilities/effects/backdrop-filter', title: 'Backdrop filters', cat: 'Effects', re: /^backdrop-/, summary: 'backdrop-blur-*, backdrop-brightness-*, … — filter what\'s BEHIND an element.', example: '<header class="backdrop-blur-md bg-white/60 sticky top-0">Frosted navbar</header>', tips: ['Frosted glass: backdrop-blur + translucent bg', 'backdrop-blur is the heart of the `.glass` component'], mistakes: [] },

  // --- transforms
  { slug: 'utilities/transforms/scale', title: 'Scale', cat: 'Transforms', re: /^scale-/, summary: 'scale-0…150, scale-x-*, scale-y-* — grow and shrink with transforms.', example: '<button class="hover:scale-105 active:scale-95 transition">Press me</button>', tips: ['active:scale-95 = tactile buttons', 'scale-0→scale-100 + transition = pop-in animations'], mistakes: ['Scaling text blurs at fractional sizes — prefer font-size changes for reading text'] },
  { slug: 'utilities/transforms/rotate', title: 'Rotate', cat: 'Transforms', re: /^rotate-/, summary: 'rotate-0…180, negatives, and arbitrary angles rotate-[17deg].', example: '<div class="rotate-6 hover:rotate-0 transition">Playful card</div>', tips: ['rotate-45 turns a square into a diamond', 'Arbitrary: rotate-[3deg] for scattered-postcard looks'], mistakes: [] },
  { slug: 'utilities/transforms/translate', title: 'Translate', cat: 'Transforms', re: /^(-?translate-[xy]-|-?translate-)/, summary: 'translate-x-*, translate-y-* with negatives — nudge without layout impact.', example: '<div class="hover:-translate-y-1 hover:shadow-lg transition">Lift on hover</div>', tips: ['-translate-y-1 + shadow = the hover-lift', 'translate-x-1/2 -translate-y-1/2 centers absolutely positioned elements'], mistakes: [] },
  { slug: 'utilities/transforms/skew', title: 'Skew', cat: 'Transforms', re: /^skew-/, summary: 'skew-x-*, skew-y-* — slant elements.', example: '<div class="skew-y-2 bg-blue-500">Tilted banner</div>', tips: ['Counter-skew content so text stays level'], mistakes: [] },
  { slug: 'utilities/transforms/transform-origin', title: 'Transform origin', cat: 'Transforms', re: /^origin-/, summary: 'origin-center/top/left/bottom-right… — the pivot for scale/rotate.', example: '<div class="origin-bottom-left rotate-12">Pivoted</div>', tips: ['Dropdown pop-ins want origin-top'], mistakes: [] },
  { slug: 'utilities/transforms/perspective', title: 'Perspective & 3D', cat: 'Transforms', re: /^(perspective|backface|transform-gpu|transform-none)/, summary: 'perspective-*, backface-hidden, transform-gpu — depth and compositing control.', example: '<div class="perspective-[1000px]">\n  <div class="rotate-y-12 backface-hidden">Card face</div>\n</div>', tips: ['transform-gpu hints the compositor for animation-heavy elements'], mistakes: [] },

  // --- transitions & animations
  { slug: 'utilities/transitions/transition-property', title: 'Transition property', cat: 'Transitions', re: /^transition(-[a-z]+)?$/, summary: 'transition, transition-all/colors/opacity/transform/shadow — what animates.', example: '<button class="transition-colors hover:bg-blue-600">Smooth color</button>', tips: ['Prefer specific transition-* over transition-all (performance)', 'transition + duration defaults = 150ms'], mistakes: ['transition-all animating layout properties (width) — jank source'] },
  { slug: 'utilities/transitions/duration', title: 'Duration', cat: 'Transitions', re: /^duration-/, summary: 'duration-75…1000 — how long transitions run.', example: '<div class="transition duration-300">Standard ease</div>', tips: ['Micro-interactions: 150ms; reveals: 300ms; drama: 500ms+'], mistakes: [] },
  { slug: 'utilities/transitions/delay', title: 'Delay', cat: 'Transitions', re: /^delay-/, summary: 'delay-75…1000 — stagger transitions.', example: '<div class="transition delay-150">Follows the leader</div>', tips: ['Stagger cards with delay-75/150/225'], mistakes: ['Delays on hover-out feel laggy — apply delays only on hover-in via variants'] },
  { slug: 'utilities/transitions/timing-function', title: 'Timing functions (easing)', cat: 'Transitions', re: /^ease-/, summary: 'ease-linear/in/out/in-out plus spring-like custom curves.', example: '<div class="transition ease-out duration-200">Natural motion</div>', tips: ['ease-out for entrances, ease-in for exits'], mistakes: [] },
  { slug: 'utilities/animations/keyframes', title: 'Animations & keyframes', cat: 'Animations', re: /^animate-/, summary: 'animate-spin/ping/pulse/bounce plus custom keyframes via theme.animation.', example: '<span class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>', tips: ['The spinner recipe above is the canonical loading state', 'Custom keyframes: theme.extend.keyframes + animation'], mistakes: ['Animating without motion-safe: breaks vestibular accessibility — gate with motion-safe:'] },
  { slug: 'utilities/animations/custom-animations', title: 'Custom animations', cat: 'Animations', re: null, summary: 'Define your own keyframes and animation utilities through theme.extend — slide-ins, fades, marquees.', example: '// nakshora.config.js\ntheme: {\n  extend: {\n    keyframes: {\n      rise: { from: { opacity: 0, transform: "translateY(8px)" }, to: { opacity: 1, transform: "none" } },\n    },\n    animation: { rise: "rise 0.4s ease-out both" },\n  },\n}', tips: ['Name animations by intent (rise, fade-in), not effect', 'Both `from` and `to` keep reduced-motion fallbacks sane'], mistakes: [] },

  // --- interactivity
  { slug: 'utilities/interactivity/cursor', title: 'Cursor', cat: 'Interactivity', re: /^cursor-/, summary: 'cursor-pointer/default/not-allowed/wait/text/move/grab/zoom-in and 30+ more cursor utilities.', example: '<button class="cursor-pointer">Affordance</button>\n<div class="cursor-not-allowed opacity-50">Locked</div>', tips: ['cursor-pointer on any clickable without native semantics', 'grab + active:grabbing for drag handles'], mistakes: [] },
  { slug: 'utilities/interactivity/pointer-events', title: 'Pointer events', cat: 'Interactivity', re: /^pointer-events-/, summary: 'pointer-events-none/auto — click-through control.', example: '<div class="pointer-events-none absolute inset-0 grid place-items-center">\n  <button class="pointer-events-auto">Overlay CTA</button>\n</div>', tips: ['Decorative overlays: pointer-events-none so links below stay clickable'], mistakes: [] },
  { slug: 'utilities/interactivity/user-select', title: 'User select', cat: 'Interactivity', re: /^select-/, summary: 'select-none/text/all/auto — copy protection and select-all zones.', example: '<div class="select-none">Drag-friendly UI</div>\n<code class="select-all">copy-me()</code>', tips: ['select-all on license keys / code snippets', 'Never select-none on reading text'], mistakes: [] },
  { slug: 'utilities/interactivity/resize', title: 'Resize', cat: 'Interactivity', re: /^resize/, summary: 'resize, resize-x/y, resize-none — user-resizable boxes.', example: '<textarea class="resize-y min-h-24 w-full">Grows vertically</textarea>', tips: ['resize-y for textareas, resize-none for polished forms'], mistakes: [] },
  { slug: 'utilities/interactivity/appearance', title: 'Appearance', cat: 'Interactivity', re: /^appearance-/, summary: 'appearance-none strips native control styling for custom designs.', example: '<select class="appearance-none border rounded-lg px-3 py-2 pr-8">…</select>', tips: ['Pair appearance-none with your own chevron icon'], mistakes: [] },
  { slug: 'utilities/interactivity/scroll-behavior', title: 'Scroll behavior', cat: 'Interactivity', re: /^scroll-(auto|smooth)$/, summary: 'scroll-smooth — native smooth scrolling for anchor navigation.', example: '<html class="scroll-smooth">\n<a href="#pricing">Jump to pricing</a>', tips: ['Add scroll-mt-* to targets so fixed headers don\'t cover them'], mistakes: [] },
  { slug: 'utilities/interactivity/scroll-margin', title: 'Scroll margin', cat: 'Interactivity', re: /^scroll-m/, summary: 'scroll-m-* — breathing room when scrolled to (anchor offset).', example: '<section id="pricing" class="scroll-mt-24">Anchors land below the sticky header</section>', tips: ['scroll-mt-24 pairs with h-24 sticky navbars'], mistakes: [] },
  { slug: 'utilities/interactivity/scroll-padding', title: 'Scroll padding', cat: 'Interactivity', re: /^scroll-p/, summary: 'scroll-p-* — inset the scroll container\'s snap/anchor area.', example: '<div class="snap-x scroll-px-6 overflow-x-auto">…</div>', tips: [], mistakes: [] },
  { slug: 'utilities/interactivity/scroll-snap', title: 'Scroll snap', cat: 'Interactivity', re: /^snap-/, summary: 'snap-x/y, snap-start/center/end, snap-mandatory/proximity — CSS scroll snapping.', example: '<div class="snap-x snap-mandatory flex overflow-x-auto">\n  <div class="snap-center shrink-0 w-4/5">Slide</div>\n</div>', tips: ['Carousels without JS: snap-x + snap-mandatory + shrink-0 slides', 'snap-proximity feels more forgiving on long lists'], mistakes: [] },
  { slug: 'utilities/interactivity/touch-action', title: 'Touch action', cat: 'Interactivity', re: /^touch-/, summary: 'touch-auto/none/pan-x/pan-y/pinch-zoom — gesture control.', example: '<div class="touch-pan-y">Vertical scroll preserved, horizontal gestures free for JS</div>', tips: ['touch-none on custom sliders prevents scroll fighting'], mistakes: [] },
  { slug: 'utilities/interactivity/will-change', title: 'Will change', cat: 'Interactivity', re: /^will-change-/, summary: 'will-change-transform/scroll/contents/auto — compositor hints.', example: '<div class="will-change-transform animate-spin">Heavy spinner</div>', tips: ['Apply just before animation, remove after — permanent hints waste memory'], mistakes: [] },
  { slug: 'utilities/interactivity/accent-caret', title: 'Accent & caret colors', cat: 'Interactivity', re: /^(accent|caret)-/, summary: 'accent-* recolors form controls; caret-* recolors the text cursor.', example: '<input type="checkbox" class="accent-blue-500" checked />\n<input class="caret-fuchsia-500" placeholder="Type…" />', tips: ['accent-* works on checkboxes, radios, ranges, progress'], mistakes: [] },
  { slug: 'utilities/interactivity/sr-only', title: 'sr-only & not-sr-only', cat: 'Interactivity', re: /^(sr-only|not-sr-only)$/, summary: 'Visually hide content while keeping it for screen readers — and reveal on focus.', example: '<a href="#main" class="sr-only focus:not-sr-only">Skip to content</a>', tips: ['Skip links: sr-only + focus:not-sr-only', 'Never use display:none for a11y-relevant text'], mistakes: [] },
  { slug: 'utilities/interactivity/content-visibility', title: 'Content visibility & contain', cat: 'Interactivity', re: /^(content-|contain-)/, summary: 'content-visibility-auto skips offscreen rendering; contain-* isolates layout/paint.', example: '<section class="content-auto contain-layout">Long page, fast paint</section>', tips: ['content-auto on below-the-fold sections = real FPS wins'], mistakes: [] },

  // --- tables & svg & misc
  { slug: 'utilities/tables/table-layout', title: 'Table layout', cat: 'Tables', re: /^(table-auto|table-fixed)$/, summary: 'table-auto (content-sized columns) vs table-fixed (equal, predictable columns).', example: '<table class="table-fixed w-full">…</table>', tips: ['table-fixed + truncate = clean data grids'], mistakes: [] },
  { slug: 'utilities/tables/border-collapse', title: 'Border collapse & spacing', cat: 'Tables', re: /^(border-collapse|border-separate|border-spacing)/, summary: 'border-collapse merges cell borders; border-separate + border-spacing-* spaces them.', example: '<table class="border-separate border-spacing-2">…</table>', tips: [], mistakes: [] },
  { slug: 'utilities/tables/caption', title: 'Caption side', cat: 'Tables', re: /^caption-/, summary: 'caption-top/bottom — accessible table captions.', example: '<table><caption class="caption-bottom text-sm text-slate-500">Q3 revenue</caption></table>', tips: ['Always caption data tables — screen readers announce them'], mistakes: [] },
  { slug: 'utilities/svg/fill-stroke', title: 'SVG fill & stroke', cat: 'SVG', re: /^(fill-|stroke-)/, summary: 'fill-* and stroke-* across every palette, plus stroke-0…2 widths.', example: '<svg class="fill-blue-500 stroke-slate-900 stroke-2" viewBox="0 0 24 24">…</svg>', tips: ['Color icons from the parent: fill-current + text-blue-500', 'stroke-current matches text color automatically'], mistakes: [] },
  { slug: 'utilities/misc/box-sizing-base', title: 'Base styles & resets', cat: 'Misc', re: null, summary: 'What the base layer does: border-box everywhere, margin resets, font inheritance — and how to opt out.', example: '*, ::before, ::after {\n  box-sizing: border-box;\n  border: 0 solid;\n}', tips: ['Everything is border-box: width includes padding/border', 'Disable via corePlugins.preflight if you must'], mistakes: [] },
  { slug: 'utilities/misc/arbitrary-values', title: 'Arbitrary values & properties', cat: 'Misc', re: null, summary: 'w-[37px], bg-[#1e293b], [mask-type:luminance], [&>*]:p-2 — escape hatches with full type safety of output.', example: '<div class="w-[37px] bg-[#1e293b] [mask-type:luminance]">Exact</div>', tips: ['Spaces become underscores: bg-[url(/img/hero_bg.jpg)]', 'Arbitrary variants: [&>p]:text-sm targets children'], mistakes: ['Overusing arbitrary values — if you need it twice, make a token'] },
  { slug: 'utilities/misc/important-modifier', title: 'The important modifier (!)', cat: 'Misc', re: null, summary: 'Prefix any utility with ! to emit !important — surgical specificity wins.', example: '<div class="!mt-0">Beats the inherited margin</div>', tips: ['Great for third-party CSS collisions', 'Global alternative: the important config option'], mistakes: [] }
];

function familyArticle(V, fam, classesMatching, countMatching) {
  const rows = fam.re ? classesMatching(fam.re, 60) : [];
  const total = fam.re ? countMatching(fam.re) : 0;
  const blocks = [
    p(fam.summary + ` ${fam.re && total ? `This family contains **${total.toLocaleString('en-US')} generated classes** in ${V.label}.` : ''}`),
    h2('Classes')
  ];
  if (rows.length) {
    blocks.push(table(['Class', 'Generated CSS'], rows));
    if (total > rows.length) blocks.push(p(`…and ${(total - rows.length).toLocaleString('en-US')} more in this family — search by class name to find the exact one.`));
  } else {
    blocks.push(code('js', fam.example || '// see examples below', 'reference'));
  }
  blocks.push(
    h2('Example'),
    code('html', fam.example, 'example'),
    h2('Responsive & variants'),
    p(`Every class here accepts screen prefixes (${V.id === 'v3.1' ? '`xxs:` … `5xl:`' : '`sm:` … `xl:`'}) and state variants${V.jit ? ' — `md:hover:' + firstClass(fam) + '` style stacks compile to a single media query' : ''}. See [[responsive/index|Responsive design]] and [[variants/index|Variants]].`),
    ...(fam.tips?.length ? [h2('Best practices'), list(fam.tips)] : []),
    ...(fam.mistakes?.length ? [h2('Common mistakes'), list(fam.mistakes)] : []),
    h2('Related'),
    p(relatedLine(fam))
  );
  return article({
    slug: fam.slug,
    title: `${fam.title} utilities — ${V.label}`,
    section: 'utilities',
    category: `Utilities · ${fam.cat}`,
    tags: ['utilities', fam.cat.toLowerCase().replace(/ & .*/, ''), fam.slug.split('/').pop()],
    keywords: [fam.title.toLowerCase(), 'utility', 'css', fam.cat.toLowerCase()],
    summary: `${fam.summary} Complete class table, generated CSS, examples and pitfalls for ${V.label}.`,
    hub: 'utilities/index',
    blocks
  });
}

function firstClass(fam) {
  return { 'utilities/layout/display': 'hidden', 'utilities/spacing/padding': 'p-4', 'utilities/effects/shadows': 'shadow-lg' }[fam.slug] || 'p-4';
}

function relatedLine(fam) {
  const map = {
    Layout: '[[utilities/spacing/margin|Margin]] · [[utilities/sizing/width|Width]] · [[responsive/index|Responsive]]',
    Spacing: '[[utilities/spacing/spacing-scale|Spacing scale]] · [[utilities/sizing/width|Width]] · [[comparisons/margin-vs-padding|Margin vs padding]]',
    Sizing: '[[utilities/layout/aspect-ratio|Aspect ratio]] · [[utilities/spacing/spacing-scale|Spacing scale]]',
    Flexbox: '[[utilities/grid/grid-template-columns|Grid]] · [[comparisons/grid-vs-flexbox|Grid vs flexbox]]',
    Grid: '[[utilities/flexbox/flex-direction|Flexbox]] · [[utilities/spacing/gap|Gap]]',
    Typography: '[[utilities/colors/text-color|Text color]] · [[utilities/typography/font-size|Font size]]',
    Backgrounds: '[[utilities/backgrounds/gradients|Gradients]] · [[colors/index|Colors]]',
    Borders: '[[utilities/borders/ring|Ring]] · [[comparisons/ring-vs-border-vs-outline|Ring vs border vs outline]]',
    Effects: '[[utilities/effects/backdrop-filter|Backdrop filters]] · [[utilities/effects/opacity|Opacity]]',
    Transforms: '[[utilities/transitions/transition-property|Transitions]] · [[utilities/animations/keyframes|Animations]]',
    Transitions: '[[utilities/animations/keyframes|Animations]] · [[utilities/transitions/timing-function|Easing]]',
    Animations: '[[utilities/transitions/transition-property|Transitions]]',
    Interactivity: '[[utilities/interactivity/cursor|Cursor]] · [[utilities/interactivity/scroll-snap|Scroll snap]]',
    Tables: '[[utilities/tables/table-layout|Table layout]]',
    SVG: '[[colors/index|Colors]]',
    Misc: '[[concepts/class-anatomy|Class anatomy]]'
  };
  return map[fam.cat] || '[[utilities/index|Utilities hub]]';
}

// ---------------------------------------------------------------- v1 families
function v1Families(v1Classes) {
  const has = (re) => v1Classes.filter((c) => re.test(c));
  const fams = [
    ['utilities/layout/display', 'Display & layout', /^(-?(block|inline|flex|grid|hidden|static|relative|absolute|fixed|sticky))/, 'Display, positioning and visibility classes in the v1 stylesheet.'],
    ['utilities/layout/grid', 'Grid & columns', /^(grid|col|area|gap|justify|items|content|self)/, 'v1 grid utilities: grid-cols-*, gap-*, alignment and named areas.'],
    ['utilities/spacing/padding', 'Padding', /^p[trblxy]?-/, 'Padding utilities on the --space-0…9 scale.'],
    ['utilities/spacing/margin', 'Margin', /^m[trblxy]?-/, 'Margin utilities on the --space-0…9 scale, including mx-auto centering.'],
    ['utilities/sizing/width', 'Width & height', /^([wh]|max|min)-/, 'Sizing utilities: w-*, h-*, max-w-*, fractions like w-1-2, viewport sizes.'],
    ['utilities/typography/font-size', 'Typography', /^(text|font|leading|tracking|list|underline|uppercase|lowercase|capitalize)/, 'The fluid v1 text scale (text-1…text-5), weights, leading and transforms.'],
    ['utilities/borders/border-width', 'Borders & radius', /^(border|rounded)/, 'Border widths, styles and rounded-* radii.'],
    ['utilities/effects/shadows', 'Shadows', /^shadow/, 'The v1 shadow ladder, including neon-tinted shadows.'],
    ['utilities/effects/opacity', 'Opacity & filters', /^(opacity|brightness|saturate|scale|rotate|transition|animate|backdrop|blur)/, 'Opacity steps, brightness/saturate filters, transforms, transitions and the v1 animation set.'],
    ['utilities/interactivity/cursor', 'Interactivity', /^(cursor|pointer|select|resize|overflow|snap|scroll)/, 'Cursor, selection, overflow and the v1 scroll-snap helpers.'],
    ['utilities/tables/table-layout', 'Tables & media', /^(table|object|align|vertical)/, 'Table layout, object-fit and alignment helpers.'],
    ['utilities/misc/z-index', 'Stacking & misc', /^z-/, 'z-0…z-50 stacking utilities and misc helpers.']
  ];
  return fams.map(([slug, title, re, summary]) => ({
    slug, title, summary,
    rows: has(re).slice(0, 60).map((c) => [`\`${c}\``, '']),
    count: has(re).length
  }));
}

function v1FamilyArticle(V, fam) {
  return article({
    slug: fam.slug,
    title: `${fam.title} — Nakshora 1.0`,
    section: 'utilities',
    category: `Utilities · v1`,
    tags: ['utilities', 'v1', fam.slug.split('/').pop()],
    keywords: [fam.title.toLowerCase(), 'v1', 'utility'],
    summary: `${fam.summary} ${fam.count} classes in the frozen v1.0.0 stylesheet.`,
    hub: 'utilities/index',
    blocks: [
      p(`${fam.summary} The frozen v1.0.0 stylesheet contains **${fam.count} classes** in this family.`),
      h2('Classes'),
      fam.rows.length ? table(['Class', 'Notes'], fam.rows.map(([c]) => [c, v1Note(c)])) : p('See the component reference for this area.'),
      h2('Usage'),
      code('html', `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/nakshora/nakshora@main/minified-version/v1.0.0.css" />\n\n<div class="${fam.rows[0]?.[0].replace(/`/g, '') || 'p-4'}">…</div>`, 'index.html'),
      h2('Scaling beyond v1'),
      p(`v1 utilities are frozen — no JIT, no arbitrary values. When you outgrow them, the [[releases/migration-v1-to-v3|migration guide]] moves you to the modern engine where this family gains responsive variants, state variants and ${V.id === 'v1.0' ? '11,417' : 'thousands of'} utilities.`)
    ]
  });
}

function v1Note(cls) {
  const c = cls.replace(/`/g, '');
  if (c.startsWith('grid-cols')) return 'Column templates 1–12';
  if (c.startsWith('gap')) return 'Gutter from the --space scale';
  if (c.startsWith('text-')) return 'Fluid scale via clamp()';
  if (c.startsWith('bg-neon')) return 'Neon palette background';
  if (c.startsWith('btn')) return 'See components';
  return '—';
}

// ---------------------------------------------------------------- v2 families
function v2Families() {
  return [
    ['utilities/layout/display', 'Display & layout', 'display, position, float, overflow and visibility utilities generated by the v2 engine.'],
    ['utilities/spacing/padding', 'Padding', 'p-* utilities on the v2 spacing scale.'],
    ['utilities/spacing/margin', 'Margin', 'm-* utilities on the v2 spacing scale.'],
    ['utilities/spacing/gap', 'Gap', 'gap-* for flex and grid gutters.'],
    ['utilities/flexbox/flex-direction', 'Flexbox', 'flex-direction, wrap, grow/shrink, justify and align utilities.'],
    ['utilities/grid/grid-template-columns', 'Grid', 'grid-cols-*, spans and auto-flow utilities.'],
    ['utilities/sizing/width', 'Width & height', 'w-*, h-*, min/max sizing with fractions.'],
    ['utilities/typography/font-size', 'Typography', 'font sizes, weights, alignment, transforms and decoration.'],
    ['utilities/colors-overview', 'Colors', '50 colors × 10 shades powering text-*, bg-* and border-*.'],
    ['utilities/borders/border-width', 'Borders & shadows', 'border widths, styles, radii and the shadow ladder.'],
    ['utilities/effects/opacity', 'Effects', 'opacity, blur, filters and blend modes.'],
    ['utilities/transforms/scale', 'Transforms & transitions', 'scale, rotate, translate, skew plus transition utilities.']
  ].map(([slug, title, summary]) => ({ slug, title, summary }));
}

function v2FamilyArticle(V, fam) {
  return article({
    slug: fam.slug,
    title: `${fam.title} — Nakshora 2.0`,
    section: 'utilities',
    category: 'Utilities · v2',
    tags: ['utilities', 'v2', fam.slug.split('/').pop()],
    keywords: [fam.title.toLowerCase(), 'v2', 'utility'],
    summary: `${fam.summary} Generated by the v2 CSSGenerator from your theme.`,
    hub: 'utilities/index',
    blocks: [
      p(`${fam.summary} In v2, these utilities are **generated** from your configuration — the exact output depends on your theme and variant settings.`),
      h2('Generation'),
      code('js', `import { CSSGenerator } from 'nakshora';\n\nconst css = new CSSGenerator({\n  theme: { /* colors, spacing, breakpoints */ },\n  variants: ['hover', 'focus', 'md', 'lg'],\n}).generate({ minify: true });`, 'build.mjs'),
      h2('Usage'),
      code('html', '<div class="flex items-center gap-4 p-6">v2 utilities in action</div>'),
      h2('Known issues fixed in v3'),
      list(['`.mr-*`/`-right` spacing emitted scale keys instead of values — fixed', 'Responsive media queries were empty stubs — now fully generated', 'State variants (hover:, dark:, group-*) added with the JIT engine'], [false])
    ]
  });
}
