# Examples

Copy-paste components, all v3 classes (works in JIT mode when your content
globs include the example file).

## Buttons

```html
<!-- Primary -->
<button
  class="px-5 py-2.5 bg-blue-500 text-white font-semibold rounded-lg
               hover:bg-blue-600 active:scale-95 transition shadow-md"
>
  Primary
</button>

<!-- Glass -->
<button
  class="glass px-5 py-2.5 text-white font-medium rounded-lg
               hover:bg-white/20 transition"
>
  Glass
</button>

<!-- Neon -->
<button class="neon-btn">Neon</button>

<!-- Brutalist -->
<button class="brutalist-btn">Brutal</button>

<!-- Minimal -->
<button class="minimalist-btn">Minimal</button>

<!-- Ghost -->
<button
  class="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-md
               font-medium transition"
>
  Ghost
</button>
```

## Cards

```html
<!-- Standard -->
<div
  class="bg-white rounded-xl border border-slate-200 shadow-sm p-6 hover-lift
            dark:bg-slate-800 dark:border-slate-700"
>
  <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Title</h3>
  <p class="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
    Body copy with comfortable line height.
  </p>
</div>

<!-- Glass -->
<div class="glass p-6">
  <h3 class="text-lg font-bold text-white">Glass card</h3>
  <p class="mt-2 text-slate-300 text-sm">Frosted surface over any background.</p>
</div>

<!-- Neon -->
<div class="neon-card p-6">
  <p class="neon-text font-bold tracking-wide">SYSTEM ONLINE</p>
</div>

<!-- Skeleton (loading) -->
<div class="bg-white rounded-xl border border-slate-200 p-6 flex items-start gap-4">
  <div class="skeleton-circle w-12 h-12 shrink-0"></div>
  <div class="flex-1 space-y-2 py-1">
    <div class="skeleton-text w-3/4"></div>
    <div class="skeleton-text w-1/2"></div>
    <div class="skeleton-text w-5/6"></div>
  </div>
</div>
```

## Navigation

```html
<header class="sticky top-0 z-50 glass-dark">
  <nav class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
    <a class="text-white font-black text-xl tracking-tight" href="#">NAKSHORA</a>
    <div class="hidden md:flex items-center gap-8">
      <a class="text-slate-300 hover:text-white text-sm font-medium transition" href="#">Docs</a>
      <a class="text-slate-300 hover:text-white text-sm font-medium transition" href="#">Themes</a>
      <a class="text-slate-300 hover:text-white text-sm font-medium transition" href="#">Blog</a>
      <a
        class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold
                rounded-lg transition"
        href="#"
        >Get started</a
      >
    </div>
  </nav>
</header>
```

## Hero

```html
<section
  class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950
                flex items-center justify-center p-6"
>
  <div class="text-center max-w-2xl">
    <span
      class="inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/30
                  text-indigo-300 text-xs font-semibold tracking-widest uppercase mb-6"
    >
      v3.0 — JIT compiler
    </span>
    <h1 class="text-5xl sm:text-6xl font-black text-white tracking-tight leading-tight">
      Build <span class="gradient-text">beautiful</span> UIs faster
    </h1>
    <p class="mt-6 text-lg text-slate-300 leading-relaxed">
      Utility-first CSS with a JIT compiler, glass/neon/brutalist components and first-class dark
      mode.
    </p>
    <div class="mt-8 flex items-center justify-center gap-4">
      <button class="neon-btn">Start building</button>
      <a
        class="px-5 py-2.5 text-white font-medium glass rounded-lg hover:bg-white/10 transition"
        href="#"
        >Read the docs</a
      >
    </div>
  </div>
</section>
```

## Forms

