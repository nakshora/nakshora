// ---------------------------------------------------------------------------
// Provider: build-tool integrations, framework guides, editor integrations.
// ---------------------------------------------------------------------------
import { article, p, h2, h3, code, list, table, callout, cards } from '../lib/model.mjs';

export function integrationArticles(V) {
  if (V.id === 'v1.0') return v1Integrations(V);
  const A = [];
  const isV2 = V.id === 'v2.0';

  if (!isV2) {
    const tools = [
      ['vite', 'Vite', 'The recommended integration: virtual module, HMR, verified against Vite 5/6/7/8.', true],
      ['postcss', 'PostCSS', 'webpack, Next.js, Laravel, Rails, Django — anything with PostCSS.', true],
      ['cli', 'CLI (no bundler)', 'Compile from the terminal into any pipeline.', true],
      ['cdn', 'CDN', 'Zero-install prototyping with the full build.', true],
      ['webpack', 'webpack', 'Via the PostCSS plugin — loader config included.', false],
      ['parcel', 'Parcel', 'Zero-config via PostCSS.', false],
      ['esbuild', 'esbuild', 'Watch mode + PostCSS glue.', false],
      ['rollup', 'Rollup', 'postcss + nakshora in the plugin chain.', false],
      ['nextjs', 'Next.js', 'App Router + Pages Router, SSR-safe.', false],
      ['nuxt', 'Nuxt', 'Vite-mode Nuxt with HMR.', false],
      ['astro', 'Astro', 'Island-friendly, zero JS shipped.', false],
      ['remix', 'Remix / React Router', 'Route-based styling with HMR.', false],
      ['sveltekit', 'SvelteKit', 'Scoped classes coexist happily.', false],
      ['laravel', 'Laravel', 'Vite + Blade, the modern Laravel stack.', false],
      ['rails', 'Ruby on Rails', 'cssbundling-rails or importmap paths.', false],
      ['wordpress', 'WordPress', 'Block themes and classic themes.', false]
    ];
    A.push(article({
      slug: 'integrations/index',
      title: `Integrations — ${V.label}`,
      section: 'integrations',
      category: 'Integrations',
      tags: ['integrations', 'reference'],
      keywords: ['integrations', 'vite', 'postcss', 'webpack', 'next.js', 'setup'],
      summary: `Every way to run ${V.label}: bundlers, metaframeworks, backend stacks and zero-install options.`,
      order: 100,
      blocks: [
        p(`${V.label} runs anywhere CSS is built. The four first-class integrations are maintained in the monorepo; everything else rides on the PostCSS plugin or the CLI.`),
        h2('First-class'),
        cards(tools.filter((t) => t[3]).map(([slug, name, desc]) => ({ slug: `integrations/${slug}`, title: name, desc }))),
        h2('Framework & platform guides'),
        cards(tools.filter((t) => !t[3]).map(([slug, name, desc]) => ({ slug: `integrations/${slug}`, title: name, desc }))),
        callout('tip', `Can't find your stack? Nakshora outputs plain CSS — any pipeline that accepts a stylesheet can consume it. Ask in the [[faq/index|FAQ]].`)
      ]
    }));
    for (const [slug, name, desc] of tools) {
      A.push(toolArticle(V, slug, name, desc));
    }
  } else {
    A.push(article({
      slug: 'integrations/index',
      title: `Using ${V.label} in your build`,
      section: 'integrations',
      category: 'Integrations',
      tags: ['integrations'],
      keywords: ['integrations', 'webpack', 'build', 'npm'],
      summary: 'Nakshora 2.0 is a generator: wire it into any build tool that can run a Node script.',
      order: 100,
      blocks: [
        p('v2 predates the plugin ecosystem — integration means calling the generator from your build script and pointing your HTML at the emitted file.'),
        cards([
          { slug: 'integrations/npm-script', title: 'npm script', desc: 'The simplest wiring.' },
          { slug: 'integrations/webpack', title: 'webpack', desc: 'Generate before the bundle.' },
          { slug: 'integrations/static-html', title: 'Static HTML', desc: 'No bundler at all.' }
        ])
      ]
    }));
    for (const [slug, name, desc] of [
      ['npm-script', 'npm script integration', 'Generate CSS from a package.json script — the canonical v2 setup.'],
      ['webpack', 'webpack integration', 'Run the generator before webpack; watch mode included.'],
      ['static-html', 'Static HTML integration', 'Plain HTML pages consuming generated CSS.']
    ]) {
      A.push(article({
        slug: `integrations/${slug}`,
        title: `${name} — ${V.label}`,
        section: 'integrations',
        category: 'Integrations',
        tags: ['integrations', slug],
        keywords: [name.toLowerCase(), 'integration', 'v2'],
        summary: desc,
        blocks: [
          p(desc),
          h2('Setup'),
          code(slug === 'npm-script' ? 'json' : slug === 'webpack' ? 'js' : 'html', v2Example(slug), slug === 'npm-script' ? 'package.json' : slug === 'webpack' ? 'build.mjs' : 'index.html'),
          h2('Workflow'),
          list([
            'Edit your theme/config',
            'Re-run generation (`npm run css`)',
            'Refresh the browser'
          ]),
          callout('note', 'v2 has no watch mode — the v3 CLI added `nakshora dev` with incremental rebuilds.')
        ]
      }));
    }
  }

  // framework guides (JS frameworks) — v3.x
  if (!isV2) {
    const frameworks = [
      ['react', 'React', 'Conditional classes, dark-mode hooks, component extraction patterns.'],
      ['vue', 'Vue', 'Scoped styles coexist; dynamic class bindings with Nakshora.'],
      ['svelte', 'Svelte', 'Class: directives plus utilities — best friends.'],
      ['angular', 'Angular', 'Standalone components with utility classes.'],
      ['solid', 'SolidJS', 'Fine-grained reactivity, zero-overhead styling.'],
      ['preact', 'Preact', 'Tiny apps with tiny CSS.'],
      ['htmx', 'HTMX', 'Server-rendered HTML, utility-first styling.'],
      ['alpine', 'Alpine.js', 'Sprinkled interactivity meets utilities.']
    ];
    for (const [slug, name, desc] of frameworks) {
      A.push(frameworkArticle(V, slug, name, desc));
    }
    // editors
    const editors = [
      ['vscode', 'VS Code', 'LSP via nakshora lsp — completions, hover CSS, color swatches, diagnostics.'],
      ['neovim', 'Neovim', 'nvim-lspconfig recipe for nakshora lsp.'],
      ['zed', 'Zed', 'Manual LSP server registration.'],
      ['helix', 'Helix', 'languages.toml LSP config.'],
      ['sublime', 'Sublime Text', 'LSP package + nakshora server.'],
      ['jetbrains', 'JetBrains IDEs', 'WebStorm / IntelliJ LSP plugin setup.']
    ];
    A.push(article({
      slug: 'editors/index',
      title: `Editor integrations — ${V.label}`,
      section: 'editors',
      category: 'Editors',
      tags: ['editors', 'lsp', 'tooling'],
      keywords: ['editor', 'ide', 'lsp', 'autocomplete', 'intellisense'],
      summary: `Autocomplete, hover documentation, diagnostics and color previews for ${V.label} in every major editor via the language server.`,
      blocks: [
        p(`${V.label} ships a **language server** (\`nakshora lsp\`) implementing completions, hover CSS previews, diagnostics for unknown classes and color swatches for palette utilities. Any LSP-capable editor can use it.`),
        code('bash', 'npm install -D @nakshora/cli   # provides nakshora lsp', 'terminal'),
        h2('Editors'),
        cards(editors.map(([slug, name, desc]) => ({ slug: `editors/${slug}`, title: name, desc }))),
        h2('What the server provides'),
        table(['LSP feature', 'In your editor'], [
          ['Completion', 'Every utility + variant prefix, context-aware'],
          ['Hover', 'The exact CSS a class compiles to'],
          ['Diagnostics', 'Unknown or misspelled classes underlined'],
          ['Color provider', 'Swatches next to `bg-blue-500` and friends'],
          ['Document symbols', 'Overview of @theme/@utility blocks']
        ])
      ]
    }));
    for (const [slug, name, desc] of editors) {
      A.push(editorArticle(V, slug, name, desc));
    }
  }
  return A;
}

