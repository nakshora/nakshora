// CSS-first configuration (Tailwind v4 style) — opt-in, additive.
//
//   @theme { --color-brand-500: #123456; --breakpoint-3xl: 120rem; --font-display: "Inter", sans-serif; }
//   @theme inline { … }                      (same; the `inline`/`static`/`reference` flags are accepted)
//   @utility content-auto { content-visibility: auto; }
//   @utility tab-* { tab-size: --value(--tab-size-*, integer, [integer]); }
//   @custom-variant hocus (&:hover, &:focus);
//   @custom-variant theme-midnight (&:where([data-theme="midnight"] *));
//   @custom-variant any-hover { @media (any-hover: hover) { @slot; } }
//
// `extractCssConfig(css)` removes those blocks and returns the equivalent
// `NakshoraConfig` fragment (theme.extend + a plugin) plus the remaining CSS
// and the `:root` custom properties that `@theme` also emits (Tailwind emits
// every `@theme` variable as a CSS variable; `@theme reference` does not).
//
// Namespace → theme key mapping follows Tailwind v4's documented table.
// Anything that does not map (e.g. `--my-token`) is kept as a plain `:root`
// custom property so `var(--my-token)` keeps working.

import { parseCss, serializeCss, type CssAtRule, type CssDecl, type CssNode } from './css-ast';
import type { NakshoraConfig, UtilityGenerator } from './types';

export interface CssConfigResult {
  /** CSS with the configuration at-rules removed */
  css: string;
  /** config fragment: `theme.extend` + one plugin for utilities / variants */
  config: Partial<NakshoraConfig>;
  /** `:root { --color-…: … }` block for the `@theme` variables (empty for `reference`) */
  rootVars: string;
  /** true when any configuration at-rule was present */
  found: boolean;
  /** human-readable notes (ignored namespaces, unsupported forms) */
  notes: string[];
}

/** Tailwind v4 namespace → v3 theme key. `null` = keep as a CSS variable only. */
export const THEME_NAMESPACES: Record<string, string | null> = {
  color: 'colors',
  font: 'fontFamily',
  text: 'fontSize',
  'font-weight': 'fontWeight',
  tracking: 'letterSpacing',
  leading: 'lineHeight',
  breakpoint: 'screens',
  container: 'containers',
  spacing: 'spacing',
  radius: 'borderRadius',
  shadow: 'boxShadow',
  'inset-shadow': null,
  'drop-shadow': 'dropShadow',
  blur: 'blur',
  perspective: null,
  aspect: 'aspectRatio',
  ease: 'transitionTimingFunction',
  animate: 'animation',
  default: null,
};

const CONFIG_AT_RULES = new Set(['theme', 'utility', 'custom-variant']);

export function hasCssConfig(css: string): boolean {
  return /@(?:theme|utility|custom-variant)\b/.test(css);
}

