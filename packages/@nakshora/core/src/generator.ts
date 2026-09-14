// Nakshora Core — CSS generator (full & JIT modes)
//
// Public API (stable): `CSSGenerator`, `createGenerator`, `STATE_VARIANTS`,
// `generate`, `generateFromContent`, `generateJIT`, `getBase`, `getVariables`,
// `getKeyframes`, `getUtilitiesFull`, `getComponents`, `getUtilities`,
// `getUtility`, `getStats`, `minify`, `config`.
//
// The heavy lifting lives in `engine.ts` (candidate → rules). This file owns
// configuration resolution, the layers (base / variables / keyframes /
// components), rule ordering and serialisation.

import type {
  CSSProperties,
  DarkMode,
  GenerationOptions,
  GenerationStats,
  NakshoraConfig,
  PresetConfig,
  UtilityRule,
  VariantsConfig,
} from './types';
import { defaultVariants, deepMerge } from './config';
import { componentCss } from './components';
import {
  byteLength,
  classToSelector,
  escapeClass,
  extractClasses,
  minifyCss,
  splitClass,
  stringifyDecls,
} from './util';
import { resolveTheme, type ResolvedTheme } from './theme';
import { Engine, LEGACY_VARIANT_KEYS, type CompiledRule, type VariantDefinition } from './engine';
import { DEFAULTS_GROUPS } from './utilities';
import { GROUP_CATEGORIES, categoryForPlugin } from './registry';
import {
  createPluginAPI,
  normalizePlugin,
  type AnyPlugin,
  type PluginCollector,
} from './plugin-api';
import { serializeCss, type CssNode } from './css-ast';
import { processAuthorCss } from './apply';
import { compareRules } from './engine';
import { splitPath } from './theme';

/**
 * A single state-variant definition (public, documentation-oriented view).
 */
export interface VariantDef {
  /** Class prefix, e.g. `hover` */
  prefix: string;
  /** Selector suffix appended to the class, e.g. `:hover` */
  suffix: string;
  /** Ancestor selector prepended (group/peer/dark strategies) */
  ancestor: string;
  /** Key in VariantsConfig that toggles this variant */
  configKey: keyof VariantsConfig;
  description: string;
}

/**
 * The classic state variants (documentation + AI corpus). The engine supports
 * many more — see `CSSGenerator#getVariantNames()`.
 */
export const STATE_VARIANTS: VariantDef[] = [
  {
    prefix: 'hover',
    suffix: ':hover',
    ancestor: '',
    configKey: 'hover',
    description: 'applies on hover',
  },
  {
    prefix: 'focus',
    suffix: ':focus',
    ancestor: '',
    configKey: 'focus',
    description: 'applies on focus',
  },
  {
    prefix: 'focus-visible',
    suffix: ':focus-visible',
    ancestor: '',
    configKey: 'focusVisible',
    description: 'keyboard focus',
  },
  {
    prefix: 'focus-within',
    suffix: ':focus-within',
    ancestor: '',
    configKey: 'focusWithin',
    description: 'a descendant has focus',
  },
  {
    prefix: 'active',
    suffix: ':active',
    ancestor: '',
    configKey: 'active',
    description: 'while pressed',
  },
  {
    prefix: 'visited',
    suffix: ':visited',
    ancestor: '',
    configKey: 'visited',
    description: 'visited links',
  },
  {
    prefix: 'disabled',
    suffix: ':disabled',
    ancestor: '',
    configKey: 'disabled',
    description: 'disabled controls',
  },
  {
    prefix: 'first',
    suffix: ':first-child',
    ancestor: '',
    configKey: 'firstChild',
    description: 'first child',
  },
  {
    prefix: 'last',
    suffix: ':last-child',
    ancestor: '',
    configKey: 'lastChild',
    description: 'last child',
  },
  {
    prefix: 'group-hover',
    suffix: '',
    ancestor: '.group:hover',
    configKey: 'groupHover',
    description: 'parent .group hovered',
  },
  {
    prefix: 'group-focus',
    suffix: '',
    ancestor: '.group:focus',
    configKey: 'groupFocus',
    description: 'parent .group focused',
  },
  {
    prefix: 'peer-hover',
    suffix: '',
    ancestor: '.peer:hover ~',
    configKey: 'peerHover',
    description: 'preceding .peer hovered',
  },
  {
    prefix: 'peer-focus',
    suffix: '',
    ancestor: '.peer:focus ~',
    configKey: 'peerFocus',
    description: 'preceding .peer focused',
  },
  {
    prefix: 'dark',
    suffix: '',
    ancestor: ':is(.dark *)',
    configKey: 'dark',
    description: 'dark mode',
  },
];

