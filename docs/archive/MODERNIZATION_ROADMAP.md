# 🚀 Nakshora Modernization Roadmap

**Comprehensive Architecture Refactor to Tailwind CSS v4+ Standards**

---

## 📋 Executive Summary

This document outlines the complete modernization of Nakshora from a simple utility CSS framework into a **production-grade, monorepo-based, JIT-compiled CSS engine** matching Tailwind CSS v4 architecture and performance standards.

### Vision

Transform Nakshora into the **fastest, most flexible, open-source utility-first CSS framework** with:

- ⚡ JIT compilation (on-demand class generation)
- 🎨 Advanced variant & arbitrary value system
- 📦 Monorepo with CLI, PostCSS, Vite, and Core packages
- 🔄 Automated CI/CD with free CDN distribution
- 🏆 Production-grade tooling and DX

---

## Phase 1: Monorepo Architecture & Core Setup

### 1.1 Monorepo Structure

```
nakshora/
├── packages/
│   ├── @nakshora/core           # Core JIT compiler & engine
│   ├── @nakshora/cli            # Command-line interface
│   ├── @nakshora/postcss        # PostCSS plugin
│   └── @nakshora/vite-plugin    # Vite integration
├── tools/
│   ├── scripts/                 # Shared build scripts
│   └── ts-config/              # Shared TypeScript configs
├── .changeset/                  # Changesets configuration
├── .github/
│   └── workflows/
│       ├── release.yml          # CI/CD Release pipeline
│       ├── test.yml             # Test pipeline
│       └── performance.yml      # Performance tracking
├── docs/
│   ├── ARCHITECTURE.md          # System architecture
│   ├── JIT_COMPILER.md          # JIT compiler internals
│   ├── PLUGIN_DEVELOPMENT.md    # Plugin development guide
│   └── MIGRATION_V3.md          # Migration from v2 to v3
├── pnpm-workspace.yaml          # pnpm workspace config
├── package.json                 # Root workspace package
├── tsconfig.json                # Root TypeScript config
├── .eslintrc.cjs                # ESLint configuration
├── .prettierrc                  # Prettier configuration
└── vitest.config.ts             # Vitest configuration
```

### 1.2 Package Structure Details

#### `@nakshora/core`

```
packages/@nakshora/core/
├── src/
│   ├── index.ts                 # Main entry point
│   ├── jit-compiler.ts          # JIT compilation engine
│   ├── parser.ts                # CSS class parser
│   ├── ast.ts                   # AST definitions
│   ├── variants.ts              # Variant system
│   ├── arbitrary-values.ts      # Bracket syntax handler
│   ├── design-tokens.ts         # Token system
│   ├── theme.ts                 # Theme engine
│   ├── config.ts                # Configuration loader
│   ├── cache.ts                 # Compilation cache
│   ├── utils/
│   │   ├── css-utils.ts         # CSS utilities
│   │   └── string-utils.ts      # String utilities
│   └── types/
│       └── index.ts             # TypeScript definitions
├── dist/
│   ├── core.esm.js              # ESM build
│   ├── core.cjs.js              # CommonJS build
│   ├── core.umd.js              # UMD build (browser)
│   └── core.d.ts                # Type definitions
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

#### `@nakshora/cli`

```
packages/@nakshora/cli/
├── src/
│   ├── cli.ts                   # CLI entry point
│   ├── commands/
│   │   ├── build.ts             # Build command
│   │   ├── watch.ts             # Watch mode
│   │   └── init.ts              # Init command
│   ├── logger.ts                # Console output
│   └── config.ts                # CLI configuration
├── bin/
│   └── nakshora.js              # Executable
├── dist/
├── package.json
└── tsconfig.json
```

#### `@nakshora/postcss`

```
packages/@nakshora/postcss/
├── src/
│   ├── index.ts                 # PostCSS plugin entry
│   ├── plugin.ts                # PostCSS implementation
│   └── scanner.ts               # Source file scanner
├── dist/
├── package.json
└── tsconfig.json
```

#### `@nakshora/vite-plugin`

```
packages/@nakshora/vite-plugin/
├── src/
│   ├── index.ts                 # Plugin entry
│   ├── plugin.ts                # Vite plugin implementation
│   └── hmr.ts                   # HMR support
├── dist/
├── package.json
└── tsconfig.json
```

---

## Phase 2: Core JIT Compiler Architecture

### 2.1 JIT Compilation System

The JIT (Just-In-Time) compiler generates CSS classes **on-demand** by:

1. **Scanning source files** for utility class usage (JSX, TSX, HTML, Vue, Svelte)
2. **Parsing class names** using a sophisticated regex/state machine
3. **Applying variant transformations** (responsive, state, pseudo-classes)
4. **Resolving arbitrary values** from bracket syntax
5. **Generating optimized CSS** with vendor prefixes
6. **Caching results** for fast rebuilds

### 2.2 Parser Algorithm (TypeScript Pseudocode)

```typescript
/**
 * Core JIT Parser Algorithm
 *
 * Input: HTML/JSX source code
 * Output: Set of CSS rules to generate
 */

