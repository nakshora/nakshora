# 🚀 Nakshora CSS Framework v2.0 - Complete Build & Publishing Guide

**The World's Most Advanced Utility-First CSS Framework**

---

## 📋 Project Overview

**Nakshora 2.0** is a cutting-edge, modern utility-first CSS framework built with:

- **TypeScript**: Type-safe configuration and utilities
- **Rust**: High-performance CSS generator (optional advanced optimization)
- **CSS**: Pure, optimized CSS output
- **Approach**: Similar to Tailwind CSS - utility-first, not component-based

### Key Features

✨ **Utility-First Architecture** - Mix and match utility classes for custom designs
🎨 **Multiple Design Themes** - Neon, Pastel, Brutalist, Minimalist, Nature-Inspired
📱 **Ultra-Responsive** - Mobile-first, built-in breakpoints for all devices
⚡ **Performance-Optimized** - Minimal CSS output, tree-shakeable utilities
🔧 **TypeScript Support** - Full type safety in configuration
🎯 **Zero-Config Setup** - Works out of the box
🌐 **Framework Agnostic** - Works with React, Vue, Svelte, HTML, etc.

---

## 👥 Project Attribution

| Role                  | Name                   | Contact             |
| --------------------- | ---------------------- | ------------------- |
| **Owner & Developer** | Rizwan Rahim Chowdhury | rizwan@bsdc.info.bd |
| **Developer & Team**  | RRC Development        | rrc@bsdc.info.bd    |
| **Website**           |                        | rrc.bsdc.info.bd    |

---

## 🏗️ Project Structure

```
nakshora/
├── src/
│   ├── index.ts              # Main entry point
│   ├── config.ts             # Configuration system
│   ├── generator.ts          # CSS generator
│   ├── utilities/
│   │   ├── spacing.ts        # Margin & padding utilities
│   │   ├── display.ts        # Display utilities
│   │   ├── flexbox.ts        # Flexbox utilities
│   │   ├── grid.ts           # CSS Grid utilities
│   │   ├── typography.ts     # Font & text utilities
│   │   ├── colors.ts         # Color utilities
│   │   ├── effects.ts        # Shadow, blur, etc.
│   │   ├── layout.ts         # Position, z-index, etc.
│   │   ├── transforms.ts     # Transform utilities
│   │   └── responsive.ts     # Responsive modifiers
│   ├── themes/
│   │   ├── neon.ts          # Neon Cyber theme
│   │   ├── pastel.ts        # Pastel Dream theme
│   │   ├── brutalist.ts     # Brutalist theme
│   │   ├── minimalist.ts    # Ultra Minimalist theme
│   │   └── nature.ts        # Nature Inspired theme
│   ├── css/
│   │   ├── base.css         # Base/reset styles
│   │   ├── variables.css    # CSS custom properties
│   │   ├── utilities.css    # Generated utilities
│   │   └── main.css         # Combined output
│   └── types/
│       └── index.ts         # TypeScript type definitions
├── dist/
│   ├── nakshora.css         # Full version
│   ├── nakshora.min.css     # Minified version
│   └── nakshora.esm.js      # ESM bundle
├── docs/
│   ├── INSTALLATION.md      # Installation guide
│   ├── GETTING_STARTED.md   # Quick start guide
│   ├── UTILITIES.md         # Utilities reference
│   ├── THEMES.md            # Themes documentation
│   ├── API.md               # Configuration API
│   └── EXAMPLES.md          # Code examples
├── examples/
│   ├── basic.html           # Basic example
│   ├── react-app/           # React example
│   ├── vue-app/             # Vue example
│   └── advanced.html        # Advanced example
├── tests/
│   ├── generator.test.ts    # Generator tests
│   ├── utilities.test.ts    # Utilities tests
│   └── themes.test.ts       # Themes tests
├── tsconfig.json            # TypeScript configuration
├── webpack.config.js        # Build configuration
├── package.json             # NPM package definition
├── .npmignore              # NPM publish ignore rules
└── README.md               # Main README

```

---

## 🔧 Core Concepts

### 1. **Utility-First Philosophy**

Unlike traditional CSS frameworks that provide pre-built components, Nakshora provides low-level utility classes that can be combined to create any design:

```html
<!-- Instead of: <button class="btn btn-primary"> -->
<!-- Use: -->
<button class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Click Me</button>
```

### 2. **Responsive Modifiers**

Build responsive designs with breakpoint prefixes:

```html
<div class="w-full md:w-1/2 lg:w-1/3 xl:w-1/4">Responsive width</div>
```

### 3. **CSS Variables**

Customizable design tokens via CSS custom properties:

```css
:root {
  --color-primary: #3b82f6;
  --spacing-unit: 0.25rem;
  --font-family-base: 'Inter', sans-serif;
}
```

### 4. **Composable Design System**