export interface ResolvedBreakpoint {
  name: string;
  px: number;
  /** raw min-width value (`640px`, `40rem`) */
  value: string;
}

const VERSION = '3.0.0';
/** Breakpoints whose responsive variants are part of the default full build. */
export const CORE_SCREENS = ['sm', 'md', 'lg', 'xl', '2xl'];

export class CSSGenerator {
  readonly config: NakshoraConfig;
  /** the fully resolved theme (Tailwind-shaped scales) */
  readonly theme: ResolvedTheme;
  readonly engine: Engine;
  private readonly variantCfg: VariantsConfig;
  private readonly breakpoints: ResolvedBreakpoint[];
  private catalog: UtilityRule[] | null = null;
  private catalogByClass: Map<string, UtilityRule> | null = null;
  private readonly pluginBase: CssNode[];
  private readonly pluginRawCss: string[];
  private readonly corePluginsEnabled: (name: string) => boolean;

  constructor(config: Partial<NakshoraConfig> = {}) {
    // ── presets + plugin config hooks ──
    let draft: NakshoraConfig = {};
    for (const preset of config.presets ?? []) draft = mergePreset(draft, preset);
    draft = mergePreset(draft, config);
    const plugins = (draft.plugins ?? []).map((p) => normalizePlugin(p as AnyPlugin));
    const pluginThemes: Record<string, unknown>[] = [];
    for (const p of plugins) {
      if (p.legacyConfig) p.legacyConfig(draft as Record<string, unknown>);
      if (p.config) {
        const { theme, ...rest } = p.config as { theme?: Record<string, unknown> } & Record<
          string,
          unknown
        >;
        if (theme) pluginThemes.push(theme);
        // plugin-level `corePlugins`, `darkMode`… act as defaults
        for (const [k, v] of Object.entries(rest))
          if ((draft as Record<string, unknown>)[k] === undefined)
            (draft as Record<string, unknown>)[k] = v;
      }
    }

    const corePlugins = draft.corePlugins ?? {};
    this.corePluginsEnabled = Array.isArray(corePlugins)
      ? (name) =>
          corePlugins.includes(name) ||
          ['base', 'variables', 'components', 'animations'].includes(name)
      : (name) => corePlugins[name] !== false;

    this.config = {
      ...draft,
      theme: draft.theme ?? {},
      variants: { ...defaultVariants, ...draft.variants },
      darkMode: draft.darkMode ?? 'class',
      content: draft.content,
      purge: draft.purge ?? [],
      safelist: draft.safelist ?? [],
      blocklist: draft.blocklist ?? [],
      plugins: draft.plugins ?? [],
      important: draft.important ?? false,
      corePlugins,
      prefix: draft.prefix ?? '',
      extractorPattern: draft.extractorPattern,
      layers: draft.layers ?? false,
      preflight: draft.preflight ?? true,
    };
    this.variantCfg = this.config.variants as VariantsConfig;
    this.theme = resolveTheme(this.config.theme, { pluginTheme: pluginThemes });

    this.breakpoints = Object.entries(this.theme.screens)
      .map(([name, value]) => ({ name, value, px: screenPx(value) }))
      .filter((b) => !Number.isNaN(b.px) && b.px > 0)
      .sort((a, b) => a.px - b.px);

    // ── plugins ──
    const collector: PluginCollector = {
      statics: [],
      functional: [],
      variants: [],
      base: [],
      rawCss: [],
    };
    const themeFn = (path?: string, fallback?: unknown): unknown => {
      if (path === undefined) return this.theme;
      const v = lookup(this.theme, path);
      return v === undefined ? fallback : v;
    };
    for (const p of plugins) {
      if (!p.handler) continue;
      const api = createPluginAPI(collector, {
        theme: this.theme,
        themeFn,
        configFn: (path?: string, fallback?: unknown) => {
          if (path === undefined) return { ...this.config, theme: this.theme };
          if (path === 'prefix') return this.config.prefix;
          if (path === 'separator') return ':';
          if (path === 'darkMode') return this.config.darkMode;
          const v = lookup({ ...this.config, theme: this.theme } as Record<string, unknown>, path);
          return v === undefined ? fallback : v;
        },
        corePluginEnabled: this.corePluginsEnabled,
        prefix: this.config.prefix ?? '',
        pluginName: 'plugin',
      });
      p.handler(api);
    }
    this.pluginBase = collector.base;
    this.pluginRawCss = collector.rawCss;

    this.engine = new Engine({
      theme: this.theme,
      darkMode:
        this.variantCfg.dark === false ? false : ((this.config.darkMode ?? 'class') as DarkMode),
      pluginEnabled: this.corePluginsEnabled,
      variantEnabled: (key) => this.isVariantEnabled(key),
      important: this.config.important ?? false,
      extraStatic: collector.statics,
      extraFunctional: collector.functional,
      extraVariants: collector.variants,
      combineMedia: true,
    });
  }