export function extractCssConfig(css: string): CssConfigResult {
  const notes: string[] = [];
  if (!hasCssConfig(css)) return { css, config: {}, rootVars: '', found: false, notes };

  const root = parseCss(css);
  const themeVars = new Map<string, string>();
  const rootVarList: [string, string][] = [];
  const keyframes: Record<string, Record<string, Record<string, string>>> = {};
  const staticUtilities: Record<string, Record<string, unknown>> = {};
  const functionalUtilities: {
    name: string;
    decls: CssDecl[];
    nested: CssNode[];
  }[] = [];
  const variants: { name: string; formats: string[] }[] = [];
  let found = false;

  const remaining: CssNode[] = [];
  for (const node of root.nodes) {
    if (node.type !== 'atrule' || !CONFIG_AT_RULES.has(node.name)) {
      remaining.push(node);
      continue;
    }
    found = true;
    if (node.name === 'theme') {
      const flags = node.params.trim().split(/\s+/).filter(Boolean);
      const reference = flags.includes('reference');
      for (const child of node.nodes ?? []) {
        if (child.type === 'decl' && child.prop.startsWith('--')) {
          const name = child.prop.slice(2);
          if (name === '*' || child.value === 'initial') {
            const ns = splitNamespace(name.replace(/-\*$/, '')).namespace ?? name;
            const key = THEME_NAMESPACES[ns] ?? ns;
            notes.push(
              `@theme: \`${child.prop}: initial\` (namespace reset) is not supported — set \`theme.${key}\` in the config to replace the scale`,
            );
            continue;
          }
          themeVars.set(name, child.value);
          if (!reference) rootVarList.push([child.prop, child.value]);
        } else if (child.type === 'atrule' && child.name === 'keyframes') {
          const frames: Record<string, Record<string, string>> = {};
          for (const step of child.nodes ?? [])
            if (step.type === 'rule')
              frames[step.selector] = Object.fromEntries(
                step.nodes
                  .filter((n): n is CssDecl => n.type === 'decl')
                  .map((d) => [d.prop, d.value]),
              );
          keyframes[child.params.trim()] = frames;
        }
      }
    } else if (node.name === 'utility') {
      const name = node.params.trim();
      const decls = (node.nodes ?? []).filter((n): n is CssDecl => n.type === 'decl');
      const nested = (node.nodes ?? []).filter((n) => n.type !== 'decl');
      if (name.endsWith('-*')) functionalUtilities.push({ name: name.slice(0, -2), decls, nested });
      else staticUtilities[`.${name}`] = nodesToCssInJs(node.nodes ?? []);
    } else {
      const m = /^([\w@-]+)\s*(?:\((.*)\))?$/s.exec(node.params.trim());
      if (!m) {
        notes.push(`@custom-variant: cannot parse \`${node.params}\``);
        continue;
      }
      const name = m[1];
      if (m[2] !== undefined) variants.push({ name, formats: splitTopLevel(m[2]) });
      else variants.push({ name, formats: blockVariantFormats(node) });
    }
  }

  // ── theme.extend from the variables ──
  const extend: Record<string, Record<string, unknown>> = {};
  const fontSizeMeta: Record<string, Record<string, string>> = {};
  for (const [name, value] of themeVars) {
    const { namespace, key } = splitNamespace(name);
    if (!namespace || !(namespace in THEME_NAMESPACES)) {
      if (namespace !== null && namespace !== undefined && !(namespace in THEME_NAMESPACES))
        notes.push(`@theme: \`--${name}\` has no utility namespace — kept as a CSS variable only`);
      continue;
    }
    const themeKey = THEME_NAMESPACES[namespace];
    if (themeKey === null) {
      notes.push(
        `@theme: \`--${name}\` (${namespace}) maps to a v4-only utility — kept as a CSS variable only`,
      );
      continue;
    }
    // `--text-xl--line-height: 1.75rem` style metadata
    const meta = /^(.*?)--(line-height|letter-spacing|font-weight)$/.exec(key);
    if (themeKey === 'fontSize' && meta) {
      (fontSizeMeta[meta[1]] ??= {})[camel(meta[2])] = value;
      continue;
    }
    if (themeKey === 'colors') setColor(extend, key, resolveVarRefs(value, themeVars));
    else (extend[themeKey] ??= {})[key] = resolveVarRefs(value, themeVars);
  }
  for (const [k, meta] of Object.entries(fontSizeMeta)) {
    const size = (extend.fontSize ??= {})[k];
    if (size !== undefined) extend.fontSize[k] = [size, meta];
  }
  if (Object.keys(keyframes).length) extend.keyframes = keyframes;

  // ── plugin for utilities / variants ──
  const plugin =
    Object.keys(staticUtilities).length || functionalUtilities.length || variants.length
      ? (api: UtilityGenerator): void => {
          if (Object.keys(staticUtilities).length) api.addUtilities(staticUtilities);
          for (const fu of functionalUtilities) {
            const { values, kinds } = functionalValues(fu.decls, api, themeVars);
            api.matchUtilities(
              {
                [fu.name]: (value) => {
                  const v = String(value);
                  const out: Record<string, unknown> = {};
                  for (const d of fu.decls) out[d.prop] = substituteValue(d.value, v);
                  for (const n of fu.nested) Object.assign(out, nodesToCssInJs([n]));
                  return out;
                },
              },
              { values, type: matchType(kinds), bare: bareKind(kinds) },
            );
          }
          for (const v of variants) api.addVariant(v.name, v.formats);
        }
      : undefined;

  const config: Partial<NakshoraConfig> = {};
  if (Object.keys(extend).length) config.theme = { extend } as NakshoraConfig['theme'];
  if (plugin) config.plugins = [plugin];

  const rootVars = rootVarList.length
    ? `:root {\n${rootVarList.map(([p, v]) => `  ${p}: ${v};`).join('\n')}\n}\n`
    : '';
  return { css: serializeCss({ type: 'root', nodes: remaining }), config, rootVars, found, notes };
}

