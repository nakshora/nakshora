// Nakshora Core — plugin API (Tailwind-compatible + Nakshora legacy)
//
// Supports:
//   • Nakshora 3.0 plugins  `{ name, config?(cfg), handler?(api) }`
//   • Tailwind plugins      `plugin(fn, { theme })`, `{ handler, config }`,
//                            `plugin.withOptions(...)` results, bare functions
// and exposes the Tailwind plugin API surface (`addUtilities`, `matchUtilities`,
// `addComponents`, `matchComponents`, `addBase`, `addVariant`, `matchVariant`,
// `theme`, `config`, `e`, `prefix`, `corePlugins`, `variants`).

import {
  collapseAdjacentRules,
  cssInJsToNodes,
  flattenNodes,
  kebabProp,
  splitSelectorList,
  type CssInJs,
  type CssNode,
} from './css-ast';
import type { VariantBranch, VariantDefinition } from './engine';
import type { StaticUtilityDef } from './static-utilities';
import type { ResolvedTheme } from './theme';
import type { Decls, FunctionalRuleShape, FunctionalUtility } from './utilities';
import { escapeClassName, type DataType } from './values';

export interface TailwindPluginObject {
  handler: (api: PluginAPI) => void;
  config?: Record<string, unknown>;
}
export type TailwindPluginFn = ((api: PluginAPI) => void) & { __isOptionsFunction?: boolean };
export type AnyPlugin = TailwindPluginObject | TailwindPluginFn | LegacyPlugin;

export interface LegacyPlugin {
  name?: string;
  config?: ((config: Record<string, unknown>) => void) | Record<string, unknown>;
  handler?: (api: PluginAPI) => void;
}

/**
 * Group name for user `addComponents` / `matchComponents` output. Deliberately
 * distinct from the `components` core-plugin key so that
 * `corePlugins: { components: false }` (which disables Nakshora's *built-in*
 * component blocks) never silences a project's own plugin components.
 */
export const PLUGIN_COMPONENTS_GROUP = 'plugin-components';

export interface MatchOptions {
  values?: Record<string, unknown>;
  type?: DataType | Array<DataType | [DataType, { preferOnConflict?: boolean }]>;
  supportsNegativeValues?: boolean;
  /** Nakshora extension: accept bare `integer` / `number` / `percentage` values (`tab-4`) */
  bare?: 'integer' | 'number' | 'percentage';
  modifiers?: 'any' | Record<string, string>;
  respectPrefix?: boolean;
  respectImportant?: boolean;
}

export interface PluginAPI {
  addUtilities(utilities: CssInJs | CssInJs[], options?: unknown): void;
  matchUtilities(
    utilities: Record<
      string,
      (value: unknown, extra: { modifier: string | null }) => CssInJs | CssInJs[]
    >,
    options?: MatchOptions,
  ): void;
  addComponents(components: CssInJs | CssInJs[], options?: unknown): void;
  matchComponents(
    components: Record<
      string,
      (value: unknown, extra: { modifier: string | null }) => CssInJs | CssInJs[]
    >,
    options?: MatchOptions,
  ): void;
  addBase(base: CssInJs | CssInJs[]): void;
  addVariant(
    name: string,
    definition:
      | string
      | string[]
      | ((api: {
          container?: unknown;
          separator?: string;
          modifySelectors?: unknown;
        }) => string | string[] | void),
  ): void;
  matchVariant(
    name: string,
    fn: (value: string, extra: { modifier: string | null }) => string | string[],
    options?: {
      values?: Record<string, string>;
      /** Tailwind value-aware ordering (`screens`, container sizes) */
      sort?: (
        a: { value: unknown; modifier: string | null },
        b: { value: unknown; modifier: string | null },
      ) => number;
    },
  ): void;
  theme(path?: string, defaultValue?: unknown): unknown;
  config(path?: string, defaultValue?: unknown): unknown;
  corePlugins(name: string): boolean;
  e(className: string): string;
  prefix(selector: string): string;
  variants(path?: string, defaultValue?: unknown): unknown;
  /** Nakshora: add raw CSS to the utilities layer */
  addCss?(css: string): void;
}