function v1Integrations(V) {
  const rows = [
    ['static-html', 'Static HTML', 'The native v1 habitat: one link tag, zero tooling.'],
    ['wordpress', 'WordPress', 'Enqueue the frozen stylesheet in functions.php.'],
    ['react-cdn', 'React (CDN era)', 'The 2024 pattern: CDN stylesheet + any component model.'],
    ['performance', 'Loading v1 fast', 'Preload, caching and the brotli story for the frozen file.']
  ];
  const A = [article({
    slug: 'integrations/index',
    title: `Using ${V.label} in your stack`,
    section: 'integrations',
    category: 'Integrations',
    tags: ['integrations'],
    keywords: ['integrations', 'v1', 'cdn', 'link tag'],
    summary: 'Nakshora 1.0 integrates with everything — it is a single stylesheet. Guides for static HTML, WordPress, and legacy React setups.',
    order: 100,
    blocks: [
      p('v1 needs no plugins: any technology that can load a CSS file runs Nakshora.'),
      cards(rows.map(([slug, name, desc]) => ({ slug: `integrations/${slug}`, title: name, desc })))
    ]
  })];
  for (const [slug, name, desc] of rows) {
    A.push(article({
      slug: `integrations/${slug}`,
      title: `${name} — ${V.label}`,
      section: 'integrations',
      category: 'Integrations',
      tags: ['integrations', slug],
      keywords: [name.toLowerCase(), 'v1', 'integration'],
      summary: desc,
      blocks: [
        p(desc),
        h2('Setup'),
        code(slug === 'wordpress' ? 'php' : 'html', slug === 'wordpress'
          ? `<?php\nfunction enqueue_nakshora() {\n  wp_enqueue_style(\n    'nakshora',\n    'https://cdn.jsdelivr.net/gh/nakshora/nakshora@main/minified-version/v1.0.0.css',\n    [],\n    '1.0.0'\n  );\n}\nadd_action('wp_enqueue_scripts', 'enqueue_nakshora');`
          : slug === 'performance'
            ? `<link rel="preload" as="style"\n  href="https://cdn.jsdelivr.net/gh/nakshora/nakshora@main/minified-version/v1.0.0.css" />\n<link rel="stylesheet"\n  href="https://cdn.jsdelivr.net/gh/nakshora/nakshora@main/minified-version/v1.0.0.css" />`
            : `<link rel="stylesheet"\n  href="https://cdn.jsdelivr.net/gh/nakshora/nakshora@main/minified-version/v1.0.0.css" />`),
        h2('Notes'),
        list(v1IntegrationNotes(slug)),
        callout('note', 'The v1 file is immutable — cache it aggressively (immutable + max-age=31536000).')
      ]
    }));
  }
  return A;
}