/** Merge a CSS-config fragment into a config (theme.extend deep-merged, plugins appended). */
export function mergeCssConfig(
  base: Partial<NakshoraConfig>,
  fragment: Partial<NakshoraConfig>,
): Partial<NakshoraConfig> {
  const out: Partial<NakshoraConfig> = { ...base };
  if (fragment.theme?.extend) {
    const baseExtend = (base.theme?.extend ?? {}) as Record<string, unknown>;
    const fragExtend = fragment.theme.extend as Record<string, unknown>;
    const extend: Record<string, unknown> = { ...baseExtend };
    for (const [k, v] of Object.entries(fragExtend)) {
      const existing = baseExtend[k];
      extend[k] =
        existing && typeof existing === 'object' && !Array.isArray(existing)
          ? { ...(existing as object), ...(v as object) }
          : v;
    }
    out.theme = { ...(base.theme ?? {}), extend } as NakshoraConfig['theme'];
  }
  if (fragment.plugins?.length) out.plugins = [...(base.plugins ?? []), ...fragment.plugins];
  return out;
}

// ───────────────────────────── helpers ─────────────────────────────

function splitNamespace(name: string): { namespace: string | null; key: string } {
  // longest namespace first (`font-weight` before `font`, `inset-shadow` before `shadow`)
  const candidates = Object.keys(THEME_NAMESPACES).sort((a, b) => b.length - a.length);
  for (const ns of candidates) {
    if (name === ns) return { namespace: ns, key: 'DEFAULT' };
    if (name.startsWith(`${ns}-`)) return { namespace: ns, key: name.slice(ns.length + 1) };
  }
  return { namespace: name.split('-')[0] ?? null, key: name };
}

function setColor(
  extend: Record<string, Record<string, unknown>>,
  key: string,
  value: string,
): void {
  const colors = (extend.colors ??= {});
  const m = /^(.*)-(\d{2,4}|DEFAULT)$/.exec(key);
  if (m) {
    const existing = colors[m[1]];
    const palette: Record<string, string> =
      existing && typeof existing === 'object' ? (existing as Record<string, string>) : {};
    if (typeof existing === 'string') palette.DEFAULT = existing;
    palette[m[2]] = value;
    colors[m[1]] = palette;
  } else {
    const existing = colors[key];
    if (existing && typeof existing === 'object')
      (existing as Record<string, string>).DEFAULT = value;
    else colors[key] = value;
  }
}

function resolveVarRefs(value: string, vars: Map<string, string>, depth = 0): string {
  if (depth > 8) return value;
  return value.replace(/var\(--([\w-]+)\)/g, (m, name: string) =>
    vars.has(name) ? resolveVarRefs(vars.get(name) as string, vars, depth + 1) : m,
  );
}

function camel(s: string): string {
  return s.replace(/-(\w)/g, (_, c: string) => c.toUpperCase());
}

