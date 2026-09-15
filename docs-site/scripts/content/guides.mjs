// ---------------------------------------------------------------------------
// Provider: getting started, core concepts, configuration, CLI, API, themes,
// migration, releases, platform meta — version-aware.
// ---------------------------------------------------------------------------
import { article, p, h2, h3, code, list, table, callout, cards, cap, plural } from '../lib/model.mjs';

export function guideArticles(V) {
  const A = [];
  const isV1 = V.id === 'v1.0';
  const isV2 = V.id === 'v2.0';
  const isJit = V.jit;
  const base = `/${V.id}`;

  const add = (a) => A.push(article({ order: A.length * 10, ...a }));

  // ---------------------------------------------------------------- intro
  add({
    slug: 'getting-started/introduction',
    title: `Introduction to ${V.label}`,
    section: 'getting-started',
    category: 'Getting Started',
    tags: ['getting-started', 'overview', 'fundamentals'],
    keywords: ['nakshora', 'introduction', 'what is nakshora', 'css framework', 'overview', 'নক্ষত্র'],
    summary: `${V.label} — ${V.tagline} Learn what makes this release of the Nakshora CSS framework special and how the documentation is organized.`,
    blocks: [
      p(`**Nakshora** (নক্ষত্র — *"star"* in Bangla) is a utility-first CSS framework created by **Rizwan Rahim Chowdhury** and maintained by **RRC Development**. ${V.tagline} This documentation covers ${V.label} in complete depth: every utility, every variant, every configuration option, with working examples you can copy straight into production.`),
      p(`${V.summary}`),
      h2('What is inside this release'),
      list(V.highlights.map((h) => h)),
      h2('How the documentation is organized'),
      p(`The ${V.label} docs follow a hub-and-spoke structure. Start with the [[getting-started/quick-start|Quick start]], then move through [[getting-started/installation|Installation]] and the core concepts. The [[utilities/index|Utilities reference]] documents every single class this release can produce, the [[recipes/index|Recipes]] library gives you copy-paste components, and the [[tutorials/index|Tutorials]] walk you through complete builds.`),
      cards([
        { slug: 'getting-started/quick-start', title: 'Quick start', desc: `Your first ${V.label} UI in five minutes.` },
        { slug: 'utilities/index', title: 'Utilities reference', desc: `${plural(V.utilityCount, 'class')} documented.` },
        { slug: 'colors/index', title: 'Colors', desc: `${V.paletteCount} palettes with every shade.` },
        { slug: 'recipes/index', title: 'Recipes', desc: 'Copy-paste components and patterns.' }
      ]),
      h2('A note on versions'),
      p(`Nakshora ships major releases with long documentation tails: ${isV1 ? 'you are reading the original 1.0 design-system docs — the frozen stylesheet that started it all.' : isV2 ? 'you are reading the 2.0 docs — the TypeScript rewrite that introduced the generator and themes.' : V.id === 'v3.0' ? 'you are reading the 3.0 docs — the JIT monorepo release.' : 'you are reading the latest 3.1 docs — the recommended release for all new projects.'} Use the version switcher in the header to jump between releases; equivalent articles are cross-linked.`),
      callout('tip', `New to utility-first CSS? Read [[concepts/utility-first-methodology|Utility-first methodology]] before diving into the reference — five minutes there saves hours of guessing.`)
    ]
  });

  add({
    slug: 'getting-started/why-nakshora',
    title: `Why ${V.label}?`,
    section: 'getting-started',
    category: 'Getting Started',
    tags: ['getting-started', 'overview', 'comparison'],
    keywords: ['why nakshora', 'benefits', 'features', 'comparison', 'utility-first'],
    summary: `The case for ${V.label}: ${Object.keys(V.features).length} headline capabilities, from ${isJit ? 'JIT compilation and tiny bundles' : 'zero-config styling'} to built-in design paradigms.`,
    blocks: [
      p(`Choosing a CSS framework is choosing a multi-year companion for your team. Here is what ${V.label} brings to the table, and why teams pick it over hand-written CSS or other frameworks.`),
      h2('The headline capabilities'),
      table(['Capability', 'What it means for you'], Object.entries(V.features).map(([f]) => [f, capabilityBenefit(f)])),
      h2('Utility-first beats naming'),
      p(`With ${V.label} you stop inventing class names like \`.sidebar-wrapper-inner-left\` and start composing interfaces from a fixed, documented vocabulary. Every class is one declaration, so reading markup tells you exactly how it renders — and refactoring is deletion, not archaeology. See [[concepts/utility-first-methodology|Utility-first methodology]] for the full argument.`),
      h2('Design paradigms built in'),
      p(`Nakshora is famous for shipping *design paradigms*, not just primitives: ${isV1 ? 'glass cards, neon buttons, brutalist panels, neumorphic helpers and skeleton loaders are all first-class v1 classes.' : 'glassmorphism (\`glass\`), neon cyber (\`neon-card\`), brutalism (\`brutalist-card\`), minimalism (\`minimalist-card\`) and skeleton loading states.'} You get an opinionated, beautiful starting point *and* the utilities to break out of it. More in [[components/index|Design components]].`),
      h2('Honest numbers'),
      p(`This release: **${plural(V.utilityCount, 'utility')}**, **${V.paletteCount} color palettes**, **${V.screenCount} responsive screens**${V.variantCount ? `, **${V.variantCount} variants**` : ''}. Every number on this site is generated from the framework source — no marketing inflation.`),
      callout('note', `Nakshora is MIT licensed, owned by **Rizwan Rahim Chowdhury** and developed by **RRC Development**. Free forever, for commercial and personal use.`)
    ]
  });

  add({
    slug: 'getting-started/quick-start',
    title: `Quick start — ${V.label} in five minutes`,
    section: 'getting-started',
    category: 'Getting Started',
    tags: ['getting-started', 'quick-start', 'tutorial'],
    keywords: ['quick start', 'tutorial', 'first steps', 'hello world', 'setup'],
    summary: `Build your first interface with ${V.label} in five minutes: install, add classes, ship. The fastest path from zero to a styled UI.`,
    blocks: [
      p(`This guide takes you from an empty file to a styled, responsive card in five minutes with ${V.label}.`),
      h2('Step 1 — Get the framework'),
      ...(isV1
        ? [
            p('Nakshora 1.0 is a single static stylesheet. Add one `<link>` tag and you are done:'),
            code('html', `<!doctype html>\n<html>\n  <head>\n    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/nakshora/nakshora@main/minified-version/v1.0.0.css" />\n  </head>\n  <body>\n    <!-- your markup -->\n  </body>\n</html>`, 'index.html')
          ]
        : isV2
          ? [
              p('Nakshora 2.0 installs from npm:'),
              code('bash', 'npm install nakshora', 'terminal'),
              code('js', `import { CSSGenerator } from 'nakshora';\n\nconst generator = new CSSGenerator();\nconst css = generator.generate({ minify: true });`, 'build.mjs — generate your stylesheet')
            ]
          : [
              p(`Install the ${V.id === 'v3.0' ? 'Vite plugin' : 'Vite plugin (recommended)'} and register it:`),
              code('bash', 'npm install -D @nakshora/vite-plugin', 'terminal'),
              code('js', `import { defineConfig } from 'vite';\nimport { nakshora } from '@nakshora/vite-plugin';\n\nexport default defineConfig({\n  plugins: [\n    nakshora({\n      content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,vue}'], // JIT scanning\n    }),\n  ],\n});`, 'vite.config.js'),
              code('js', `// src/main.js — the virtual module resolves to your compiled CSS\nimport 'nakshora';`)
            ]),
      h2('Step 2 — Compose your first UI'),
      p('Every visual decision is a class. Copy this card into your project:'),
      code(
        'html',
        `<div class="${isV1 ? 'card-glass p-6 rounded-lg' : 'max-w-sm mx-auto mt-16 glass p-6 rounded-xl shadow-lg'}">\n  <h2 class="${isV1 ? 'text-neon-cyan-400 font-bold text-2xl' : 'text-lg font-bold text-slate-900 dark:text-white'}">Nakshora</h2>\n  <p class="${isV1 ? 'text-mono-300 mt-2' : 'mt-2 text-sm text-slate-500 dark:text-slate-400'}">\n    Utility-first styling, zero ceremony.\n  </p>\n  <button class="${isV1 ? 'btn-neon mt-4' : 'mt-4 px-5 py-2.5 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 active:scale-95 transition shadow-md'}">\n    Get started\n  </button>\n</div>`,
        'index.html'
      ),
      h2('Step 3 — Make it responsive'),
      p(`Prefix any utility with a screen to apply it from that breakpoint up. ${isV1 ? 'v1 ships `sm:` through `k8:` (8 screens)' : `${V.label} ships ${V.screenCount} screens (${V.screens.map((s) => `\`${s.name}:\``).join(', ')})`}:`),
      code('html', `<div class="${isV1 ? 'grid sm:grid-cols-2 lg:grid-cols-4 gap-4' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'}">\n  <!-- one column on phones, two on large phones, four on laptops+ -->\n</div>`),
      h2('Next steps'),
      cards([
        { slug: 'getting-started/installation', title: 'Installation', desc: 'Every way to add Nakshora to a project.' },
        { slug: 'concepts/utility-first-methodology', title: 'Utility-first methodology', desc: 'Think in utilities.' },
        { slug: 'utilities/index', title: 'Utilities reference', desc: 'Every class, documented.' }
      ])
    ]
  });

  // ----------------------------------------------------------- installation
  add({
    slug: 'getting-started/installation',
    title: `Installing ${V.label}`,
    section: 'getting-started',
    category: 'Getting Started',
    tags: ['getting-started', 'installation', 'setup'],
    keywords: ['install', 'installation', 'npm', 'cdn', 'setup', 'download'],
    summary: `Every way to install ${V.label}: ${isV1 ? 'CDN link or self-hosted file' : 'npm, pnpm, yarn, bun, CDN and framework-specific instructions'}. Verified commands, expected output, and troubleshooting.`,
    blocks: [
      p(`${V.label} can be added to any project in under a minute. Pick the path that matches your stack below — every command is tested against this release.`),
      ...(isV1
        ? [
            h2('CDN (recommended for v1)'),
            code('html', `<link rel="stylesheet"\n  href="https://cdn.jsdelivr.net/gh/nakshora/nakshora@main/minified-version/v1.0.0.css" />`, 'index.html'),
            p('The v1 stylesheet is **frozen**: it will never change under you, which makes it safe for production sites that must not drift.'),
            h2('Self-hosting'),
            p('Download the file once and serve it yourself for full control and offline support:'),
            code('bash', 'curl -O https://cdn.jsdelivr.net/gh/nakshora/nakshora@main/minified-version/v1.0.0.css'),
            callout('note', 'v1 has no build step and no configuration file — the whole design system is baked in. That is the point of the 1.x line.')
          ]
        : isV2
          ? [
              h2('npm'),
              code('bash', 'npm install nakshora', 'terminal'),
              h2('From source'),
              p('v2 generates CSS programmatically, so "installing" really means wiring the generator into your build:'),
              code('js', `import { CSSGenerator } from 'nakshora';\n\nconst css = new CSSGenerator({\n  theme: { /* optional overrides */ },\n}).generate({ minify: true });\n\n// write css to disk, or pipe it into your pipeline`, 'build.mjs'),
              h2('What you get'),
              list([
                '`CSSGenerator` — the typed CSS generation engine',
                'Five theme presets: `neonCyberTheme`, `pastelDreamTheme`, `brutalistTheme`, `minimalistTheme`, `natureTheme`',
                'TypeScript declarations for the whole config surface',
                'ESM bundle with source maps'
              ])
            ]
          : [
              h2('Package managers'),
              table(['Tool', 'Command'], [
                ['npm', '`npm install -D @nakshora/vite-plugin`'],
                ['pnpm', '`pnpm add -D @nakshora/vite-plugin`'],
                ['yarn', '`yarn add -D @nakshora/vite-plugin`'],
                ['bun', '`bun add -d @nakshora/vite-plugin`']
              ]),
              p('Swap `@nakshora/vite-plugin` for `@nakshora/postcss`, `@nakshora/cli` or `@nakshora/core` depending on your integration — see the guides below.'),
              h2('Choose your integration'),
              cards([
                { slug: 'integrations/vite', title: 'Vite', desc: 'Virtual module + HMR. The recommended path.' },
                { slug: 'integrations/postcss', title: 'PostCSS', desc: 'webpack, Next.js, Laravel, Rails and friends.' },
                { slug: 'integrations/cli', title: 'CLI', desc: 'No bundler? nakshora build has you covered.' },
                { slug: 'integrations/cdn', title: 'CDN', desc: 'Zero-install prototyping.' }
              ]),
              h2('Verify the install'),
              code('bash', `npx nakshora doctor\n# ✓ config found: nakshora.config.js\n# ✓ content globs match 42 files\n# ✓ core version ${V.num}`, 'terminal'),
              callout('tip', '`nakshora doctor` checks your config, content globs and versions — run it first when anything looks off. Full guide: [[cli/doctor|nakshora doctor]].')
            ])
    ]
  });

  // Package-manager + CDN install variants (v2+)
  if (!isV1) {
    for (const pm of isV2 ? ['npm', 'yarn'] : ['npm', 'pnpm', 'yarn', 'bun']) {
      const cmd = {
        npm: 'npm install -D @nakshora/vite-plugin',
        pnpm: 'pnpm add -D @nakshora/vite-plugin',
        yarn: 'yarn add -D @nakshora/vite-plugin',
        bun: 'bun add -d @nakshora/vite-plugin'
      }[pm];
      add({
        slug: `getting-started/install-${pm}`,
        title: `Install ${V.label} with ${pm}`,
        section: 'getting-started',
        category: 'Installation',
        tags: ['installation', pm, 'setup'],
        keywords: [pm, `install with ${pm}`, 'setup', 'add nakshora'],
        summary: `Step-by-step: add ${V.label} to a project using ${pm}, then verify the install and compile your first CSS.`,
        blocks: [
          p(`Using **${pm}** as your package manager? Here is the exact workflow for ${V.label}.`),
          h2(`1. Add the package with ${pm}`),
          code('bash', cmd, 'terminal'),
          ...(isV2
            ? [p('v2 publishes a single `nakshora` package containing the generator, themes and type declarations.')]
            : [
                p('The four published packages:'),
                table(['Package', 'Purpose'], [
                  ['`@nakshora/core`', 'JIT compiler & engine (zero dependencies)'],
                  ['`@nakshora/cli`', 'Command-line interface'],
                  ['`@nakshora/postcss`', 'PostCSS plugin'],
                  ['`@nakshora/vite-plugin`', 'Vite plugin with HMR']
                ])
              ]),
          h2('2. Verify'),
          code('bash', isV2 ? "node -e \"console.log(Object.keys(await import('nakshora')))\"" : 'npx nakshora --version', 'terminal'),
          h2('3. Continue with your integration'),
          p(`Package installed — next, wire it into your build: [[integrations/vite|Vite]], [[integrations/postcss|PostCSS]] or [[integrations/cli|the CLI]].`),
          callout('note', `Prefer another tool? See the [[getting-started/installation|installation hub]] for every option.`)
        ]
      });
    }
    add({
      slug: 'getting-started/install-cdn',
      title: `Use ${V.label} via CDN`,
      section: 'getting-started',
      category: 'Installation',
      tags: ['installation', 'cdn', 'prototyping'],
      keywords: ['cdn', 'jsdelivr', 'no install', 'prototyping', 'link tag'],
      summary: `Run ${V.label} without any build tooling using the jsDelivr CDN — perfect for prototypes, codepens and static pages.`,
      blocks: [
        p('The CDN path is the fastest way to try Nakshora: no npm, no config, no build.'),
        h2('Add the stylesheet'),
        code('html', isV1
          ? `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/nakshora/nakshora@main/minified-version/v1.0.0.css" />`
          : `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/nakshora/nakshora@main/dist/css/nakshora.min.css" />`, 'index.html'),
        ...(isV1 ? [] : [
          p('The CDN file is the **full build** — every base utility with responsive variants. It is minified to about 6 MB (133 KB brotli), which is ideal for experiments but too large for production.'),
          h2('Production: switch to JIT'),
          p('For production, compile only the classes you use (typically 5–20 KB) with the [[integrations/cli|CLI]] or [[integrations/vite|Vite plugin]]. The [[concepts/jit-compiler|JIT compiler guide]] explains the difference.')
        ]),
        callout('warn', isV1 ? 'The v1 file is frozen at 1.0.0 — pin it forever. But do not expect new utilities; the modern releases live in v3.' : 'Never ship the full CDN build to production — JIT builds are 300× smaller.')
      ]
    });
  }

  add({
    slug: 'getting-started/first-project',
    title: `Your first ${V.label} project, start to finish`,
    section: 'getting-started',
    category: 'Getting Started',
    tags: ['getting-started', 'tutorial', 'project'],
    keywords: ['first project', 'walkthrough', 'beginner', 'complete example'],
    summary: `A complete, beginner-friendly walkthrough: scaffold a page, lay it out, style it, make it responsive and ship it — all with ${V.label}.`,
    blocks: [
      p(`This tutorial builds a small "profile card + links" page from scratch with ${V.label}. Follow along in a single HTML file.`),
      h2('The skeleton'),
      code('html', `<body class="${isV1 ? 'bg-mono-900 text-mono-100' : 'min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100'}">\n  <main class="${isV1 ? 'max-w-md mx-auto p-6' : 'max-w-md mx-auto px-6 py-16'}">\n  </main>\n</body>`),
      p(`Two concepts already at work: the **spacing scale** ([[utilities/spacing/spacing-scale|0…96]]) powers \`p-6\`/\`py-16\`, and \`mx-auto\` + \`max-w-md\` **center the column** ([[utilities/layout/centering|centering patterns]]).`),
      h2('The card'),
      code('html', `<div class="${isV1 ? 'card-glass p-6 rounded-lg text-center' : 'glass p-8 rounded-2xl shadow-xl text-center'}">\n  <img class="${isV1 ? 'rounded-full mx-auto' : 'w-20 h-20 rounded-full mx-auto ring-4 ring-white/50'}" src="avatar.jpg" alt="Profile photo" />\n  <h1 class="${isV1 ? 'text-neon-cyan-400 font-bold text-2xl mt-4' : 'mt-4 text-xl font-bold'}">Ayesha Rahman</h1>\n  <p class="${isV1 ? 'text-mono-300' : 'text-sm text-slate-500 dark:text-slate-400'}">Frontend engineer · Dhaka</p>\n</div>`),
      h2('Responsive without media queries'),
      p(`You never write \`@media\` by hand: prefix utilities with screens instead. Stack two columns on tablets:`),
      code('html', `<div class="${isV1 ? 'grid sm:grid-cols-2 gap-4' : 'grid grid-cols-1 md:grid-cols-2 gap-6'}">…</div>`),
      p(`Read [[responsive/index|Responsive design]] for the mobile-first model.`),
      h2('Ship it'),
      p(isV1 ? 'Upload the single HTML file anywhere — Netlify, GitHub Pages, Cloudflare Pages. There is nothing to build.' : 'Run your build (`npm run build`), upload the output, done. The generated CSS is static and cache-friendly.'),
      callout('pro', `Stuck on a layout? The [[cookbook/index|Cookbook]] has 100+ one-line solutions — centering, sticky footers, full-bleed sections and friends.`)
    ]
  });

  // ------------------------------------------------------------- concepts
  const concepts = [
    ['utility-first-methodology', 'Utility-first methodology', 'Why composing small utilities beats writing custom CSS: naming, consistency, refactoring and team scale.'],
    ['design-tokens', 'Design tokens', `How ${V.label} exposes its scales — spacing, colors, radii — as a single source of truth${!isV1 ? ', including the CSS custom properties on `:root`' : ' via CSS custom properties'}.`],
    ['mobile-first', 'Mobile-first workflow', 'Base styles target small screens; screen prefixes layer up. The mental model that makes responsive design effortless.'],
    ['specificity-and-cascade', 'Specificity & the cascade', 'Why utilities never fight each other, how `!important` support works, and how to override safely.'],
    ['class-anatomy', 'Anatomy of a class', 'Reading `md:hover:bg-blue-600/50` piece by piece: screens, variants, utilities, modifiers.']
  ];
  for (const [slug, title, desc] of concepts) {
    add(conceptArticle(V, slug, title, desc));
  }
  if (isJit) {
    add(conceptArticle(V, 'jit-compiler', 'The JIT compiler', `How ${V.label} scans your content and emits only the CSS you use — the engine behind ${plural(V.utilityCount, 'utility')} in a 10 KB stylesheet.`));
    add(conceptArticle(V, 'full-vs-jit', 'Full mode vs JIT mode', 'When to use the complete stylesheet and when to compile — sizes, trade-offs and how to switch.'));
  }
  add(conceptArticle(V, 'dark-mode-strategies', 'Dark mode strategies', `${isV1 ? 'The v1 design language is dark-first; here is how to build light sections.' : `Class-based, media-based${V.id === 'v3.1' ? ' and selector-based' : ''} dark mode — choosing and wiring the right strategy.`}`));
  add(conceptArticle(V, 'css-variables', 'CSS custom properties', `Every token as a \`--var\`: how to read and reuse ${V.label} tokens in custom CSS.`));

  // --------------------------------------------------------- configuration
  if (V.config) {
    add({
      slug: 'configuration/index',
      title: `Configuring ${V.label}`,
      section: 'configuration',
      category: 'Configuration',
      tags: ['configuration', 'reference'],
      keywords: ['config', 'configuration', 'nakshora.config.js', 'options'],
      summary: `The complete ${V.label} configuration reference: every option with types, defaults and examples.`,
      blocks: [
        p(`${V.label} is configured through a single file${isV2 ? ' — a typed options object passed to `CSSGenerator`' : ' — `nakshora.config.js` at your project root'}. Every option on this page links to a deep-dive article.`),
        h2('The config file'),
        code('js', isV2 ? `import { CSSGenerator } from 'nakshora';\n\nconst generator = new CSSGenerator({\n  theme: {\n    breakpoints: { mobile: '480px' },\n    colors: { brand: '#6d28d9' },\n  },\n  variants: ['hover', 'focus'],\n});` : `/** @type {import('@nakshora/core').Config} */\nexport default {\n  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],\n  theme: {\n    extend: {\n      colors: { brand: { 500: '#6d28d9' } },\n    },\n  },\n  darkMode: 'class',\n  plugins: [],\n};`, 'nakshora.config.js'),
        h2('Every option'),
        table(['Option', 'Type', 'Deep dive'], [
          ['`content`', 'string[]', isJit ? '[[configuration/content|Content scanning]]' : '—'],
          ['`theme`', 'object', '[[configuration/theme|Theme & extend]]'],
          ['`theme.extend`', 'object', '[[configuration/extend|Extending vs overriding]]'],
          ['`darkMode`', 'string', '[[configuration/darkmode|Dark mode option]]'],
          ['`prefix`', 'string', '[[configuration/prefix|Class prefix]]'],
          ['`important`', 'boolean | string', '[[configuration/important|Important mode]]'],
          ['`corePlugins`', 'array | object', '[[configuration/core-plugins|Disabling core plugins]]'],
          ['`safelist`', 'array', '[[configuration/safelist|Safelist]]'],
          ['`plugins`', 'array', '[[configuration/plugins|Plugin API]]'],
          ['`presets`', 'array', '[[configuration/presets|Presets]]']
        ]),
        callout('tip', isV2 ? 'v2 configuration is the ancestor of the v3 file format — if you know one, you know both.' : `Configuration deep-merges with the defaults: use \`theme.extend\` to add without losing anything. See [[configuration/extend|Extending vs overriding]].`)
      ]
    });
    const cfgTopics = [
      ['theme', 'The theme object', 'Colors, spacing, screens, fonts — the complete theme anatomy with defaults listed.'],
      ['extend', 'Extending vs overriding', 'theme vs theme.extend — when you add tokens and when you replace them, with merge examples.'],
      ['darkmode', 'The darkMode option', "'media', 'class'" + (V.id === 'v3.1' ? " and 'selector'" : '') + ' — exactly what each emits.'],
      ['prefix', 'Class prefixes', 'Avoid collisions with other libraries: prefix every utility with one config line.'],
      ['important', 'Important mode', 'Global !important and selector-scoped importance — escape hatches for legacy CSS.'],
      ['core-plugins', 'Core plugins list', 'Trim the engine: disable entire utility groups you never use.'],
      ['safelist', 'Safelisting classes', 'Protect dynamically-built class names from purging — with regex safelists.'],
      ['plugins', 'Writing plugins', isV2 ? 'v2 plugin patterns: extending the generator.' : 'addUtilities, addComponents, theme(), variants — the full plugin API.'],
      ['presets', 'Presets', 'Package and share whole configurations between projects.']
    ];
    if (isJit) cfgTopics.unshift(['content', 'Content scanning', 'How the scanner finds class names, glob syntax, extractor behavior and dynamic-name pitfalls.']);
    if (V.id === 'v3.1') cfgTopics.push(['css-first', 'CSS-first configuration', '@theme, @utility and @custom-variant — Tailwind-v4-style config written in your stylesheet.']);
    for (const [slug, title, desc] of cfgTopics) {
      add(configArticle(V, slug, title, desc));
    }
  } else {
    add({
      slug: 'configuration/index',
      title: 'Configuration in Nakshora 1.0',
      section: 'configuration',
      category: 'Configuration',
      tags: ['configuration'],
      keywords: ['config', 'configuration', 'customize v1'],
      summary: 'Nakshora 1.0 has no config file by design — here is how to customize the frozen design system anyway.',
      blocks: [
        p('v1 is a **frozen design system**: there is no `nakshora.config.js` and no generator. That is a feature — the stylesheet never drifts. When you need customization, you have three sanctioned paths.'),
        h2('1. Override tokens via CSS variables'),
        p('Every palette is a custom property. Redefine it in a later stylesheet:'),
        code('css', `:root {\n  --neon-cyan-500: hsl(190, 100%, 60%); /* your brand cyan */\n}`),
        h2('2. Layer your own CSS after v1'),
        p('v1 uses single-class selectors, so a later stylesheet wins ties naturally.'),
        h2('3. Upgrade to the compiler'),
        p('If you need generated utilities, that is what [[../v3.1/getting-started/introduction|Nakshora 3.1]] is for — and the [[releases/migration-v1-to-v3|v1 → v3 migration guide]] ports the whole v1 look into a real config.'),
        callout('note', 'Configuration as a first-class system arrived in v2.0.')
      ]
    });
  }

  // ------------------------------------------------------------------- CLI
  if (V.id === 'v3.0' || V.id === 'v3.1') {
    const cliCommands = [
      ['init', 'nakshora init', 'Create a starter nakshora.config.js (and optionally an entry CSS) in the current directory.'],
      ['build', 'nakshora build', 'Compile CSS from your content: full or JIT, minified, with source maps and stats.'],
      ['dev', 'nakshora dev', 'Watch mode — rebuild on every change' + (V.id === 'v3.1' ? ', plus `--serve` for a dependency-free dev server with CSS hot-swap' : '') + '.'],
      ['doctor', 'nakshora doctor', 'Diagnose your setup: config validity, content globs, versions, common mistakes.']
    ];
    if (V.id === 'v3.1') {
      cliCommands.push(
        ['migrate', 'nakshora migrate', 'Port a Tailwind CSS project to Nakshora automatically: config, at-rules and dependencies.'],
        ['lsp', 'nakshora lsp', 'Run the language server: completions, hover docs, diagnostics and color previews for any LSP editor.'],
        ['inspect', 'nakshora inspect', 'Explain a class: show the exact CSS a utility (including variants and arbitrary values) produces.'],
        ['export-ai', 'nakshora export:ai', 'Export the machine-readable utility corpus (ai/corpus.json) for LLM training and RAG.']
      );
    }
    add({
      slug: 'cli/index',
      title: `The ${V.label} CLI`,
      section: 'cli',
      category: 'CLI',
      tags: ['cli', 'reference'],
      keywords: ['cli', 'command line', 'nakshora command', 'terminal'],
      summary: `The complete command reference for the @nakshora/cli package in ${V.label}: ${cliCommands.length} commands, every flag.`,
      blocks: [
        p(`\`@nakshora/cli\` is the command-line front end to the ${V.label} engine. It is the fastest way to compile, inspect and debug.`),
        code('bash', 'npm install -D @nakshora/cli\nnpx nakshora --help', 'terminal'),
        h2('Commands'),
        table(['Command', 'What it does'], cliCommands.map(([slug, cmd, desc]) => [`[[cli/${slug}|\`${cmd}\`]]`, desc])),
        callout('tip', 'Every command supports `--help` for flags. The CLI is also how you run the [[cli/lsp|language server]].')
      ]
    });
    for (const [slug, cmd, desc] of cliCommands) {
      add(cliArticle(V, slug, cmd, desc));
    }
  }

  // ------------------------------------------------------------------- API
  if (!isV1) {
    add({
      slug: 'api/index',
      title: `JavaScript API — ${V.label}`,
      section: 'api',
      category: 'JavaScript API',
      tags: ['api', 'reference', 'javascript'],
      keywords: ['api', 'javascript', 'programmatic', 'CSSGenerator', 'node'],
      summary: `The programmatic surface of ${V.label}: generate CSS, resolve config and drive the engine from Node or the browser.`,
      blocks: [
        p(`Everything the CLI does, you can do from JavaScript. The core is dependency-free and runs in Node **and the browser**${V.id === 'v3.1' ? ' (enforced by a test that fails on any Node API reference in the dist)' : ''}.`),
        h2(isV2 ? 'CSSGenerator (v2)' : 'CSSGenerator'),
        code('js', isV2 ? `import { CSSGenerator } from 'nakshora';\n\nconst gen = new CSSGenerator({\n  theme: { colors: { brand: '#6d28d9' } },\n});\n\nconst css = gen.generate({ minify: true });` : `import { CSSGenerator } from '@nakshora/core';\n\nconst gen = new CSSGenerator({\n  content: ['./src/**/*.html'],\n  theme: { extend: { colors: { brand: { 500: '#6d28d9' } } } },\n});\n\nconst css = gen.generate();      // JIT — only used classes\nconst full = gen.generate({ mode: 'full' }); // everything`, 'example.mjs'),
        h2('Key methods'),
        table(['Method', 'Returns'], [
          ['`generate(options)`', 'Compiled CSS string (JIT when `content` is set)'],
          ...(isV2 ? [] : [
            ['`getStats()`', 'Catalog statistics: utilities, categories, palettes'],
            ['`getUtilities()`', 'The utility registry (class → CSS)'],
            ['`generateFromContent(html)`', 'Compile ad-hoc markup without touching disk']
          ]),
          ['`getVariables()`', 'The :root CSS custom properties'],
          ['`getKeyframes()`', 'All animation keyframes']
        ]),
        h2('Where to go next'),
        cards([
          { slug: 'api/theme-resolution', title: 'Theme resolution', desc: 'How defaults, config and extend merge.' },
          { slug: 'configuration/plugins', title: 'Plugin API', desc: 'Extend the engine itself.' }
        ])
      ]
    });
    add({
      slug: 'api/theme-resolution',
      title: 'Theme resolution order',
      section: 'api',
      category: 'JavaScript API',
      tags: ['api', 'theme', 'configuration'],
      keywords: ['theme resolution', 'defaults', 'merge', 'deep merge'],
      summary: 'Exactly how defaults, presets, theme and theme.extend merge into the resolved theme that drives codegen.',
      blocks: [
        p(`Understanding merge order removes 90% of "why is my token missing" questions. The resolved theme is computed as:`),
        code('text', 'built-in defaults  ←  presets[]  ←  theme  ←  theme.extend'),
        list([
          '**Defaults** — the full built-in token set (22 palettes, spacing scale, screens…).',
          '**Presets** — applied left to right; later presets win on conflict.',
          '**theme** — replaces whole keys you name.',
          '**theme.extend** — deep-merges into the result of the above.'
        ]),
        h2('Worked example'),
        code('js', `{\n  theme: {\n    colors: { brand: { 500: '#6d28d9' } }, // only 'brand' + defaults survive\n  },\n  // vs.\n  theme: {\n    extend: { colors: { brand: { 500: '#6d28d9' } } }, // adds 'brand', keeps all defaults\n  }`),
        callout('warn', `A common trap: defining \`theme.colors\` (without \`extend\`) **replaces the entire palette**. See [[configuration/extend|Extending vs overriding]].`)
      ]
    });
  }

  // ----------------------------------------------------------- themes
  if (!isV1) {
    const themes = [
      ['neon-cyber', 'Neon Cyber', 'Vibrant, high-contrast, dark-first. Glows, saturated hues, cyber aesthetics.', 'neonTheme'],
      ['pastel-dream', 'Pastel Dream', 'Soft, calming, light-friendly. Low-saturation palettes for gentle UIs.', 'pastelTheme'],
      ['brutalist', 'Brutalist', 'Stark, minimal, unapologetic. Hard borders, flat colors, loud type.', 'brutalistTheme'],
      ['minimalist', 'Ultra Minimalist', 'Clean, professional, quiet. Near-mono palettes with surgical accents.', 'minimalistTheme'],
      ['nature', 'Nature Inspired', 'Organic, earthy, warm. Greens, clays and daylight neutrals.', 'natureTheme']
    ];
    add({
      slug: 'themes/index',
      title: `Themes & presets — ${V.label}`,
      section: 'themes',
      category: 'Themes',
      tags: ['themes', 'presets', 'design'],
      keywords: ['themes', 'presets', 'neon', 'pastel', 'brutalist', 'minimalist', 'nature'],
      summary: `The five built-in ${V.label} theme presets — Neon Cyber, Pastel Dream, Brutalist, Ultra Minimalist, Nature — and how to build your own.`,
      blocks: [
        p(`${V.label} ships **five complete design themes** as ready-to-import presets. Each is a full token set: palettes, typography, radii, shadows.`),
        h2('The five presets'),
        cards(themes.map(([slug, name, desc]) => ({ slug: `themes/${slug}`, title: name, desc }))),
        h2('Using a preset'),
        code('js', isV2 ? `import { CSSGenerator } from 'nakshora';\nimport { neonCyberTheme } from 'nakshora/themes';\n\nconst css = new CSSGenerator({ theme: neonCyberTheme }).generate();` : `import { neonTheme } from '@nakshora/core';\n\nexport default {\n  content: ['./src/**/*.{html,js}'],\n  theme: { colors: neonTheme.colors },\n};`, 'nakshora.config.js'),
        h2('Build your own'),
        p('A preset is just a config. Compose one from tokens: see [[themes/custom-theme|Creating a custom theme]].')
      ]
    });
    for (const [slug, name, desc, exportName] of themes) {
      add({
        slug: `themes/${slug}`,
        title: `${name} theme`,
        section: 'themes',
        category: 'Themes',
        tags: ['themes', slug, 'design'],
        keywords: [name.toLowerCase(), 'theme', 'preset', exportName],
        summary: `${name} — one of the five built-in ${V.label} themes. ${desc} Palette samples, usage and pairing advice.`,
        blocks: [
          p(`**${name}** is one of the five design themes bundled with ${V.label}. ${desc}`),
          h2('When to choose it'),
          p(themeAdvice(slug)),
          h2('Install'),
          code('js', isV2 ? `import { ${exportName} } from 'nakshora/themes';` : `import { ${exportName.replace('Theme', '')}Theme } from '@nakshora/core';`),
          h2('Sample markup'),
          code('html', themeSample(slug)),
          h2('Pair it with'),
          p(`Combine ${name} with the matching component family: [[components/index|design components]] — and read [[concepts/dark-mode-strategies|dark mode strategies]] if you invert the scheme.`),
          callout('tip', 'Mixing presets in one project is fine — import one for tokens and cherry-pick palettes from another.')
        ]
      });
    }
    add({
      slug: 'themes/custom-theme',
      title: 'Creating a custom theme',
      section: 'themes',
      category: 'Themes',
      tags: ['themes', 'customization', 'design-tokens'],
      keywords: ['custom theme', 'design tokens', 'brand', 'white label'],
      summary: `Design a bespoke ${V.label} theme from scratch: palettes, type scale, radii and shadows — then ship it as a reusable preset.`,
      blocks: [
        p('A custom theme is a config object. Start from the questions every design system must answer.'),
        h2('1. Palette'),
        p('Pick a base hue and generate an 11-step ramp (or reuse one of the 22 built-ins). Brand colors slot in as extra palettes:'),
        code('js', `theme: {\n  extend: {\n    colors: {\n      brand: {\n        50: '#f5f3ff', 500: '#6d28d9', 900: '#312e81',\n      },\n    },\n  },\n}`),
        h2('2. Typography, radii, shadows'),
        p('Extend `fontFamily`, `borderRadius`, `boxShadow` the same way — every key deep-merges ([[configuration/extend|extend vs override]]).'),
        h2('3. Ship it as a preset'),
        code('js', `// my-company-theme.js\nexport const myCompanyTheme = {\n  theme: { /* …all tokens… */ },\n};\n\n// consumer\nimport myCompanyTheme from './my-company-theme.js';\nexport default { presets: [myCompanyTheme] };`),
        callout('pro', 'Document your tokens as you add them — future-you will thank present-you. The [[concepts/design-tokens|design tokens guide]] shows the format.')
      ]
    });
  } else {
    add({
      slug: 'themes/index',
      title: 'The v1 design language',
      section: 'themes',
      category: 'Themes',
      tags: ['themes', 'design'],
      keywords: ['themes', 'design language', 'neon', 'pastel', 'v1 look'],
      summary: 'Nakshora 1.0 predates the preset system: its design language is baked in — neon, pastel, brutal, nature and mono palettes with component styling.',
      blocks: [
        p('v1 has no theme API — the design system **is** the theme. Its visual language is organized into palette families you apply through classes and CSS variables.'),
        h2('The palette families'),
        table(['Family', 'Palettes', 'Mood'], [
          ['Neon', '`neon-purple` `neon-pink` `neon-cyan` `neon-lime` `neon-orange`', 'High-energy, dark-first, glowing'],
          ['Pastel', '`pastel-rose` `pastel-lavender` `pastel-mint` `pastel-peach` `pastel-sky`', 'Soft, light, gentle'],
          ['Brutal', '`brutal-red` `brutal-yellow` `brutal-blue`', 'Loud, flat, hard-edged'],
          ['Nature', '`forest` `earth` `ocean` `sunset`', 'Organic and warm'],
          ['Neutral', '`mono` `minimal-ice`', 'Quiet structure']
        ]),
        h2('Recreating the v1 look on the modern engine'),
        p('The v3 compiler recreates the entire v1 design system as a config — palettes become `theme.extend.colors`, components become `addComponents`. Follow the [[releases/migration-v1-to-v3|migration guide]].')
      ]
    });
  }

  // -------------------------------------------------------------- migration
  // Migration guides ship in EVERY release: readers of an old version are
  // precisely the people who need the forward path.
  add(migrationArticle('migration-v1-to-v3', 'Migrating from Nakshora v1 to v3', V.id === 'v3.1' || V.id === 'v3.0' ? 'From the frozen stylesheet to the JIT compiler: renamed components, palette mapping and the config that recreates the v1 look.' : 'You are reading the v1 docs — and the future is compiled. This guide ports the whole v1 look into a modern config.', V));
  add(migrationArticle('migration-v2-to-v3', 'Migrating from Nakshora v2 to v3', V.id === 'v2.0' ? 'Your generator API survives; broken theme imports, spacing bugs and empty media queries are fixed. Here is the delta.' : 'CSSGenerator survives; broken theme imports, spacing bugs and empty media queries are fixed. Here is the delta.', V));
  add(migrationArticle('migration-tailwind', 'Migrating from Tailwind CSS to Nakshora', 'Tailwind 3.4 grammar is a subset of Nakshora. `nakshora migrate` ports config, at-rules and dependencies automatically.', V));
  if (V.id === 'v3.1' || V.id === 'v3.0') {
    add(migrationArticle('migration-v30-to-v31', 'Migrating from Nakshora 3.0 to 3.1', 'A safe minor upgrade: new breakpoints, CSS-first config, LSP — and the config fields worth adopting.', V));
  }

  // ---------------------------------------------------- performance / ops
  if (isJit) {
    add({
      slug: 'performance/index',
      title: `Performance — ${V.label}`,
      section: 'performance',
      category: 'Performance',
      tags: ['performance', 'jit', 'optimization'],
      keywords: ['performance', 'bundle size', 'fast', 'benchmark', 'optimization'],
      summary: `How ${V.label} stays fast: JIT output sizes, incremental rebuilds, content caching and the CI benchmark gate.`,
      blocks: [
        p(`Nakshora is engineered for speed on two axes: **build time** and **shipped CSS**. ${V.label} numbers, measured in CI:`),
        h2('Shipped CSS'),
        table(['Mode', 'Size'], [
          ['JIT output (typical site)', '**5–20 KB** minified'],
          ...(V.id === 'v3.1' ? [['Full build', '5,983 KB min / **133 KB brotli**']] : [['Full build', '~3 MB minified']]),
          ['v1 frozen stylesheet (history)', '~1 MB']
        ]),
        h2('Build time'),
        list([
          '**18 ms** — cold JIT build of a 200-line page',
          '**1.3 ms** — incremental rebuild with the content cache',
          'Per-resolved-theme catalog memoisation',
          'Incremental content cache keyed on mtime + hash',
          'Deterministic scanning (stable output, diffable CSS)'
        ]),
        h2('The benchmark gate'),
        p(V.id === 'v3.1' ? '`scripts/benchmark.mjs` runs in CI against `perf/baseline.json`: a regression of more than 10% and 2ms fails the build. Performance is a contract, not a hope.' : 'Build performance is tracked in CI; regressions are caught before release.'),
        h2('Make your own build faster'),
        list([
          'Tighten `content` globs — never scan `node_modules`',
          'Use [[configuration/safelist|safelists]] sparingly; each entry is CSS you ship',
          'Prefer one config per app; presets are cached per resolved theme'
        ])
      ]
    });
  }

  // ------------------------------------------------------------------ AI
  if (V.id === 'v3.0' || V.id === 'v3.1') {
    add({
      slug: 'ai/index',
      title: 'Nakshora for AI & LLMs',
      section: 'ai',
      category: 'AI & LLMs',
      tags: ['ai', 'llm', 'machine-learning'],
      keywords: ['ai', 'llm', 'llms.txt', 'corpus', 'sft', 'fine-tuning', 'rag'],
      summary: 'Nakshora is AI-ready: llms.txt, a complete LLM documentation dump, a structured utility corpus and an SFT dataset — teach any model the framework.',
      blocks: [
        p(`Nakshora was the first utility framework built **with LLMs as a first-class audience**. ${V.label} ships four machine-readable artifacts:`),
        table(['Artifact', 'What it is', 'Use it for'], [
          ['`llms.txt`', 'Concise, spec-compliant framework summary', 'Agent context, search grounding'],
          ['`llms-full.md`', 'Complete documentation in one Markdown file', 'Long-context RAG, offline assistants'],
          ['`ai/corpus.json`', `Structured corpus of every utility (${plural(V.utilityCount, 'entry', 'entries')})`, 'Embeddings, tool-use catalogs'],
          ['`ai/sft-train.jsonl`', 'Instruction-tuning pairs', 'Fine-tuning code models']
        ]),
        h2('Give an agent the framework in one line'),
        code('text', 'Add to your agent instructions:\n"Read https://raw.githubusercontent.com/nakshora/nakshora/main/llms.txt before generating Nakshora markup."'),
        h2('Export the corpus yourself'),
        code('bash', 'npx nakshora export:ai --out corpus.json', 'terminal'),
        p('The corpus shape: `{ class, css, description, category, example, responsiveExamples[] }` for every utility — perfect for embeddings or function-calling catalogs.'),
        callout('note', 'This very documentation platform publishes its own `llms.txt` and per-version `llms-full.md` — see the site footer.')
      ]
    });
  }

  // ------------------------------------------------------------ playground
  if (V.id === 'v3.1') {
    add({
      slug: 'getting-started/playground',
      title: 'The Nakshora Playground',
      section: 'getting-started',
      category: 'Getting Started',
      tags: ['playground', 'tools', 'browser'],
      keywords: ['playground', 'browser', 'try online', 'repl'],
      summary: 'Compile Nakshora classes in your browser at nakshora.bsdc.info.bd/playground — presets, inspector and shareable URLs.',
      blocks: [
        p(`The [playground](${SITE_PLAYGROUND}) runs the **full ${V.label} engine in your browser** — the core has zero Node dependencies, so the compiler is the page.`),
        h2('What you can do'),
        list([
          'Type classes, see the compiled CSS instantly',
          'Load theme presets (neon, pastel, brutalist…) and compare output',
          'Inspect how variants and arbitrary values compile',
          'Share a URL with your exact setup for bug reports'
        ]),
        h2('Great for'),
        list(['Learning — try before you install', 'Bug reports — reproduce in one click', 'Design reviews — compare palettes live']),
        callout('tip', 'The playground is also the fastest way to learn arbitrary values: type `w-[37px]` and watch the CSS appear.')
      ]
    });
  }

  // -------------------------------------------------------------- releases
  add({
    slug: 'releases/whats-new',
    title: `What's new in ${V.label}`,
    section: 'releases',
    category: 'Releases',
    tags: ['releases', 'changelog', 'news'],
    keywords: ['whats new', 'changelog', 'release notes', V.num],
    summary: `The complete rundown of ${V.label} (${V.num}, released ${V.date}): every feature, fix and improvement.`,
    blocks: [
      p(`**${V.label}** shipped on **${V.date}**. ${V.tagline}`),
      h2('Highlights'),
      list(V.highlights),
      h2('Everything in this release'),
      table(['Area', 'Delivered'], Object.entries(V.features).map(([f]) => [featureArea(f), f])),
      h2('Version timeline'),
      table(['Release', 'Date', 'Era'], [
        ['Nakshora 1.0', '2024-11-20', 'The frozen design system'],
        ['Nakshora 2.0', '2026-09-12', 'The TypeScript generator'],
        ['Nakshora 3.0', '2026-09-13', 'The JIT monorepo'],
        ['Nakshora 3.1', '2026-09-14', 'Tailwind parity & LSP (current)']
      ]),
      callout('note', `Full history lives in the repository CHANGELOGs — every change is attributed and linked to its pull request.`)
    ]
  });

  // ------------------------------------------------------------ meta pages
  add({
    slug: 'releases/license-and-attribution',
    title: 'License & attribution',
    section: 'releases',
    category: 'Releases',
    tags: ['meta', 'license'],
    keywords: ['license', 'mit', 'attribution', 'commercial use'],
    summary: 'Nakshora is MIT licensed — free for personal and commercial use. Authorship: Rizwan Rahim Chowdhury, RRC Development.',
    blocks: [
      p('Nakshora is released under the **MIT License** — one of the most permissive licenses in open source.'),
      h2('What you can do'),
      list(['Use it in commercial products', 'Modify it and ship the modifications', 'Bundle it into paid themes, templates and SaaS', 'Use it without attribution in your product UI']),
      h2('Authorship'),
      table(['Role', 'Name', 'Contact'], [
        ['Owner & author', 'Rizwan Rahim Chowdhury', 'rizwan@bsdc.info.bd'],
        ['Development', 'RRC Development', 'rrc@bsdc.info.bd'],
        ['Company site', 'rrc.bsdc.info.bd', 'https://rrc.bsdc.info.bd']
      ]),
      callout('note', 'Attribution is appreciated but never required. If Nakshora powers something you are proud of, tell the team — it matters.')
    ]
  });

  return A;
}