function v1IntegrationNotes(slug) {
  const map = {
    'static-html': ['Self-host for offline builds; the CDN file is frozen forever', 'Order matters: your overrides go in a later <link>'],
    wordpress: ['Version the handle ("1.0.0") so cache busting is explicit', 'Child themes can dequeue and replace with a customized copy'],
    'react-cdn': ['Class strings are just strings — any className binding works', 'This era predates JIT; output is the full design system'],
    performance: ['jsDelivr serves brotli automatically', 'Add crossorigin only if you also use SRI']
  };
  return map[slug] || [];
}

function toolArticle(V, slug, name, desc) {
  const examples = {
    vite: ['js', `import { defineConfig } from 'vite';\nimport { nakshora } from '@nakshora/vite-plugin';\n\nexport default defineConfig({\n  plugins: [\n    nakshora({ content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,vue}'] }),\n  ],\n});`, 'vite.config.js'],
    postcss: ['js', `// postcss.config.js\nmodule.exports = {\n  plugins: [\n    require('@nakshora/postcss')({\n      config: { content: ['./src/**/*.{html,js,ts,jsx,tsx}'] },\n    }),\n  ],\n};`, 'postcss.config.js'],
    cli: ['bash', 'npm install -D @nakshora/cli\nnakshora init\nnakshora build src/app.css -o dist/app.min.css --minify', 'terminal'],
    cdn: ['html', `<link rel="stylesheet"\n  href="https://cdn.jsdelivr.net/gh/nakshora/nakshora@main/dist/css/nakshora.min.css" />`, 'index.html'],
    webpack: ['js', `// postcss.config.js consumed by postcss-loader\nmodule.exports = {\n  plugins: [require('@nakshora/postcss')()],\n};\n// webpack.config.js\nmodule.exports = {\n  module: {\n    rules: [\n      { test: /\\.css$/, use: ['style-loader', 'css-loader', 'postcss-loader'] },\n    ],\n  },\n};`, 'webpack.config.js'],
    parcel: ['json', '{\n  "scripts": { "start": "parcel index.html" }\n}\n// .postcssrc.json\n{ "plugins": { "@nakshora/postcss": {} } }', '.postcssrc.json'],
    esbuild: ['js', `import { build } from 'esbuild';\nimport postcss from 'postcss';\nimport nakshora from '@nakshora/postcss';\n\n// esbuild has no CSS plugin API — run PostCSS first:\nconst css = await postcss([nakshora()]).process(src, { from: 'app.css' });\nawait build({ stdin: { contents: css.css, loader: 'css' }, outfile: 'dist/app.css' });`, 'build.mjs'],
    rollup: ['js', `import postcss from 'rollup-plugin-postcss';\nimport nakshora from '@nakshora/postcss';\n\nexport default {\n  plugins: [postcss({ plugins: [nakshora()] })],\n};`, 'rollup.config.js'],
    nextjs: ['js', `// postcss.config.mjs (App Router + Pages Router)\nexport default {\n  plugins: {\n    '@nakshora/postcss': { content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'] },\n  },\n};`, 'postcss.config.mjs'],
    nuxt: ['js', `// nuxt.config.ts — Vite-mode\nexport default defineNuxtConfig({\n  postcss: {\n    plugins: { '@nakshora/postcss': { content: ['./components/**/*.vue', './pages/**/*.vue'] } },\n  },\n});`, 'nuxt.config.ts'],
    astro: ['js', `// astro.config.mjs\nimport { defineConfig } from 'astro/config';\n\nexport default defineConfig({\n  vite: { css: { postcss: { plugins: [require('@nakshora/postcss')()] } } },\n});`, 'astro.config.mjs'],
    remix: ['js', `// postcss.config.js — consumed by Remix's built-in CSS pipeline\nmodule.exports = { plugins: { '@nakshora/postcss': {} } };`, 'postcss.config.js'],
    sveltekit: ['js', `// postcss.config.cjs consumed by Vite inside SvelteKit\nmodule.exports = {\n  plugins: { '@nakshora/postcss': { content: ['./src/**/*.{html,svelte}'] } },\n};`, 'postcss.config.cjs'],
    laravel: ['js', `// vite.config.js in a Laravel app\nimport { defineConfig } from 'vite';\nimport laravel from 'laravel-vite-plugin';\nimport { nakshora } from '@nakshora/vite-plugin';\n\nexport default defineConfig({\n  plugins: [\n    laravel({ input: ['resources/css/app.css', 'resources/js/app.js'], refresh: true }),\n    nakshora({ content: ['./resources/views/**/*.blade.php'] }),\n  ],\n});`, 'vite.config.js'],
    rails: ['bash', '# cssbundling-rails path\nbin/rails css:install:postcss\n# then add @nakshora/postcss to postcss.config.js\nyarn add -D @nakshora/postcss', 'terminal'],
    wordpress: ['php', `// build the theme CSS with the CLI, enqueue the result\nadd_action('wp_enqueue_scripts', function () {\n  wp_enqueue_style('nakshora', get_theme_file_uri('dist/app.css'), [], filemtime(get_theme_file_path('dist/app.css')));\n});`, 'functions.php']
  };
  const [lang, example, fname] = examples[slug] || examples.cli;
  return article({
    slug: `integrations/${slug}`,
    title: `${name} + ${V.label}`,
    section: 'integrations',
    category: 'Integrations',
    tags: ['integrations', slug],
    keywords: [name.toLowerCase(), 'integration', 'setup', 'install'],
    summary: `${desc} Complete ${name} setup guide for ${V.label}: install, config, verification and troubleshooting.`,
    blocks: [
      p(`${desc} This guide covers the complete ${name} setup for ${V.label}.`),
      h2('Install'),
      code('bash', `npm install -D ${slug === 'cdn' ? '' : slug === 'cli' ? '@nakshora/cli' : slug === 'postcss' || ['webpack', 'parcel', 'nextjs', 'nuxt', 'astro', 'remix', 'sveltekit', 'rails'].includes(slug) ? '@nakshora/postcss postcss' : '@nakshora/vite-plugin'}`.trim() || 'No install needed — CDN only.', 'terminal'),
      h2('Configure'),
      code(lang, example, fname),
      h2('Verify'),
      code('bash', 'npx nakshora doctor', 'terminal'),
      p('Doctor validates your config, checks that content globs match real files, and prints the engine version.'),
      h2('Troubleshooting'),
      list(toolTrouble(slug)),
      h2('Next'),
      p(`Styling patterns: [[concepts/utility-first-methodology|utility-first methodology]] · performance: [[performance/index|performance guide]].`)
    ]
  });
}

