// Nakshora Core — CSS generator (full & JIT modes)

import type {
  CSSProperties,
  GenerationOptions,
  GenerationStats,
  NakshoraConfig,
  ThemeConfig,
  UtilityRule,
  UtilityGenerator,
  VariantsConfig,
} from './types';
import { defaultTheme, defaultVariants, deepMerge } from './config';
import { buildUtilityList } from './registry';
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

/**
 * A single state-variant definition.
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
 * All built-in state variants, in cascade order.
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
    description: 'applies on keyboard focus',
  },
  {
    prefix: 'focus-within',
    suffix: ':focus-within',
    ancestor: '',
    configKey: 'focusWithin',
    description: 'applies when a descendant has focus',
  },
  {
    prefix: 'active',
    suffix: ':active',
    ancestor: '',
    configKey: 'active',
    description: 'applies while the element is active (pressed)',
  },
  {
    prefix: 'visited',
    suffix: ':visited',
    ancestor: '',
    configKey: 'visited',
    description: 'applies to visited links',
  },
  {
    prefix: 'disabled',
    suffix: ':disabled',
    ancestor: '',
    configKey: 'disabled',
    description: 'applies when disabled',
  },
  {
    prefix: 'first',
    suffix: ':first-child',
    ancestor: '',
    configKey: 'firstChild',
    description: 'applies to the first child',
  },
  {
    prefix: 'last',
    suffix: ':last-child',
    ancestor: '',
    configKey: 'lastChild',
    description: 'applies to the last child',
  },
  {
    prefix: 'group-hover',
    suffix: '',
    ancestor: '.group:hover',
    configKey: 'groupHover',
    description: 'applies when the .group parent is hovered',
  },
  {
    prefix: 'group-focus',
    suffix: '',
    ancestor: '.group:focus',
    configKey: 'groupFocus',
    description: 'applies when the .group parent has focus',
  },
  {
    prefix: 'peer-hover',
    suffix: '',
    ancestor: '.peer:hover ~',
    configKey: 'peerHover',
    description: 'applies when the preceding .peer sibling is hovered',
  },
  {
    prefix: 'peer-focus',
    suffix: '',
    ancestor: '.peer:focus ~',
    configKey: 'peerFocus',
    description: 'applies when the preceding .peer sibling has focus',
  },
  {
    prefix: 'dark',
    suffix: '',
    ancestor: '.dark',
    configKey: 'dark',
    description: 'applies inside a .dark ancestor (class dark mode)',
  },
];

const variantByPrefix = new Map<string, VariantDef>(STATE_VARIANTS.map((v) => [v.prefix, v]));

export interface ResolvedBreakpoint {
  name: string;
  px: number;
}

export class CSSGenerator {
  readonly config: NakshoraConfig;
  private readonly theme: Required<ThemeConfig>;
  private readonly variantCfg: Required<VariantsConfig>;
  private readonly utilities: UtilityRule[];
  private readonly breakpoints: ResolvedBreakpoint[];
  private readonly utilityByClass: Map<string, UtilityRule>;
  private readonly extraBase: Record<string, CSSProperties>;
  private readonly extraComponents: Record<string, CSSProperties>;

  constructor(config: Partial<NakshoraConfig> = {}) {
    // Apply plugin config hooks on a draft config
    const draft: NakshoraConfig = { ...config };
    const plugins = config.plugins ?? [];
    for (const plugin of plugins) {
      if (plugin.config) plugin.config(draft);
    }

    this.config = {
      theme: deepMerge(defaultTheme, draft.theme ?? {}),
      variants: { ...defaultVariants, ...draft.variants },
      content: draft.content,
      purge: draft.purge ?? [],
      safelist: draft.safelist ?? [],
      plugins,
      important: draft.important ?? false,
      corePlugins: draft.corePlugins ?? {},
      extractorPattern: draft.extractorPattern,
    };
    this.theme = this.config.theme as Required<ThemeConfig>;
    this.variantCfg = this.config.variants as Required<VariantsConfig>;

    // Breakpoints: ascending, skip 0 (that's the base layout)
    this.breakpoints = Object.entries(this.theme.breakpoints ?? {})
      .filter(([, px]) => typeof px === 'number' && px > 0)
      .map(([name, px]) => ({ name, px: px as number }))
      .sort((a, b) => a.px - b.px);

    // Build the utility catalog
    this.utilities = buildUtilityList(this.theme);
    this.extraBase = {};
    this.extraComponents = {};
    const gen: UtilityGenerator = {
      addUtilities: (utilities, group = 'plugin') => {
        for (const [cls, decls] of Object.entries(utilities)) {
          this.utilities.push({
            class: cls,
            group,
            category: GROUP_LABELS[group] ?? group,
            decls,
            description: `plugin utility ${cls}`,
          });
        }
      },
      addComponents: (components) => {
        Object.assign(this.extraComponents, components);
      },
      addBase: (base) => {
        Object.assign(this.extraBase, base);
      },
    };
    for (const plugin of plugins) {
      if (plugin.handler) plugin.handler(gen);
    }

    // Deduplicate by class name (later wins — Tailwind semantics)
    this.utilityByClass = new Map();
    for (const rule of this.utilities) this.utilityByClass.set(rule.class, rule);
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

  /** All utility rules in catalog order */
  getUtilities(): UtilityRule[] {
    return [...this.utilities];
  }

  /** Look up a single utility by (base) class name */
  getUtility(className: string): UtilityRule | undefined {
    return this.utilityByClass.get(className);
  }

  /** Statistics about a generated stylesheet */
  getStats(css?: string): GenerationStats {
    const generated = css ?? this.generate();
    const minified = minifyCss(generated);
    const ruleCount = (generated.match(/\{[^{}]*\}/g) ?? []).length;
    return {
      utilities: this.utilities.length,
      responsiveRules: (generated.match(/@media/g) ?? []).length,
      variantRules: ruleCount,
      totalRules: ruleCount,
      sizeBytes: byteLength(generated),
      minifiedSizeBytes: byteLength(minified),
    };
  }

  minify(css: string): string {
    return minifyCss(css);
  }

  // ───────────────────────────── layer accessors ─────────────────────────────
  // Exposed for bundler integrations (PostCSS, Vite) that need individual layers.

  /** Base styles (reset, defaults, reduced-motion) */
  getBase(): string {
    return this.baseStyles();
  }

  /** `:root` CSS variables */
  getVariables(): string {
    return this.variables();
  }

  /** `@keyframes` for the referenced animations */
  getKeyframes(names?: Set<string>): string {
    return this.keyframes(names);
  }

  /**
   * Full utility set.
   * @param includeVariants when true (default) state variants are included
   *   as well — the standard full build omits them (JIT-only) to stay lean.
   */
  getUtilitiesFull(includeVariants = true): string {
    let css = '';
    const rules = this.utilities.filter((r) => this.isGroupEnabled(r.group));
    const variants = includeVariants ? this.enabledVariants() : [];
    const breakpoints = this.enabledBreakpoints();
    let lastGroup = '';
    for (const rule of rules) {
      if (rule.group !== lastGroup) {
        lastGroup = rule.group;
        css += `\n/* ${GROUP_LABELS[rule.group] ?? rule.group} */\n`;
      }
      css += this.emitRule(rule);
    }
    for (const bp of breakpoints) {
      css += `\n@media (min-width: ${bp.px}px) {\n`;
      for (const rule of rules) {
        if (rule.responsive === false) continue;
        css += this.emitRule(rule, bp.name);
      }
      css += '}\n';
    }
    for (const variant of variants) {
      css += `\n/* variant: ${variant.prefix} */\n`;
      for (const rule of rules) {
        if (rule.variantable === false) continue;
        css += this.emitRule(rule, variant.prefix);
      }
    }
    return css;
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

  private enabledVariants(): VariantDef[] {
    return STATE_VARIANTS.filter((v) => this.variantCfg[v.configKey] !== false);
  }

  private enabledBreakpoints(): ResolvedBreakpoint[] {
    return this.variantCfg.responsive !== false ? this.breakpoints : [];
  }

  private isGroupEnabled(group: string): boolean {
    return this.config.corePlugins?.[group] !== false;
  }

  /** Wrap a selector with the `important` scope when configured as a string */
  private wrapSelector(selector: string): string {
    const imp = this.config.important;
    if (typeof imp === 'string' && imp.trim()) {
      return imp
        .trim()
        .split(',')
        .map((s) => s.trim())
        .map((scope) => `${scope} ${selector}`)
        .join(', ');
    }
    return selector;
  }

  private emitRule(rule: UtilityRule, prefix = '', media?: string): string {
    const variant = prefix ? variantByPrefix.get(prefix) : undefined;
    let selector: string;
    if (variant) {
      const full = variant.prefix === prefix ? `${variant.prefix}:${rule.class}` : rule.class;
      const suffix = variant.suffix;
      const ancestor = variant.ancestor;
      selector = ancestor ? `${ancestor} .${escapeClass(full)}` : `.${escapeClass(full)}${suffix}`;
    } else if (prefix) {
      selector = `.${escapeClass(`${prefix}:${rule.class}`)}`;
    } else {
      selector = `.${escapeClass(rule.class)}`;
    }
    selector = this.wrapSelector(selector);
    const decls = stringifyDecls(rule.decls, this.config.important === true);
    const body = `${selector} { ${decls}; }`;
    return media ? `  ${body}\n` : `${body}\n`;
  }

  // ─────────────────────────────── layers ───────────────────────────────

  private baseStyles(): string {
    if (!this.isGroupEnabled('base')) return '';
    const font =
      (this.theme.fontFamily?.sans as string) ??
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    let css = `/* Nakshora v3 — Base */
*, ::before, ::after {
  box-sizing: border-box;
  border-width: 0;
  border-style: solid;
  border-color: #e5e7eb;
}

* {
  margin: 0;
  padding: 0;
}

html {
  line-height: 1.5;
  -webkit-text-size-adjust: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  scroll-behavior: smooth;
}

body {
  font-family: ${font};
  line-height: 1.5;
  color: #1f2937;
  background-color: #ffffff;
}

img, picture, video, canvas, svg {
  display: block;
  max-width: 100%;
}

input, button, textarea, select {
  font: inherit;
  color: inherit;
}

p, h1, h2, h3, h4, h5, h6 {
  overflow-wrap: break-word;
}

h1, h2, h3, h4, h5, h6 {
  font-size: inherit;
  font-weight: inherit;
}

a {
  color: inherit;
  text-decoration: inherit;
}

button {
  cursor: pointer;
  background: none;
}

:where([tabindex="-1"]):focus:not(:focus-visible) {
  outline: none;
}

:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
`;
    for (const [selector, decls] of Object.entries(this.extraBase)) {
      css += `${this.wrapSelector(selector)} { ${stringifyDecls(decls, this.config.important === true)}; }\n`;
    }
    return css;
  }

  private variables(): string {
    if (!this.isGroupEnabled('variables')) return '';
    let css = '\n/* Nakshora v3 — CSS Variables */\n:root {\n';
    for (const [name, scale] of Object.entries(this.theme.colors ?? {})) {
      if (typeof scale === 'string') {
        css += `  --color-${name}: ${scale};\n`;
      } else if (scale) {
        for (const [shade, value] of Object.entries(scale)) {
          if (typeof value === 'string') css += `  --color-${name}-${shade}: ${value};\n`;
        }
      }
    }
    for (const [key, value] of Object.entries(this.theme.spacing ?? {})) {
      css += `  --spacing-${key}: ${value};\n`;
    }
    const fontSize = this.theme.typography?.fontSize ?? {};
    for (const [size, value] of Object.entries(fontSize)) {
      css += `  --text-${size}: ${Array.isArray(value) ? value[0] : value};\n`;
    }
    for (const [name, value] of Object.entries(this.theme.fontFamily ?? {})) {
      css += `  --font-${name}: ${value};\n`;
    }
    css += '}\n';
    return css;
  }

  private keyframes(names?: Set<string>): string {
    if (!this.isGroupEnabled('animations')) return '';
    const keyframes = this.theme.keyframes ?? {};
    const animations = this.theme.animation ?? {};
    const needed = names ?? new Set(Object.values(animations).map((v) => v.split(/\s+/)[0]));
    let css = '';
    for (const [name, body] of Object.entries(keyframes)) {
      if (!needed.has(name)) continue;
      css += `@keyframes ${name} {\n${body
        .split(';')
        .map((s) => (s.trim() ? `  ${s.trim()};` : ''))
        .join('\n')}\n}\n`;
    }
    return css ? `\n/* Nakshora v3 — Keyframes */\n${css}` : '';
  }

  private components(): string {
    if (!this.isGroupEnabled('components')) return '';
    let css = '\n/* Nakshora v3 — Components */\n';
    for (const block of Object.values(componentCss)) css += block;
    for (const [selector, decls] of Object.entries(this.extraComponents)) {
      css += `${this.wrapSelector(selector)} { ${stringifyDecls(decls, this.config.important === true)}; }\n`;
    }
    return css;
  }

  // ─────────────────────────────── full mode ───────────────────────────────

  private generateFull(_options: GenerationOptions): string {
    let css = `/*! Nakshora v3.0.0 — utility-first CSS framework (full build) */\n`;
    css += this.baseStyles();
    css += this.variables();
    css += this.keyframes();
    css += '\n/* ─── Utilities ─── */\n';
    // Full build = base + responsive. State variants (hover:, dark:, …) are
    // JIT-only — they are emitted when classes are found in content.
    css += this.getUtilitiesFull(false);
    css += this.components();
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

    const bpNames = new Map(this.breakpoints.map((b) => [b.name, b]));
    const usedAnimations = new Set<string>();
    const emitted = new Set<string>();
    const blocks: { media?: string; variantOrder: number; body: string }[] = [];

    for (const token of found) {
      const { prefixes, base } = splitClass(token);
      if (prefixes.length > 3) continue;
      const rule = this.utilityByClass.get(base);
      if (!rule) continue;
      if (!this.isGroupEnabled(rule.group)) continue;

      let media: string | undefined;
      let ancestor = '';
      let suffix = '';
      let variantOrder = 0;
      const prefixParts: string[] = [token];

      let ok = true;
      const responsiveEnabled = this.variantCfg.responsive !== false;
      for (const prefix of prefixes) {
        const bp = responsiveEnabled ? bpNames.get(prefix) : undefined;
        if (bp) {
          media = `@media (min-width: ${bp.px}px)`;
          continue;
        }
        const variant = variantByPrefix.get(prefix);
        if (!variant) {
          ok = false;
          break;
        }
        if (this.variantCfg[variant.configKey] === false) {
          ok = false;
          break;
        }
        if (variant.suffix) {
          suffix += variant.suffix;
          variantOrder++;
        } else {
          ancestor = `${ancestor} ${variant.ancestor}`.trim();
          variantOrder++;
        }
      }
      if (!ok) continue;

      const className = prefixParts.join('');
      if (emitted.has(className)) continue;
      emitted.add(className);
      if (rule.group === 'animations') {
        const first = String(rule.decls.animation ?? '').split(/\s+/)[0];
        if (first) usedAnimations.add(first);
      }

      const selector = ancestor
        ? `${ancestor} .${escapeClass(className)}${suffix}`
        : `.${escapeClass(className)}${suffix}`;
      const wrapped = this.wrapSelector(selector);
      const body = `${wrapped} { ${stringifyDecls(rule.decls, this.config.important === true)}; }\n`;
      blocks.push({ media, variantOrder, body: media ? `  ${body}` : body });
    }

    blocks.sort((a, b) => a.variantOrder - b.variantOrder);

    let css = '';
    if (!utilitiesOnly) {
      css += `/*! Nakshora v3.0.0 — JIT build · ${emitted.size} classes */\n`;
      css += this.baseStyles();
      css += this.variables();
      css += this.keyframes(usedAnimations);
    }

    const plain: string[] = [];
    const byMedia = new Map<string, string[]>();
    for (const block of blocks) {
      if (block.media) {
        const list = byMedia.get(block.media) ?? [];
        list.push(block.body);
        byMedia.set(block.media, list);
      } else {
        plain.push(block.body);
      }
    }
    css += '\n/* ─── Utilities (JIT) ─── */\n';
    css += plain.join('');
    const sortedMedia = [...byMedia.entries()].sort(
      (a, b) =>
        parseInt(a[0].match(/min-width: (\d+)/)?.[1] ?? '0', 10) -
        parseInt(b[0].match(/min-width: (\d+)/)?.[1] ?? '0', 10),
    );
    for (const [media, bodies] of sortedMedia) {
      css += `\n${media} {\n${bodies.join('')}\n}\n`;
    }

    css += this.components();
    return css;
  }
}