export interface PluginCollector {
  statics: StaticUtilityDef[];
  functional: FunctionalUtility[];
  variants: VariantDefinition[];
  base: CssNode[];
  /** raw css added by plugins */
  rawCss: string[];
}

/** Normalise any plugin form into `{ handler, config }`. */
export function normalizePlugin(plugin: AnyPlugin): {
  handler?: (api: PluginAPI) => void;
  config?: Record<string, unknown>;
  legacyConfig?: (c: Record<string, unknown>) => void;
} {
  if (typeof plugin === 'function') {
    if ((plugin as TailwindPluginFn).__isOptionsFunction) {
      const resolved = (plugin as unknown as () => TailwindPluginObject)();
      return { handler: resolved.handler, config: resolved.config };
    }
    return { handler: plugin as (api: PluginAPI) => void };
  }
  if (plugin && typeof plugin === 'object') {
    const p = plugin as LegacyPlugin;
    return {
      handler: p.handler,
      config: typeof p.config === 'object' && p.config !== null ? p.config : undefined,
      legacyConfig: typeof p.config === 'function' ? p.config : undefined,
    };
  }
  return {};
}

/** Tailwind `plugin()` helper so configs can `import { plugin } from '@nakshora/core'`. */
export function plugin(
  handler: (api: PluginAPI) => void,
  config?: Record<string, unknown>,
): TailwindPluginObject {
  return { handler, config };
}
plugin.withOptions = function withOptions<T>(
  pluginFunction: (options?: T) => (api: PluginAPI) => void,
  configFunction: (options?: T) => Record<string, unknown> = () => ({}),
): ((options?: T) => TailwindPluginObject) & { __isOptionsFunction: true } {
  const optionsFunction = (options?: T): TailwindPluginObject => ({
    handler: pluginFunction(options),
    config: configFunction(options),
  });
  (optionsFunction as unknown as { __isOptionsFunction: boolean }).__isOptionsFunction = true;
  return optionsFunction as ((options?: T) => TailwindPluginObject) & { __isOptionsFunction: true };
};

interface RuleShape {
  selector: string;
  decls: Decls;
  atrules: string[];
}

/** Flatten CSS-in-JS into `{ selector, decls, atrules }` rules. */
export function cssInJsToRules(input: CssInJs | CssInJs[]): {
  rules: RuleShape[];
  looseDecls: Decls;
} {
  const nodes = flattenNodes(cssInJsToNodes(input));
  const rules: RuleShape[] = [];
  const looseDecls: Decls = {};
  const walk = (list: CssNode[], atrules: string[]): void => {
    for (const node of list) {
      if (node.type === 'rule') {
        const decls: Decls = {};
        for (const d of node.nodes)
          if (d.type === 'decl') decls[d.prop] = d.important ? `${d.value} !important` : d.value;
        rules.push({ selector: node.selector, decls, atrules });
      } else if (node.type === 'atrule' && node.nodes) {
        walk(node.nodes, [...atrules, `@${node.name} ${node.params}`.trim()]);
      } else if (node.type === 'decl') {
        looseDecls[node.prop] = node.important ? `${node.value} !important` : node.value;
      }
    }
  };
  walk(nodes, []);
  return { rules, looseDecls };
}

/**
 * `&` → undefined (the class itself), `&:hover` → `:hover`, `& > *` → ` > *`;
 * anything more complex (`.x &`, `&:a, &:b`) stays a template containing `&`.
 */
function selectorSuffix(selector: string): string | undefined {
  const sel = selector.trim();
  if (sel === '&') return undefined;
  if (sel.startsWith('&') && sel.indexOf('&', 1) === -1 && !sel.includes(',')) return sel.slice(1);
  return sel;
}

