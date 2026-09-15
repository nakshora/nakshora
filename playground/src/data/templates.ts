// ---------------------------------------------------------------------------
// Nakshora Playground — 100+ ready-made templates for v3.1.
// Every entry is a real, loadable body fragment compiled live by the engine.
// ---------------------------------------------------------------------------

export interface Template {
  id: string;
  name: string;
  cat: string;
  desc: string;
  html: string;
}

const T = (id: string, name: string, cat: string, desc: string, html: string): Template => ({ id, name, cat, desc, html });

// ------------------------------------------------------------ explicit set
export const EXPLICIT: Template[] = [
  T('hero-neon', 'Neon hero', 'Landing', 'Dark hero with gradient headline and glow CTA.', `<body class="bg-slate-950 text-white min-h-screen grid place-items-center p-6">
  <main class="max-w-3xl text-center space-y-6">
    <span class="inline-block rounded-full border border-indigo-500/40 bg-indigo-500/10 px-4 py-1 text-xs font-semibold tracking-widest uppercase text-indigo-300">Nakshora 3.1</span>
    <h1 class="text-5xl md:text-7xl font-black tracking-tight bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-amber-300 bg-clip-text text-transparent">Ship patterns, not stylesheets.</h1>
    <p class="text-slate-400 text-lg md:text-xl">The utility-first CSS framework with a JIT compiler — 11,417 utilities, zero runtime.</p>
    <div class="flex gap-4 justify-center flex-wrap">
      <a href="#" class="rounded-xl bg-indigo-500 hover:bg-indigo-400 transition px-7 py-3 font-bold shadow-lg shadow-indigo-500/30">Start building</a>
      <a href="#" class="rounded-xl border border-slate-700 hover:border-slate-500 transition px-7 py-3 font-bold text-slate-300">Read the docs</a>
    </div>
  </main>
</body>`),
  T('navbar-glass', 'Glass navbar', 'Navbar', 'Sticky frosted navigation with mobile pattern.', `<body class="bg-slate-100 min-h-screen">
  <header class="sticky top-0 z-40 border-b border-white/40 bg-white/70 backdrop-blur">
    <nav class="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4">
      <a href="#" class="text-lg font-black tracking-tight text-slate-900">নকশোরা</a>
      <div class="hidden md:flex gap-6 text-sm font-semibold text-slate-600">
        <a href="#" class="hover:text-indigo-600 transition">Docs</a>
        <a href="#" class="hover:text-indigo-600 transition">Templates</a>
        <a href="#" class="hover:text-indigo-600 transition">Pricing</a>
      </div>
      <div class="ml-auto flex items-center gap-3">
        <a href="#" class="hidden sm:block text-sm font-semibold text-slate-600 hover:text-slate-900">Sign in</a>
        <a href="#" class="rounded-lg bg-slate-900 hover:bg-slate-700 transition px-4 py-2 text-sm font-bold text-white">Get started</a>
      </div>
    </nav>
  </header>
  <main class="mx-auto max-w-6xl p-8 text-slate-700">Page content under a frosted, sticky header — scroll to feel it.</main>
</body>`),
  T('pricing-3', 'Pricing trio', 'Pricing', 'Three tiers with a highlighted pro plan.', `<body class="bg-white p-8 min-h-screen">
  <section class="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
    <div class="rounded-2xl border border-slate-200 p-6 flex flex-col gap-4">
      <h3 class="font-bold text-slate-900">Starter</h3>
      <p class="text-4xl font-black text-slate-900">$0</p>
      <ul class="space-y-2 text-sm text-slate-600"><li>✓ CDN build</li><li>✓ Community support</li><li>✓ MIT forever</li></ul>
      <a href="#" class="mt-auto rounded-lg border border-slate-300 py-2 text-center text-sm font-bold hover:bg-slate-50 transition">Choose</a>
    </div>
    <div class="rounded-2xl border-2 border-indigo-600 p-6 flex flex-col gap-4 shadow-xl shadow-indigo-600/10 relative">
      <span class="absolute -top-3 left-6 rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold text-white">POPULAR</span>
      <h3 class="font-bold text-slate-900">Pro</h3>
      <p class="text-4xl font-black text-slate-900">$19</p>
      <ul class="space-y-2 text-sm text-slate-600"><li>✓ JIT + LSP</li><li>✓ Priority support</li><li>✓ Team presets</li></ul>
      <a href="#" class="mt-auto rounded-lg bg-indigo-600 py-2 text-center text-sm font-bold text-white hover:bg-indigo-500 transition">Choose</a>
    </div>
    <div class="rounded-2xl border border-slate-200 p-6 flex flex-col gap-4">
      <h3 class="font-bold text-slate-900">Enterprise</h3>
      <p class="text-4xl font-black text-slate-900">Let’s talk</p>
      <ul class="space-y-2 text-sm text-slate-600"><li>✓ SLA</li><li>✓ On-prem registry</li><li>✓ Training</li></ul>
      <a href="#" class="mt-auto rounded-lg border border-slate-300 py-2 text-center text-sm font-bold hover:bg-slate-50 transition">Contact</a>
    </div>
  </section>
</body>`),
  T('cards-glass', 'Glass cards', 'Cards', 'Frosted panels over a gradient sky.', `<body class="min-h-screen bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-8 grid place-items-center">
  <div class="grid gap-6 md:grid-cols-3 max-w-4xl">
    <div class="rounded-2xl border border-white/30 bg-white/10 backdrop-blur p-6 text-white space-y-2 hover:bg-white/20 transition">
      <div class="text-3xl">⚡</div><h3 class="font-bold">18 ms builds</h3><p class="text-sm text-white/70">JIT compilation of 200 lines, cold.</p>
    </div>
    <div class="rounded-2xl border border-white/30 bg-white/10 backdrop-blur p-6 text-white space-y-2 hover:bg-white/20 transition">
      <div class="text-3xl">🪶</div><h3 class="font-bold">5–20 KB shipped</h3><p class="text-sm text-white/70">Only the CSS you actually use.</p>
    </div>
    <div class="rounded-2xl border border-white/30 bg-white/10 backdrop-blur p-6 text-white space-y-2 hover:bg-white/20 transition">
      <div class="text-3xl">🤖</div><h3 class="font-bold">AI-ready</h3><p class="text-sm text-white/70">llms.txt + corpus ship with every release.</p>
    </div>
  </div>
</body>`),
  T('form-auth', 'Sign-in card', 'Auth', 'Centered auth card with validation styling.', `<body class="min-h-screen grid place-items-center bg-slate-950 p-6">
  <form class="w-full max-w-sm space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
    <h1 class="text-xl font-black text-white">Welcome back</h1>
    <label class="block text-sm font-semibold text-slate-400">Email
      <input type="email" placeholder="you@bsdc.info.bd" class="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 transition" />
    </label>
    <label class="block text-sm font-semibold text-slate-400">Password
      <input type="password" placeholder="••••••••" class="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 transition" />
    </label>
    <button class="w-full rounded-lg bg-indigo-600 py-2.5 font-bold text-white hover:bg-indigo-500 active:scale-[.98] transition">Sign in</button>
    <p class="text-center text-xs text-slate-500">New here? <a href="#" class="text-indigo-400 hover:underline">Create account</a></p>
  </form>
</body>`),
  T('dashboard-stats', 'Stats dashboard', 'Dashboard', 'KPI grid with sparkline-style bars.', `<body class="min-h-screen bg-slate-100 p-6">
  <main class="mx-auto max-w-6xl space-y-6">
    <header class="flex items-center justify-between"><h1 class="text-2xl font-black text-slate-900">Overview</h1><span class="rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1">LIVE</span></header>
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div class="rounded-xl bg-white p-5 shadow-sm border border-slate-200"><p class="text-xs font-bold uppercase text-slate-400">Builds</p><p class="text-3xl font-black text-slate-900">12,480</p><p class="text-xs text-emerald-600 font-semibold">▲ 8.1%</p></div>
      <div class="rounded-xl bg-white p-5 shadow-sm border border-slate-200"><p class="text-xs font-bold uppercase text-slate-400">CSS shipped</p><p class="text-3xl font-black text-slate-900">9.2 KB</p><p class="text-xs text-emerald-600 font-semibold">▼ 12%</p></div>
      <div class="rounded-xl bg-white p-5 shadow-sm border border-slate-200"><p class="text-xs font-bold uppercase text-slate-400">Lighthouse</p><p class="text-3xl font-black text-slate-900">99</p><p class="text-xs text-slate-400 font-semibold">perf</p></div>
      <div class="rounded-xl bg-white p-5 shadow-sm border border-slate-200"><p class="text-xs font-bold uppercase text-slate-400">Errors</p><p class="text-3xl font-black text-slate-900">0</p><p class="text-xs text-slate-400 font-semibold">oracle green</p></div>
    </div>
    <div class="rounded-xl bg-white p-5 shadow-sm border border-slate-200 flex items-end gap-2 h-40">
      <div class="flex-1 rounded-t bg-indigo-200 h-1/3"></div><div class="flex-1 rounded-t bg-indigo-300 h-1/2"></div><div class="flex-1 rounded-t bg-indigo-400 h-2/3"></div><div class="flex-1 rounded-t bg-indigo-500 h-5/6"></div><div class="flex-1 rounded-t bg-indigo-600 h-full"></div>
    </div>
  </main>
</body>`),
  T('ecom-grid', 'Product grid', 'E-commerce', 'Responsive shop grid with hover lift.', `<body class="min-h-screen bg-white p-6">
  <main class="mx-auto max-w-6xl">
    <h1 class="mb-6 text-2xl font-black text-slate-900">New arrivals</h1>
    <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
      ${['Indigo', 'Rose', 'Amber', 'Emerald', 'Cyan', 'Fuchsia', 'Slate', 'Lime'].map((c, i) => `<a href="#" class="group rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition">
        <div class="aspect-square bg-${c.toLowerCase()}-100 grid place-items-center text-${c.toLowerCase()}-600 text-4xl font-black">${i + 1}</div>
        <div class="p-3"><p class="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition">${c} piece</p><p class="text-xs text-slate-500">৳ ${(i + 3) * 350}</p></div>
      </a>`).join('\n      ')}
    </div>
  </main>
</body>`),
  T('blog-post', 'Article layout', 'Blog', 'Readable measure with drop-cap vibe.', `<body class="min-h-screen bg-amber-50 text-slate-800">
  <article class="mx-auto max-w-2xl px-6 py-16 space-y-6">
    <p class="text-xs font-black uppercase tracking-widest text-amber-600">Essay · 6 min</p>
    <h1 class="text-4xl font-black tracking-tight text-slate-900">Patterns all the way down</h1>
    <p class="text-lg leading-8">নকশা means pattern. A utility framework is a dictionary of patterns; the compiler is its grammar checker. This post argues that taste scales only when vocabulary is boring on purpose.</p>
    <p class="leading-7">When <code class="rounded bg-amber-100 px-1 font-mono text-sm text-amber-800">mt-4</code> means the same thing on every project, review gets cheaper, onboarding gets faster, and design debates move from pixels to meaning.</p>
    <blockquote class="border-l-4 border-amber-400 pl-4 italic text-slate-600">“Trust the pattern.”</blockquote>
    <p class="leading-7">The compiler’s job is to keep the vocabulary complete and the grammar regular. Everything else is essays.</p>
  </article>
</body>`),
  T('footer-4col', 'Footer, four columns', 'Footer', 'Classic sitemap footer with socials.', `<body class="min-h-screen bg-slate-950 flex flex-col">
  <div class="flex-1"></div>
  <footer class="border-t border-slate-800 bg-slate-900 text-slate-400">
    <div class="mx-auto grid max-w-6xl gap-8 p-10 sm:grid-cols-2 lg:grid-cols-4 text-sm">
      <div><h4 class="mb-3 font-black text-white">নকশোরা</h4><p class="leading-6">The utility-first CSS framework from Bangladesh. MIT forever.</p></div>
      <div><h4 class="mb-3 font-bold text-white">Product</h4><ul class="space-y-2"><li><a class="hover:text-white transition" href="#">Playground</a></li><li><a class="hover:text-white transition" href="#">Docs</a></li><li><a class="hover:text-white transition" href="#">CLI</a></li></ul></div>
      <div><h4 class="mb-3 font-bold text-white">Company</h4><ul class="space-y-2"><li><a class="hover:text-white transition" href="#">RRC Development</a></li><li><a class="hover:text-white transition" href="#">BSDC</a></li><li><a class="hover:text-white transition" href="#">Contact</a></li></ul></div>
      <div><h4 class="mb-3 font-bold text-white">Legal</h4><ul class="space-y-2"><li><a class="hover:text-white transition" href="#">MIT license</a></li><li><a class="hover:text-white transition" href="#">Brand</a></li></ul></div>
    </div>
    <p class="border-t border-slate-800 py-4 text-center text-xs">© 2026 Rizwan Rahim Chowdhury · RRC Development</p>
  </footer>
</body>`),
  T('cta-band', 'CTA band', 'CTA', 'Gradient conversion band.', `<body class="min-h-screen grid place-items-center bg-white p-6">
  <section class="max-w-4xl w-full rounded-3xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 p-10 md:p-14 text-center text-white shadow-2xl">
    <h2 class="text-3xl md:text-5xl font-black tracking-tight">Start shipping patterns today.</h2>
    <p class="mt-3 text-indigo-100">Free, MIT, zero runtime. Your JS budget stays yours.</p>
    <a href="#" class="mt-8 inline-block rounded-xl bg-white text-indigo-700 font-black px-8 py-3 hover:scale-105 active:scale-95 transition shadow-lg">Open the playground →</a>
  </section>
</body>`),
  T('table-data', 'Data table', 'Table', 'Striped responsive table with badges.', `<body class="min-h-screen bg-slate-50 p-6">
  <div class="mx-auto max-w-4xl overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
    <table class="w-full text-sm">
      <thead class="bg-slate-900 text-left text-white"><tr><th class="p-3 font-bold">Release</th><th class="p-3 font-bold">Utilities</th><th class="p-3 font-bold">Era</th><th class="p-3 font-bold">Status</th></tr></thead>
      <tbody class="divide-y divide-slate-100 text-slate-700">
        <tr class="odd:bg-white even:bg-slate-50"><td class="p-3 font-bold">v3.1</td><td class="p-3">11,417</td><td class="p-3">Parity</td><td class="p-3"><span class="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">latest</span></td></tr>
        <tr class="odd:bg-white even:bg-slate-50"><td class="p-3 font-bold">v3.0</td><td class="p-3">3,091</td><td class="p-3">JIT</td><td class="p-3"><span class="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">stable</span></td></tr>
        <tr class="odd:bg-white even:bg-slate-50"><td class="p-3 font-bold">v2.0</td><td class="p-3">500 colors</td><td class="p-3">Generator</td><td class="p-3"><span class="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">legacy</span></td></tr>
        <tr class="odd:bg-white even:bg-slate-50"><td class="p-3 font-bold">v1.0</td><td class="p-3">1,038</td><td class="p-3">Frozen</td><td class="p-3"><span class="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">legacy</span></td></tr>
      </tbody>
    </table>
  </div>
</body>`),
  T('team-grid', 'Team grid', 'Team', 'Avatar cards with role + socials.', `<body class="min-h-screen bg-white p-8">
  <section class="mx-auto max-w-5xl">
    <h1 class="text-3xl font-black text-slate-900 text-center mb-10">The humans</h1>
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      ${[['RC', 'Rizwan Rahim Chowdhury', 'Author · SEO architect', 'indigo'], ['ND', 'নকশা Design Council', 'Pattern review', 'rose'], ['BD', 'BSDC Community', 'Mentorship & livestreams', 'emerald']].map(([ini, n, r, c]) => `<div class="rounded-2xl border border-slate-200 p-6 text-center hover:shadow-lg hover:-translate-y-1 transition">
        <div class="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full bg-${c}-100 text-2xl font-black text-${c}-700">${ini}</div>
        <h3 class="font-bold text-slate-900">${n}</h3><p class="text-sm text-slate-500">${r}</p>
      </div>`).join('\n      ')}
    </div>
  </section>
</body>`),
  T('faq-acc', 'FAQ (details)', 'FAQ', 'Native details/summary accordion, zero JS.', `<body class="min-h-screen bg-slate-50 p-8">
  <main class="mx-auto max-w-2xl space-y-3">
    <h1 class="text-2xl font-black text-slate-900 mb-6">Questions, answered</h1>
    ${[['Is Nakshora free?', 'Yes — MIT licensed, forever. Attribution optional.'], ['Does it ship JavaScript?', 'No. Zero runtime by principle; the output is pure CSS.'], ['Can I use Tailwind configs?', 'The grammar is Tailwind-3.4 compatible; nakshora migrate ports projects.'], ['Works on 3G?', 'JIT output is 5–20 KB. Lighthouse 95+ on mid-tier Android is the bar.']].map(([q, a]) => `<details class="group rounded-xl border border-slate-200 bg-white p-5 open:shadow-md transition">
      <summary class="flex cursor-pointer items-center justify-between font-bold text-slate-900">${q}<span class="text-indigo-500 transition group-open:rotate-45">＋</span></summary>
      <p class="mt-3 text-sm leading-6 text-slate-600">${a}</p>
    </details>`).join('\n    ')}
  </main>
</body>`),
  T('gallery-masonry', 'Masonry gallery', 'Gallery', 'CSS-columns masonry with hover zoom.', `<body class="min-h-screen bg-slate-950 p-6">
  <div class="columns-2 md:columns-3 xl:columns-4 gap-4 space-y-4 max-w-6xl mx-auto">
    ${[40, 64, 52, 72, 44, 60, 48, 68, 56, 42].map((h, i) => `<figure class="overflow-hidden rounded-xl group">
      <div class="w-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 group-hover:scale-105 transition duration-300" style="height:${h * 3}px"></div>
    </figure>`).join('\n    ')}
  </div>
</body>`),
  T('hero-minimal', 'Minimal hero', 'Landing', 'Typographic hero, brutal whitespace.', `<body class="min-h-screen bg-white text-slate-900 grid place-items-center p-10">
  <main class="max-w-xl space-y-6">
    <p class="font-mono text-xs uppercase tracking-[0.3em] text-slate-400">nakshora · 3.1</p>
    <h1 class="text-5xl font-black leading-[1.05] tracking-tight">Less CSS, more meaning.</h1>
    <p class="text-slate-500 leading-7">A vocabulary of patterns, compiled to exactly what you use.</p>
    <a href="#" class="inline-block border-b-2 border-slate-900 pb-0.5 font-bold hover:border-indigo-600 hover:text-indigo-600 transition">Enter the playground</a>
  </main>
</body>`),
  T('brutal-poster', 'Brutalist poster', 'Brutal', 'Hard borders, offset shadows, loud type.', `<body class="min-h-screen bg-yellow-300 p-8 text-black">
  <main class="max-w-3xl mx-auto space-y-6 font-black">
    <h1 class="text-6xl md:text-8xl uppercase leading-none border-4 border-black p-6 bg-white shadow-[10px_10px_0_0_#000]">Do it loud</h1>
    <p class="text-xl border-4 border-black p-4 bg-pink-400 shadow-[8px_8px_0_0_#000] -rotate-1">Brutalist mode: flat colors, hard edges, zero apologies.</p>
    <button class="text-2xl uppercase border-4 border-black bg-cyan-300 px-8 py-3 shadow-[6px_6px_0_0_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition">Press</button>
  </main>
</body>`),
  T('skeleton-load', 'Skeleton loading', 'UX', 'Shimmer placeholders for perceived speed.', `<body class="min-h-screen bg-white p-8">
  <div class="max-w-md mx-auto space-y-4 animate-pulse">
    <div class="h-8 w-2/3 rounded bg-slate-200"></div>
    <div class="h-4 w-full rounded bg-slate-100"></div>
    <div class="h-4 w-5/6 rounded bg-slate-100"></div>
    <div class="h-40 w-full rounded-xl bg-slate-200"></div>
    <div class="flex gap-3">${[0, 1, 2].map(() => '<div class="h-10 w-10 rounded-full bg-slate-200"></div>').join('')}</div>
  </div>
</body>`),
  T('dark-app', 'Dark app shell', 'Dashboard', 'Sidebar + topbar dark application frame.', `<body class="min-h-screen bg-slate-950 text-slate-300 flex">
  <aside class="hidden md:flex w-60 flex-col gap-1 border-r border-slate-800 p-4">
    <p class="mb-4 px-2 text-lg font-black text-white">নকশোরা</p>
    ${['Home', 'Projects', 'Builds', 'Oracle', 'Settings'].map((x, i) => `<a href="#" class="rounded-lg px-3 py-2 text-sm font-semibold ${i === 0 ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 hover:text-white'} transition">${x}</a>`).join('\n    ')}
  </aside>
  <div class="flex-1 flex flex-col">
    <header class="flex h-14 items-center justify-between border-b border-slate-800 px-6">
      <p class="text-sm font-bold text-white">Builds</p>
      <div class="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500"></div>
    </header>
    <main class="p-6 grid gap-4 sm:grid-cols-3">
      ${['Queued 2', 'Running 1', 'Passed 480'].map((s) => `<div class="rounded-xl border border-slate-800 bg-slate-900 p-5"><p class="text-sm font-bold text-white">${s}</p><p class="text-xs text-slate-500">last 24h</p></div>`).join('\n      ')}
    </main>
  </div>
</body>`),
  T('restaurant-menu', 'Restaurant menu', 'Business', 'Elegant menu with dot leaders.', `<body class="min-h-screen bg-stone-100 p-10 text-stone-800">
  <main class="mx-auto max-w-xl space-y-8">
    <header class="text-center space-y-1"><p class="font-mono text-xs tracking-[0.4em] uppercase text-amber-700">Dhaka · est. 2024</p><h1 class="text-4xl font-black text-stone-900">Nakshora Kitchen</h1></header>
    ${[['Ilish paturi', 'mustard, banana leaf', '৳ 450'], ['Kacchi biryani', 'old dhaka style', '৳ 380'], ['Shorshe ilish', 'with steamed rice', '৳ 420'], ['Mishti doi', 'clay pot, caramelized', '৳ 120']].map(([n, d, p]) => `<div class="flex items-baseline gap-2"><h3 class="font-bold text-stone-900">${n}</h3><div class="flex-1 border-b-2 border-dotted border-stone-300"></div><span class="font-black text-amber-700">${p}</span></div><p class="-mt-1 text-sm italic text-stone-500">${d}</p>`).join('\n    ')}
  </main>
</body>`),
  T('portfolio-hero', 'Portfolio hero', 'Portfolio', 'Personal brand with availability badge.', `<body class="min-h-screen bg-zinc-950 text-zinc-100 grid place-items-center p-8">
  <main class="max-w-2xl space-y-5">
    <span class="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-300"><span class="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>Available for commissions</span>
    <h1 class="text-4xl md:text-6xl font-black tracking-tight">Rizwan Rahim Chowdhury</h1>
    <p class="text-zinc-400 text-lg">Software developer · SEO architect · full-stack engineer — shipping from Sylhet on a tablet.</p>
    <div class="flex flex-wrap gap-2 text-xs font-mono">${['PHP 8', 'Node.js', 'Termux', 'code-server', 'MySQL 8', 'JSON-LD', 'Cloudflare'].map((t) => `<span class="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-zinc-300">${t}</span>`).join('')}</div>
  </main>
</body>`),
  T('stats-band', 'Stats band', 'Marketing', 'Big-number proof strip.', `<body class="min-h-screen grid place-items-center bg-indigo-950 p-8">
  <section class="grid max-w-5xl grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
    ${[['11,417', 'utilities'], ['155', 'variants'], ['10', 'breakpoints'], ['0 B', 'runtime JS']].map(([n, l]) => `<div><p class="text-4xl md:text-5xl font-black bg-gradient-to-b from-white to-indigo-300 bg-clip-text text-transparent">${n}</p><p class="mt-1 text-xs uppercase tracking-widest text-indigo-300">${l}</p></div>`).join('\n    ')}
  </section>
</body>`),
  T('cookie-consent', 'Cookie banner', 'UX', 'Bottom consent bar with actions.', `<body class="min-h-screen bg-slate-100 p-8">
  <main class="text-slate-500">Page content…</main>
  <div class="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur p-4">
    <div class="mx-auto flex max-w-4xl flex-col md:flex-row items-center gap-3">
      <p class="text-sm text-slate-600 flex-1">We use cookies for analytics — never for ads. <a href="#" class="font-bold text-indigo-600 hover:underline">Policy</a></p>
      <div class="flex gap-2"><button class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold hover:bg-slate-50 transition">Reject</button><button class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-500 transition">Accept</button></div>
    </div>
  </div>
</body>`),
  T('timeline', 'Release timeline', 'Marketing', 'Vertical history with dots.', `<body class="min-h-screen bg-white p-10">
  <ol class="relative mx-auto max-w-xl space-y-10 border-l-2 border-indigo-100 pl-8">
    ${[['2024', 'v1.0 — the frozen sheet', '1,038 hand-tuned classes; neon, glass, brutal.'], ['2026-09', 'v2.0 — the generator', 'TypeScript CSSGenerator; 50 hues × 10 shades.'], ['2026', 'v3.0 — the JIT era', 'Monorepo, CLI, 18 ms builds.'], ['2026', 'v3.1 — parity', 'Tailwind 3.4 grammar, byte-identical, LSP.']].map(([d, t, s]) => `<li class="relative">
      <span class="absolute -left-[41px] grid h-5 w-5 place-items-center rounded-full bg-indigo-600 ring-4 ring-white"></span>
      <p class="font-mono text-xs text-indigo-500">${d}</p><h3 class="font-black text-slate-900">${t}</h3><p class="text-sm text-slate-500">${s}</p>
    </li>`).join('\n    ')}
  </ol>
</body>`),
  T('newsletter', 'Newsletter capture', 'Marketing', 'Inline email form with microcopy.', `<body class="min-h-screen grid place-items-center bg-emerald-50 p-6">
  <section class="w-full max-w-lg rounded-2xl border border-emerald-200 bg-white p-8 text-center shadow-sm">
    <h2 class="text-2xl font-black text-slate-900">One pattern a week</h2>
    <p class="mt-2 text-sm text-slate-500">No spam. Unsubscribe anytime. Written in Sylhet.</p>
    <form class="mt-6 flex gap-2">
      <input class="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition" placeholder="you@example.com" type="email" />
      <button class="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-black text-white hover:bg-emerald-500 transition">Join</button>
    </form>
  </section>
</body>`),
  T('404-page', '404 star', 'UX', 'On-brand not-found with star motif.', `<body class="min-h-screen bg-slate-950 text-white grid place-items-center p-6 text-center">
  <main class="space-y-4">
    <p class="text-7xl font-black bg-gradient-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">404</p>
    <h1 class="text-xl font-bold">This star is not on our chart.</h1>
    <p class="text-slate-400 text-sm">The pattern you seek was never compiled.</p>
    <a href="#" class="inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-bold hover:bg-indigo-500 transition">Go home</a>
  </main>
</body>`),
  T('login-split', 'Split-screen auth', 'Auth', 'Brand panel + form panel.', `<body class="min-h-screen grid md:grid-cols-2 bg-white">
  <div class="hidden md:flex flex-col justify-between bg-gradient-to-br from-indigo-700 to-fuchsia-700 p-10 text-white">
    <p class="text-2xl font-black">নকশোরা</p>
    <blockquote class="text-2xl font-bold leading-snug">“World-class software is bottlenecked by mindset, never by metal.”</blockquote>
    <p class="text-sm text-indigo-200">Rizwan Rahim Chowdhury · RRC Development</p>
  </div>
  <div class="grid place-items-center p-8">
    <form class="w-full max-w-sm space-y-4">
      <h1 class="text-2xl font-black text-slate-900">Sign in</h1>
      <input class="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30" placeholder="Email" type="email" />
      <input class="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30" placeholder="Password" type="password" />
      <button class="w-full rounded-lg bg-slate-900 py-2.5 text-sm font-black text-white hover:bg-slate-700 transition">Continue</button>
    </form>
  </div>
</body>`),
  T('weather-cards', 'Weather cards', 'Widgets', 'Forecast row with icons and temps.', `<body class="min-h-screen bg-sky-100 p-8">
  <main class="mx-auto max-w-3xl grid grid-cols-2 md:grid-cols-4 gap-4">
    ${[['Mon', '☀️', '31°'], ['Tue', '⛅', '29°'], ['Wed', '🌧️', '27°'], ['Thu', '⛈️', '26°']].map(([d, i, t]) => `<div class="rounded-2xl bg-white/80 backdrop-blur p-5 text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition">
      <p class="text-xs font-bold uppercase text-sky-500">${d}</p><p class="text-4xl my-2">${i}</p><p class="text-2xl font-black text-slate-800">${t}</p>
    </div>`).join('\n    ')}
  </main>
</body>`),
  T('gradient-gallery', 'Gradient gallery', 'Design', 'Named gradient swatch grid.', `<body class="min-h-screen bg-slate-950 p-8">
  <div class="mx-auto grid max-w-5xl grid-cols-2 md:grid-cols-3 gap-4">
    ${[['from-indigo-500 to-fuchsia-500', 'Nebula'], ['from-amber-400 to-rose-500', 'Sunset'], ['from-emerald-400 to-cyan-500', 'River'], ['from-slate-700 to-slate-900', 'Mono'], ['from-pink-400 to-rose-300', 'Pastel'], ['from-yellow-300 to-red-500', 'Brutal']].map(([g, n]) => `<figure class="rounded-xl overflow-hidden border border-slate-800">
      <div class="h-28 bg-gradient-to-br ${g}"></div><figcaption class="bg-slate-900 p-2 text-center font-mono text-xs text-slate-300">${n}</figcaption>
    </figure>`).join('\n    ')}
  </div>
</body>`),
  T('kanban', 'Kanban board', 'Dashboard', 'Three-column task board.', `<body class="min-h-screen bg-slate-100 p-6">
  <main class="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
    ${[['To do', 3, 'slate'], ['Doing', 2, 'amber'], ['Done', 4, 'emerald']].map(([title, n, c]) => `<section class="rounded-xl bg-slate-200/70 p-3">
      <h3 class="mb-3 px-1 text-xs font-black uppercase tracking-wider text-${c}-700">${title} · ${n}</h3>
      <div class="space-y-2">${Array.from({ length: n as number }, (_, i) => `<div class="rounded-lg bg-white p-3 shadow-sm border border-slate-200 hover:shadow transition"><p class="text-sm font-semibold text-slate-800">Task ${i + 1}</p><p class="text-xs text-slate-400">nakshora/${(i + 2) * 7}</p></div>`).join('')}</div>
    </section>`).join('\n    ')}
  </main>
</body>`),
  T('hero-video', 'Hero with media', 'Landing', 'Two-column hero with mock product shot.', `<body class="min-h-screen bg-white">
  <main class="mx-auto grid max-w-6xl items-center gap-12 p-10 md:grid-cols-2">
    <div class="space-y-5">
      <h1 class="text-4xl md:text-5xl font-black tracking-tight text-slate-900">Compile the pattern. Ship the star.</h1>
      <p class="text-lg text-slate-500">Nakshora turns utility grammar into pure CSS in milliseconds — in your build or in your browser.</p>
      <div class="flex gap-3"><a href="#" class="rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-500 transition">Try live</a><a href="#" class="rounded-xl border border-slate-300 px-6 py-3 font-bold text-slate-700 hover:border-slate-500 transition">Docs</a></div>
    </div>
    <div class="rounded-2xl border border-slate-200 bg-slate-950 p-4 shadow-2xl">
      <div class="mb-3 flex gap-1.5">${['bg-rose-500', 'bg-amber-400', 'bg-emerald-500'].map((c) => `<span class="h-3 w-3 rounded-full ${c}"></span>`).join('')}</div>
      <pre class="rounded-lg bg-slate-900 p-4 font-mono text-xs leading-6 text-emerald-300">&lt;div class="grid md:grid-cols-3
  gap-4 p-6"&gt;…&lt;/div&gt;</pre>
      <p class="mt-3 text-center font-mono text-xs text-slate-500">→ 1.9 KB of CSS, 14 ms</p>
    </div>
  </main>
</body>`)
];