interface ClassMatch {
  classname: string;
  variants: string[];
  property: string;
  value: string;
  arbitrary?: boolean;
}

// Step 1: Scan source files
async function scanSourceFiles(globs: string[]): Promise<string[]> {
  // Find all source files matching patterns
  // (*.html, *.jsx, *.tsx, *.vue, *.svelte)
}

// Step 2: Extract utility classes
function extractClasses(source: string): ClassMatch[] {
  // Regex patterns for different class formats:
  // - Simple: "flex", "w-4", "text-lg"
  // - Variants: "hover:text-red-600", "md:flex"
  // - Arbitrary: "w-[calc(100%-12px)]", "text-[#123456]"

  const patterns = {
    simple: /\b([a-z]+(?:-[a-z0-9]+)*(?:\d+)?)\b/g,
    variants: /([a-z]+):(.*)/,
    arbitrary: /\[([^\]]+)\]/,
  };

  // Parse and categorize each match
}

// Step 3: Resolve design tokens
function resolveToken(token: string, theme: ThemeConfig): string {
  // Look up token in theme config
  // Handle nested paths: "colors.blue.500" → "#3b82f6"
  // Support arbitrary values: "[#123456]", "[calc(...)]"
}

// Step 4: Apply variants
function applyVariants(base: string, variants: string[]): string {
  // For "hover:text-red-600":
  //   - Base: "text-red-600" → "color: #dc2626"
  //   - Variant: "hover:" → ".hover\\:text-red-600:hover { ... }"
  // Support variant composition:
  // - "md:hover:text-red-600" → @media (min-width: 768px) { ... :hover { ... } }
}

// Step 5: Generate CSS
function generateCss(matches: ClassMatch[], theme: ThemeConfig): string {
  let css = '';

  for (const match of matches) {
    const rule = buildCssRule(match, theme);
    css += rule;
  }

  return css;
}

// Step 6: Cache & return
function compileToCSS(sources: string[], config: NakshoraConfig): string {
  const matches = new Set<ClassMatch>();

  for (const source of sources) {
    extractClasses(source).forEach((m) => matches.add(m));
  }

  const cached = cache.getIfValid(matches);
  if (cached) return cached;

  const css = generateCss(Array.from(matches), config.theme);
  cache.set(matches, css);

  return css;
}
```

### 2.3 Variant System Architecture

```typescript
interface VariantConfig {
  name: string;
  selector: (selector: string) => string; // CSS selector transformation
  atRule?: (rule: string) => string; // @media/@supports transformation
  priority?: number; // Specificity handling
}

type VariantType =
  | 'pseudo-class' // :hover, :focus, :active
  | 'pseudo-element' // ::before, ::after
  | 'responsive' // @media queries
  | 'state' // group-hover, peer-checked
  | 'dark' // @media (prefers-color-scheme: dark)
  | 'custom'; // User-defined