  // ───────────────────────────────────────────── API ─────────────────────────────────────────────

  /**
   * Generate the stylesheet.
   *
   * - `full` mode (default): base styles, CSS variables, keyframes, every
   *   utility + its responsive variants, and the component set.
   * - `jit` mode: only the utilities found in `options.content`
   *   (state variants and variant combinations included).
   */
  generate(options: GenerationOptions = {}): string {
    const mode = options.mode ?? (this.hasContent() ? 'jit' : 'full');
    const css =
      mode === 'jit'
        ? this.generateJIT(options.content ?? this.getContentFromConfig(), options)
        : this.generateFull(options);
    return options.minify ? minifyCss(css) : css;
  }

  /** Generate JIT CSS from explicit content */
  generateFromContent(content: string | string[], options: GenerationOptions = {}): string {
    const css = this.generateJIT(content, options);
    return options.minify ? minifyCss(css) : css;
  }

  /** All utility rules in catalog order (value-bearing classes, no variants) */
  getUtilities(): UtilityRule[] {
    return [...this.buildCatalog()];
  }

  /** Look up a single utility by (base) class name */
  getUtility(className: string): UtilityRule | undefined {
    this.buildCatalog();
    const hit = this.catalogByClass!.get(className);
    if (hit) return hit;
    // arbitrary / negative / modifier forms are compiled on demand
    const rules = this.engine.compile(className);
    if (rules.length === 0) return undefined;
    return {
      class: className,
      group: rules[0].plugin,
      category: categoryForPlugin(rules[0].plugin),
      decls: Object.assign({}, ...rules.map((r) => r.decls)) as CSSProperties,
      description: `${className} (computed)`,
    };
  }

  /** Every variant name the engine knows (static + functional prefixes) */
  getVariantNames(): string[] {
    return this.engine.getVariants().map((v) => v.name);
  }

  /** Variant definitions (docs / IntelliSense) */
  getVariantDefinitions(): VariantDefinition[] {
    return this.engine.getVariants();
  }

  /** Resolved breakpoints, ascending */
  getBreakpoints(): ResolvedBreakpoint[] {
    return this.variantCfg.responsive !== false ? [...this.breakpoints] : [];
  }

  /** Compile a single candidate to CSS (empty string when unknown) */
  compileClass(candidate: string): string {
    return this.serializeRules(this.engine.compile(candidate));
  }