const SITE_PLAYGROUND = 'https://nakshora.bsdc.info.bd/playground/';

function capabilityBenefit(f) {
  if (f.includes('JIT')) return 'Kilobyte stylesheets from a huge catalog — fast pages, fast paints.';
  if (f.includes('breakpoint')) return 'One grammar for every device from watches to video walls.';
  if (f.includes('variant')) return 'Hover, focus, dark, container — compose states without custom CSS.';
  if (f.includes('CSS-first')) return 'Extend the theme without touching JavaScript.';
  if (f.includes('language server')) return 'Autocomplete and inline docs in your editor.';
  if (f.includes('dev server')) return 'Instant visual feedback with zero extra dependencies.';
  if (f.includes('Tailwind')) return 'Port existing knowledge and projects with almost no changes.';
  if (f.includes('monorepo')) return 'Install exactly the pieces you need.';
  if (f.includes('themes') || f.includes('Themes')) return 'Adopt a complete visual language in one import.';
  if (f.includes('npm')) return 'Standard tooling, provenance-signed releases.';
  return 'Less friction, more product.';
}

function featureArea(f) {
  if (/jit|compile|benchmark/i.test(f)) return 'Engine';
  if (/breakpoint|container|screen/i.test(f)) return 'Responsive';
  if (/variant|has-|aria|dark/i.test(f)) return 'Variants';
  if (/lsp|dev server|cli/i.test(f)) return 'Tooling';
  if (/css-first|@theme|config/i.test(f)) return 'Configuration';
  if (/plugin|tailwind/i.test(f)) return 'Ecosystem';
  return 'Platform';
}