function toolTrouble(slug) {
  const map = {
    vite: ['Virtual module `import "nakshora"` missing → plugin not registered in vite.config', 'HMR not updating CSS → ensure the plugin is inside `plugins: []`, not `css.postcss`'],
    postcss: ['`@nakshora source` does nothing → content globs are relative to the CSS file; check paths'],
    cli: ['Command not found → use `npx nakshora` or add node_modules/.bin to PATH'],
    cdn: ['Large download → expected; the CDN file is the full build. JIT-compile for production.'],
    webpack: ['postcss-loader order matters: after css-loader, before style-loader'],
    nextjs: ['App Router: postcss.config must be .mjs or .js (not .json) with the content option'],
    wordpress: ['Cache plugins: purge CSS cache after rebuilds']
  };
  return map[slug] || ['Run `nakshora doctor` first — it catches 90% of setup mistakes.'];
}

function frameworkArticle(V, slug, name, desc) {
  const samples = {
    react: [`import { useState } from 'react';\n\nexport function ThemeToggle() {\n  const [dark, setDark] = useState(false);\n  return (\n    <button\n      onClick={() => setDark(!dark)}\n      className={\n        dark\n          ? 'px-4 py-2 bg-slate-800 text-white rounded-lg'\n          : 'px-4 py-2 bg-slate-100 text-slate-900 rounded-lg'\n      }\n    >\n      Toggle theme\n    </button>\n  );\n}`, 'jsx'],
    vue: [`<template>\n  <button\n    :class="[\n      'px-4 py-2 rounded-lg transition',\n      active ? 'bg-blue-500 text-white' : 'bg-slate-100'\n    ]"\n  >\n    {{ label }}\n  </button>\n</template>`, 'vue'],
    svelte: [`<script>\n  let active = false;\n</script>\n\n<button\n  class:active\n  class="px-4 py-2 rounded-lg transition"\n  class:bg-blue-500={active}\n>Toggle</button>`, 'svelte'],
    angular: [`@Component({\n  template: \`\n    <button [class.bg-blue-500]="active"\n            class="px-4 py-2 rounded-lg">\n      Toggle\n    </button>\n  \`,\n})\nexport class ToggleComponent {\n  active = false;\n}`, 'ts'],
    solid: [`import { createSignal } from 'solid-js';\n\nexport function Toggle() {\n  const [active, setActive] = createSignal(false);\n  return (\n    <button\n      class="px-4 py-2 rounded-lg"\n      classList={{ 'bg-blue-500 text-white': active() }}\n      onClick={() => setActive(!active())}\n    />\n  );\n}`, 'tsx'],
    preact: [`import { useState } from 'preact/hooks';\n\nexport function Toggle() {\n  const [on, setOn] = useState(false);\n  return <button class={on ? 'btn-active nk' : 'btn'} onClick={() => setOn(!on)} />;\n}`, 'jsx'],
    htmx: [`<button hx-post="/subscribe" hx-swap="outerHTML"\n  class="px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">\n  Subscribe\n</button>`, 'html'],
    alpine: [`<div x-data="{ open: false }">\n  <button @click="open = !open"\n    class="px-4 py-2 rounded-lg"\n    :class="open ? 'bg-blue-500 text-white' : 'bg-slate-100'">\n    Toggle\n  </button>\n  <p x-show="open" class="mt-2 text-sm">Content</p>\n</div>`, 'html']
  };
  const [sample, lang] = samples[slug] || samples.react;
  return article({
    slug: `integrations/${slug}`,
    title: `${name} + ${V.label}`,
    section: 'integrations',
    category: 'Frameworks',
    tags: ['integrations', 'frameworks', slug],
    keywords: [name.toLowerCase(), 'framework', 'components', 'dynamic classes'],
    summary: `${desc} Patterns for dynamic classes, conditional styling and component extraction in ${name}.`,
    blocks: [
      p(desc),
      h2('Conditional classes'),
      code(lang, sample, `Component.${lang === 'vue' || lang === 'svelte' || lang === 'html' ? lang : 'tsx'}`),
      h2('Patterns that scale'),
      list(frameworkTips(slug)),
      h2('Gotchas'),
      list(frameworkGotchas(slug)),
      callout('tip', `Dynamic class fragments must be visible to the content scanner — full class names in source, or a [[configuration/safelist|safelist]].`)
    ]
  });
}

