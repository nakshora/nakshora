// `nakshora doctor` — diagnose a project set-up without building anything.
//
// Pure function (`diagnose`) + a printer so the checks are unit-testable.

import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, isAbsolute, join, resolve } from 'node:path';
import { globby } from 'globby';
import {
  CSSGenerator,
  ApplyError,
  version,
  extractCssConfig,
  hasCssConfig,
  mergeCssConfig,
  type NakshoraConfig,
} from '@nakshora/core';
import { findConfigFile, loadConfigFile } from './config-loader';

export type Level = 'ok' | 'warn' | 'error';
export interface Finding {
  level: Level;
  check: string;
  message: string;
  hint?: string;
}

// no `g` flag: `.test()` on a global regex keeps `lastIndex` between files
const CSS_AT_RULES =
  /@nakshora\s+(source|utilities|utils|base|variables|vars|keyframes|components)\s*;?/;

export async function diagnose(
  cwd: string = process.cwd(),
  explicitConfig?: string,
): Promise<{
  findings: Finding[];
  config: Partial<NakshoraConfig> | null;
  configFile: string | null;
}> {
  const findings: Finding[] = [];
  const push = (level: Level, check: string, message: string, hint?: string): void => {
    findings.push({ level, check, message, hint });
  };

  // ── runtime ──
  const major = Number(process.versions.node.split('.')[0]);
  if (major >= 18) push('ok', 'node', `Node ${process.version}`);
  else push('error', 'node', `Node ${process.version} is too old`, 'Nakshora needs Node >= 18');
  push('ok', 'version', `@nakshora/core ${version}`);

  // ── config discovery ──
  const file = explicitConfig
    ? isAbsolute(explicitConfig)
      ? explicitConfig
      : resolve(cwd, explicitConfig)
    : findConfigFile(cwd);
  let config: Partial<NakshoraConfig> | null = null;
  if (!file) {
    push(
      'warn',
      'config',
      'no nakshora.config.{js,mjs,cjs,ts,json} found (walking up from the current directory)',
      'run `nakshora init`, or pass --content to build in JIT mode without a config',
    );
  } else if (!existsSync(file)) {
    push('error', 'config', `config file not found: ${file}`);
  } else {
    try {
      config = await loadConfigFile(file);
      push('ok', 'config', `loaded ${file}`);
    } catch (err) {
      push('error', 'config', `failed to load ${file}: ${(err as Error).message}`);
    }
  }

  if (config) {
    // ── content ──
    const content = config.content ?? config.purge;
    if (!content || (Array.isArray(content) && content.length === 0)) {
      push(
        'warn',
        'content',
        'no `content` configured — builds run in FULL mode (every utility, ~6 MB)',
        "add content: ['./src/**/*.{html,js,ts,jsx,tsx,vue,svelte}'] for JIT output",
      );
    } else {
      const entries = Array.isArray(content) ? content : [content];
      const base = file ? dirname(file) : cwd;
      let total = 0;
      for (const entry of entries) {
        if (/[*{[]/.test(entry)) {
          const files = await globby(entry, { cwd: base, absolute: true });
          total += files.length;
          if (files.length === 0)
            push(
              'warn',
              'content',
              `glob matches no files: ${entry}`,
              `resolved relative to ${base}`,
            );
          else if (!/node_modules/.test(entry) && files.some((f) => f.includes('/node_modules/')))
            push(
              'warn',
              'content',
              `glob reaches into node_modules: ${entry}`,
              'this scans thousands of files on every build; narrow it',
            );
          else push('ok', 'content', `${entry} → ${files.length} file(s)`);
        } else if (existsSync(resolve(base, entry)) && statSync(resolve(base, entry)).isFile()) {
          total++;
          push('ok', 'content', `${entry} (file)`);
        } else {
          push(
            'warn',
            'content',
            `"${entry.slice(0, 40)}${entry.length > 40 ? '…' : ''}" is neither a glob nor an existing file — treated as raw template text`,
          );
        }
      }
      if (total > 5000)
        push(
          'warn',
          'content',
          `${total} files matched — large content sets slow down every rebuild`,
          'exclude build output / vendored directories',
        );
      if (config.purge && !config.content)
        push(
          'warn',
          'config',
          '`purge` is the legacy name',
          'rename it to `content` (identical semantics)',
        );
    }

    // ── config sanity: instantiate the generator, validate theme-ish things ──
    try {
      const gen = new CSSGenerator(config);
      const screens = Object.keys(gen.theme.screens);
      push(
        'ok',
        'theme',
        `${gen.getUtilities().length} utilities, ${screens.length} screens (${screens.join(' ')})`,
      );
      const safelist = (config.safelist ?? []) as unknown[];
      const badSafe = safelist.filter(
        (s) => typeof s === 'string' && gen.engine.compile(s).length === 0,
      );
      if (badSafe.length)
        push('warn', 'safelist', `safelist entries that produce no CSS: ${badSafe.join(' ')}`);
      if (config.important === true)
        push(
          'warn',
          'config',
          '`important: true` marks every declaration !important',
          "prefer important: '#app' (selector strategy) when you only need to win over third-party CSS",
        );
      const unknownVariantKeys = Object.keys(config.variants ?? {}).filter(
        (k) =>
          ![
            'hover',
            'focus',
            'focusVisible',
            'focusWithin',
            'active',
            'visited',
            'disabled',
            'firstChild',
            'lastChild',
            'group',
            'groupHover',
            'groupFocus',
            'peer',
            'peerHover',
            'peerFocus',
            'dark',
            'responsive',
            'maxResponsive',
            'containerQueries',
          ].includes(k),
      );
      if (unknownVariantKeys.length)
        push(
          'warn',
          'variants',
          `unknown variants keys are ignored: ${unknownVariantKeys.join(', ')}`,
        );
    } catch (err) {
      push('error', 'config', `config rejected by the compiler: ${(err as Error).message}`);
    }
  }

  // ── stylesheets: @nakshora at-rules and @apply that would fail ──
  const cssFiles = await globby(
    ['**/*.css', '!node_modules/**', '!dist/**', '!build/**', '!**/*.min.css'],
    {
      cwd,
      absolute: true,
    },
  );
  const withAtRule = cssFiles.filter((f) => CSS_AT_RULES.test(readFileSync(f, 'utf-8')));
  if (cssFiles.length && withAtRule.length === 0 && config)
    push(
      'warn',
      'css',
      `none of ${cssFiles.length} stylesheet(s) contain \`@nakshora source;\``,
      'add `@nakshora source;` to your entry CSS (or import "virtual:nakshora" with the Vite plugin)',
    );
  else if (withAtRule.length)
    push(
      'ok',
      'css',
      `@nakshora at-rules in ${withAtRule.map((f) => f.replace(cwd + '/', '')).join(', ')}`,
    );
  if (config) {
    // CSS-first configuration (@theme / @utility / @custom-variant) extends the
    // config exactly as the build does; its notes are surfaced as warnings.
    let effective = config;
    const cssConfigFiles: string[] = [];
    for (const f of cssFiles.slice(0, 200)) {
      const css = readFileSync(f, 'utf-8');
      if (!hasCssConfig(css)) continue;
      const extracted = extractCssConfig(css);
      effective = mergeCssConfig(effective, extracted.config);
      cssConfigFiles.push(f.replace(cwd + '/', ''));
      for (const note of extracted.notes)
        push('warn', 'css-config', `${f.replace(cwd + '/', '')}: ${note}`);
      for (const m of css.matchAll(/--(modifier|alpha|spacing)\(/g))
        push(
          'warn',
          'css-config',
          `${f.replace(cwd + '/', '')}: \`--${m[1]}()\` is not implemented — the literal text stays in the output`,
          'use theme values or a plugin `matchUtilities` callback instead',
        );
    }
    if (cssConfigFiles.length)
      push(
        'ok',
        'css-config',
        `@theme / @utility / @custom-variant in ${cssConfigFiles.join(', ')}`,
      );
    const gen = new CSSGenerator(effective);
    for (const f of cssFiles.slice(0, 200)) {
      let css = readFileSync(f, 'utf-8');
      if (hasCssConfig(css)) css = extractCssConfig(css).css;
      if (!/@apply\b|theme\(|@screen\b/.test(css)) continue;
      try {
        gen.processCss(css);
        push('ok', 'apply', `${f.replace(cwd + '/', '')}: @apply / theme() resolve`);
      } catch (err) {
        if (err instanceof ApplyError)
          push('error', 'apply', `${f.replace(cwd + '/', '')}: ${err.message}`);
      }
    }
  }

  // ── package set-up ──
  const pkgPath = join(cwd, 'package.json');
  if (existsSync(pkgPath)) {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8')) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    const has = (n: string): boolean => n in deps;
    if (has('@nakshora/vite-plugin') && !has('vite'))
      push('warn', 'deps', '@nakshora/vite-plugin is installed but vite is not');
    if (has('@nakshora/postcss') && !has('postcss'))
      push(
        'warn',
        'deps',
        '@nakshora/postcss needs the postcss peer dependency',
        'npm i -D postcss',
      );
    if (
      has('tailwindcss') &&
      (has('@nakshora/cli') || has('@nakshora/postcss') || has('@nakshora/vite-plugin'))
    )
      push(
        'warn',
        'deps',
        'both tailwindcss and Nakshora are installed',
        'run `nakshora migrate` to port tailwind.config.* and remove tailwindcss to avoid double-processing',
      );
    if (!Object.keys(deps).some((d) => d.startsWith('@nakshora/')))
      push(
        'warn',
        'deps',
        'no @nakshora/* package in package.json',
        'npm i -D @nakshora/cli (or @nakshora/vite-plugin / @nakshora/postcss)',
      );
  }

  return { findings, config, configFile: file ?? null };
}

export function formatFindings(findings: Finding[]): string {
  const icon: Record<Level, string> = { ok: '✔', warn: '▲', error: '✖' };
  return findings
    .map(
      (f) =>
        `${icon[f.level]} ${f.check.padEnd(9)} ${f.message}${f.hint ? `\n            ↳ ${f.hint}` : ''}`,
    )
    .join('\n');
}