const GROUP_LABELS: Record<string, string> = {
  display: 'Display',
  position: 'Position',
  inset: 'Inset',
  zIndex: 'Z-Index',
  overflow: 'Overflow',
  visibility: 'Visibility',
  sizing: 'Sizing',
  margin: 'Margin',
  padding: 'Padding',
  gap: 'Gap',
  flex: 'Flexbox',
  grid: 'Grid',
  typography: 'Typography',
  textDecoration: 'Text Decoration',
  textColor: 'Text Colors',
  backgroundColor: 'Background Colors',
  borderColor: 'Border Colors',
  gradients: 'Gradient Stops',
  borders: 'Borders',
  borderRadius: 'Border Radius',
  backgrounds: 'Backgrounds',
  shadows: 'Shadows',
  opacity: 'Opacity',
  filters: 'Filters',
  transforms: 'Transforms',
  transitions: 'Transitions',
  animations: 'Animations',
  cursors: 'Cursors',
  whitespace: 'Whitespace & Misc',
  base: 'Base',
  variables: 'Variables',
  components: 'Components',
  plugin: 'Plugins',
};

/**
 * Convenience one-shot generator.
 */
export function createGenerator(config: Partial<NakshoraConfig> = {}): CSSGenerator {
  return new CSSGenerator(config);
}

export { classToSelector, extractClasses, minifyCss, splitClass };
export default CSSGenerator;