// Built-in variants:
const builtInVariants: Record<string, VariantConfig> = {
  hover: {
    name: 'hover',
    selector: (sel) => `${sel}:hover`,
  },
  focus: {
    name: 'focus',
    selector: (sel) => `${sel}:focus`,
  },
  'group-hover': {
    name: 'group-hover',
    selector: (sel) => `.group:hover ${sel}`,
  },
  'peer-checked': {
    name: 'peer-checked',
    selector: (sel) => `.peer:checked ~ ${sel}`,
  },
  dark: {
    name: 'dark',
    atRule: (rule) => `@media (prefers-color-scheme: dark) { ${rule} }`,
  },
  sm: {
    name: 'sm',
    atRule: (rule) => `@media (min-width: 640px) { ${rule} }`,
    type: 'responsive',
  },
  // ... more variants
};
```

### 2.4 Arbitrary Values Parser

```typescript
/**
 * Support for arbitrary values in bracket syntax
 * Examples:
 *   - w-[100px], h-[calc(100%-12px)]
 *   - bg-[#f3cc00], text-[rgb(255,0,0)]
 *   - top-[12.5%], z-[999]
 */

function parseArbitraryValue(input: string): {
  property: string;
  value: string;
  unit?: string;
} {
  // Extract: "w-[100px]" → { property: 'width', value: '100px' }
  // Handle: "bg-[url(...)]", "shadow-[0_0_10px_rgba(...)]"
  // Support: calc(), rgba(), var(), etc.

  const match = input.match(/^([a-z-]+)-\[(.+)\]$/);
  if (!match) return null;

  const [, utility, value] = match;
  return {
    property: utilityToProperty(utility),
    value: value,
  };
}
```

### 2.5 Design Token System

```typescript
interface DesignTokens {
  colors: Record<string, ColorScale>;
  spacing: Record<string, string>;
  fontSize: Record<string, [string, LineHeightScale]>;
  fontWeight: Record<string, number>;
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
  zIndex: Record<string, string>;
  opacity: Record<string, string>;
  duration: Record<string, string>;
  timingFunction: Record<string, string>;
  breakpoints: Record<string, string>;
  [key: string]: unknown;
}

// Theme configuration with @theme syntax (like Tailwind v4)
const configFile = `
@theme {
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --font-mono: 'Courier New', monospace;
  --border-radius-lg: 0.75rem;
  --shadow-lg: 0 20px 25px -5px rgb(0, 0, 0, 0.1);
  
  // Responsive breakpoints
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
}
`;
```

---

## Phase 3: Migration Roadmap (v2 → v3)

### 3.1 Migration Steps

| Step | Task                                   | Effort | Timeline |
| ---- | -------------------------------------- | ------ | -------- |
| 1    | Set up monorepo structure with pnpm    | Low    | Week 1   |
| 2    | Migrate core types to `@nakshora/core` | Low    | Week 1   |
| 3    | Implement JIT compiler algorithm       | High   | Week 2-3 |
| 4    | Build variant system engine            | High   | Week 2-3 |
| 5    | Create arbitrary values parser         | Medium | Week 3   |
| 6    | Implement design token system          | Medium | Week 3-4 |
| 7    | Build PostCSS plugin                   | Medium | Week 4   |
| 8    | Create Vite plugin                     | Medium | Week 4   |
| 9    | Build CLI tool                         | Medium | Week 4-5 |
| 10   | Create GitHub Actions workflows        | Medium | Week 5   |
| 11   | Set up @changesets/cli                 | Low    | Week 5   |
| 12   | Comprehensive testing & docs           | High   | Week 5-6 |
| 13   | Release v3.0.0                         | Low    | Week 6   |

### 3.2 Breaking Changes (v2 → v3)

```typescript
// v2 (Old)
import { CSSGenerator, defaultTheme } from 'nakshora';
const generator = new CSSGenerator(defaultTheme);
const css = generator.generate({ purge: ['src/**/*'] });

// v3 (New)
import { compile } from '@nakshora/core';
import nakshora from '@nakshora/postcss';

// Option 1: PostCSS (recommended)
// postcss.config.js
module.exports = {
  plugins: [
    nakshora({
      content: ['src/**/*.{html,jsx,tsx,vue,svelte}'],
    }),
  ],
};

// Option 2: CLI
// $ nakshora build --watch

// Option 3: Programmatic
import { compile } from '@nakshora/core';
const css = await compile({
  content: ['src/**/*.{html,jsx,tsx,vue,svelte}'],
  theme: customTheme,
});
```

### 3.3 Deprecation Strategy

1. **v2.x**: Freeze feature development, only security fixes
2. **v3.0-beta**: Public beta period (4-6 weeks)
3. **v3.0.0**: Official release, deprecate v2
4. **v2 EOL**: 12 months after v3 release

---

## Phase 4: Deployment & CI/CD

### 4.1 Automated Publishing Pipeline

```yaml
# .github/workflows/release.yml