function conceptArticle(V, slug, title, desc) {
  const isV1 = V.id === 'v1.0';
  return article({
    slug: `concepts/${slug}`,
    title: `${title} — ${V.label}`,
    section: 'concepts',
    category: 'Core Concepts',
    tags: ['concepts', slug],
    keywords: [title.toLowerCase(), 'concept', 'fundamentals'],
    summary: desc + ` Concept deep-dive for ${V.label}.`,
    blocks: [
      p(desc),
      h2('The idea'),
      p(conceptBody(slug).idea),
      h2('In practice'),
      code('html', conceptBody(slug).example(V), 'example'),
      h2('Common mistakes'),
      list(conceptBody(slug).mistakes),
      h2('Keep learning'),
      p(`Next: [[concepts/design-tokens|Design tokens]] and [[utilities/index|the utilities reference]] put this concept to work. For the big picture, see [[getting-started/introduction|the introduction]].`)
    ]
  });
}

function conceptBody(slug) {
  const bodies = {
    'utility-first-methodology': {
      idea: 'Instead of naming layout chunks after features ("product-card"), you describe intent with utilities ("p-4 flex gap-2"). Names stop being a design argument, CSS stops growing forever, and every teammate reads the same vocabulary. Utility-first scales with team size because the stylesheet is a fixed, documented language instead of an ever-growing pile of one-off selectors.',
      example: () => `<div class="flex items-center gap-4 p-4 rounded-xl shadow-md">\n  <img class="h-12 w-12 rounded-full" src="a.jpg" alt="" />\n  <div>\n    <h3 class="font-semibold">Nakshora</h3>\n    <p class="text-sm text-slate-500">Utility-first, not class-soup.</p>\n  </div>\n</div>`,
      mistakes: ['Reaching for custom CSS before checking the reference — a utility almost always exists', 'Duplicating long class strings instead of extracting a component in your framework of choice', 'Mixing paradigms in one element (half utilities, half custom selectors)']
    },
    'design-tokens': {
      idea: 'A token is a named decision: "spacing step 4 = 1rem", "blue 500 = #3b82f6". When every utility reads from the token scale, consistency is automatic — two developers cannot invent two different paddings. Nakshora exposes the whole scale as CSS custom properties, so your custom CSS speaks the same language.',
      example: (V) => V.id === 'v1.0' ? `.my-banner {\n  background: var(--neon-cyan-500);\n  padding: var(--space-6);\n}` : `.my-banner {\n  background: var(--color-blue-500);\n  padding: var(--spacing-6);\n}`,
      mistakes: ['Hard-coding hex values that already exist in a palette', 'Creating near-duplicate tokens ("#3b82f6" vs "blue-500")', 'Overriding tokens globally when a local class would do']
    },
    'mobile-first': {
      idea: 'Base styles serve the smallest screen; each screen prefix adds overrides from that width up. You never "undo desktop styles on mobile" — you only ever add. The result: less CSS, fewer bugs, and layouts that degrade gracefully downward.',
      example: (V) => `<div class="grid grid-cols-1 ${V.id === 'v1.0' ? 'sm' : 'md'}:grid-cols-2 ${V.id === 'v1.0' ? 'lg' : 'xl'}:grid-cols-3 gap-4">\n  <!-- 1 column by default, 2 from ${V.id === 'v1.0' ? '640px' : '768px'}, 3 from ${V.id === 'v1.0' ? '1024px' : '1280px'} -->\n</div>`,
      mistakes: ['Designing desktop first and fighting to shrink it', 'Using max-width queries when a min-width prefix reads better', 'Forgetting that unprefixed classes apply at ALL widths']
    },
    'specificity-and-cascade': {
      idea: 'Utilities are single-class selectors, so they all tie — the cascade decides by source order, which Nakshora controls for you. States (hover:, focus:) and screens compile into the right order automatically. When you truly need to win against legacy CSS, there is an important mode.',
      example: () => `<button class="bg-blue-500 hover:bg-blue-600">…</button>\n<!-- hover always wins over base: it is compiled later -->`,
      mistakes: ['Stacking two conflicting base utilities on one element (text-red-500 + text-blue-500)', 'Adding !important by hand instead of using the important option', 'Overriding utilities with IDs — the specificity hole becomes unfillable']
    },
    'class-anatomy': {
      idea: 'A Nakshora class is a tiny language: [screens:] [variants:] utility [/modifier]. Screens set the width condition, variants set the state condition, the utility does the work, and modifiers tweak it (opacity, arbitrary values). Once you can parse one class, you can parse all 11,000+.',
      example: (V) => `<button class="${V.id === 'v1.0' ? 'lg:hover:' : 'md:hover:'}bg-blue-600 bg-blue-500">…</button>\n<!--  md:hover:bg-blue-600\n      │   │     │\n      │   │     └─ utility: background blue-600\n      │   └─ variant: on hover\n      └─ screen: from md up -->`,
      mistakes: ['Putting the screen prefix after the variant (hover:md: is wrong order in v3)', 'Forgetting the colon between segments', 'Trying to prefix arbitrary values incorrectly: md:w-[100px], not w-md-[100px]']
    },
    'jit-compiler': {
      idea: 'The JIT (just-in-time) compiler scans your content files, extracts every class name, and emits CSS for exactly those — nothing else. An 11,417-utility catalog becomes a 10 KB stylesheet. Scanning is incremental (mtime + hash cache), so rebuilds take about a millisecond.',
      example: () => `<!-- content/index.html contains: -->\n<div class="p-4 bg-blue-500 rounded-lg">…</div>\n\n/* compiled output — ONLY these three rules: */\n.p-4 { padding: 1rem }\n.bg-blue-500 { background-color: var(--color-blue-500) }\n.rounded-lg { border-radius: 0.5rem }`,
      mistakes: ['Building class names with string concatenation the scanner cannot see (use safelists)', 'Scanning node_modules or build output (slow, wrong classes)', 'Shipping full mode to production out of habit']
    },
    'full-vs-jit': {
      idea: 'Full mode emits the entire catalog — great for prototyping via CDN, wrong for production. JIT emits only what your content uses. Same classes, same names — only the delivery changes, so switching modes never touches your markup.',
      example: () => `# full build (CDN / prototyping)\nnpx nakshora build nakshora.css --full -o dist/nakshora.css\n\n# JIT build (production)\nnpx nakshora build nakshora.css -o dist/nakshora.min.css --minify`,
      mistakes: ['Profiling performance on a full build and blaming the framework', 'Forgetting to set content globs, which silently disables JIT']
    },
    'dark-mode-strategies': {
      idea: 'Class strategy: toggle `dark` on <html> and control the scheme yourself (persists with localStorage). Media strategy: follow the OS preference with zero JS. Selector strategy (3.1): scope dark mode to any ancestor selector. Pick one, then express all variants with dark: prefixes.',
      example: () => `<html class="dark">\n  <body class="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">\n    …\n  </body>\n</html>`,
      mistakes: ['Mixing media and class strategies in one app', 'Forgetting dark: variants on images and shadows (they glare)', 'Toggling the class on <body> when darkMode expects <html>']
    },
    'css-variables': {
      idea: 'Every token is mirrored onto :root as a custom property. That means your hand-written CSS, inline styles, canvas code and JS can all read the same design decisions — and you can retheme at runtime by redefining a handful of variables.',
      example: (V) => V.id === 'v1.0' ? `.callout {\n  border-left: 4px solid var(--neon-cyan-500);\n  padding: var(--space-4);\n}` : `.callout {\n  border-left: 4px solid var(--color-blue-500);\n  padding: var(--spacing-4);\n}`,
      mistakes: ['Re-declaring palette hexes instead of using the variables', 'Expecting variables for arbitrary values (they are inlined, not tokenized)']
    }
  };
  return bodies[slug] || bodies['design-tokens'];
}