function frameworkTips(slug) {
  const map = {
    react: ['Extract repeated class strings into `<Button variant="primary">` components', 'Keep conditional logic in arrays/ternaries of FULL class names', 'Co-locate dark: variants with the component that owns them'],
    vue: ['Use :class arrays for readability', 'Scoped styles + utilities coexist: utilities for layout, scoped for one-offs', 'v-bind() CSS can consume Nakshora variables'],
    svelte: ['class: directives compose perfectly with utilities', 'Keep component APIs as variant props mapping to class sets'],
    angular: ['[class.x] bindings for toggles; static utilities in the template', 'Consider standalone components with utility templates'],
    solid: ['classList is ideal for variant maps', 'Utilities keep fine-grained updates cheap — no style recalculation surprises'],
    preact: ['Tiny apps: utilities keep the CSS budget predictable'],
    htmx: ['Server templates render full class names — scanner-friendly by default', 'Use transitions (transition + opacity) for swap polish'],
    alpine: ['x-bind:class with full names keeps JIT scanning accurate']
  };
  return map[slug] || [];
}

function frameworkGotchas(slug) {
  const map = {
    react: ['String-built classes like `bg-${color}-500` are invisible to the scanner — map from a literal object instead'],
    vue: ['Dynamic :class with computed fragments needs safelisting'],
    svelte: ['class:{expr} is fine; runtime-built strings are not scanned'],
    angular: ['Template concatenation defeats scanning'],
    solid: ['Same rule: literal names, or safelist'],
    preact: ['None specific — general JIT rules apply'],
    htmx: ['hx-swap-injected markup must live in scanned template files'],
    alpine: ['Classes inside x-data strings ARE scanned (they are in the file) — no issue']
  };
  return map[slug] || ['General JIT rules apply: the scanner must see full class names.'];
}