- **Spacing Scale**: From `0` to `96` units (0px to 384px)
- **Type Scale**: 6 base sizes + responsive variants
- **Color Palette**: 50+ colors with shades
- **Breakpoints**: xs, sm, md, lg, xl, 2xl

---

## 📦 Utility Classes Reference

### Display & Layout

```
.block, .inline-block, .inline, .flex, .grid, .hidden
.absolute, .relative, .fixed, .sticky
.flex-row, .flex-col, .flex-wrap
.grid-cols-{1-12}, .grid-rows-{1-12}
.gap-{0-96} (in 4px increments)
```

### Spacing

```
.m-{0-96}   (margin)
.p-{0-96}   (padding)
.mt-{0-96}  (margin-top)
.mb-{0-96}  (margin-bottom)
.ml-{0-96}  (margin-left)
.mr-{0-96}  (margin-right)
.mx-{0-96}  (margin horizontal)
.my-{0-96}  (margin vertical)
```

### Typography

```
.text-xs, .text-sm, .text-base, .text-lg, .text-xl, .text-2xl
.font-thin, .font-light, .font-normal, .font-semibold, .font-bold
.text-left, .text-center, .text-right, .text-justify
.uppercase, .lowercase, .capitalize
.line-clamp-{1-6}
.tracking-tight, .tracking-normal, .tracking-wide
```

### Colors

```
.text-{color}-{shade}
.bg-{color}-{shade}
.border-{color}-{shade}

Colors: red, blue, green, yellow, purple, pink, orange, teal, indigo, cyan
Shades: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900
```

### Borders

```
.border, .border-2, .border-4, .border-8
.border-t, .border-b, .border-l, .border-r
.rounded, .rounded-sm, .rounded-lg, .rounded-full
.border-{color}-{shade}
```

### Effects

```
.shadow-sm, .shadow, .shadow-lg, .shadow-xl, .shadow-2xl
.shadow-{color}-{shade}
.blur-sm, .blur, .blur-lg
.opacity-{0-100}
.brightness-{50-200}
.contrast-{50-200}
.grayscale, .grayscale-0
```

### Flexbox

```
.justify-start, .justify-center, .justify-end, .justify-between
.items-start, .items-center, .items-end, .items-stretch
.gap-{0-96}
.flex-1, .flex-auto, .flex-none
.basis-{0-96}
```

### Transforms & Transitions

```
.scale-{50-150}
.rotate-{0-360}
.translate-x-{0-96}
.translate-y-{0-96}
.skew-x-{0-12}
.skew-y-{0-12}
.transition, .transition-fast, .transition-slow
.duration-{75-1000}
.ease-linear, .ease-in, .ease-out, .ease-in-out
```

### Responsive Breakpoints

```
.sm:     640px
.md:     768px
.lg:     1024px
.xl:     1280px
.2xl:    1536px

Usage: md:w-1/2 lg:text-lg
```

---

## 🎨 Built-in Themes

### 1. Neon Cyber

Modern, vibrant, high-contrast design

```css
Primary: #00d9ff (Cyan)
Secondary: #ff006e (Hot Pink)
Accent: #ffbe0b (Yellow)
```

### 2. Pastel Dream

Soft, calming, harmonious palette

```css
Primary: #a0c4ff
Secondary: #ffb7b2
Accent: #ffd3b6
```

### 3. Brutalist

Minimalist, stark, no-nonsense approach

```css
Primary: #000000
Secondary: #ffffff
Accent: #333333
```

### 4. Minimalist

Clean, modern, professional

```css
Primary: #2c3e50
Secondary: #34495e
Accent: #3498db
```

### 5. Nature Inspired

Organic, earthy, calm colors

```css
Primary: #2d5016
Secondary: #6b8e23
Accent: #8fbc8f
```

---

## 🚀 Installation Steps

### Step 1: Prerequisites

- Node.js 16.x or higher
- npm or yarn package manager
- TypeScript knowledge (optional)

### Step 2: Install Nakshora

```bash
npm install nakshora
```

### Step 3: Import in Your Project

```html
<!-- HTML -->
<link rel="stylesheet" href="node_modules/nakshora/dist/nakshora.min.css" />
```

```javascript
// JavaScript/TypeScript
import 'nakshora/dist/nakshora.css';
```

```jsx
// Reac
import 'nakshora/dist/nakshora.css';
```

### Step 4: Use Utility Classes

```html
<div
  class="flex items-center justify-center h-screen bg-gradient-to-br from-blue-500 to-purple-600"
>
  <div class="p-8 bg-white rounded-lg shadow-2xl">
    <h1 class="text-3xl font-bold text-gray-900 mb-4">Welcome to Nakshora 2.0</h1>
    <button class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
      Get Started
    </button>
  </div>
</div>
```

---

## 🔧 Configuration

### TypeScript Configuration