function configArticle(V, slug, title, desc) {
  return article({
    slug: `configuration/${slug}`,
    title: `${title} — ${V.label} configuration`,
    section: 'configuration',
    category: 'Configuration',
    tags: ['configuration', slug],
    keywords: [title.toLowerCase(), 'config', 'option', 'reference'],
    summary: `${desc} Complete reference for this ${V.label} configuration option: types, defaults, examples and pitfalls.`,
    blocks: [
      p(desc),
      h2('Syntax'),
      code('js', configExample(slug, V), 'nakshora.config.js'),
      h2('Details & defaults'),
      p(configDetail(slug, V)),
      h2('Worked examples'),
      list(configExamples(slug)),
      h2('Related options'),
      p('See the [[configuration/index|configuration hub]] for the full option table, and [[api/theme-resolution|theme resolution]] for how options merge.')
    ]
  });
}

function configExample(slug, V) {
  const map = {
    content: `export default {\n  content: [\n    './index.html',\n    './src/**/*.{js,ts,jsx,tsx,vue}',\n  ],\n};`,
    theme: `export default {\n  theme: {\n    colors: { brand: { 500: '#6d28d9' } },\n    spacing: { 18: '4.5rem' },\n  },\n};`,
    extend: `export default {\n  theme: {\n    extend: {\n      colors: { brand: { 500: '#6d28d9' } }, // keeps all defaults\n    },\n  },\n};`,
    darkmode: `export default {\n  darkMode: 'class', // 'media' | 'class'${V.id === 'v3.1' ? " | 'selector'" : ''}\n};`,
    prefix: `export default {\n  prefix: 'nk-', // nk-flex, nk-p-4, nk-text-blue-500 …\n};`,
    important: `export default {\n  important: true,          // every utility gets !important\n  // or scope it:\n  // important: '#app',\n};`,
    'core-plugins': `export default {\n  corePlugins: {\n    float: false,   // never ship float utilities\n    clear: false,\n  },\n};`,
    safelist: `export default {\n  safelist: [\n    'bg-red-500',\n    { pattern: /^bg-(blue|green)-(400|500)$/, variants: ['hover'] },\n  ],\n};`,
    plugins: `import plugin from '@nakshora/core/plugin';\n\nexport default {\n  plugins: [\n    plugin(({ addUtilities }) => {\n      addUtilities({ '.content-auto': { 'content-visibility': 'auto' } });\n    }),\n  ],\n};`,
    presets: `import baseTheme from './company-preset.js';\n\nexport default {\n  presets: [baseTheme],\n  theme: { extend: { /* project deltas */ } },\n};`,
    'css-first': `/* app.css — Tailwind-v4-style CSS config */\n@theme {\n  --color-brand-500: #6d28d9;\n}\n\n@utility tab-4 {\n  tab-size: 4;\n}\n\n@custom-variant hocus (&:hover, &:focus);`
  };
  return map[slug] || map.theme;
}