function editorArticle(V, slug, name, desc) {
  const setups = {
    vscode: ['json', `// .vscode/settings.json\n{\n  "nakshora.lsp.command": "npx",\n  "nakshora.lsp.args": ["nakshora", "lsp"]\n}\n// or launch manually and attach via any LSP client extension`, 'settings.json'],
    neovim: ['lua', `-- nvim-lspconfig\nlocal configs = require('lspconfig.configs')\nconfigs.nakshora = {\n  default_config = {\n    cmd = { 'npx', 'nakshora', 'lsp' },\n    filetypes = { 'html', 'css', 'javascript', 'typescriptreact' },\n    root_dir = require('lspconfig.util').root_pattern('nakshora.config.js'),\n  },\n}\nrequire('lspconfig').nakshora.setup({})`, 'lsp.lua'],
    zed: ['json', `// .zed/settings.json\n{\n  "lsp": [\n    { "name": "nakshora", "command": "npx", "args": ["nakshora", "lsp"] }\n  ]\n}`, 'settings.json'],
    helix: ['toml', `# languages.toml\n[[language]]\nname = "html"\nlanguage-servers = ["nakshora-lsp"]\n\n[language-server.nakshora-lsp]\ncommand = "npx"\nargs = ["nakshora", "lsp"]`, 'languages.toml'],
    sublime: ['json', `// LSP package settings\n"clients": {\n  "nakshora": {\n    "command": ["npx", "nakshora", "lsp"],\n    "selector": "text.html | source.css"\n  }\n}`, 'LSP.sublime-settings'],
    jetbrains: ['text', 'Settings → Languages & Frameworks → LSP Servers\n+ New server → Command: npx nakshora lsp\nFile types: HTML, CSS, JS, TS', 'IDE settings']
  };
  const [lang, setup, fname] = setups[slug];
  return article({
    slug: `editors/${slug}`,
    title: `${name} + ${V.label}`,
    section: 'editors',
    category: 'Editors',
    tags: ['editors', slug, 'lsp'],
    keywords: [name.toLowerCase(), 'lsp', 'autocomplete', 'intellisense', 'editor'],
    summary: `${desc} Step-by-step language server setup for ${name}.`,
    blocks: [
      p(desc),
      h2('Prerequisite'),
      code('bash', 'npm install -D @nakshora/cli   # exposes `nakshora lsp`', 'terminal'),
      h2('Configuration'),
      code(lang, setup, fname),
      h2('What you get'),
      list(['Completion for every utility and variant prefix', 'Hover panels showing the compiled CSS', 'Diagnostics for unknown classes', 'Color swatches next to palette utilities']),
      callout('note', `The server speaks standard LSP over stdio — if your editor isn't listed in [[editors/index|the editor hub]], register \`npx nakshora lsp\` as a generic LSP server.`)
    ]
  });
}

function v2Example(slug) {
  const map = {
    'npm-script': `{\n  "scripts": {\n    "css": "node build.mjs",\n    "watch": "node --watch build.mjs"\n  }\n}`,
    webpack: `import { CSSGenerator } from 'nakshora';\nimport { writeFileSync } from 'node:fs';\n\nconst css = new CSSGenerator({ theme: {} }).generate({ minify: true });\nwriteFileSync('src/generated/nakshora.css', css);`,
    'static-html': `<!doctype html>\n<html>\n  <head>\n    <link rel="stylesheet" href="src/generated/nakshora.css" />\n  </head>\n  <body class="p-8">\n    <h1 class="font-bold text-3xl">Generated with Nakshora 2.0</h1>\n  </body>\n</html>`
  };
  return map[slug] || '';
}