name: Release

on:
  push:
    branches: [main]

jobs:
  release:
    runs-on: ubuntu-latest

    steps:
      # 1. Setup
      - uses: actions/checkout@v4

      # 2. Run tests
      - run: pnpm test

      # 3. Build packages
      - run: pnpm build

      # 4. Publish to NPM (via changesets)
      - run: pnpm publish:packages

      # 5. Publish to GitHub Packages
      - run: pnpm publish:github

      # 6. Create GitHub release
      - run: pnpm create:release

      # 7. Upload to CDNs (jsDelivr, unpkg)
      # (Automatic via NPM metadata)
```

### 4.2 CDN Distribution

All packages automatically available on:

```html
<!-- jsDelivr CDN -->
<script src="https://cdn.jsdelivr.net/npm/@nakshora/core@latest/dist/core.umd.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@nakshora/core@latest/dist/core.css" />

<!-- Unpkg CDN -->
<script src="https://unpkg.com/@nakshora/core@latest/dist/core.umd.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@nakshora/core@latest/dist/core.css" />
```

---

## Phase 5: Developer Experience Enhancements

### 5.1 IntelliSense & IDE Support

Create Language Server Protocol (LSP) extension for VS Code:

- Autocomplete for utility classes
- Real-time validation
- Color preview for color utilities
- Quick info for class documentation
- Inline config diagnostics

### 5.2 Performance Monitoring

- Bundle size tracking
- Compilation speed benchmarks
- CSS output size monitoring
- GitHub Action reports on every commit

### 5.3 Documentation

| Document                | Purpose                 |
| ----------------------- | ----------------------- |
| `ARCHITECTURE.md`       | System design overview  |
| `JIT_COMPILER.md`       | JIT engine internals    |
| `VARIANT_SYSTEM.md`     | Variant architecture    |
| `PLUGIN_DEVELOPMENT.md` | Creating custom plugins |
| `MIGRATION_V3.md`       | Upgrading from v2       |
| `API_REFERENCE.md`      | Complete API docs       |
| `CONTRIBUTING.md`       | Development guide       |

---

## Phase 6: Feature Roadmap

### v3.0 (Core Release)

- ✅ JIT compilation
- ✅ Monorepo structure
- ✅ PostCSS & Vite plugins
- ✅ CLI tool
- ✅ Advanced variants
- ✅ Arbitrary values
- ✅ Design tokens

### v3.1 (Enhancement)

- 🔄 Component library
- 🔄 Animation builder
- 🔄 Plugin ecosystem
- 🔄 Custom functions

### v3.2 (Ecosystem)

- 🔮 VS Code extension
- 🔮 Figma plugin
- 🔮 Tailwind migration tool
- 🔮 Design system CLI

### v4.0 (Advanced)

- 🚀 Rust/Wasm engine
- 🚀 AI-powered suggestions
- 🚀 Real-time collaboration
- 🚀 Advanced performance

---

## Getting Started: Next Steps

1. **Review this roadmap** with team
2. **Set up monorepo** (Phase 1)
3. **Implement JIT compiler** (Phase 2)
4. **Configure CI/CD** (Phase 4)
5. **Release v3.0-beta**
6. **Gather community feedback**
7. **Release v3.0.0**

---

## Technical Resources

- [Tailwind CSS GitHub](https://github.com/tailwindlabs/tailwindcss)
- [PostCSS Plugin API](https://postcss.org/api/)
- [Vite Plugin API](https://vitejs.dev/guide/api-plugin.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Changesets](https://github.com/changesets/changesets)

---

## Questions & Discussion

For discussions on this modernization roadmap, please:

- Open GitHub Discussions
- Email: rrc@bsdc.info.bd
- Visit: rrc.bsdc.info.bd

---

**Ready to modernize Nakshora? Let's build the future of CSS frameworks! 🚀**

**v3.0 Modernization | MIT License | Built by RRC Development**