```html
<form class="space-y-4 max-w-md mx-auto">
  <div>
    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
    <input
      type="email"
      class="w-full px-4 py-2.5 rounded-lg border border-slate-300
                  focus:outline-none focus:ring-0 focus:border-blue-500
                  bg-white dark:bg-slate-800 dark:border-slate-600 dark:text-white transition"
      placeholder="you@example.com"
    />
  </div>
  <div class="flex items-center gap-3">
    <input type="checkbox" id="terms" class="peer" />
    <label for="terms" class="text-sm text-slate-600 dark:text-slate-400">I accept the terms</label>
  </div>
  <button
    type="submit"
    class="w-full px-5 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50
                 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition"
  >
    Submit
  </button>
</form>
```

## Badges & tags

```html
<span
  class="inline-flex items-center px-2.5 py-0.5 rounded-full
              bg-emerald-100 text-emerald-800 text-xs font-semibold"
  >Active</span
>
<span
  class="inline-flex items-center px-2.5 py-0.5 rounded-full
              bg-amber-100 text-amber-800 text-xs font-semibold"
  >Pending</span
>
<span
  class="inline-flex items-center px-2.5 py-0.5 rounded-full
              bg-rose-100 text-rose-800 text-xs font-semibold"
  >Failed</span
>
```

## Pricing grid

```html
<div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
  <!-- tier -->
  <div
    class="bg-white rounded-2xl border border-slate-200 p-8 hover-lift
              dark:bg-slate-800 dark:border-slate-700"
  >
    <h3 class="font-bold text-lg text-slate-900 dark:text-white">Starter</h3>
    <p class="mt-4">
      <span class="text-4xl font-black text-slate-900 dark:text-white">$0</span>
      <span class="text-slate-500 text-sm">/mo</span>
    </p>
    <ul class="mt-6 space-y-3 text-sm text-slate-600 dark:text-slate-300">
      <li class="flex items-center gap-2">✔ 1 project</li>
      <li class="flex items-center gap-2">✔ Community support</li>
    </ul>
    <button
      class="mt-8 w-full px-4 py-2.5 border border-slate-300 rounded-lg
                   hover:bg-slate-50 font-medium transition dark:border-slate-600 dark:hover:bg-slate-700"
    >
      Choose
    </button>
  </div>
  <!-- highlight tier -->
  <div class="bg-slate-900 text-white rounded-2xl p-8 shadow-xl relative">
    <span
      class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-500
                  text-xs font-bold rounded-full"
      >POPULAR</span
    >
    <h3 class="font-bold text-lg">Pro</h3>
    <p class="mt-4">
      <span class="text-4xl font-black">$29</span> <span class="text-slate-400 text-sm">/mo</span>
    </p>
    <button
      class="mt-8 w-full px-4 py-2.5 bg-blue-500 hover:bg-blue-600 rounded-lg
                   font-semibold transition"
    >
      Choose
    </button>
  </div>
  <!-- …third tier… -->
</div>
```

## Tables

```html
<div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
  <table class="w-full text-sm">
    <thead class="bg-slate-50 dark:bg-slate-800 text-left">
      <tr>
        <th class="px-4 py-3 font-semibold text-slate-900 dark:text-white">Name</th>
        <th class="px-4 py-3 font-semibold text-slate-900 dark:text-white">Status</th>
        <th class="px-4 py-3 font-semibold text-slate-900 dark:text-white text-right">Size</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-900">
      <tr class="hover:bg-slate-50 dark:hover:bg-slate-800 transition">
        <td class="px-4 py-3">core</td>
        <td class="px-4 py-3">published</td>
        <td class="px-4 py-3 text-right">25 KB</td>
      </tr>
    </tbody>
  </table>
</div>
```

## Tooltips (peer-based, no JS)

```html
<span class="group relative inline-block">
  <span class="cursor-help border-b border-dotted border-slate-400">hover me</span>
  <span
    class="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                px-3 py-1.5 rounded-md bg-slate-900 text-white text-xs whitespace-nowrap
                opacity-0 group-hover:opacity-100 transition"
  >
    A tooltip
  </span>
</span>
```