/** Turn a rule selector into class-keyed static utility definitions. */
export function rulesToStatics(pluginName: string, rules: RuleShape[]): StaticUtilityDef[] {
  const out: StaticUtilityDef[] = [];
  for (const rule of rules) {
    const parts = splitSelectorList(rule.selector);
    // Tailwind registers a rule under every class it mentions; each such
    // candidate then owns the parts containing it, the rest are "siblings".
    const classes: string[] = [];
    for (const part of parts) {
      const m = /\.((?:\\.|[\w-])+)/.exec(part);
      if (!m) continue;
      const cls = m[1].replace(/\\(.)/g, '$1');
      if (!classes.includes(cls)) classes.push(cls);
    }
    if (classes.length === 0) continue;
    for (const cls of classes) {
      const escaped = `.${escapeClassName(cls)}`;
      const own: string[] = [];
      // ordered list; `null` marks the slots of the class's own parts
      const ordered: (string | null)[] = [];
      for (const part of parts) {
        if (part.includes(escaped) || part.includes(`.${cls}`)) {
          own.push(part.split(escaped).join('&').split(`.${cls}`).join('&'));
          ordered.push(null);
        } else ordered.push(part);
      }
      const template = own.join(', ');
      const hasSiblings = ordered.some((x) => x !== null);
      out.push({
        p: pluginName,
        c: cls,
        s: template === '&' ? undefined : template,
        sl: hasSiblings ? ordered.map((x) => x ?? '&') : undefined,
        pc: true,
        d: Object.entries(rule.decls),
        at: rule.atrules.length ? rule.atrules : undefined,
      });
    }
  }
  return out;
}

function normalizeTypes(type: MatchOptions['type']): {
  types: DataType[];
  preferOnConflict: boolean;
} {
  if (!type) return { types: [], preferOnConflict: false };
  const list = Array.isArray(type) ? type : [type];
  let prefer = false;
  const types = list.map((t) => {
    if (Array.isArray(t)) {
      if (t[1]?.preferOnConflict) prefer = true;
      return t[0];
    }
    return t;
  });
  return { types, preferOnConflict: prefer };
}

/**
 * Create the plugin API bound to a collector. `theme` and `config` are
 * resolved against the already-merged theme/config.
 */
