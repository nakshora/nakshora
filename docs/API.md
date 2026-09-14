# JavaScript API Reference

Complete programmatic surface of `@nakshora/core`.

```js
import {
  CSSGenerator,
  createGenerator,
  defaultTheme,
  defaultVariants,
  defaultColors,
  mergeConfig,
  resolveThemeValue,
  applyPreset,
  deepMerge,
  buildUtilityList,
  GROUP_CATEGORIES,
  componentCss,
  componentNames,
  extractClasses,
  minifyCss,
  splitClass,
  escapeClass,
  stringifyDecls,
  classToSelector,
  formatBytes,
  byteLength,
  neonTheme,
  pastelTheme,
  brutalistTheme,
  minimalistTheme,
  natureTheme,
  buildAICorpus,
  corpusToSFT,
  STATE_VARIANTS,
  version,
  metadata,
} from '@nakshora/core';

import nakshoraDefault, { version as v } from '@nakshora/core';
// nakshoraDefault === { CSSGenerator, defaultTheme, neonTheme, version, metadata, … }
```

## `class CSSGenerator`

The JIT CSS compiler.

```js
const generator = new CSSGenerator(config?: Partial<NakshoraConfig>);
```

### `generator.generate(options?) → string`

Generate a stylesheet.

```js
generate(options?: {
  minify?: boolean,        // minify output
  mode?: 'full' | 'jit',   // 'jit' also accepts content
  content?: string | string[],
  sourceMap?: boolean,     // accepted for compat (bundler provides maps)
})
```

Mode resolution: explicit `mode` → JIT when `content` is configured → full.

### `generator.generateFromContent(content, options?) → string`

JIT-compile a raw content string/array.

### `generator.getBase() → string`

### `generator.getVariables() → string`

### `generator.getKeyframes(names?: Set<string>) → string`

### `generator.getUtilitiesFull(includeVariants = true) → string`

### `generator.getComponents() → string`

Individual layers (used by the PostCSS/Vite integrations).

### `generator.getUtilities() → UtilityRule[]`

The complete utility catalog:

```ts
interface UtilityRule {
  class: string; // 'mt-4'
  category: string; // 'spacing'
  group: string; // 'margin' (corePlugins key)
  decls: CSSProperties; // { 'margin-top': '1rem' }
  description?: string;
  variantable?: boolean;
  responsive?: boolean;
}
```

### `generator.getUtility(className) → UtilityRule | undefined`

### `generator.getStats(css?) → GenerationStats`

```ts
interface GenerationStats {
  utilities: number; // catalog size (value-bearing classes without variants)
  responsiveRules: number; // style rules inside @media / @container
  variantRules: number; // style rules whose selector list has a variant prefix (`\:`)
  totalRules: number; // style rules (keyframe steps excluded)
  sizeBytes: number;
  minifiedSizeBytes: number;
}
```

Counts are taken from the parsed stylesheet (`parseCss`), so nested at-rules,
selector lists and comments are handled exactly. Full build (measured):
68,601 rules, 57,115 responsive, 57,110 variant — the 5 non-variant responsive
rules are the `sm`…`2xl` `.container` steps.

### `generator.minify(css) → string`

### `generator.config: NakshoraConfig`

The resolved config (read-only).

## `createGenerator(config?) → CSSGenerator`

Convenience constructor.

## Config helpers

### `mergeConfig(base, override) → NakshoraConfig`

Deep-merges two configs (theme sections recursively; safelist/plugins
concatenate; override wins).

### `resolveThemeValue(theme, path) → string | number | null`

```js
resolveThemeValue(defaultTheme, 'colors.blue.500'); // '#3b82f6'
resolveThemeValue(defaultTheme, 'spacing.4'); // '1rem'
```

### `applyPreset(config, preset) → NakshoraConfig`

Apply a theme preset (e.g. `neonTheme`) to a config.

### `deepMerge(base, override) → T`

Recursive plain-object merge (arrays replace).

## Data

| Export                            | Description                                               |
| --------------------------------- | --------------------------------------------------------- |
| `defaultTheme`                    | full default theme (22 palettes, spacing, breakpoints, …) |
| `defaultVariants`                 | all-`true` variant map                                    |
| `defaultColors`                   | the 22 default palettes                                   |
| `buildUtilityList(theme)`         | raw catalog builder (used by the generator)               |
| `GROUP_CATEGORIES`                | group key → category label                                |
| `componentCss` / `componentNames` | the built-in component CSS blocks                         |
| `STATE_VARIANTS`                  | `VariantDef[]` — prefix, suffix, ancestor, description    |
| `version` / `metadata`            | package identity                                          |

## Presets

`neonTheme`, `pastelTheme`, `brutalistTheme`, `minimalistTheme`, `natureTheme`

```ts
interface PresetConfig {
  name: 'neon' | 'pastel' | 'brutalist' | 'minimalist' | 'nature';
  description: string;
  colors: ColorConfig;
  typography: Partial<TypographyConfig>;
  shadows?;
  borderRadius?;
  animation?;
  keyframes?;
}
```

## String utilities

| Function                                      | Purpose                                                 |
| --------------------------------------------- | ------------------------------------------------------- |
| `extractClasses(content: string[], pattern?)` | JIT class extraction (Set)                              |
| `splitClass(token)`                           | `{ prefixes: string[], base: string }`                  |
| `escapeClass(name)`                           | class → CSS-safe selector part (`hover:x` → `hover\:x`) |
| `stringifyDecls(decls, important?)`           | declarations → `a: b; c: d`                             |
| `classToSelector(name, suffix?, ancestor?)`   | full selector builder                                   |
| `minifyCss(css)`                              | whitespace/comment minifier                             |
| `byteLength(str)` / `formatBytes(n)`          | size helpers                                            |

## AI assets

### `buildAICorpus(config?, version?) → AICorpus`

Structured corpus of every utility, variant and breakpoint — for RAG or
fine-tuning.

```ts
interface AICorpus {
  framework: 'nakshora';
  version: string;
  generatedAt: string;
  description: string;
  howToUse: string[]; // system-prompt-ready guidance
  variants: { prefix; description; example }[];
  breakpoints: { name; min; example }[];
  categories: {
    id;
    name;
    utilities: [
      { class; css; description; category; example; responsiveExamples; variantExamples },
    ];
  }[];
  utilityCount: number;
}
```

### `corpusToSFT(corpus, limit = 500) → string`

JSONL for supervised fine-tuning (one `{"messages":[user, assistant]}` per line).

## Plugins

```ts
type PluginInput =
  | ((api: UtilityGenerator) => void)
  | { name: string; config?(config: NakshoraConfig): void; handler?(api: UtilityGenerator): void }
  | TailwindPluginObject; // plugin(...) / plugin.withOptions(...) / official plugins

interface UtilityGenerator {
  addUtilities(utilities, options?): void;
  matchUtilities({ [name]: (value, { modifier }) => decls }, options?): void;
  addComponents(components, options?): void;
  matchComponents({ [name]: (value, { modifier }) => decls }, options?): void;
  addBase(base): void;
  addVariant(name, definition: string | string[] | (api) => string | string[]): void;
  matchVariant(name, (value, { modifier }) => string | string[], { values? }): void;
  theme(path?, defaultValue?): unknown;
  config(path?, defaultValue?): unknown;
  corePlugins(name): boolean;
  e(className): string;
  prefix(selector): string;
}
```

Full example with the exact CSS each method produces: [CONFIGURATION.md → Plugins](./CONFIGURATION.md#plugins).
`plugin()` and `plugin.withOptions()` are exported from `@nakshora/core` for
Tailwind-style authoring.
