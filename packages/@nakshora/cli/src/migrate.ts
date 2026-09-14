// `nakshora migrate` — codemods for moving to Nakshora v3:
//   • tailwind.config.{js,cjs,mjs,ts} → nakshora.config.js  (`--from tailwind`)
//   • Nakshora v1 class names in source files                (`--from v1`)
//
// Everything is a pure text transform (`migrateSource`, `migrateTailwindConfig`)
// so it is testable; the command wires the file system.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import fg from 'fast-glob';

/** Nakshora v1 (static CSS) → v3 class renames. */
export const V1_RENAMES: Record<string, string> = {
  'card-neon': 'neon-card',
  'btn-neon': 'neon-btn',
  'animate-neonGlow': 'animate-neon-glow',
  uhd: '4xl',
  k8: '5xl',
};

/** Tailwind v3 class names that Nakshora spells differently (rare) + deprecated forms. */
export const TAILWIND_RENAMES: Record<string, string> = {
  'flex-grow': 'grow',
  'flex-grow-0': 'grow-0',
  'flex-shrink': 'shrink',
  'flex-shrink-0': 'shrink-0',
  'overflow-ellipsis': 'text-ellipsis',
  'decoration-slice': 'box-decoration-slice',
  'decoration-clone': 'box-decoration-clone',
};

export interface MigrateResult {
  text: string;
  changes: { from: string; to: string; count: number }[];
}