```typescript
// nakshora.config.ts
export const config = {
  theme: {
    colors: {
      // Custom colors
      brand: '#3b82f6',
    },
    spacing: {
      // Custom spacing scale
      custom: '10px',
    },
    breakpoints: {
      // Custom breakpoints
      mobile: '480px',
    },
  },
  variants: {
    // Enable/disable variants
    hover: true,
    focus: true,
    active: true,
  },
};
```

---

## 📚 Documentation Files

- **INSTALLATION.md** - Detailed installation guide for all platforms
- **GETTING_STARTED.md** - Quick start guide with examples
- **UTILITIES.md** - Complete utilities reference
- **THEMES.md** - Theme documentation and customization
- **API.md** - Configuration API reference
- **EXAMPLES.md** - Real-world code examples
- **CONTRIBUTING.md** - Contribution guidelines

---

## 🏗️ Build Process

### Development

```bash
npm run dev          # Watch mode with live reload
npm run build:dev   # Build unminified version
```

### Production

```bash
npm run build       # Production build
npm run build:prod  # Optimized production build
npm run minify      # Minify CSS output
```

### Testing

```bash
npm run test        # Run all tests
npm run test:watch  # Watch mode testing
npm run test:coverage # Test coverage report
```

---

## 📦 Publishing to NPM

### Step 1: Prepare Package

```bash
# Update version in package.json
npm version minor

# Build final version
npm run build:prod
```

### Step 2: NPM Authentication

```bash
npm login
# Enter your npm username and password
```

### Step 3: Publish

```bash
npm publish
```

### Step 4: Verify

```bash
npm view nakshora
# Should show your published package
```

---

## 🎯 Key Differentiators

| Feature          | Nakshora 2.0  | Bootstrap       | Tailwind CSS  |
| ---------------- | ------------- | --------------- | ------------- |
| Approach         | Utility-First | Component-based | Utility-First |
| Bundle Size      | ~15KB         | ~160KB          | ~40KB         |
| Customization    | Deep          | Limited         | Excellent     |
| Learning Curve   | Gradual       | Steep           | Medium        |
| Themes           | 5 built-in    | 4               | Configurable  |
| Type-Safe Config | Yes ✅        | No              | Yes ✅        |
| Performance      | Excellent     | Good            | Excellent     |

---

## 💡 Development Roadmap

### v2.0 Current

- ✅ Utility-first architecture
- ✅ 5 design themes
- ✅ TypeScript support
- ✅ Full responsive design
- ✅ Comprehensive utilities

### v2.1 Planned

- 🔄 Dark mode support
- 🔄 Animation builder
- 🔄 Component templates
- 🔄 Plugin system

### v2.2 Future

- 🔮 VS Code extension
- 🔮 Design system generator
- 🔮 Figma plugin
- 🔮 Rust-optimized compiler

---

## 📖 Quick Reference Guide

### Font Sizes

```
text-xs   → 12px    text-lg   → 18px
text-sm   → 14px    text-xl   → 20px
text-base → 16px    text-2xl  → 24px
```

### Common Padding/Margin Values

```
p-1  → 4px      p-4  → 16px     p-8  → 32px
p-2  → 8px      p-5  → 20px     p-12 → 48px
p-3  → 12px     p-6  → 24px     p-16 → 64px
```

### Display Classes

```
.block        → display: block
.inline       → display: inline
.inline-block → display: inline-block
.flex         → display: flex
.grid         → display: grid
.hidden       → display: none
```

### Responsive Grid

```
.grid-cols-1   → 1 column
.grid-cols-2   → 2 columns
.grid-cols-3   → 3 columns
.grid-cols-4   → 4 columns
.grid-cols-6   → 6 columns
.grid-cols-12  → 12 column grid
```

---

## 🤝 Contributing

Nakshora 2.0 is an open-source project. Contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License - Free for commercial and personal use

---

## 🆘 Support & Community

- **Documentation**: [Full docs](https://nakshora.dev)
- **GitHub Issues**: [Report bugs](https://github.com/nakshora/nakshora/issues)
- **Discussions**: [Community chat](https://github.com/nakshora/nakshora/discussions)
- **Email**: rrc@bsdc.info.bd

---

## 🎓 Learning Resources

- Official Documentation
- Code Examples & Templates
- Interactive Playground
- Video Tutorials
- Community Showcase

---

## 🚀 Next Steps

1. **Install Nakshora**: Follow the installation guide
2. **Read Getting Started**: Quick introduction to utilities
3. **Explore Examples**: Real-world usage patterns
4. **Build Something**: Start your first project
5. **Share Your Work**: Show us what you create!

---

**Made with ❤️ by Rizwan Rahim Chowdhury**
**RRC Development - rrc.bsdc.info.bd**

Version: 2.0.0
Last Updated: 2026-09-12