function configDetail(slug, V) {
  const map = {
    content: 'The scanner walks every matched file and extracts candidate class names with a conservative tokenizer. Globs follow fast-glob syntax. **Default:** none — without `content`, the engine falls back to full mode. Performance tip: be specific (`./src/**/*.tsx` beats `./**/*`).',
    theme: 'Replaces whole token namespaces. Anything you define here wins over defaults *and hides them* — for additive changes use `extend`. See [[api/theme-resolution|theme resolution]].',
    extend: 'Deep-merges into the resolved theme. Objects merge key-by-key; arrays append. This is the option you want 95% of the time.',
    darkmode: "`media` follows the OS preference via `prefers-color-scheme`. `class` requires a `dark` class on an ancestor (usually `<html>`) — pair it with a toggle script and localStorage. `selector` (3.1+) lets you customize the ancestor selector entirely.",
    prefix: 'Prepends the prefix to every utility (`nk-p-4`). Variants keep their position: `hover:nk-p-4`. Useful when embedding Nakshora next to another framework.',
    important: '`true` appends `!important` to every declaration. A selector string scopes the utilities under it (`#app .p-4 { … }`) — usually the better escape hatch.',
    'core-plugins': 'Disable whole utility groups by name (object form) or keep an allow-list (array form). Great for design-system governance and shaving milliseconds off huge builds.',
    safelist: 'Classes the scanner cannot see (built at runtime, toggled from a database) must be safelisted or they get purged. Patterns accept regex + variant lists. **Rule of thumb:** if you safelist more than ~50 classes, your content globs are probably wrong.',
    plugins: 'Plugins receive a small API: `addUtilities`, `addComponents`, `addBase`, `theme()`, `variants()`' + (V.id === 'v3.1' ? ' — full Tailwind plugin API compatibility, including the `bare` extension' : '') + '. Official Tailwind plugins (typography, forms, aspect-ratio, container-queries) run unchanged on 3.1.',
    presets: 'A preset is a partial config. Presets apply before your own `theme`, and can nest. They are the supported way to share a company design system across many apps.',
    'css-first': 'New in 3.1: write configuration in the stylesheet itself. `@theme` defines tokens as CSS variables, `@utility` registers custom utilities, `@custom-variant` creates new variants. It composes with — never replaces — the JS config.'
  };
  return map[slug] || '';
}