  /** Statistics about a generated stylesheet */
  getStats(css?: string): GenerationStats {
    const generated = css ?? this.generate();
    const minified = minifyCss(generated);
    const ruleCount = (generated.match(/\{[^{}]*\}/g) ?? []).length;
    const responsiveRules = countRulesInside(generated, /@media \((?:min|max)-width/);
    const variantRules = (generated.match(/\\:/g) ?? []).length;
    return {
      utilities: this.buildCatalog().length,
      responsiveRules,
      variantRules,
      totalRules: ruleCount,
      sizeBytes: byteLength(generated),
      minifiedSizeBytes: byteLength(minified),
    };
  }

  minify(css: string): string {
    return minifyCss(css);
  }

  /** Expand `@apply`, `theme()`, `screen()` and `@screen` in author CSS */
  processCss(css: string, options: { strict?: boolean } = {}): string {
    return processAuthorCss(css, this.engine, options);
  }

  /** Resolve a theme path (`colors.blue.500`, `spacing[2.5]`) */
  themeValue(path: string): string | undefined {
    return this.engine.lookupTheme(path);
  }

  // ───────────────────────────── layer accessors ─────────────────────────────

  /** Base styles (reset, `--tw-*` defaults, plugin base) */
  getBase(): string {
    return this.baseStyles();
  }

  /** `:root` CSS variables */
  getVariables(): string {
    return this.variables();
  }

  /** `@keyframes` for the referenced animations (all when `names` is omitted) */
  getKeyframes(names?: Set<string>): string {
    return this.keyframes(names);
  }

  /**
   * Full utility set.
   * @param includeVariants when true (default) the classic state variants
   *   (`STATE_VARIANTS`) are included — the standard full build omits them.
   */
  getUtilitiesFull(
    includeVariants = true,
    options: { screens?: 'all' | 'core' | string[] } = {},
  ): string {
    const catalog = this.buildCatalog();
    const prefix = this.config.prefix ?? '';
    // base rules, compiled once
    const base: CompiledRule[] = [];
    for (const r of catalog) {
      const cls = r.class.slice(prefix.length);
      for (const c of this.engine.compile(cls))
        base.push(prefix ? this.reprefix(c, cls, r.class) : c);
    }
    let css = this.serializeRules(base);
    // responsive variants: same rules wrapped in the screen's media query
    // (fast path — identical output to compiling `sm:x` through the engine)
    for (const bp of this.fullBuildScreens(options.screens)) {
      const wrapped: CompiledRule[] = [];
      const vm = this.engine.resolveVariant(bp.name);
      const at = vm?.branches[0]?.atrules?.[0] ?? {
        kind: 'media' as const,
        params: `(min-width: ${bp.value})`,
        sort: 1000 + bp.px / 10,
        min: bp.px,
      };
      for (const rule of base) {
        const from = `.${escapeClass(rule.candidate)}`;
        const to = `.${escapeClass(`${bp.name}:${rule.candidate}`)}`;
        wrapped.push({
          ...rule,
          selector: rule.selector.split(from).join(to),
          atrules: [at, ...rule.atrules],
          sort: {
            ...rule.sort,
            variant: 1,
            variants: vm ? [vm.sort] : [],
            hooks: vm?.fn ? [{ ...vm.fn, bit: vm.sort }] : undefined,
          },
        });
      }
      css += this.serializeRules(wrapped);
    }
    if (includeVariants) {
      const candidates: string[] = [];
      for (const v of STATE_VARIANTS) {
        if (!this.isVariantEnabled(v.configKey as string)) continue;
        for (const r of catalog) candidates.push(`${v.prefix}:${r.class}`);
      }
      css += this.compileCandidates(candidates).css;
    }
    return css;
  }

  /**
   * Screens that get responsive variants in the *full* build. Default
   * (`'core'`): the classic `sm`–`2xl` set, so the extended 10-step scale
   * does not multiply the CDN bundle (every screen is always available in
   * JIT mode). `'all'` or an explicit list opt in.
   */
  private fullBuildScreens(screens: 'all' | 'core' | string[] = 'core'): ResolvedBreakpoint[] {
    const all = this.getBreakpoints();
    if (screens === 'all') return all;
    const wanted = new Set(screens === 'core' ? CORE_SCREENS : screens);
    const picked = all.filter((b) => wanted.has(b.name));
    // custom screen sets without the classic names → keep everything
    return screens === 'core' && picked.length === 0 ? all : picked;
  }

  private reprefix(rule: CompiledRule, from: string, to: string): CompiledRule {
    return {
      ...rule,
      selector: rule.selector.split(`.${escapeClass(from)}`).join(`.${escapeClass(to)}`),
    };
  }

  /** Design-paradigm component CSS */
  getComponents(): string {
    return this.components();
  }

  // ─────────────────────────────────────────── internals ───────────────────────────────────────────

  private hasContent(): boolean {
    if (this.config.content !== undefined) {
      const c = this.config.content;
      return c !== '' && !(Array.isArray(c) && c.length === 0);
    }
    return false;
  }

  private getContentFromConfig(): string[] {
    const content = this.config.content ?? this.config.purge;
    if (typeof content === 'string') return [content];
    return Array.isArray(content) ? content : [];
  }

  private isVariantEnabled(key: string): boolean {
    const cfg = this.variantCfg as Record<string, boolean | undefined>;
    if (cfg[key] === false) return false;
    // legacy camelCase keys (`focusVisible`, `groupHover` …)
    for (const [legacy, name] of Object.entries(LEGACY_VARIANT_KEYS)) {
      if (name === key && cfg[legacy] === false) return false;
    }
    const camel = key.replace(/-([a-z])/g, (_m, c: string) => c.toUpperCase());
    if (camel !== key && cfg[camel] === false) return false;
    return true;
  }

  private buildCatalog(): UtilityRule[] {
    if (this.catalog) return this.catalog;
    const prefix = this.config.prefix ?? '';
    const entries = this.engine.buildCatalog();
    this.catalog = entries.map((e) => ({
      class: prefix + e.class,
      group: e.plugin,
      category: categoryForPlugin(e.plugin),
      decls: e.decls as CSSProperties,
      description: e.description,
    }));
    this.catalogByClass = new Map(this.catalog.map((r) => [r.class, r]));
    return this.catalog;
  }

  /** Compile candidates → ordered CSS text plus bookkeeping */
  private compileCandidates(candidates: Iterable<string>): {
    css: string;
    emitted: Set<string>;
    animations: Set<string>;
    defaults: Set<string>;
  } {
    const prefix = this.config.prefix ?? '';
    const block = new Set(this.config.blocklist ?? []);
    const rules: CompiledRule[] = [];
    const emitted = new Set<string>();
    const animations = new Set<string>();
    const defaults = new Set<string>();
    const seenRules = new Set<string>();
    // Tailwind sorts the candidate set (code-unit order) before generating, so
    // the output never depends on where a class was first seen.
    const ordered = [...new Set(candidates)].sort((x, y) => (x < y ? -1 : x > y ? 1 : 0));
    for (const raw of ordered) {
      if (emitted.has(raw) || block.has(raw)) continue;
      let candidate = raw;
      if (prefix) {
        // prefix applies to the utility part only: `hover:nk-flex` → `hover:flex`
        const idx = raw.lastIndexOf(':');
        const base = raw.slice(idx + 1);
        const neg = base.startsWith('-') ? '-' : '';
        const bang = base.startsWith('!') ? '!' : '';
        const core = base.slice(neg.length + bang.length);
        if (!core.startsWith(prefix)) continue;
        candidate = raw.slice(0, idx + 1) + neg + bang + core.slice(prefix.length);
      }
      const compiled = this.engine.compile(candidate);
      if (compiled.length === 0) continue;
      emitted.add(raw);
      for (const r of compiled) {
        const rule = prefix
          ? {
              ...r,
              selector: r.selector.split(`.${escapeClass(candidate)}`).join(`.${escapeClass(raw)}`),
            }
          : r;
        // A selector-list component (`.a:hover, .b:hover { … }`) is registered
        // under every class it names; when several of them are candidates the
        // same rule must still be emitted once (Tailwind dedupes by rule identity).
        const identity = `${rule.selector}\u0000${rule.atrules
          .map((a) => `${a.kind} ${a.params}`)
          .join('|')}\u0000${JSON.stringify(rule.decls)}`;
        if (seenRules.has(identity)) continue;
        seenRules.add(identity);
        rules.push(rule);
        if (r.defaults) defaults.add(r.defaults);
        for (const a of r.animations ?? []) animations.add(a);
      }
    }
    return { css: this.serializeRules(rules), emitted, animations, defaults };
  }

  /** Sort rules (variant weight → plugin → utility → value) and serialise with grouped at-rules. */
  private serializeRules(rules: CompiledRule[]): string {
    const sorted = [...rules].sort(compareRules);
    let out = '';
    let openKey = '';
    let openDepth = 0;
    const closeAll = (): void => {
      while (openDepth > 0) {
        openDepth--;
        out += `${'  '.repeat(openDepth)}}\n`;
      }
      openKey = '';
    };
    for (const rule of sorted) {
      const key = rule.atrules.map(atRuleText).join('\u0000');
      if (key !== openKey) {
        closeAll();
        for (const at of rule.atrules) {
          out += `${'  '.repeat(openDepth)}${atRuleText(at)} {\n`;
          openDepth++;
        }
        openKey = key;
      }
      out += `${'  '.repeat(openDepth)}${rule.selector} { ${stringifyDecls(rule.decls)}; }\n`;
    }
    closeAll();
    return out;
  }

  // ─────────────────────────────── layers ───────────────────────────────

  private baseStyles(): string {
    if (!this.corePluginsEnabled('base')) return '';
    let css = '';
    if (this.config.preflight !== false && this.corePluginsEnabled('preflight'))
      css += preflight(this.theme);
    css += this.twDefaults();
    if (this.pluginBase.length) css += serializeCss(this.pluginBase);
    return css;
  }

  /** `*, ::before, ::after { --tw-… }` defaults required by composed utilities */
  private twDefaults(groups?: Set<string>): string {
    const wanted = groups ?? new Set(Object.keys(DEFAULTS_GROUPS));
    const decls: Record<string, string> = {};
    for (const g of Object.keys(DEFAULTS_GROUPS)) {
      if (!wanted.has(g)) continue;
      Object.assign(decls, DEFAULTS_GROUPS[g]);
    }
    if (Object.keys(decls).length === 0) return '';
    const body = Object.entries(decls)
      .map(([k, v]) => `  ${k}: ${v};`)
      .join('\n');
    return `\n*, ::before, ::after {\n${body}\n}\n\n::backdrop {\n${body}\n}\n`;
  }

  private variables(): string {
    if (!this.corePluginsEnabled('variables')) return '';
    let css = '\n/* Nakshora v3 — CSS Variables */\n:root {\n';
    for (const [name, scale] of Object.entries(this.theme.colors ?? {})) {
      if (typeof scale === 'string') css += `  --color-${name}: ${scale};\n`;
      else if (scale && typeof scale === 'object') {
        for (const [shade, value] of Object.entries(scale)) {
          if (typeof value === 'string')
            css += `  --color-${name}${shade === 'DEFAULT' ? '' : `-${shade}`}: ${value};\n`;
        }
      }
    }
    // `--spacing-0.5` is not a valid <dashed-ident>; dots become `_` (`--spacing-0_5`)
    for (const [key, value] of Object.entries(this.theme.spacing ?? {}))
      css += `  --spacing-${cssIdent(key)}: ${value};\n`;
    for (const [size, value] of Object.entries(this.theme.fontSize ?? {}))
      css += `  --text-${size}: ${Array.isArray(value) ? value[0] : String(value)};\n`;
    for (const [name, value] of Object.entries(this.theme.fontFamily ?? {}))
      css += `  --font-${name}: ${Array.isArray(value) ? value.join(', ') : String(value)};\n`;
    for (const [name, value] of Object.entries(this.theme.screens ?? {}))
      css += `  --breakpoint-${name}: ${value};\n`;
    css += '}\n';
    return css;
  }

  private keyframes(names?: Set<string>): string {
    if (!this.corePluginsEnabled('animations') && !this.corePluginsEnabled('animation')) return '';
    const keyframes = (this.theme.keyframes ?? {}) as Record<
      string,
      Record<string, Record<string, string>>
    >;
    const animations = (this.theme.animation ?? {}) as Record<string, string>;
    const needed =
      names ?? new Set(Object.values(animations).map((v) => String(v).split(/\s+/)[0]));
    let css = '';
    for (const [name, body] of Object.entries(keyframes)) {
      if (!needed.has(name)) continue;
      css += `@keyframes ${name} {\n`;
      for (const [step, decls] of Object.entries(body)) {
        css += `  ${step} { ${Object.entries(decls)
          .map(([k, v]) => `${kebabCase(k)}: ${v};`)
          .join(' ')} }\n`;
      }
      css += '}\n';
    }
    return css ? `\n/* Nakshora v3 — Keyframes */\n${css}` : '';
  }

  private components(): string {
    if (!this.corePluginsEnabled('components')) return '';
    let css = '\n/* Nakshora v3 — Components */\n';
    for (const block of Object.values(componentCss)) css += block;
    if (this.pluginRawCss.length) css += `${this.pluginRawCss.join('\n')}\n`;
    return css;
  }

  private wrapLayer(name: string, css: string): string {
    if (!css.trim()) return '';
    if (!this.config.layers) return css;
    return `@layer ${name} {\n${css}}\n`;
  }

  // ─────────────────────────────── full mode ───────────────────────────────

  private generateFull(options: GenerationOptions): string {
    let css = `/*! Nakshora v${VERSION} — utility-first CSS framework (full build) */\n`;
    if (this.config.layers) css += '@layer base, components, utilities;\n';
    css += this.wrapLayer('base', this.baseStyles() + this.variables() + this.keyframes());
    css += this.wrapLayer('components', this.components());
    css += '\n/* ─── Utilities ─── */\n';
    // Full build = base + responsive. State variants (hover:, dark:, …) are
    // JIT-only — they are emitted when classes are found in content.
    css += this.wrapLayer('utilities', this.getUtilitiesFull(false, { screens: options.screens }));
    return css;
  }

  // ─────────────────────────────── JIT mode ───────────────────────────────

  /**
   * Compile a JIT build from content.
   * @param internal.utilitiesOnly emit only the utilities section (no base/variables/keyframes/components)
   */
  generateJIT(
    content: string | string[] | undefined,
    _options: GenerationOptions,
    internal?: { utilitiesOnly?: boolean },
  ): string {
    const utilitiesOnly = internal?.utilitiesOnly ?? false;
    const chunks = typeof content === 'string' ? [content] : (content ?? []);
    const found = extractClasses(chunks, this.config.extractorPattern);
    for (const safe of this.config.safelist ?? []) found.add(safe);
    const { css: utilities, emitted, animations, defaults } = this.compileCandidates(found);

    let css = '';
    if (!utilitiesOnly) {
      css += `/*! Nakshora v${VERSION} — JIT build · ${emitted.size} classes */\n`;
      if (this.config.layers) css += '@layer base, components, utilities;\n';
      let base = '';
      if (this.corePluginsEnabled('base')) {
        if (this.config.preflight !== false && this.corePluginsEnabled('preflight'))
          base += preflight(this.theme);
        base += this.twDefaults(defaults);
        if (this.pluginBase.length) base += serializeCss(this.pluginBase);
      }
      css += this.wrapLayer('base', base + this.variables() + this.keyframes(animations));
      // component classes are not utilities → match against every candidate
      css += this.wrapLayer('components', this.componentsFor(found));
    }
    css += '\n/* ─── Utilities (JIT) ─── */\n';
    css += this.wrapLayer('utilities', utilities);
    return css;
  }

  /** Components layer — only the built-in blocks whose classes appear in `candidates`. */
  private componentsFor(candidates: Set<string>): string {
    if (!this.corePluginsEnabled('components')) return '';
    const used = new Set<string>();
    for (const c of candidates) {
      const base = c.slice(c.lastIndexOf(':') + 1);
      used.add(base);
    }
    let css = '';
    for (const block of Object.values(componentCss)) {
      const classes = [...block.matchAll(/\.([a-zA-Z][\w-]*)/g)].map((m) => m[1]);
      if (classes.some((c) => used.has(c))) css += block;
    }
    if (this.pluginRawCss.length) css += `${this.pluginRawCss.join('\n')}\n`;
    return css ? `\n/* Nakshora v3 — Components */\n${css}` : '';
  }
}

// ───────────────────────────── helpers ─────────────────────────────

function mergePreset(
  base: NakshoraConfig,
  preset: Partial<NakshoraConfig> | PresetConfig,
): NakshoraConfig {
  if ('colors' in preset && !('theme' in preset)) {
    // PresetConfig (theme preset)
    const p = preset as PresetConfig;
    const { name: _n, description: _d, ...themeBits } = p;
    void _n;
    void _d;
    return { ...base, theme: deepMerge(base.theme ?? {}, themeBits as Record<string, unknown>) };
  }
  const cfg = preset as Partial<NakshoraConfig>;
  return {
    ...base,
    ...cfg,
    theme: deepMerge(base.theme ?? {}, cfg.theme ?? {}),
    variants: { ...base.variants, ...cfg.variants },
    corePlugins: Array.isArray(cfg.corePlugins)
      ? cfg.corePlugins
      : { ...(Array.isArray(base.corePlugins) ? {} : base.corePlugins), ...cfg.corePlugins },
    plugins: [...(base.plugins ?? []), ...(cfg.plugins ?? [])],
    safelist: [...(base.safelist ?? []), ...(cfg.safelist ?? [])],
  };
}

function lookup(obj: Record<string, unknown>, path: string): unknown {
  let cur: unknown = obj;
  for (const key of splitPath(path)) {
    if (cur === null || typeof cur !== 'object') return undefined;
    cur = (cur as Record<string, unknown>)[key];
  }
  return cur;
}

function screenPx(value: string): number {
  const m = /^(\d+(?:\.\d+)?)(px|rem|em)?$/.exec(String(value).trim());
  if (!m) return NaN;
  return m[2] === 'rem' || m[2] === 'em' ? parseFloat(m[1]) * 16 : parseFloat(m[1]);
}

/** Make a theme key safe for use inside a custom-property name. */
function cssIdent(key: string): string {
  return key.replace(/[^a-zA-Z0-9_-]/g, '_');
}

function kebabCase(prop: string): string {
  return prop.startsWith('--') ? prop : prop.replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase();
}

function atRuleText(at: CompiledRule['atrules'][number]): string {
  switch (at.kind) {
    case 'media':
      return `@media ${at.params}`;
    case 'supports':
      return `@supports ${at.params}`;
    case 'container':
      return `@container ${at.params}`;
    case 'starting':
      return '@starting-style';
    default:
      return `@${at.params}`;
  }
}

function countRulesInside(css: string, header: RegExp): number {
  let count = 0;
  const lines = css.split('\n');
  let depth = 0;
  let inside = 0;
  for (const line of lines) {
    if (header.test(line) && line.trimEnd().endsWith('{')) {
      inside = depth + 1;
      depth++;
      continue;
    }
    const opens = (line.match(/\{/g) ?? []).length;
    const closes = (line.match(/\}/g) ?? []).length;
    if (inside && depth >= inside && /\{[^}]*\}/.test(line)) count++;
    depth += opens - closes;
    if (depth < inside) inside = 0;
  }
  return count;
}

