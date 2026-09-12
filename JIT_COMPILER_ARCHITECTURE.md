# 🔥 Nakshora v3.0 - JIT Compiler Architecture

**Deep Technical Dive: Just-In-Time CSS Generation Engine**

---

## 📑 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Parser Algorithm](#parser-algorithm)
3. [Variant System](#variant-system)
4. [Arbitrary Values](#arbitrary-values)
5. [Design Tokens](#design-tokens)
6. [Caching Strategy](#caching-strategy)
7. [Performance Optimization](#performance-optimization)
8. [Implementation Examples](#implementation-examples)

---

## Architecture Overview

### System Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Source Files                         │
│   (*.html, *.jsx, *.tsx, *.vue, *.svelte)               │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│          File Scanner & Globbing                        │
│  (Extracts potential class names from source)           │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│       Class Name Parser & Tokenizer                     │
│  (Extracts: "hover:md:text-blue-600[calc(100%-12px)]")  │
│   ├─ Variants: ["hover", "md"]                          │
│   ├─ Property: "text-color"                             │
│   ├─ Value: "blue-600[calc(100%-12px)]"                 │
│   └─ Arbitrary: true                                    │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│        Token Resolution Engine                          │
│  (Resolves tokens from theme configuration)             │
│   - "blue-600" → "#2563eb" (from theme.colors)          │
│   - "md" → "@media (min-width: 768px)"                  │
│   - "[calc(...)]" → arbitrary value                     │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│         Variant Transformer                             │
│  (Applies CSS pseudo-classes and media queries)         │
│   - "hover:" → selector:hover                           │
│   - "dark:" → @media (prefers-color-scheme: dark)       │
│   - "group-hover:" → .group:hover selector              │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│         CSS Rule Generator                              │
│  (Generates optimized CSS rules)                        │
│   - Vendor prefixing (-webkit-, -moz-, etc.)            │
│   - Minification                                        │
│   - Deduplication                                       │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│         Cache Layer                                     │
│  (Stores compiled CSS for fast rebuilds)                │
│   - Hash-based invalidation                             │
│   - File watcher for changes                            │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│            Output CSS File                              │
│   (Generated CSS with only used utilities)              │
└─────────────────────────────────────────────────────────┘
```

---

## Parser Algorithm

### Core Parser Logic

```typescript
/**
 * Advanced JIT Parser
 * 
 * Scans source files for utility class usage and generates
 * CSS on-demand instead of outputting a giant static file.
 */

// Step 1: Type Definitions
interface ClassMatch {
  classname: string;              // Full: "hover:md:text-blue-600[calc(100%-12px)]"
  variants: VariantMatch[];       // [{ name: 'hover' }, { name: 'md' }]
  property: string;               // 'color'
  value: string;                  // '#2563eb'
  arbitrary?: boolean;            // true if [calc(...)]
  arbitraryValue?: string;        // 'calc(100%-12px)'
  selector?: string;              // Final CSS selector
  atRule?: string;                // @media or @supports
  specificity: number;            // For conflict resolution
}

interface VariantMatch {
  name: string;                   // 'hover', 'md', 'dark', etc.
  type: 'pseudo-class' | 'responsive' | 'state' | 'dark' | 'custom';
  priority: number;               // Lower = higher specificity
}

interface ThemeConfig {
  colors: Record<string, ColorScale>;
  spacing: Record<string, string>;
  fontSize: Record<string, [string, LineHeight]>;
  fontWeight: Record<string, number>;
  breakpoints: Record<string, string>;
  // ... more tokens
}

// Step 2: File Scanner with Glob Support
async function scanSourceFiles(
  patterns: string[],
  ignorePatterns?: string[]
): Promise<string[]> {
  // Use 'globby' for fast file discovery
  // Support: *.html, *.jsx, *.tsx, *.vue, *.svelte, *.mdx
  
  const files = await globby(patterns, {
    ignore: ignorePatterns || ['node_modules', 'dist', 'build'],
    gitignore: true,
  });
  
  return files;
}

// Step 3: Extract Raw Content
async function extractRawContent(files: string[]): Promise<string> {
  let content = '';
  
  for (const file of files) {
    const fileContent = await fs.readFile(file, 'utf-8');
    content += '\n' + fileContent; // Join all files with newlines
  }
  
  return content;
}

// Step 4: Tokenize Class Names
function tokenizeClasses(content: string): string[] {
  // Regex patterns for different class formats:
  
  // Match class attributes: class="flex w-4 hover:text-red-600"
  const classRegex = /class=['"]([^'"]+)['"]/g;
  
  // Match className props: className={`flex ${condition ? 'hidden' : 'block'}`}
  const classNameRegex = /className=['"]([^'"]+)['"]/g;
  const classNameDynRegex = /className=\{`([^`]+)`\}/g;
  
  // Match Tailwind-like strings
  const tailwindRegex = /(?:class|className)(?:Name)?\s*(?:=|:)\s*['"`]([^'"`]+)['"`]/g;
  
  let matches: string[] = [];
  let match;
  
  // Extract all class strings
  while ((match = classRegex.exec(content)) !== null) {
    matches.push(match[1]);
  }
  while ((match = classNameRegex.exec(content)) !== null) {
    matches.push(match[1]);
  }
  while ((match = classNameDynRegex.exec(content)) !== null) {
    matches.push(match[1]);
  }
  while ((match = tailwindRegex.exec(content)) !== null) {
    matches.push(match[1]);
  }
  
  // Flatten and deduplicate
  return [...new Set(matches)].filter(Boolean);
}

// Step 5: Parse Individual Classes
function parseClassNames(classStrings: string[]): ClassMatch[] {
  const matches: ClassMatch[] = [];
  
  for (const classString of classStrings) {
    // Split by spaces to get individual classes
    const classes = classString.split(/\s+/).filter(Boolean);
    
    for (const className of classes) {
      const match = parseClass(className);
      if (match) {
        matches.push(match);
      }
    }
  }
  
  return matches;
}

// Step 6: Parse Single Class Name
function parseClass(className: string): ClassMatch | null {
  // Format: [variants]property-value[arbitrary]
  // Examples:
  //   - "flex" → property: 'display', value: 'flex'
  //   - "w-4" → property: 'width', value: '1rem' (spacing.4)
  //   - "hover:text-red-600" → variants: ['hover'], property: 'color', value: '#dc2626'
  //   - "md:grid-cols-3" → variants: ['md'], property: 'grid-template-columns', value: 'repeat(3, minmax(0, 1fr))'
  //   - "w-[100px]" → arbitrary: true, value: '100px'
  //   - "hover:md:text-blue-600" → variants: ['hover', 'md'], value: '#3b82f6'

  // Regex pattern to parse class names
  const pattern = /^((?:[a-z-]+:)*)([a-z0-9-]+)(?:-(.+))?$/i;
  const match = className.match(pattern);
  
  if (!match) return null;
  
  const [, variantPart, utility, valuePart] = match;
  
  // Parse variants
  const variants = variantPart
    ? variantPart.split(':').filter(Boolean).map(v => ({ name: v, type: getVariantType(v) }))
    : [];
  
  // Parse utility property
  const [property, value] = parseUtility(utility, valuePart);
  
  if (!property || !value) return null;
  
  return {
    classname: className,
    variants,
    property,
    value,
    arbitrary: valuePart?.startsWith('[') || false,
    arbitraryValue: valuePart?.slice(1, -1) || undefined,
  };
}

// Step 7: Resolve Theme Tokens
function resolveToken(
  utility: string,
  valuePart: string | undefined,
  theme: ThemeConfig
): [string, string] | [null, null] {
  // Map utility prefix to CSS property and theme section
  const utilityMap = {
    'w': { property: 'width', theme: 'spacing' },
    'h': { property: 'height', theme: 'spacing' },
    'p': { property: 'padding', theme: 'spacing' },
    'm': { property: 'margin', theme: 'spacing' },
    'text': { property: 'color', theme: 'colors' },
    'bg': { property: 'background-color', theme: 'colors' },
    'border': { property: 'border-color', theme: 'colors' },
    // ... more mappings
  };
  
  const prefix = utility.split('-')[0];
  const mapping = utilityMap[prefix];
  
  if (!mapping) return [null, null];
  
  // Get value from theme or arbitrary
  let value: string;
  if (valuePart?.startsWith('[')) {
    // Arbitrary value: w-[100px], text-[#f00]
    value = valuePart.slice(1, -1);
  } else if (valuePart) {
    // Theme value: w-4, text-red-600
    const key = valuePart;
    value = theme[mapping.theme][key];
  } else {
    return [null, null];
  }
  
  return [mapping.property, value];
}

// Step 8: Generate CSS Rule with Variants
function generateCssRule(match: ClassMatch, theme: ThemeConfig): string {
  const { property, value, variants, classname } = match;
  
  // Build selector
  let selector = `.${classname.replace(/:/g, '\\:')}`;
  let rule = `${selector} { ${property}: ${value}; }`;
  
  // Apply variants (pseudo-classes first, then media queries)
  for (const variant of variants) {
    rule = applyVariant(rule, variant, theme);
  }
  
  return rule;
}

// Step 9: Apply Variant Transformations
function applyVariant(
  rule: string,
  variant: VariantMatch,
  theme: ThemeConfig
): string {
  switch (variant.type) {
    case 'pseudo-class': {
      // :hover, :focus, :active, etc.
      const selector = rule.match(/\..*?(?=\s*{)/)?.[0];
      return rule.replace(selector, `${selector}:${variant.name}`);
    }
    
    case 'responsive': {
      // @media queries
      const breakpoint = theme.breakpoints[variant.name];
      if (!breakpoint) return rule;
      
      return `@media (min-width: ${breakpoint}) { ${rule} }`;
    }
    
    case 'dark': {
      // @media (prefers-color-scheme: dark)
      return `@media (prefers-color-scheme: dark) { ${rule} }`;
    }
    
    case 'state': {
      // group-hover, peer-checked, etc.
      if (variant.name === 'group-hover') {
        const selector = rule.match(/\..*?(?=\s*{)/)?.[0];
        return rule.replace(selector, `.group:hover ${selector}`);
      }
      
      if (variant.name === 'peer-checked') {
        const selector = rule.match(/\..*?(?=\s*{)/)?.[0];
        return rule.replace(selector, `.peer:checked ~ ${selector}`);
      }
      
      return rule;
    }
    
    default:
      return rule;
  }
}

// Step 10: Main Compilation Function
async function compile(options: {
  content: string[] | string;
  theme?: ThemeConfig;
  output?: string;
  minify?: boolean;
  watch?: boolean;
}): Promise<string> {
  const contentPatterns = Array.isArray(options.content) 
    ? options.content 
    : [options.content];
  
  const theme = options.theme || defaultTheme;
  
  // 1. Scan files
  const files = await scanSourceFiles(contentPatterns);
  
  // 2. Extract content
  const content = await extractRawContent(files);
  
  // 3. Tokenize
  const classStrings = tokenizeClasses(content);
  
  // 4. Parse classes
  const matches = parseClassNames(classStrings);
  
  // 5. Generate CSS
  let css = '';
  const seen = new Set<string>();
  
  for (const match of matches) {
    const rule = generateCssRule(match, theme);
    
    if (!seen.has(rule)) {
      css += rule + '\n';
      seen.add(rule);
    }
  }
  
  // 6. Minify if needed
  if (options.minify) {
    css = minifyCss(css);
  }
  
  // 7. Write output
  if (options.output) {
    await fs.writeFile(options.output, css, 'utf-8');
  }
  
  return css;
}
```

---

## Variant System

### Variant Registry

```typescript
interface VariantRegistry {
  pseudo: Record<string, PseudoClassVariant>;
  responsive: Record<string, ResponsiveVariant>;
  state: Record<string, StateVariant>;
  dark: DarkVariant;
  custom: Record<string, CustomVariant>;
}

// Built-in variants
const BUILT_IN_VARIANTS: VariantRegistry = {
  pseudo: {
    hover: {
      name: 'hover',
      selector: (sel) => `${sel}:hover`,
      priority: 0,
    },
    focus: {
      name: 'focus',
      selector: (sel) => `${sel}:focus`,
      priority: 0,
    },
    active: {
      name: 'active',
      selector: (sel) => `${sel}:active`,
      priority: 0,
    },
    'focus-within': {
      name: 'focus-within',
      selector: (sel) => `${sel}:focus-within`,
      priority: 0,
    },
    'focus-visible': {
      name: 'focus-visible',
      selector: (sel) => `${sel}:focus-visible`,
      priority: 0,
    },
    'visited': {
      name: 'visited',
      selector: (sel) => `${sel}:visited`,
      priority: 0,
    },
    'target': {
      name: 'target',
      selector: (sel) => `${sel}:target`,
      priority: 0,
    },
    'first': {
      name: 'first',
      selector: (sel) => `${sel}:first-child`,
      priority: 0,
    },
    'last': {
      name: 'last',
      selector: (sel) => `${sel}:last-child`,
      priority: 0,
    },
    'only': {
      name: 'only',
      selector: (sel) => `${sel}:only-child`,
      priority: 0,
    },
    'odd': {
      name: 'odd',
      selector: (sel) => `${sel}:nth-child(odd)`,
      priority: 0,
    },
    'even': {
      name: 'even',
      selector: (sel) => `${sel}:nth-child(even)`,
      priority: 0,
    },
    'disabled': {
      name: 'disabled',
      selector: (sel) => `${sel}:disabled`,
      priority: 0,
    },
    'enabled': {
      name: 'enabled',
      selector: (sel) => `${sel}:enabled`,
      priority: 0,
    },
    'checked': {
      name: 'checked',
      selector: (sel) => `${sel}:checked`,
      priority: 0,
    },
    'empty': {
      name: 'empty',
      selector: (sel) => `${sel}:empty`,
      priority: 0,
    },
  },
  
  responsive: {
    xs: { name: 'xs', breakpoint: '0px', priority: 1 },
    sm: { name: 'sm', breakpoint: '640px', priority: 2 },
    md: { name: 'md', breakpoint: '768px', priority: 3 },
    lg: { name: 'lg', breakpoint: '1024px', priority: 4 },
    xl: { name: 'xl', breakpoint: '1280px', priority: 5 },
    '2xl': { name: '2xl', breakpoint: '1536px', priority: 6 },
  },
  
  state: {
    'group-hover': {
      name: 'group-hover',
      selector: (sel) => `.group:hover ${sel}`,
      priority: 1,
    },
    'group-focus': {
      name: 'group-focus',
      selector: (sel) => `.group:focus ${sel}`,
      priority: 1,
    },
    'peer-hover': {
      name: 'peer-hover',
      selector: (sel) => `.peer:hover ~ ${sel}`,
      priority: 1,
    },
    'peer-focus': {
      name: 'peer-focus',
      selector: (sel) => `.peer:focus ~ ${sel}`,
      priority: 1,
    },
    'peer-checked': {
      name: 'peer-checked',
      selector: (sel) => `.peer:checked ~ ${sel}`,
      priority: 1,
    },
  },
  
  dark: {
    name: 'dark',
    atRule: '@media (prefers-color-scheme: dark)',
    priority: 2,
  },
};
```

---

## Arbitrary Values

### Bracket Syntax Parser

```typescript
/**
 * Support for arbitrary values in square brackets
 * Examples:
 *   - w-[100px], h-[calc(100%-12px)]
 *   - bg-[#f3cc00], text-[rgb(255,0,0)]
 *   - top-[12.5%], z-[999]
 *   - shadow-[0_10px_20px_rgba(0,0,0,0.3)]
 *   - font-[family-name] for arbitrary fonts
 */

function parseArbitraryValue(input: string): {
  utility: string;
  value: string;
  unit?: string;
  type: 'length' | 'color' | 'function' | 'string';
} | null {
  // Match: "utility-[value]"
  const match = input.match(/^([a-z0-9-]+)-\[(.+)\]$/i);
  if (!match) return null;
  
  const [, utility, value] = match;
  
  // Detect value type
  let type: 'length' | 'color' | 'function' | 'string' = 'string';
  
  if (/^#([a-f0-9]{3}|[a-f0-9]{6}|[a-f0-9]{8})$/i.test(value)) {
    type = 'color';
  } else if (/^(rgb|hsl|var|calc)\(/i.test(value)) {
    type = 'function';
  } else if (/^\d+(%|px|em|rem|vw|vh|ch|ex)?$/.test(value)) {
    type = 'length';
  }
  
  return { utility, value, type };
}

// Validate arbitrary values
function isValidArbitraryValue(value: string): boolean {
  // Reject common XSS attempts
  const dangerous = ['javascript:', 'onerror', 'onclick', 'eval'];
  return !dangerous.some(d => value.toLowerCase().includes(d));
}

// Examples of valid arbitrary values
const examples = [
  'w-[100px]' → { property: 'width', value: '100px' }
  'h-[calc(100%-12px)]' → { property: 'height', value: 'calc(100%-12px)' }
  'bg-[#f3cc00]' → { property: 'background-color', value: '#f3cc00' }
  'text-[rgb(255,0,0)]' → { property: 'color', value: 'rgb(255,0,0)' }
  'top-[12.5%]' → { property: 'top', value: '12.5%' }
  'z-[999]' → { property: 'z-index', value: '999' }
  'shadow-[0_10px_20px_rgba(0,0,0,0.3)]' → { property: 'box-shadow', value: '0 10px 20px rgba(0,0,0,0.3)' }
];
```

---

## Design Tokens

### Token Resolution

```typescript
/**
 * Design tokens are the foundation of the framework
 * Includes: colors, spacing, typography, shadows, etc.
 */

interface DesignTokens {
  colors: Record<string, ColorScale>;
  spacing: Record<string, string>;
  fontSize: Record<string, [string, LineHeightScale]>;
  fontWeight: Record<string, number>;
  borderRadius: Record<string, string>;
  boxShadow: Record<string, string>;
  transitionDuration: Record<string, string>;
  transitionTimingFunction: Record<string, string>;
  zIndex: Record<string, string>;
  opacity: Record<string, string>;
  [key: string]: unknown;
}

// Default design tokens
const DEFAULT_TOKENS: DesignTokens = {
  colors: {
    transparent: 'transparent',
    current: 'currentColor',
    black: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      // ... more shades
      950: '#030712',
    },
    white: '#ffffff',
    gray: { /* 10 shades */ },
    red: { /* 10 shades */ },
    blue: { /* 10 shades */ },
    // ... more colors
  },
  
  spacing: {
    '0': '0px',
    '1': '0.25rem',
    '2': '0.5rem',
    '3': '0.75rem',
    '4': '1rem',
    '5': '1.25rem',
    '6': '1.5rem',
    // ... up to '96'
  },
  
  fontSize: {
    'xs': ['0.75rem', { lineHeight: '1rem' }],
    'sm': ['0.875rem', { lineHeight: '1.25rem' }],
    'base': ['1rem', { lineHeight: '1.5rem' }],
    'lg': ['1.125rem', { lineHeight: '1.75rem' }],
    // ... more sizes
  },
};

// Resolve token path like "colors.blue.500"
function resolveTokenPath(path: string, tokens: DesignTokens): string | null {
  const parts = path.split('.');
  let value: any = tokens;
  
  for (const part of parts) {
    if (typeof value !== 'object' || value === null) {
      return null;
    }
    value = value[part];
  }
  
  return typeof value === 'string' ? value : null;
}
```

---

## Caching Strategy

### Intelligent Cache Management

```typescript
/**
 * Caching for fast rebuilds
 * - Hash-based validation
 * - Dependency tracking
 * - Invalidation on config changes
 */

interface CacheEntry {
  hash: string;               // Hash of source files
  css: string;               // Generated CSS
  timestamp: number;         // Cache time
  dependencies: string[];    // Source files used
  config: NakshoraConfig;   // Config snapshot
}

class CSSCache {
  private cache: Map<string, CacheEntry> = new Map();
  private watchers: Map<string, fs.FSWatcher> = new Map();
  
  // Generate hash from content
  hash(content: string, config: NakshoraConfig): string {
    return crypto
      .createHash('sha256')
      .update(content + JSON.stringify(config))
      .digest('hex');
  }
  
  // Get from cache if valid
  get(content: string, config: NakshoraConfig): string | null {
    const key = this.hash(content, config);
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    // Validate cache is still fresh (< 5 minutes)
    if (Date.now() - entry.timestamp > 5 * 60 * 1000) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.css;
  }
  
  // Store in cache
  set(
    content: string,
    config: NakshoraConfig,
    css: string,
    dependencies: string[]
  ): void {
    const key = this.hash(content, config);
    
    this.cache.set(key, {
      hash: key,
      css,
      timestamp: Date.now(),
      dependencies,
      config,
    });
    
    // Limit cache size
    if (this.cache.size > 100) {
      const oldest = [...this.cache.entries()].sort(
        (a, b) => a[1].timestamp - b[1].timestamp
      )[0];
      this.cache.delete(oldest[0]);
    }
  }
  
  // Watch files for changes
  watch(files: string[], callback: () => void): void {
    for (const file of files) {
      if (!this.watchers.has(file)) {
        const watcher = fs.watch(file, () => {
          this.cache.clear(); // Invalidate entire cache on change
          callback();
        });
        this.watchers.set(file, watcher);
      }
    }
  }
  
  // Clear cache
  clear(): void {
    this.cache.clear();
    for (const watcher of this.watchers.values()) {
      watcher.close();
    }
    this.watchers.clear();
  }
}
```

---

## Performance Optimization

### Optimization Techniques

```typescript
/**
 * Performance optimizations for production
 */

class PerformanceOptimizer {
  
  // 1. CSS Minification (reduce output size)
  minifyCss(css: string): string {
    return css
      .replace(/\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\//g, '') // Remove comments
      .replace(/\s+/g, ' ')                               // Collapse whitespace
      .replace(/\s*([{}:;,])\s*/g, '$1')                 // Remove spacing around punctuation
      .trim();
  }
  
  // 2. Deduplication (remove duplicate rules)
  deduplicateCss(css: string): string {
    const rules = css.split('}').filter(Boolean);
    const seen = new Set<string>();
    
    return rules
      .filter(rule => {
        if (seen.has(rule)) return false;
        seen.add(rule);
        return true;
      })
      .join('}');
  }
  
  // 3. Vendor Prefixing (auto-add browser prefixes)
  addVendorPrefixes(property: string, value: string): string {
    // Properties that need prefixes
    const prefixed = [
      'user-select', 'appearance', 'backface-visibility',
      'transform', 'transition', 'animation', 'filter'
    ];
    
    if (!prefixed.includes(property)) {
      return `${property}: ${value};`;
    }
    
    return [
      `-webkit-${property}: ${value};`,
      `-moz-${property}: ${value};`,
      `${property}: ${value};`
    ].join(' ');
  }
  
  // 4. CSS Variables (smaller output)
  useCssVariables(tokens: DesignTokens): string {
    let css = ':root {\n';
    
    // Define CSS custom properties
    for (const [key, value] of Object.entries(tokens.colors)) {
      if (typeof value === 'string') {
        css += `  --color-${key}: ${value};\n`;
      } else {
        for (const [shade, color] of Object.entries(value)) {
          css += `  --color-${key}-${shade}: ${color};\n`;
        }
      }
    }
    
    css += '}\n';
    return css;
  }
  
  // 5. Tree-shaking (only include used utilities)
  treeShake(css: string, usedClasses: Set<string>): string {
    const rules = css.split('\n').filter(rule => {
      const className = rule.match(/\.([a-z0-9\\:-]+)/)?.[1];
      if (!className) return true; // Keep non-class rules
      
      // Check if class is used
      const decoded = className.replace(/\\/g, '');
      return usedClasses.has(decoded);
    });
    
    return rules.join('\n');
  }
  
  // 6. Parallel Compilation (use Worker threads)
  async compileInParallel(
    batches: string[],
    compiler: (batch: string) => Promise<string>
  ): Promise<string> {
    const results = await Promise.all(
      batches.map(batch => compiler(batch))
    );
    return results.join('\n');
  }
}
```

---

## Implementation Examples

### Example 1: Simple Utility Class

**Input:**
```html
<div class="flex w-4 h-8">Content</div>
```

**Parser Steps:**
```
1. Extract: ["flex", "w-4", "h-8"]
2. Parse:
   - "flex" → property: "display", value: "flex", variants: []
   - "w-4" → property: "width", value: "1rem", variants: []
   - "h-8" → property: "height", value: "2rem", variants: []
3. Generate CSS:
   .flex { display: flex; }
   .w-4 { width: 1rem; }
   .h-8 { height: 2rem; }
```

### Example 2: Variant with Responsive Breakpoint

**Input:**
```html
<button class="md:hover:text-red-600 px-4 py-2">Click me</button>
```

**Parser Steps:**
```
1. Extract: ["md:hover:text-red-600", "px-4", "py-2"]
2. Parse "md:hover:text-red-600":
   - Variants: [
       { name: "md", type: "responsive", priority: 3 },
       { name: "hover", type: "pseudo-class", priority: 0 }
     ]
   - Property: "color"
   - Value: "#dc2626" (from theme.colors.red.600)
3. Generate CSS with variant stacking:
   @media (min-width: 768px) {
     .md\:hover\:text-red-600:hover {
       color: #dc2626;
     }
   }
```

### Example 3: Arbitrary Value

**Input:**
```html
<div class="w-[calc(100%-12px)] bg-[#f3cc00]">Custom sizing</div>
```

**Parser Steps:**
```
1. Extract: ["w-[calc(100%-12px)]", "bg-[#f3cc00]"]
2. Parse:
   - "w-[calc(100%-12px)]"
     → arbitrary: true
     → property: "width"
     → value: "calc(100%-12px)"
   - "bg-[#f3cc00]"
     → arbitrary: true
     → property: "background-color"
     → value: "#f3cc00"
3. Generate CSS:
   .w-\[calc\(100\%-12px\)\] { width: calc(100%-12px); }
   .bg-\[\#f3cc00\] { background-color: #f3cc00; }
```

---

## Conclusion

The Nakshora v3.0 JIT compiler represents a fundamental shift from static CSS generation to **dynamic, on-demand compilation**. By scanning source files, parsing utility classes, resolving design tokens, applying variants, and caching results, we achieve:

- ✅ **Smaller CSS Output** (only used utilities)
- ✅ **Faster Builds** (via caching)
- ✅ **Better DX** (IDE support, arbitrary values)
- ✅ **Production-Ready** (minification, vendor prefixing)
- ✅ **Framework Agnostic** (works anywhere)

---

**Ready to dive deeper? Explore the source code in `packages/@nakshora/core/src/`!**

**v3.0 JIT Compiler | MIT License | Built by RRC Development**