function configExamples(slug) {
  const map = {
    content: ['Monorepo? Point at every package: `./packages/*/src/**/*.{ts,tsx}`', 'Add `./node_modules/@acme/ui/dist/**/*.js` when a component library ships Nakshora classes'],
    theme: ['Replace the whole type scale: `theme.fontFamily.sans = ["Inter", …]`', 'Reduce palettes: define only the 5 colors your brand allows'],
    extend: ['Add `brand` colors without touching the 22 defaults', 'Add a spacing step: `extend.spacing[18] = "4.5rem"`', 'Add a screen: `extend.screens["3xl"] = "1920px"` (already built in on 3.1)'],
    darkmode: ['Class + localStorage toggle is the standard SaaS pattern', 'Media is best for content sites with no user preference storage'],
    prefix: ['Embedding inside WordPress themes: `prefix: "nk-"` avoids theme collisions'],
    important: ['Legacy CSS you cannot delete? Scope with `important: "#legacy-app"` first'],
    'core-plugins': ['A documentation site rarely needs floats — disable `float` and `clear`'],
    safelist: ['Runtime status colors: `/^bg-(red|amber|green)-500$/`', 'Server-rendered alerts whose classes come from a database'],
    plugins: ['Port a Tailwind plugin: change the import, keep the code', 'Add `.content-auto` for content-visibility in one line'],
    presets: ['Company preset + per-app deltas keeps 12 apps consistent', 'Publish your preset to npm and import it like any dependency'],
    'css-first': ['Define `--color-brand-*` once in CSS, use `bg-brand-500` everywhere', 'Create a `hocus` variant for hover+focus in one declaration']
  };
  return map[slug] || ['See the syntax above and adapt to your project.'];
}