function splitTopLevel(list: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let cur = '';
  for (const ch of list) {
    if (ch === '(' || ch === '[') depth++;
    else if (ch === ')' || ch === ']') depth--;
    if (ch === ',' && depth === 0) {
      out.push(cur.trim());
      cur = '';
    } else cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

/** `@custom-variant x { @media (…) { @slot; } }` / `{ &:is(.x) { @slot; } }` */
function blockVariantFormats(node: CssAtRule): string[] {
  const formats: string[] = [];
  const walk = (nodes: CssNode[], prefix: string[]): void => {
    for (const n of nodes) {
      if (n.type === 'atrule' && n.name === 'slot')
        formats.push(...(prefix.length ? prefix : ['&']));
      else if (n.type === 'atrule' && n.nodes)
        walk(n.nodes, [...prefix, `@${n.name} ${n.params}`.trim()]);
      else if (n.type === 'rule') walk(n.nodes, [...prefix, n.selector]);
    }
  };
  walk(node.nodes ?? [], []);
  return formats;
}

function nodesToCssInJs(nodes: CssNode[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const n of nodes) {
    if (n.type === 'decl') out[n.prop] = n.important ? `${n.value} !important` : n.value;
    else if (n.type === 'rule') out[n.selector] = nodesToCssInJs(n.nodes);
    else if (n.type === 'atrule' && n.nodes)
      out[`@${n.name} ${n.params}`.trim()] = nodesToCssInJs(n.nodes);
  }
  return out;
}

const VALUE_FN = /--value\(([^)]*)\)/g;

interface ValueKinds {
  /** theme namespaces referenced (`--tab-size-*`) */
  namespaces: string[];
  /** bare data types accepted (`integer`, `number`, `percentage`) */
  bare: string[];
  /** arbitrary accepted (`[integer]`, `[*]`) */
  arbitrary: boolean;
}

function functionalValues(
  decls: CssDecl[],
  api: UtilityGenerator,
  themeVars: Map<string, string>,
): { values: Record<string, string>; kinds: ValueKinds } {
  const kinds: ValueKinds = { namespaces: [], bare: [], arbitrary: false };
  for (const d of decls)
    for (const m of d.value.matchAll(VALUE_FN))
      for (const arg of splitTopLevel(m[1])) {
        if (arg.startsWith('--') && arg.endsWith('-*')) kinds.namespaces.push(arg.slice(2, -2));
        else if (arg.startsWith('[')) kinds.arbitrary = true;
        else if (/^[a-z]+$/.test(arg)) kinds.bare.push(arg);
      }
  const values: Record<string, string> = {};
  for (const ns of kinds.namespaces) {
    for (const [name, value] of themeVars)
      if (name.startsWith(`${ns}-`)) values[name.slice(ns.length + 1)] = value;
    const themeKey = THEME_NAMESPACES[ns];
    const scale = themeKey
      ? (api.theme(themeKey) as Record<string, unknown> | undefined)
      : undefined;
    if (scale)
      for (const [k, v] of Object.entries(scale)) if (typeof v === 'string') values[k] ??= v;
  }
  return { values, kinds };
}

function substituteValue(template: string, value: string): string {
  return template.replace(VALUE_FN, () => value);
}

/** `--value(integer|number|percentage)` → bare values accepted (`tab-4`) */
function bareKind(kinds: ValueKinds): 'integer' | 'number' | 'percentage' | undefined {
  if (kinds.bare.includes('percentage')) return 'percentage';
  if (kinds.bare.includes('number') || kinds.bare.includes('ratio')) return 'number';
  if (kinds.bare.includes('integer')) return 'integer';
  return undefined;
}

/** `--value([integer])` / `[*]` → matchUtilities `type` for the bracket form */
function matchType(kinds: ValueKinds): string[] | undefined {
  const map: Record<string, string> = {
    integer: 'number',
    number: 'number',
    percentage: 'percentage',
    ratio: 'any',
  };
  if (!kinds.arbitrary)
    return kinds.bare.length ? [...new Set(kinds.bare.map((k) => map[k] ?? 'any'))] : undefined;
  return undefined; // `[…]` accepts anything
}

export { CONFIG_AT_RULES };