// ------------------------------------------------- generated variants set
const PALETTES = [
  ['indigo', 'Indigo', 'light'],
  ['emerald', 'Emerald', 'light'],
  ['rose', 'Rose', 'light'],
  ['amber', 'Amber', 'light'],
  ['sky', 'Sky', 'light'],
  ['cyan', 'Cyan', 'dark'],
  ['violet', 'Violet', 'dark'],
  ['fuchsia', 'Fuchsia', 'dark']
] as const;

function archetypeHero(p: string, dark: boolean): string {
  const bg = dark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900';
  const sub = dark ? 'text-slate-400' : 'text-slate-500';
  return `<body class="min-h-screen ${bg} grid place-items-center p-8">
  <main class="max-w-2xl text-center space-y-5">
    <span class="rounded-full bg-${p}-500/10 border border-${p}-500/40 text-${p}-${dark ? '300' : '600'} px-4 py-1 text-xs font-black uppercase tracking-widest">${p} edition</span>
    <h1 class="text-4xl md:text-6xl font-black tracking-tight">Patterns in ${p}.</h1>
    <p class="${sub} text-lg">The same grammar, a different mood — swap one token, keep every layout.</p>
    <a href="#" class="inline-block rounded-xl bg-${p}-600 hover:bg-${p}-500 transition px-7 py-3 font-bold ${dark ? 'text-white' : 'text-white'} shadow-lg shadow-${p}-600/30">Explore</a>
  </main>
</body>`;
}
function archetypeCards(p: string, dark: boolean): string {
  const bg = dark ? 'bg-slate-950' : 'bg-slate-50';
  const card = dark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-700';
  return `<body class="min-h-screen ${bg} p-8">
  <div class="mx-auto grid max-w-4xl gap-5 md:grid-cols-3">
    ${['Tokens', 'Variants', 'Parity'].map((t) => `<div class="rounded-2xl border ${card} p-6 space-y-2 hover:border-${p}-500 transition">
      <div class="h-2 w-10 rounded-full bg-${p}-500"></div>
      <h3 class="font-black ${dark ? 'text-white' : 'text-slate-900'}">${t}</h3>
      <p class="text-sm opacity-80">Systematic ${t.toLowerCase()} across every project you ship.</p>
    </div>`).join('\n    ')}
  </div>
</body>`;
}
function archetypePricing(p: string, dark: boolean): string {
  const bg = dark ? 'bg-slate-950' : 'bg-white';
  const card = dark ? 'border-slate-800 text-slate-300' : 'border-slate-200 text-slate-600';
  return `<body class="min-h-screen ${bg} grid place-items-center p-8">
  <section class="grid w-full max-w-3xl gap-5 md:grid-cols-2">
    <div class="rounded-2xl border ${card} p-7 space-y-3"><h3 class="font-black">Hobby</h3><p class="text-4xl font-black">৳0</p><p class="text-sm">CDN + community.</p><a href="#" class="block rounded-lg border border-${p}-500 text-${p}-500 py-2 text-center text-sm font-black hover:bg-${p}-500/10 transition">Start</a></div>
    <div class="rounded-2xl border-2 border-${p}-500 p-7 space-y-3 shadow-xl shadow-${p}-500/10"><h3 class="font-black">Studio</h3><p class="text-4xl font-black">৳1,500</p><p class="text-sm">JIT, LSP, presets.</p><a href="#" class="block rounded-lg bg-${p}-600 text-white py-2 text-center text-sm font-black hover:bg-${p}-500 transition">Start</a></div>
  </section>
</body>`;
}
function archetypeCta(p: string, dark: boolean): string {
  return `<body class="min-h-screen grid place-items-center ${dark ? 'bg-slate-950' : 'bg-slate-100'} p-6">
  <section class="w-full max-w-3xl rounded-3xl bg-gradient-to-r from-${p}-600 to-${p}-400 p-10 text-center text-white shadow-2xl">
    <h2 class="text-3xl md:text-4xl font-black">Ship the ${p} pattern tonight.</h2>
    <p class="mt-2 text-white/80">Zero runtime. MIT. 18 ms.</p>
    <a href="#" class="mt-6 inline-block rounded-xl bg-white px-7 py-3 font-black text-${p}-700 hover:scale-105 transition">Open playground</a>
  </section>
</body>`;
}
function archetypeForm(p: string, dark: boolean): string {
  const bg = dark ? 'bg-slate-950' : 'bg-slate-50';
  const card = dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200';
  const inp = dark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900';
  return `<body class="min-h-screen grid place-items-center ${bg} p-6">
  <form class="w-full max-w-sm space-y-4 rounded-2xl border ${card} p-8 shadow-xl">
    <h1 class="text-xl font-black ${dark ? 'text-white' : 'text-slate-900'}">Join the ${p} beta</h1>
    <input class="w-full rounded-lg border ${inp} px-3 py-2 text-sm outline-none focus:border-${p}-500 focus:ring-2 focus:ring-${p}-500/40 transition" placeholder="Name" />
    <input class="w-full rounded-lg border ${inp} px-3 py-2 text-sm outline-none focus:border-${p}-500 focus:ring-2 focus:ring-${p}-500/40 transition" placeholder="Email" type="email" />
    <button class="w-full rounded-lg bg-${p}-600 py-2.5 font-black text-white hover:bg-${p}-500 active:scale-[.98] transition">Request invite</button>
  </form>
</body>`;
}
function archetypeStats(p: string, dark: boolean): string {
  return `<body class="min-h-screen grid place-items-center ${dark ? 'bg-slate-950' : 'bg-white'} p-8">
  <section class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
    ${[['11,417', 'utilities'], ['155', 'variants'], ['10', 'screens'], ['0 B', 'runtime']].map(([n, l]) => `<div><p class="text-4xl font-black text-${p}-500">${n}</p><p class="text-xs uppercase tracking-widest ${dark ? 'text-slate-500' : 'text-slate-400'}">${l}</p></div>`).join('\n    ')}
  </section>
</body>`;
}