export function createPluginAPI(
  collector: PluginCollector,
  ctx: {
    theme: ResolvedTheme;
    themeFn: (path?: string, defaultValue?: unknown) => unknown;
    configFn: (path?: string, defaultValue?: unknown) => unknown;
    corePluginEnabled: (name: string) => boolean;
    prefix: string;
    pluginName: string;
  },
): PluginAPI {
  const addStatic = (
    kind: 'utilities' | 'components',
    input: CssInJs | CssInJs[],
    options?: unknown,
  ): void => {
    // Nakshora 3.0 legacy form: `addUtilities({ 'my-class': {…} }, 'group')` — keys
    // without a selector prefix are class names.
    const normalised = (Array.isArray(input) ? input : [input]).map((obj) =>
      Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [
          /^[a-zA-Z][\w-]*$/.test(k) && v && typeof v === 'object' ? `.${k}` : k,
          v,
        ]),
      ),
    );
    const group =
      typeof options === 'string'
        ? options
        : kind === 'components'
          ? PLUGIN_COMPONENTS_GROUP
          : ctx.pluginName;
    const { rules } = cssInJsToRules(normalised as CssInJs[]);
    collector.statics.push(...rulesToStatics(group, rules));
  };

  const addMatch = (
    kind: 'utilities' | 'components',
    utilities: Record<
      string,
      (value: unknown, extra: { modifier: string | null }) => CssInJs | CssInJs[]
    >,
    options: MatchOptions = {},
  ): void => {
    const { types, preferOnConflict } = normalizeTypes(options.type);
    for (const [prefix, fn] of Object.entries(utilities)) {
      // Tailwind wraps the returned CSS-in-JS in the utility's own rule, so
      // nested keys (`'> *'`, `'&:hover'`, `'@media …'`) resolve against it.
      const shapesFor = (value: unknown, modifier: string | null): FunctionalRuleShape[] | null => {
        const out = fn(value, { modifier });
        if (!out) return null;
        const { rules } = cssInJsToRules({ '&': out });
        if (rules.length === 0) return null;
        return rules.map((r) => ({
          selector: selectorSuffix(r.selector),
          decls: r.decls,
          atrules: r.atrules.length ? r.atrules : undefined,
        }));
      };
      collector.functional.push({
        plugin: kind === 'components' ? PLUGIN_COMPONENTS_GROUP : ctx.pluginName,
        prefix,
        values: options.values ?? {},
        types,
        preferOnConflict: preferOnConflict || undefined,
        negative: options.supportsNegativeValues,
        bare: options.bare,
        modifier:
          options.modifiers === 'any' ? 'any' : options.modifiers ? options.modifiers : undefined,
        describe: `${prefix}-{value}`,
        build: (value, { modifier }) => {
          const shapes = shapesFor(value, modifier);
          if (!shapes) return null;
          // catalog/description: the declarations that apply to the class itself
          return shapes.find((sh) => sh.selector === undefined)?.decls ?? {};
        },
        buildAll: shapesFor,
      });
    }
  };

  return {
    addUtilities: (u, o) => addStatic('utilities', u, o),
    matchUtilities: (u, o) => addMatch('utilities', u, o),
    addComponents: (c) => addStatic('components', c),
    matchComponents: (c, o) => addMatch('components', c, o),
    addBase: (base) => {
      collector.base.push(...collapseAdjacentRules(flattenNodes(cssInJsToNodes(base))));
    },
    addVariant: (name, definition) => {
      let formats: string[];
      if (typeof definition === 'function') {
        const result = definition({ separator: ':' });
        formats = result === undefined ? [] : Array.isArray(result) ? result : [result];
      } else formats = Array.isArray(definition) ? definition : [definition];
      const branches = formats.map(formatToBranch);
      collector.variants.push({
        name,
        key: name,
        sort: 0, // assigned by the engine (registration order)
        branches,
        description: `plugin variant ${name}`,
      });
    },
    matchVariant: (name, fn, options = {}) => {
      const values = options.values ?? {};
      const keys = Object.keys(values).filter((k) => k !== 'DEFAULT');
      const sortFn = typeof options.sort === 'function' ? options.sort : undefined;
      const id = `plugin:${name}`;
      collector.variants.push({
        name,
        key: name,
        sort: 0, // assigned by the engine (registration order)
        functional: true,
        slots: keys.length,
        description: `plugin variant ${name}-*`,
        match: (value, modifier) => {
          let resolved: string | undefined;
          if (value.startsWith('[') && value.endsWith(']'))
            resolved = value.slice(1, -1).replace(/_/g, ' ');
          else if (values[value] !== undefined) resolved = values[value];
          else if (value === '' && values.DEFAULT !== undefined) resolved = values.DEFAULT;
          else return null;
          const result = fn(resolved, { modifier });
          const formats = Array.isArray(result) ? result : [result];
          const slot = keys.indexOf(value);
          return {
            branches: formats.map(formatToBranch),
            slot: slot === -1 ? keys.length : slot,
            fn: sortFn
              ? {
                  id,
                  value: resolved,
                  modifier,
                  compare: (a, b) => sortFn(a, b),
                }
              : undefined,
          };
        },
      });
    },
    theme: ctx.themeFn,
    config: ctx.configFn,
    corePlugins: ctx.corePluginEnabled,
    e: escapeClassName,
    prefix: (selector) =>
      ctx.prefix ? selector.replace(/\.([\w-])/g, `.${ctx.prefix}$1`) : selector,
    variants: () => [],
    addCss: (css) => collector.rawCss.push(css),
  };

  function formatToBranch(format: string): VariantBranch {
    const f = format.trim();
    if (f.startsWith('@')) {
      const m = /^@([\w-]+)\s*(.*)$/.exec(f);
      const name = m ? m[1] : 'media';
      const params = m ? m[2].trim() : '';
      const kind =
        name === 'media'
          ? 'media'
          : name === 'supports'
            ? 'supports'
            : name === 'container'
              ? 'container'
              : 'raw';
      return {
        atrules: [
          { kind, params: kind === 'raw' ? `${name} ${params}` : params, sort: 9000, raw: true },
        ],
      };
    }
    return { format: f.includes('&') ? f : `${f} &` };
  }
}

export { kebabProp };
