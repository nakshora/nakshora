# Getting Started

Build your first Nakshora UI in about five minutes.

> 🧭 Want the complete path (all integrations, dark mode, theming,
> deployment)? Read the [Full Setup Guide](./SETUP.md).

## 1. Install

```bash
# Vite project (recommended)
npm install -D @nakshora/vite-plugin

# or PostCSS
npm install -D @nakshora/postcss postcss

# or CLI (no bundler)
npm install -D @nakshora/cli
```

## 2. Configure (Vite example)

```js
// vite.config.js
import { defineConfig } from 'vite';
import { nakshora } from '@nakshora/vite-plugin';

export default defineConfig({
  plugins: [
    nakshora({
      content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,vue}'],
    }),
  ],
});
```

```js
// src/main.js
import 'nakshora';
```

## 3. Write markup

```html
<!-- index.html -->
<body
  class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6"
>
  <div class="glass p-10 max-w-md w-full text-center">
    <h1 class="text-4xl font-black text-white tracking-tight">Nakshora</h1>
    <p class="mt-3 text-slate-300 leading-relaxed">
      Utility-first CSS with a JIT compiler, neon/glass/brutalist components and first-class dark
      mode.
    </p>
    <button class="neon-btn mt-6">Get started</button>
  </div>
</body>
```

## 4. Run & build

```bash
npm run dev     # dev server with HMR
npm run build   # production bundle
```

## 5. Your first component

### Button

```html
<button
  class="px-5 py-2.5 bg-blue-500 text-white font-semibold rounded-lg
               hover:bg-blue-600 active:scale-95 transition shadow-md"
>
  Click me
</button>
```

### Card

```html
<div
  class="bg-white rounded-xl shadow-md border border-slate-200 p-6 max-w-sm
            hover-lift dark:bg-slate-800 dark:border-slate-700"
>
  <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">Card title</h2>
  <p class="mt-2 text-slate-600 dark:text-slate-300">
    Cards are just utilities — compose them however you like.
  </p>
  <a href="#" class="inline-block mt-4 text-blue-500 hover:text-blue-600 font-medium">
    Learn more →
  </a>
</div>
```

### Responsive grid

```html
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  <!-- cards… -->
</div>
```

## Next steps

- [Full Setup Guide](./SETUP.md) — every integration, step by step
- [Utilities Reference](./UTILITIES.md) — all 3,000+ classes
- [Variants](./VARIANTS.md) — `hover:`, `dark:`, `group-*`, `peer-*`
- [Responsive](./RESPONSIVE.md) — breakpoints & mobile-first
- [Themes](./THEMES.md) — neon, pastel, brutalist, minimalist, nature
- [AI Training](./AI_TRAINING.md) — teach LLMs Nakshora
