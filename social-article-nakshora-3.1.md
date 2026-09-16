# Nakshora CSS 3.1 is here: Tailwind-class ergonomics, zero runtime JavaScript — built on a tablet in Bangladesh

**One release, three numbers: 11,417 utilities · 155 variants · 0 bytes of runtime JS.**

Today we're shipping **Nakshora CSS v3.1** — the parity release. If you know Tailwind's utility grammar, you already know Nakshora: the class names, the variants, the mental model. The difference is a principle we refuse to bend — **your users never download our JavaScript.** The output is pure CSS, compiled by a JIT engine that's fast enough to run in your build, your editor… or your browser.

নকশোরা comes from **নকশা**, the Bangla word for *pattern*. That's the whole philosophy: design systems are dictionaries of patterns, and a framework's job is to keep the vocabulary complete and the grammar regular.

---

## What's actually in v3.1

**🧩 11,417 static utilities across 37 categories.** Layout, flex, grid, typography, color, borders, gradients, shadows, filters, transforms, transitions, animations, SVG, tables, accessibility — compiled from one canonical grammar, not hand-stitched per release.

**🎨 22 palettes × 11 shades = 242 color tokens.** From `slate-50` to `rose-950`. Every shade works everywhere: text, backgrounds, borders, rings, gradients, divide colors.

**📱 10 breakpoints — 200 px to 5,000 px.** `xxs xs sm md lg xl 2xl 3xl 4xl 5xl`. Most frameworks stop at 4K screens; Nakshora covers smartwatches and video walls too.

**⚡ 155 variants.** `hover:`, `focus:`, `dark:`, `md:`, `group-hover:`, `first:`, `before:`… the full modifier matrix.

**🏎️ JIT, for real.** Compiling a 200-line document: **~18 ms cold, ~1.3 ms hot.** Full static builds: 5,983 KB min / **133 KB Brotli** — and your JIT pages ship only the few KB they use.

**🔌 A real toolchain on npm:**

```bash
npm i @nakshora/core @nakshora/cli
# plus @nakshora/postcss and @nakshora/vite-plugin
```

Drop-in Vite plugin:

```ts
// vite.config.ts
import { nakshora } from '@nakshora/vite-plugin';

export default {
  plugins: [nakshora()]
};
```

```html
<!-- index.html — that's it -->
<div class="grid md:grid-cols-3 gap-4 p-6">
  <article class="rounded-xl border border-slate-200 p-6 hover:shadow-lg transition">
    <h2 class="font-black text-slate-900">Patterns, not stylesheets.</h2>
  </article>
</div>
```

And yes — there's Tailwind compatibility: v3.1 follows the **Tailwind 3.4 utility grammar**, so muscle memory (and `nakshora migrate`) carry you over.

---

## Try it without installing anything

The new **playground** runs the *actual* v3.1 compiler 100% inside your browser tab — no server, no uploads:

👉 **[play.nakshora.bsdc.info.bd](https://play.nakshora.bsdc.info.bd/)**

- Type markup, watch exact CSS appear in milliseconds (hot compiles: 1–5 ms)
- **102 ready-made templates** — landing pages, dashboards, pricing, auth, brutalism…
- Device lab from 200 px to 5,000 px, zoom, orientation flip
- **One-link sharing** — your whole session is deflate-compressed into the URL hash
- Pretty or minified output, byte + millisecond readouts, copy/download

The deep docs live at **[docs.nakshora.bsdc.info.bd](https://docs.nakshora.bsdc.info.bd/)** — 9,400 prerendered pages covering v1.0 → v3.1.

---

## The story behind the release

Nakshora isn't built in a San Francisco office. It's built in **Sylhet, Bangladesh**, by **Rizwan Rahim Chowdhury** — a Class 7 student — entirely on an **Android tablet** over Termux, code-server and SSH. The framework, the 9,400-page docs platform, and the playground: all of it.

> "World-class software craftsmanship should come from anywhere. The vocabulary is boring on purpose, the compiler is fast on purpose, and the license is free on purpose." — Rizwan Rahim Chowdhury

Nakshora is **MIT licensed**, hosted free on Cloudflare Pages, and maintained under the banner of **RRC Development** and the Bangladesh Software Development Community (BSDC).

---

## Get started

- **GitHub:** [github.com/nakshora/nakshora](https://github.com/nakshora/nakshora) ⭐ stars welcome
- **npm:** `@nakshora/core` · `@nakshora/cli` · `@nakshora/postcss` · `@nakshora/vite-plugin`
- **Playground:** [play.nakshora.bsdc.info.bd](https://play.nakshora.bsdc.info.bd/)
- **Docs:** [docs.nakshora.bsdc.info.bd](https://docs.nakshora.bsdc.info.bd/)

Build something patterned. Trust the pattern. ✦

`#css` `#webdev` `#opensource` `#tailwind` `#bangladesh`

---
---

## Short teasers (for X / LinkedIn / Facebook)

**X (tweet):**
Nakshora CSS 3.1 is out 🎉 Tailwind 3.4 grammar parity, 11,417 utilities, 155 variants, 10 breakpoints (200–5000px) — and 0 bytes of runtime JavaScript. Built in Bangladesh, MIT forever. Try the in-browser playground: play.nakshora.bsdc.info.bd #css #opensource

**LinkedIn (post):**
Excited to announce Nakshora CSS v3.1 — the parity release. 11,417 utilities across 37 categories, 22 palettes, 155 variants, and JIT compilation that runs cold in ~18 ms. It speaks the Tailwind 3.4 grammar but ships zero runtime JavaScript.

What makes us proudest than the numbers: the whole ecosystem — framework, 9,400-page docs platform, and a real-time in-browser playground — is built by our founder Rizwan Rahim Chowdhury from Sylhet, Bangladesh, on an Android tablet. MIT licensed, free on Cloudflare Pages.

Docs: docs.nakshora.bsdc.info.bd · Playground: play.nakshora.bsdc.info.bd · GitHub: github.com/nakshora/nakshora

**Facebook / Bangla community (one-liner):**
নকশোরা CSS 3.1 রিলিজ হয়েছে! 🇧🇩 নকশা মানে প্যাটার্ন — ১১,৪১৭ ইউটিলিটি, ১৫৫ ভ্যারিয়েন্ট, ১০ ব্রেকপয়েন্ট, জিরো রানটাইম জাভাস্ক্রিপ্ট। সিলেটের এক সপ্তম শ্রেণির শিক্ষার্থীর তৈরি, ট্যাবলেটে বানানো ফ্রেমওয়ার্ক — এখন বিশ্বের জন্য উন্মুক্ত, MIT লাইসেন্সে। ট্রাই করুন: play.nakshora.bsdc.info.bd