/** Tailwind-compatible preflight (v3.4) with Nakshora's font stack applied. */
export function preflight(theme: ResolvedTheme): string {
  const sans =
    fontStack(theme.fontFamily?.sans) ||
    'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
  const mono =
    fontStack(theme.fontFamily?.mono) ||
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';
  const border = (theme.borderColor as Record<string, unknown>)?.DEFAULT ?? '#e5e7eb';
  const placeholder = ((theme.colors.gray as Record<string, string>) ?? {})[400] ?? '#9ca3af';
  return `/* Nakshora v3 — Base (preflight) */
*, ::before, ::after { box-sizing: border-box; border-width: 0; border-style: solid; border-color: ${String(border)}; }
::before, ::after { --tw-content: ''; }
html, :host { line-height: 1.5; -webkit-text-size-adjust: 100%; -moz-tab-size: 4; tab-size: 4; font-family: ${sans}; font-feature-settings: normal; font-variation-settings: normal; -webkit-tap-highlight-color: transparent; }
body { margin: 0; line-height: inherit; }
hr { height: 0; color: inherit; border-top-width: 1px; }
abbr:where([title]) { text-decoration: underline dotted; }
h1, h2, h3, h4, h5, h6 { font-size: inherit; font-weight: inherit; }
a { color: inherit; text-decoration: inherit; }
b, strong { font-weight: bolder; }
code, kbd, samp, pre { font-family: ${mono}; font-feature-settings: normal; font-variation-settings: normal; font-size: 1em; }
small { font-size: 80%; }
sub, sup { font-size: 75%; line-height: 0; position: relative; vertical-align: baseline; }
sub { bottom: -0.25em; }
sup { top: -0.5em; }
table { text-indent: 0; border-color: inherit; border-collapse: collapse; }
button, input, optgroup, select, textarea { font-family: inherit; font-feature-settings: inherit; font-variation-settings: inherit; font-size: 100%; font-weight: inherit; line-height: inherit; letter-spacing: inherit; color: inherit; margin: 0; padding: 0; }
button, select { text-transform: none; }
button, input:where([type='button']), input:where([type='reset']), input:where([type='submit']) { -webkit-appearance: button; background-color: transparent; background-image: none; }
:-moz-focusring { outline: auto; }
:-moz-ui-invalid { box-shadow: none; }
progress { vertical-align: baseline; }
::-webkit-inner-spin-button, ::-webkit-outer-spin-button { height: auto; }
[type='search'] { -webkit-appearance: textfield; outline-offset: -2px; }
::-webkit-search-decoration { -webkit-appearance: none; }
::-webkit-file-upload-button { -webkit-appearance: button; font: inherit; }
summary { display: list-item; }
blockquote, dl, dd, h1, h2, h3, h4, h5, h6, hr, figure, p, pre { margin: 0; }
fieldset { margin: 0; padding: 0; }
legend { padding: 0; }
ol, ul, menu { list-style: none; margin: 0; padding: 0; }
dialog { padding: 0; }
textarea { resize: vertical; }
input::placeholder, textarea::placeholder { opacity: 1; color: ${placeholder}; }
button, [role="button"] { cursor: pointer; }
:disabled { cursor: default; }
img, svg, video, canvas, audio, iframe, embed, object { display: block; vertical-align: middle; }
img, video { max-width: 100%; height: auto; }
[hidden]:where(:not([hidden="until-found"])) { display: none; }
`;
}

function fontStack(value: unknown): string {
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'string') return value;
  return '';
}

/**
 * Convenience one-shot generator.
 */
export function createGenerator(config: Partial<NakshoraConfig> = {}): CSSGenerator {
  return new CSSGenerator(config);
}

export { classToSelector, extractClasses, minifyCss, splitClass, GROUP_CATEGORIES };
export default CSSGenerator;