function cliArticle(V, slug, cmd, desc) {
  const flags = {
    init: [['`--full`', 'Also create an entry CSS file with @nakshora directives'], ['`--force`', 'Overwrite existing files']],
    build: [['`-o, --output <file>`', 'Output path (stdout when omitted)'], ['`--minify`', 'Minify the output'], ['`--full`', 'Emit the full catalog instead of JIT'], ['`--content <globs…>`', 'Override content globs'], ['`--safelist <classes…>`', 'Extra safelist entries'], ['`--source-map`', 'Emit a source map'], ['`--stats`', 'Print size & class statistics'], ['`--diff`', 'Show what changed since the last build']],
    dev: [['`--watch`', 'Rebuild on content changes (default)'], ['`--serve`', 'Start the dependency-free dev server with CSS hot-swap'], ['`--port <n>`', 'Dev server port']],
    doctor: [['`--json`', 'Machine-readable report']],
    migrate: [['`--from tailwind`', 'Source framework (Tailwind)'], ['`--dry-run`', 'Preview changes without writing']],
    lsp: [['`--stdio`', 'Transport (default stdio)']],
    inspect: [['`<class>`', 'The class to explain, e.g. `md:hover:bg-blue-600/50`']],
    'export-ai': [['`--out <file>`', 'Output corpus path (default ai/corpus.json)']]
  };
  const examples = {
    init: 'npx nakshora init',
    build: 'npx nakshora build src/app.css -o dist/app.min.css --minify --stats',
    dev: 'npx nakshora dev --serve',
    doctor: 'npx nakshora doctor',
    migrate: 'npx nakshora migrate --from tailwind',
    lsp: 'npx nakshora lsp',
    inspect: 'npx nakshora inspect "md:hover:bg-blue-600/50"',
    'export-ai': 'npx nakshora export:ai --out ai/corpus.json'
  };
  return article({
    slug: `cli/${slug}`,
    title: `${cmd}`,
    section: 'cli',
    category: 'CLI',
    tags: ['cli', slug],
    keywords: [cmd, 'cli', 'command', slug],
    summary: `${desc} Complete flag reference, examples and troubleshooting for \`${cmd}\`.`,
    blocks: [
      p(desc),
      h2('Usage'),
      code('bash', examples[slug] || cmd, 'terminal'),
      h2('Flags'),
      table(['Flag', 'Meaning'], flags[slug] || [['—', 'No extra flags']]),
      h2('What to expect'),
      p(cliBehavior(slug)),
      h2('Troubleshooting'),
      list(cliTrouble(slug)),
      h2('See also'),
      p('[[cli/index|CLI hub]] · [[configuration/index|Configuration reference]]')
    ]
  });
}