/** Rewrite class tokens inside `class`/`className` attributes and string literals. */
export function migrateSource(text: string, from: 'v1' | 'tailwind'): MigrateResult {
  const table = from === 'v1' ? V1_RENAMES : TAILWIND_RENAMES;
  const counts = new Map<string, number>();
  const out = text.replace(
    /(class(?:Name)?\s*=\s*)(["'`])([\s\S]*?)\2/g,
    (_m, attr: string, q: string, body: string) => {
      const rewritten = body
        .split(/(\s+)/)
        .map((tok) => {
          if (!tok.trim()) return tok;
          // keep variant prefixes: `md:card-neon` → `md:neon-card`, `uhd:flex` → `4xl:flex`
          const parts = tok.split(':');
          const mapped = parts.map((p, i) => {
            const bare = p.replace(/^!/, '').replace(/!$/, '');
            const isVariant = i < parts.length - 1;
            const to = table[bare];
            if (!to) return p;
            if (isVariant && from !== 'v1') return p; // Tailwind renames are utilities only
            counts.set(bare, (counts.get(bare) ?? 0) + 1);
            return p.replace(bare, to);
          });
          return mapped.join(':');
        })
        .join('');
      return `${attr}${q}${rewritten}${q}`;
    },
  );
  return {
    text: out,
    changes: [...counts].map(([f, count]) => ({ from: f, to: table[f], count })),
  };
}

/**
 * Turn a tailwind.config.* into a nakshora.config.js. Tailwind's config shape
 * is accepted as-is by Nakshora (theme, extend, screens, content, safelist,
 * darkMode, plugins, corePlugins, prefix, important); the codemod rewrites
 * the module wrapper, the `require('tailwindcss/...)` imports and notes what
 * it could not translate.
 */
export function migrateTailwindConfig(source: string): { text: string; notes: string[] } {
  const notes: string[] = [];
  let text = source;
  // /** @type {import('tailwindcss').Config} */ → nakshora type
  text = text.replace(
    /\/\*\*\s*@type\s*\{import\(['"]tailwindcss['"]\)\.Config\}\s*\*\//,
    "/** @type {import('@nakshora/core').NakshoraConfig} */",
  );
  text = text.replace(
    /import\s+type\s+\{\s*Config\s*\}\s+from\s+['"]tailwindcss['"];?/g,
    "import type { NakshoraConfig } from '@nakshora/core';",
  );
  text = text
    .replace(/satisfies\s+Config\b/g, 'satisfies NakshoraConfig')
    .replace(/:\s*Config\b/g, ': NakshoraConfig');
  // defaultTheme / colors imports
  if (/tailwindcss\/defaultTheme/.test(text)) {
    text = text
      .replace(
        /const\s+defaultTheme\s*=\s*require\(['"]tailwindcss\/defaultTheme['"]\);?/g,
        "const { defaultTheme } = require('@nakshora/core');",
      )
      .replace(
        /import\s+defaultTheme\s+from\s+['"]tailwindcss\/defaultTheme['"];?/g,
        "import { defaultTheme } from '@nakshora/core';",
      );
    notes.push(
      '`tailwindcss/defaultTheme` → `defaultTheme` from @nakshora/core (same keys, Tailwind values)',
    );
  }
  if (/tailwindcss\/colors/.test(text)) {
    text = text
      .replace(
        /const\s+colors\s*=\s*require\(['"]tailwindcss\/colors['"]\);?/g,
        "const { defaultColors: colors } = require('@nakshora/core');",
      )
      .replace(
        /import\s+colors\s+from\s+['"]tailwindcss\/colors['"];?/g,
        "import { defaultColors as colors } from '@nakshora/core';",
      );
    notes.push('`tailwindcss/colors` → `defaultColors` from @nakshora/core');
  }
  if (/tailwindcss\/plugin/.test(text)) {
    text = text
      .replace(
        /const\s+plugin\s*=\s*require\(['"]tailwindcss\/plugin['"]\);?/g,
        "const { plugin } = require('@nakshora/core');",
      )
      .replace(
        /import\s+plugin\s+from\s+['"]tailwindcss\/plugin['"];?/g,
        "import { plugin } from '@nakshora/core';",
      );
    notes.push('`tailwindcss/plugin` → `plugin` from @nakshora/core (same API incl. withOptions)');
  }
  for (const p of ['typography', 'forms', 'aspect-ratio', 'container-queries'])
    if (text.includes(`@tailwindcss/${p}`))
      notes.push(
        `@tailwindcss/${p} works unchanged through the plugin adapter (keep the dependency)`,
      );
  if (/\bpresets\s*:/.test(text))
    notes.push('`presets` accepted: Tailwind preset objects and Nakshora theme presets both work');
  if (/screens\s*:\s*\{/.test(text))
    notes.push(
      '`theme.screens` REPLACES the 10-step scale (Tailwind semantics); use `theme.breakpoints` to extend it instead',
    );
  if (/darkMode\s*:\s*['"]media['"]/.test(text))
    notes.push("darkMode: 'media' kept — Nakshora's default is 'class' (`:is(.dark *)`)");
  if (!/darkMode\s*:/.test(text))
    notes.push(
      "no darkMode key: Tailwind defaults to 'media', Nakshora to 'class' — add darkMode: 'media' to keep behaviour",
    );
  if (/future\s*:|experimental\s*:/.test(text))
    notes.push('`future` / `experimental` keys are ignored');
  if (/separator\s*:/.test(text))
    notes.push('`separator` is not configurable (always `:`) — the key is ignored');
  return { text, notes };
}

export interface MigrateRunOptions {
  cwd: string;
  from: 'v1' | 'tailwind';
  globs: string[];
  write: boolean;
}

export async function runMigrate(o: MigrateRunOptions): Promise<{
  files: { file: string; changes: MigrateResult['changes'] }[];
  config?: { from: string; to: string; notes: string[] };
}> {
  const out: { file: string; changes: MigrateResult['changes'] }[] = [];
  const files = await fg(o.globs, {
    cwd: o.cwd,
    absolute: true,
    ignore: ['**/node_modules/**', '**/dist/**'],
  });
  for (const f of files) {
    const src = readFileSync(f, 'utf-8');
    const res = migrateSource(src, o.from);
    if (res.changes.length === 0) continue;
    out.push({ file: f, changes: res.changes });
    if (o.write) writeFileSync(f, res.text);
  }
  let config: { from: string; to: string; notes: string[] } | undefined;
  if (o.from === 'tailwind') {
    const candidates = [
      'tailwind.config.js',
      'tailwind.config.cjs',
      'tailwind.config.mjs',
      'tailwind.config.ts',
    ];
    const found = candidates.find((c) => existsSync(join(o.cwd, c)));
    if (found) {
      const ext = found.endsWith('.ts')
        ? '.ts'
        : found.endsWith('.cjs')
          ? '.cjs'
          : found.endsWith('.mjs')
            ? '.mjs'
            : '.js';
      const to = join(o.cwd, `nakshora.config${ext}`);
      const res = migrateTailwindConfig(readFileSync(join(o.cwd, found), 'utf-8'));
      if (o.write && !existsSync(to)) writeFileSync(to, res.text);
      config = { from: found, to: `nakshora.config${ext}`, notes: res.notes };
    }
  }
  return { files: out, config };
}
