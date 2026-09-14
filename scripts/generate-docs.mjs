#!/usr/bin/env node
// Generates docs/utilities/*.md reference tables straight from the core
// utility registry — so the docs always match the real framework.
//
// Usage: node scripts/generate-docs.mjs   (run `pnpm build:core` first)

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CSSGenerator, GROUP_CATEGORIES } from '../packages/@nakshora/core/dist/index.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'docs', 'utilities');
mkdirSync(outDir, { recursive: true });

const generator = new CSSGenerator();
const rules = generator.getUtilities();

// category → rules (every rule has exactly one category; the file specs
// below list category ids, and a final check makes sure none is left out)
const byGroup = new Map();
for (const rule of rules) {
  const list = byGroup.get(rule.category) ?? [];
  list.push(rule);
  byGroup.set(rule.category, list);
}

const cssOf = (r) =>
  Object.entries(r.decls)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}: ${v}`)
    .join('; ');

const files = [
  {
    file: '01-layout.md',
    title: 'Layout Utilities',
    groups: ['layout', 'display', 'position', 'inset', 'zIndex', 'overflow', 'visibility'],
    intro: 'Control how elements are displayed, positioned and stacked in the document flow.',
  },
  {
    file: '02-spacing.md',
    title: 'Spacing Utilities',
    groups: ['margin', 'padding', 'gap'],
    intro:
      'All spacing utilities use the spacing scale (see [Configuration](../CONFIGURATION.md#spacing)).\n\n**Scale keys:** `0` `px` `0.5` `1` `1.5` `2` `2.5` `3` `3.5` `4` `5` `6` `7` `8` `9` `10` `11` `12` `14` `16` `20` `24` `28` `32` `36` `40` `44` `48` `56` `64` `72` `80` `96`',
  },
  {
    file: '03-sizing.md',
    title: 'Sizing Utilities',
    groups: ['sizing'],
    intro:
      'Width, height and min/max constraints. Sizing utilities use the spacing scale plus named max-width steps.',
  },
  {
    file: '04-flexbox-grid.md',
    title: 'Flexbox & Grid Utilities',
    groups: ['flex', 'grid'],
    intro:
      'Everything you need for one-dimensional (Flexbox) and two-dimensional (CSS Grid) layouts.',
  },
  {
    file: '05-typography.md',
    title: 'Typography Utilities',
    groups: ['typography', 'textDecoration'],
    intro: 'Font size, weight, family, spacing, alignment, transforms and decorations.',
  },
  {
    file: '06-colors.md',
    title: 'Color Utilities',
    groups: ['textColor', 'backgroundColor', 'borderColor', 'gradients', 'svg'],
    intro:
      '22 color palettes × 11 shades (50–950). Syntax: `<utility>-<palette>-<shade>` — e.g. `text-blue-500`, `bg-slate-900`, `border-rose-200`, `from-indigo-400`.\n\n**Palettes:** `slate` `gray` `zinc` `neutral` `stone` `red` `orange` `amber` `yellow` `lime` `emerald` `green` `teal` `cyan` `sky` `blue` `indigo` `violet` `purple` `fuchsia` `pink` `rose`\n\nThe full table is generated per palette below. Gradient direction utilities live in [Backgrounds](./07-backgrounds.md).',
  },
  {
    file: '07-backgrounds.md',
    title: 'Background Utilities',
    groups: ['backgrounds'],
    intro:
      'Background position, repeat, size, attachment and linear gradients (`bg-gradient-to-*` + `from-*` / `via-*` / `to-*` stops).',
  },
  {
    file: '08-borders.md',
    title: 'Border Utilities',
    groups: ['borders', 'borderRadius'],
    intro: 'Border width, style and radius (including per-corner radius).',
  },
  {
    file: '09-effects.md',
    title: 'Effect Utilities',
    groups: ['shadows', 'opacity', 'effects', 'filters'],
    intro:
      'Shadows, opacity and CSS filters (blur, brightness, grayscale, invert, saturate, drop-shadow, backdrop-*).',
  },
  {
    file: '10-transforms.md',
    title: 'Transform Utilities',
    groups: ['transforms'],
    intro:
      'Scale, rotate and translate. Negative values via the `-` prefix, e.g. `-rotate-45`, `-translate-x-4`. Note: combining transforms (scale + rotate) overrides the previous transform utility — chain with `transform` + CSS variables if you need more.',
  },
  {
    file: '11-transitions-animations.md',
    title: 'Transition & Animation Utilities',
    groups: ['transitions', 'animations'],
    intro:
      'Transition properties, durations, easings and built-in keyframe animations. All built-in keyframes: `spin` `ping` `pulse` `bounce` `fade` `slide` `shimmer`. In JIT mode, keyframes are emitted only for animations actually used.',
  },
  {
    file: '12-misc.md',
    title: 'Cursor, Whitespace & Misc Utilities',
    groups: ['cursors', 'whitespace', 'interactivity', 'tables', 'accessibility'],
    intro:
      'Cursors, white-space, floats, clearing, lists, resize, user-select, scroll/touch behaviour, accent/caret colours, tables and accessibility helpers.',
  },
];

const covered = new Set(files.flatMap((f) => f.groups));
const uncovered = [...byGroup.keys()].filter((c) => !covered.has(c));
if (uncovered.length) {
  console.error(`✖ categories without a docs page: ${uncovered.join(', ')}`);
  process.exit(1);
}

let total = 0;
for (const spec of files) {
  const sections = [];
  for (const group of spec.groups) {
    const groupRules = byGroup.get(group) ?? [];
    if (groupRules.length === 0) continue;
    const name = GROUP_CATEGORIES[group] ?? group;
    const rows = groupRules
      .map((r) => `| \`${r.class}\` | \`${cssOf(r)}\` | ${r.description ?? ''} |`)
      .join('\n');
    sections.push(
      `## ${name}\n\n**${groupRules.length} utilities**\n\n| Class | CSS | Description |\n| --- | --- | --- |\n${rows}`,
    );
    total += groupRules.length;
  }
  const content = `---\ntitle: ${spec.title}\n---\n\n# ${spec.title}\n\n> Part of the [Nakshora Utilities Reference](../UTILITIES.md). These tables are **generated from the framework source** — what you see here is exactly what the compiler emits.\n\n${spec.intro}\n\n${sections.join('\n\n')}\n\n---\n\n## Responsive & state variants\n\nEvery utility above accepts a responsive prefix (\`xxs:\` … \`5xl:\`, \`max-md:\`, container \`@md:\`) and — in JIT mode — a state variant (\`hover:\`, \`focus:\`, \`active:\`, \`disabled:\`, \`dark:\`, \`group-hover:\`, \`peer-focus:\`, …). See [Variants](../VARIANTS.md) and [Responsive](../RESPONSIVE.md).\n`;
  writeFileSync(join(outDir, spec.file), content);
  console.log(`✅ docs/utilities/${spec.file}`);
}

// INDEX
const indexLines = files.map((f, i) => {
  const count = f.groups.reduce((acc, g) => acc + (byGroup.get(g)?.length ?? 0), 0);
  return `| ${i + 1}. [${f.title}](./${f.file}) | ${count} |`;
});
writeFileSync(
  join(outDir, 'README.md'),
  `# Utilities Reference — Index\n\nEvery utility the Nakshora compiler can generate, organized by category. Tables are generated from the source registry.\n\n| Reference | Utilities |\n| --- | --- |\n${indexLines.join('\n')}\n| 13. [Design Components](./13-components.md) | built-in |\n\nTotal generated utilities: **${total}** (+ responsive & state variants in JIT mode).\n`,
);
console.log(`✅ docs/utilities/README.md — total: ${total} utilities`);