function cliBehavior(slug) {
  const map = {
    init: 'Creates `nakshora.config.js` with commented defaults. With `--full` you also get `nakshora.css` containing the `@nakshora` directives, ready for the build command.',
    build: 'Reads your config, scans content, and writes the compiled stylesheet. With `--stats` you get class counts and byte sizes; with `--diff` the delta against the previous output — great for CI reviews.',
    dev: 'Watches content and config, rebuilding in ~1 ms increments. `--serve` additionally starts a static server that hot-swaps the compiled CSS without reloading the page.',
    doctor: 'Checks in order: config parse errors, content globs matching zero files, version mismatches between packages, and common mistakes (like scanning node_modules). Exit code is non-zero when something is wrong — wire it into CI.',
    migrate: 'Detects your Tailwind setup (config file, PostCSS config, package.json), rewrites at-rules (`@tailwind` → `@nakshora`), renames dependencies and generates the equivalent Nakshora config. Run with `--dry-run` first.',
    lsp: 'Speaks the Language Server Protocol over stdio. Point any LSP-capable editor at it: completions for every utility, hover CSS previews, diagnostics for unknown classes, and color swatches for palette classes.',
    inspect: 'Prints the exact CSS (including media queries and selector variants) that the engine will emit for the given class. The fastest way to settle "what does this compile to?" arguments.',
    'export-ai': 'Serializes the full utility registry to JSON: class, compiled CSS, description, category, examples. This powers llms.txt tooling, embeddings and SFT datasets.'
  };
  return map[slug] || '';
}

function cliTrouble(slug) {
  const map = {
    init: ['"File already exists" — pass `--force` or delete the old config'],
    build: ['Empty output → your `content` globs match nothing (`nakshora doctor` proves it)', 'Missing dynamic classes → add them to the [[configuration/safelist|safelist]]'],
    dev: ['CSS not updating → check the watched globs include your templates', 'Port busy → pass `--port`'],
    doctor: ['Red ✗ on content → fix glob paths relative to the config file, not cwd'],
    migrate: ['Commit your working tree first; the migration rewrites files in place'],
    lsp: ['No completions → ensure your editor sends the file language as html/css', 'Colors missing → your editor must support the LSP color provider'],
    inspect: ['Unknown class → check spelling; remember variants go before utilities (`hover:p-4`, not `p-4:hover`)'],
    'export-ai': ['Huge file → expected; the 3.1 corpus covers 11,417 utilities']
  };
  return map[slug] || ['Run with `--help` for the full flag list.'];
}

function themeAdvice(slug) {
  const map = {
    'neon-cyber': 'Dashboards for developer tools, gaming UIs, dark-mode-first products, anything that wants glow and energy. Pair with the `.neon-*` components.',
    'pastel-dream': 'Consumer apps, wellness and lifestyle brands, onboarding flows, light-mode products that must feel gentle rather than corporate.',
    brutalist: 'Editorial projects, portfolios, campaign pages, zine aesthetics. Loud by design — pair with oversized type and flat colors.',
    minimalist: 'B2B SaaS, admin panels, documentation (like this site), anywhere clarity beats personality.',
    nature: 'Food, travel, sustainability and outdoor brands. Warm neutrals with organic accents.'
  };
  return map[slug] || '';
}

function themeSample(slug) {
  const map = {
    'neon-cyber': `<div class="neon-card p-6">\n  <h3 class="neon-text font-bold">SYSTEM ONLINE</h3>\n  <button class="neon-btn mt-4">Engage</button>\n</div>`,
    'pastel-dream': `<div class="minimalist-card p-6 rounded-2xl bg-pink-100">\n  <h3 class="text-pink-700 font-semibold">Breathe</h3>\n  <p class="text-pink-500 text-sm mt-1">Soft colors, calm interface.</p>\n</div>`,
    brutalist: `<div class="brutalist-card p-6">\n  <h3 class="font-black uppercase">No decoration.</h3>\n  <button class="brutalist-btn mt-4">DO IT</button>\n</div>`,
    minimalist: `<div class="minimalist-card p-8">\n  <h3 class="font-medium">Clean by default</h3>\n  <button class="minimalist-btn mt-4">Continue</button>\n</div>`,
    nature: `<div class="rounded-xl p-6 bg-emerald-50 border border-emerald-200">\n  <h3 class="text-emerald-800 font-semibold">Grown, not built</h3>\n  <p class="text-emerald-600 text-sm mt-1">Earth tones and daylight.</p>\n</div>`
  };
  return map[slug] || '';
}

function migrationArticle(slug, title, lead, V) {
  const tables = {
    'migration-v1-to-v3': [
      ['`<link href="…/min.main.css">`', 'JIT build via CLI/Vite/PostCSS, or the CDN full build'],
      ['`text-mono-100`, `bg-neon-purple-500`', 'Preset palettes: `text-primary-500` with `neonTheme` (or the default 22)'],
      ['`.card-neon`, `.btn-neon`', '`.neon-card`, `.neon-btn`'],
      ['`uhd:` / `k8:` breakpoints', 'Custom breakpoints via `theme.breakpoints` (3.1 ships `4xl:`/`5xl:`)'],
      ['`.skeleton-rect`, `.hover-lift`, `.gradient-text`', 'Unchanged — same names, same behavior']
    ],
    'migration-v2-to-v3': [
      ['`CSSGenerator` API', 'Preserved — same constructor and generate()'],
      ['`.mr-*`/`-right` spacing bug (emitted keys)', 'Fixed — correct values'],
      ['Empty responsive media queries', 'Fixed — real responsive variants for every utility'],
      ['Broken `./types` theme imports', 'Fixed — themes import cleanly, gain `description`'],
      ['No state variants', 'Added: hover:, dark:, group-*, peer-* in JIT']
    ],
    'migration-v30-to-v31': [
      ['4 breakpoints', '10 breakpoints (xxs → 5xl)'],
      ['JS-only config', '+ CSS-first config (@theme/@utility/@custom-variant)'],
      ['3,091 utilities', '11,417 utilities, Tailwind 3.4 parity'],
      ['No LSP', 'nakshora lsp for every editor'],
      ['dev watch only', 'dev --serve dependency-free server with CSS hot-swap']
    ],
    'migration-tailwind': [
      ['`@tailwind base; @tailwind utilities;`', '`@nakshora source;` / `@nakshora utilities;`'],
      ['tailwind.config.js', 'nakshora.config.js (same shape)'],
      ['tailwindcss dependency', '@nakshora/core (+ postcss/vite/cli equivalents)'],
      ['Class grammar', 'Byte-identical on 3.1 — 11,343 static + 1,338 dynamic classes verified']
    ]
  };
  return article({
    slug: `releases/${slug}`,
    title,
    section: 'releases',
    category: 'Migration',
    tags: ['migration', 'upgrades'],
    keywords: ['migration', 'upgrade', 'migrate', 'move to nakshora'],
    summary: `${lead} Step-by-step migration guide with the exact mapping tables.`,
    blocks: [
      p(lead),
      h2('What changes'),
      table(['Before', 'After'], tables[slug]),
      h2('Step by step'),
      list(migrationSteps(slug)),
      h2('After the migration'),
      p('Run [[cli/doctor|nakshora doctor]] to validate the new setup, then diff your pages visually. Because the class grammar is stable, most migrations finish in under an hour.'),
      callout('warn', 'Commit your working tree before starting — migration commands rewrite files in place.')
    ]
  });
}

function migrationSteps(slug) {
  const map = {
    'migration-v1-to-v3': ['Freeze a reference screenshot of each page', 'Install `@nakshora/cli`, run `nakshora init`', 'Copy `site/nakshora.config.mjs` from the repo as your config to keep the v1 look', 'Replace renamed component classes (table above)', 'Swap the `<link>` for your compiled output', 'Diff screenshots; adjust tokens where v1 used one-off values'],
    'migration-v2-to-v3': ['Replace the `nakshora` v2 dependency with `@nakshora/core`', 'Keep your `CSSGenerator` call sites — the API is stable', 'Re-run generation; expect smaller, correct output', 'Adopt JIT by adding `content` globs', 'Explore the new state variants in your markup'],
    'migration-v30-to-v31': ['Bump all @nakshora packages together (versions are lockstep)', 'Rebuild — no breaking class changes', 'Adopt new breakpoints: try `3xl:`/`4xl:` on your wide layouts', 'Try CSS-first config for one token to learn it', 'Wire `nakshora lsp` into your editor'],
    'migration-tailwind': ['Commit a clean working tree', 'Run `npx nakshora migrate` (add `--dry-run` first)', 'Review the rewritten config and at-rules', 'Swap dependencies in package.json as suggested', 'Build and run `nakshora doctor`', 'Your class names keep working — verified byte-identical on 3.1']
  };
  return map[slug] || [];
}
