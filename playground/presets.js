// Playground examples. Each one is also compiled in the test-suite
// (packages/@nakshora/core/test/playground.test.ts): every class must resolve.

export const PRESETS = {
  card: {
    html: `<div class="min-h-screen bg-slate-100 p-8 flex items-center justify-center">
  <article class="max-w-sm w-full bg-white rounded-2xl shadow-xl overflow-hidden">
    <div class="h-32 bg-gradient-to-r from-indigo-500 to-cyan-400"></div>
    <div class="p-6 space-y-3">
      <h1 class="text-xl font-bold text-slate-900">Utility-first, byte-exact</h1>
      <p class="text-slate-600 text-sm leading-relaxed">
        Every class on this page is compiled on demand. Change one and watch the CSS update.
      </p>
      <button class="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition">
        Get started
      </button>
    </div>
  </article>
</div>`,
    css: '',
  },
  form: {
    html: `<div class="dark">
  <form class="min-h-screen bg-white dark:bg-slate-900 p-8 grid gap-4 max-w-md">
    <label class="block">
      <span class="text-sm font-medium text-slate-700 dark:text-slate-200">Email</span>
      <input type="email" placeholder="you@example.com"
        class="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 focus:outline-none invalid:border-rose-500" />
    </label>
    <label class="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
      <input type="checkbox" class="peer size-4 accent-cyan-500" />
      <span class="peer-checked:text-cyan-500 peer-checked:font-semibold">Subscribe to updates</span>
    </label>
    <button disabled class="rounded-md bg-cyan-600 px-4 py-2 text-white disabled:opacity-50 disabled:cursor-not-allowed">Submit</button>
  </form>
</div>`,
    css: '',
  },
  grid: {
    html: `<ul class="grid gap-4 p-6 grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-6 bg-slate-50 min-h-screen">
  <li class="aspect-video rounded-xl bg-rose-400 max-md:col-span-full"></li>
  <li class="aspect-video rounded-xl bg-amber-400"></li>
  <li class="aspect-video rounded-xl bg-emerald-400"></li>
  <li class="aspect-video rounded-xl bg-sky-400 @container">
    <p class="p-2 text-xs @[12rem]:text-base @md:text-xl text-white">container query</p>
  </li>
  <li class="aspect-video rounded-xl bg-violet-400 print:hidden"></li>
  <li class="aspect-video rounded-xl bg-pink-400 portrait:opacity-50"></li>
</ul>`,
    css: '',
  },
  variants: {
    html: `<div class="p-8 space-y-4 bg-white min-h-screen">
  <div class="group flex items-center gap-3 rounded-lg border p-4 hover:border-indigo-500">
    <span class="size-3 rounded-full bg-slate-300 group-hover:bg-indigo-500 transition-colors"></span>
    <span class="group-hover:text-indigo-600">Hover the row (group-hover)</span>
  </div>
  <p class="text-[13px] leading-[1.7] tracking-[0.02em] text-[#1e293b]">Arbitrary values: text-[13px] text-[#1e293b]</p>
  <div class="w-[clamp(12rem,50%,32rem)] h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"></div>
  <ul class="*:rounded *:bg-slate-100 *:px-2 *:py-1 flex gap-2 text-sm">
    <li>child</li><li>variant</li><li class="!bg-emerald-200">!important</li>
  </ul>
  <button aria-pressed="true" class="aria-pressed:bg-slate-900 aria-pressed:text-white px-3 py-1 rounded">aria-pressed</button>
  <div data-state="open" class="data-[state=open]:border-emerald-500 border-2 p-2">data-[state=open]</div>
  <p class="has-[a:hover]:bg-yellow-100 p-2">has-[a:hover]: <a href="#" class="underline">hover this link</a></p>
  <p class="[&>em]:text-rose-600 [&>em]:not-italic">arbitrary variant <em>[&>em]</em></p>
  <p class="motion-reduce:transition-none supports-[backdrop-filter]:backdrop-blur-sm">supports-[…] · motion-reduce</p>
</div>`,
    css: '',
  },
  cssconfig: {
    html: `<div class="p-8 bg-brand-50 min-h-screen space-y-4">
  <h1 class="text-brand-700 font-display text-3xl">@theme tokens → utilities</h1>
  <button class="btn-primary">@apply component</button>
  <div class="tab-4 font-mono whitespace-pre">\ttab-4 (@utility)</div>
  <p class="theme-midnight:text-white theme-midnight:bg-slate-900 p-3 rounded">@custom-variant</p>
</div>`,
    css: `@theme {
  --color-brand-50: #eef2ff;
  --color-brand-700: #4338ca;
  --font-display: "Georgia", serif;
}

@utility tab-* {
  tab-size: --value(integer);
}

@custom-variant theme-midnight (&:where([data-theme="midnight"] *));

.btn-primary {
  @apply rounded-lg bg-brand-700 px-4 py-2 text-white font-semibold hover:opacity-90;
  box-shadow: 0 1px 2px theme(colors.brand.700 / 30%);
}`,
  },
  components: {
    html: `<div class="p-8 bg-slate-950 min-h-screen grid gap-6 md:grid-cols-2">
  <div class="glass p-6 rounded-2xl text-white">.glass</div>
  <div class="neon-card p-6 rounded-2xl text-white">.neon-card <button class="neon-btn mt-3">.neon-btn</button></div>
  <div class="brutalist-card p-6">.brutalist-card <button class="brutalist-btn mt-3">.brutalist-btn</button></div>
  <div class="minimalist-card p-6">.minimalist-card</div>
  <div class="space-y-2"><div class="skeleton-text"></div><div class="skeleton-text w-2/3"></div><div class="skeleton-rect h-16"></div></div>
  <p class="gradient-text gradient-neon text-3xl font-black">.gradient-text</p>
</div>`,
    css: '',
  },
};
