#!/usr/bin/env node
// Regenerate packages/@nakshora/core/src/tailwind-defaults.ts from the
// installed tailwindcss (dev dependency, pinned to 3.4.19) resolved default
// theme. Only the scales Nakshora stores verbatim are exported; scales that
// Tailwind derives from `spacing` (margin, padding, inset, width…) and
// `colors` are composed in theme.ts. Functions in the resolved theme
// (`({ theme }) => …`) are evaluated with the resolved theme.
//
//   node scripts/sync-tailwind-theme.mjs           # rewrite the file
//   node scripts/sync-tailwind-theme.mjs --check   # exit 1 when it would change
//
// The output is then formatted with prettier so it matches the repo style.

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const target = join(root, 'packages/@nakshora/core/src/tailwind-defaults.ts');

const resolveConfig = require('tailwindcss/resolveConfig');
const { version } = require('tailwindcss/package.json');
const theme = resolveConfig({}).theme;

const KEYS = [
  'animation',
  'aspectRatio',
  'backgroundImage',
  'backgroundPosition',
  'backgroundSize',
  'blur',
  'borderRadius',
  'borderWidth',
  'boxShadow',
  'brightness',
  'contrast',
  'cursor',
  'dropShadow',
  'flex',
  'flexGrow',
  'flexShrink',
  'fontFamily',
  'fontSize',
  'fontWeight',
  'gradientColorStopPositions',
  'grayscale',
  'gridAutoColumns',
  'gridAutoRows',
  'gridColumn',
  'gridColumnEnd',
  'gridColumnStart',
  'gridRow',
  'gridRowEnd',
  'gridRowStart',
  'gridTemplateColumns',
  'gridTemplateRows',
  'hueRotate',
  'invert',
  'keyframes',
  'letterSpacing',
  'lineHeight',
  'listStyleType',
  'objectPosition',
  'opacity',
  'order',
  'outlineOffset',
  'outlineWidth',
  'ringWidth',
  'rotate',
  'saturate',
  'scale',
  'sepia',
  'skew',
  'spacing',
  'textDecorationThickness',
  'transformOrigin',
  'transitionDuration',
  'transitionProperty',
  'transitionTimingFunction',
  'willChange',
  'zIndex',
];

const out = {};
for (const k of KEYS) {
  const v = theme[k];
  if (v === undefined) throw new Error(`tailwind theme has no "${k}"`);
  out[k] = v;
}

const quoteKey = (k) => (/^[A-Za-z_$][\w$]*$/.test(k) ? k : `'${k.replace(/'/g, "\\'")}'`);
const str = (s) => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
function emit(v, indent) {
  const pad = '  '.repeat(indent);
  if (Array.isArray(v))
    return `[\n${v.map((x) => `${pad}  ${emit(x, indent + 1)},`).join('\n')}\n${pad}]`;
  if (v && typeof v === 'object')
    return `{\n${Object.entries(v)
      .map(([k, x]) => `${pad}  ${quoteKey(k)}: ${emit(x, indent + 1)},`)
      .join('\n')}\n${pad}}`;
  if (typeof v === 'string') return str(v);
  return String(v);
}

const body = `// AUTO-GENERATED from tailwindcss@${version} resolved default theme (MIT).
// Do not edit by hand — regenerate with scripts/sync-tailwind-theme.mjs
// Scales derived from \`spacing\` (margin, padding, gap, inset, width…) are
// composed at resolve-time in theme.ts, not stored here.

export const tailwindDefaults: Record<string, Record<string, unknown>> = ${emit(out, 0)};
`;

const prettier = require('prettier');
const options = (await prettier.resolveConfig(target)) ?? {};
const formatted = await prettier.format(body, { ...options, filepath: target });
const before = readFileSync(target, 'utf-8');
if (process.argv.includes('--check')) {
  if (formatted !== before) {
    console.error(
      'tailwind-defaults.ts is out of sync with the installed tailwindcss — run scripts/sync-tailwind-theme.mjs',
    );
    process.exit(1);
  }
  console.log(`tailwind-defaults.ts in sync with tailwindcss@${version}`);
} else {
  writeFileSync(target, formatted);
  console.log(
    `${formatted === before ? 'unchanged' : 'updated'} ${target} (tailwindcss@${version})`,
  );
}
