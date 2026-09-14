# @nakshora/core

**The Nakshora JIT CSS compiler & engine** — 11,417 utilities across 35
categories, state + responsive variants, themes, design components and a plugin
API. Zero runtime JavaScript, zero dependencies.

[![npm version](https://img.shields.io/npm/v/@nakshora/core?color=blue)](https://www.npmjs.com/package/@nakshora/core)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/nakshora/nakshora/blob/main/LICENSE)
![node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)

Nakshora is a utility-first CSS framework with a Tailwind-compatible class
grammar. `@nakshora/core` is the compiler everything else is built on — the
[CLI](https://www.npmjs.com/package/@nakshora/cli), the
[PostCSS plugin](https://www.npmjs.com/package/@nakshora/postcss) and the
[Vite plugin](https://www.npmjs.com/package/@nakshora/vite-plugin) are thin
wrappers around it.

## Install

```bash
npm install @nakshora/core
```

Dual ESM/CJS builds with TypeScript declarations.

## Usage

### JIT — compile only the classes you use

```js
import { CSSGenerator } from '@nakshora/core';

const generator = new CSSGenerator({
  content: ['./src/**/*.{html,js,ts,jsx,tsx,vue}'],
});

const css = generator.generate({ minify: true });
```

### Full build — every utility

```js
import { createGenerator } from '@nakshora/core';

const css = createGenerator().generate({ mode: 'full' });
```

### Compile a raw string of markup

```js
import { CSSGenerator } from '@nakshora/core';

const css = new CSSGenerator().generateFromContent(
  '<button class="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 md:hover:bg-blue-700">Go</button>',
);
```

### Themes & presets

```js
import { CSSGenerator, neonTheme, applyPreset, defaultTheme, mergeConfig } from '@nakshora/core';

const config = mergeConfig(defaultTheme, { theme: neonTheme });
const css = new CSSGenerator(config).generate();
```

Five presets ship with the package: `neonTheme`, `pastelTheme`,
`brutalistTheme`, `minimalistTheme`, `natureTheme`.

### Layer-by-layer output

```js
const g = new CSSGenerator(config);
g.getBase(); //         preflight / resets
g.getVariables(); //    :root CSS custom properties for every token
g.getKeyframes(); //    @keyframes
g.getUtilitiesFull(); // all utilities (+ variants)
g.getComponents(); //   glass / neon / brutalist / minimalist / skeletons
```

### AI / tooling assets

```js
import { buildUtilityList, buildAICorpus, corpusToSFT, metadata, version } from '@nakshora/core';

buildUtilityList(); // every utility, grouped by category
buildAICorpus(); //    structured corpus (JSON) for LLM training
corpusToSFT(); //      instruction-tuning dataset (JSONL)
```

## Configuration

```js
new CSSGenerator({
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'], // enables JIT
  safelist: ['lg:flex', 'dark:bg-slate-900'], // always emit these
  important: true, // or '#app' to scope specificity
  darkMode: 'class', // `dark:` variants via <html class="dark">
  theme: {
    colors: { brand: { DEFAULT: '#6d28d9', 500: '#8b5cf6' } },
    spacing: { 18: '4.5rem' },
    screens: { '3xl': '1920px' },
  },
  corePlugins: { preflight: true, container: false },
  plugins: [
    {
      name: 'my-plugin',
      utilities: { 'btn-xl': { padding: '1rem 2rem' } },
    },
  ],
});
```

Variants compose in any order — `md:hover:bg-blue-600`, `dark:focus-visible:ring-2`,
`group-hover:text-white`, `peer-checked:border-green-500`.

## Documentation

- [JavaScript API reference](https://github.com/nakshora/nakshora/blob/main/docs/API.md)
- [Configuration](https://github.com/nakshora/nakshora/blob/main/docs/CONFIGURATION.md)
- [JIT compiler](https://github.com/nakshora/nakshora/blob/main/docs/JIT.md)
- [Utilities by category](https://github.com/nakshora/nakshora/blob/main/docs/UTILITIES.md)
- [Variants](https://github.com/nakshora/nakshora/blob/main/docs/VARIANTS.md) ·
  [Responsive](https://github.com/nakshora/nakshora/blob/main/docs/RESPONSIVE.md) ·
  [Themes](https://github.com/nakshora/nakshora/blob/main/docs/THEMES.md)
- [Full setup guide](https://github.com/nakshora/nakshora/blob/main/docs/SETUP.md)
- [AI / LLM training assets](https://github.com/nakshora/nakshora/blob/main/docs/AI_TRAINING.md)

## License

MIT © Rizwan Rahim Chowdhury —
[nakshora/nakshora](https://github.com/nakshora/nakshora)