function archetypeNav(p: string, dark: boolean): string {
  const bar = dark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-600';
  const brand = dark ? 'text-white' : 'text-slate-900';
  return `<body class="min-h-screen ${dark ? 'bg-slate-900' : 'bg-slate-50'}">
  <header class="border-b ${bar}">
    <nav class="mx-auto flex h-16 max-w-5xl items-center gap-6 px-4">
      <a href="#" class="text-lg font-black ${brand}">nakshora<span class="text-${p}-500">·</span>${p}</a>
      <div class="hidden md:flex gap-6 text-sm font-semibold">
        <a href="#" class="text-${p}-500">Home</a>
        <a href="#" class="hover:text-${p}-500 transition">Docs</a>
        <a href="#" class="hover:text-${p}-500 transition">Templates</a>
      </div>
      <a href="#" class="ml-auto rounded-lg bg-${p}-600 hover:bg-${p}-500 transition px-4 py-2 text-sm font-black text-white">Start</a>
    </nav>
  </header>
  <main class="mx-auto max-w-5xl p-8 ${dark ? 'text-slate-400' : 'text-slate-500'}">Content flows beneath a ${p} navigation bar.</main>
</body>`;
}
function archetypeFooter(p: string, dark: boolean): string {
  const foot = dark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500';
  return `<body class="min-h-screen flex flex-col ${dark ? 'bg-slate-900' : 'bg-slate-50'}">
  <div class="flex-1 p-8 ${dark ? 'text-slate-300' : 'text-slate-600'}">Page body…</div>
  <footer class="border-t ${foot}">
    <div class="mx-auto grid max-w-5xl gap-8 p-10 sm:grid-cols-3 text-sm">
      <div><h4 class="mb-2 font-black ${dark ? 'text-white' : 'text-slate-900'}">নকশোরা ${p}</h4><p>Pattern-first CSS from Bangladesh.</p></div>
      <div><h4 class="mb-2 font-black ${dark ? 'text-white' : 'text-slate-900'}">Links</h4><ul class="space-y-1"><li><a href="#" class="hover:text-${p}-500 transition">Playground</a></li><li><a href="#" class="hover:text-${p}-500 transition">Docs</a></li></ul></div>
      <div><h4 class="mb-2 font-black ${dark ? 'text-white' : 'text-slate-900'}">Legal</h4><p>MIT license · © 2026 RRC Development</p></div>
    </div>
  </footer>
</body>`;
}
function archetypeTestimonial(p: string, dark: boolean): string {
  const bg = dark ? 'bg-slate-950' : 'bg-slate-50';
  const card = dark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-600';
  return `<body class="min-h-screen grid place-items-center ${bg} p-8">
  <figure class="max-w-xl rounded-2xl border ${card} p-8 space-y-4 shadow-sm">
    <p class="text-5xl leading-none text-${p}-500 font-black">“</p>
    <blockquote class="text-lg leading-7 font-medium">We replaced 40 KB of hand-written CSS with ${p}-tinted Nakshora utilities. Builds got faster, and our reviews got quieter.</blockquote>
    <figcaption class="flex items-center gap-3">
      <span class="grid h-11 w-11 place-items-center rounded-full bg-${p}-500/15 text-${p}-500 font-black">ন</span>
      <span><strong class="block ${dark ? 'text-white' : 'text-slate-900'}">Nusrat A.</strong><span class="text-sm opacity-70">Frontend lead, Dhaka</span></span>
    </figcaption>
  </figure>
</body>`;
}

const ARCHETYPES: Array<[string, (p: string, d: boolean) => string]> = [
  ['Hero', archetypeHero],
  ['Cards', archetypeCards],
  ['Pricing', archetypePricing],
  ['CTA', archetypeCta],
  ['Form', archetypeForm],
  ['Stats', archetypeStats],
  ['Nav', archetypeNav],
  ['Footer', archetypeFooter],
  ['Testimonial', archetypeTestimonial]
];

export const GENERATED: Template[] = PALETTES.flatMap(([pid, label, mode]) =>
  ARCHETYPES.map(([aname, fn]) =>
    T(
      `gen-${pid}-${aname.toLowerCase()}`,
      `${label} ${aname.toLowerCase()}`,
      `${label} set`,
      `${aname} pattern in the ${label.toLowerCase()} palette (${mode} surface).`,
      fn(pid, mode === 'dark')
    )
  )
);

export const TEMPLATES: Template[] = [...EXPLICIT, ...GENERATED];
export const TEMPLATE_CATS = [...new Set(TEMPLATES.map((t) => t.cat))];
