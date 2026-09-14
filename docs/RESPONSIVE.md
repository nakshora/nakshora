# Responsive Design

Nakshora is **mobile-first**: base styles apply to all viewports; a screen
prefix overrides them from that width upwards. Every rule in this document is
pinned by `packages/@nakshora/core/test/responsive.test.ts`.

## The 10 breakpoints

| Prefix   | Min-width  | `max-*` variant (max-width) | Typical devices                  |
| -------- | ---------- | --------------------------- | -------------------------------- |
| _(none)_ | 0          | —                           | everything                       |
| `xxs:`   | **200px**  | `max-xxs:` → 199.98px       | tiny / folded screens, wearables |
| `xs:`    | **400px**  | `max-xs:` → 399.98px        | small phones                     |
| `sm:`    | **640px**  | `max-sm:` → 639.98px        | large phones                     |
| `md:`    | **768px**  | `max-md:` → 767.98px        | tablets                          |
| `lg:`    | **1024px** | `max-lg:` → 1023.98px       | laptops                          |
| `xl:`    | **1280px** | `max-xl:` → 1279.98px       | desktops                         |
| `2xl:`   | **1536px** | `max-2xl:` → 1535.98px      | large desktops                   |
| `3xl:`   | **1920px** | `max-3xl:` → 1919.98px      | Full HD (1080p) monitors, TVs    |
| `4xl:`   | **2560px** | `max-4xl:` → 2559.98px      | QHD / 2K monitors                |
| `5xl:`   | **5000px** | `max-5xl:` → 4999.98px      | 4K+, video walls, ultra-wide     |

`sm`–`2xl` are byte-identical to previous Nakshora versions and to Tailwind
CSS v3. The other five are additive — no existing class changes meaning.

```html
<div class="text-base sm:text-lg md:text-xl 3xl:text-2xl">Grows with the viewport</div>
```

```css
.text-base {
  font-size: 1rem;
}
@media (min-width: 640px) {
  .sm\:text-lg {
    font-size: 1.125rem;
  }
}
@media (min-width: 768px) {
  .md\:text-xl {
    font-size: 1.25rem;
  }
}
@media (min-width: 1920px) {
  .\33xl\:text-2xl {
    font-size: 1.5rem;
  }
}
```

Screens are always emitted **ascending** (200 → 5000) so a wider screen wins
the cascade; `max-*` blocks are emitted **descending** (largest width first)
so the narrowest wins.

### `max-*` — desktop-first when you need it

`max-<screen>:` uses `max-width: <screen − 0.02px>` (same convention as
Tailwind) so `max-md:` and `md:` never overlap:

```html
<nav class="max-md:hidden">…</nav>
<!-- @media (max-width: 767.98px) -->
```

### Arbitrary widths

```html
<div class="min-[900px]:flex max-[900px]:hidden [@media(min-width:200px)]:block"></div>
```

`min-[…]` / `max-[…]` take any length; `[@media(…)]:` takes a raw query
(never rewritten, see below).

## Combining with other variants

A screen and any other **media** variant collapse into **one** query, in
whichever order you write them:

| Class                             | Output                                                                       |
| --------------------------------- | ---------------------------------------------------------------------------- |
| `print:md:flex` / `md:print:flex` | `@media print and (min-width: 768px)`                                        |
| `motion-reduce:xl:hidden`         | `@media (min-width: 1280px) and (prefers-reduced-motion: reduce)`            |
| `portrait:max-md:dark:flex`       | `@media (max-width: 767.98px) and (orientation: portrait) { …:is(.dark *) }` |
| `md:hover:bg-indigo-600`          | `@media (min-width: 768px) { .md\:hover\:bg-indigo-600:hover }`              |

Selector variants (`hover:`, `dark:`, `group-*`, …) nest as usual inside the
media block. Set `combineMedia: false` in the config to get Tailwind's nested
form (`@media print { @media (min-width: 768px) { … } }`) instead. Arbitrary
`[@media(…)]:` queries are **never** merged — they stay as their own wrapper.

### Stacking screens (`lg:xl:`)

Stacking two screens of the same family keeps the **tighter** bound — the
intersection of the two ranges, which is what the browser would compute
anyway for nested queries:

| Class                       | Output                                                           |
| --------------------------- | ---------------------------------------------------------------- |
| `lg:xl:flex` / `xl:lg:flex` | `@media (min-width: 1280px)` (largest min)                       |
| `max-md:max-sm:flex`        | `@media (max-width: 639.98px)` (smallest max)                    |
| `md:max-xl:flex`            | `@media (min-width: 768px) and (max-width: 1279.98px)` (a range) |

Stacked classes sort by their **outermost** screen, so `lg:xl:flex` and
`xl:flex` never fight each other.

## `.container`

`.container` sets `width: 100%` and then one `max-width` per screen — but
only for **`sm`…`2xl`**. A `200px` or a `5000px` max-width is never useful,
so the extended screens are opt-in:

```js
theme: {
  container: {
    center: true,
    padding: { DEFAULT: '1rem', lg: '2rem' },
    minScreen: 'xxs',   // default 'sm'  — first screen to cap at (or false)
    maxScreen: '4xl',   // default '2xl' — last screen to cap at (or false)
    // screens: { … }   // Tailwind form: an explicit max-width map
  },
},
```

With `variants.responsive: false` the container emits `width: 100%` only.

## Container queries

Element-relative breakpoints (`@container`) follow Tailwind v4 grammar. Sizes
come from `theme.containers` (`3xs` 16rem … `7xl` 80rem, `xs` 20rem,
`sm` 24rem, `md` 28rem, `lg` 32rem …).

| Class                                | Output                               |
| ------------------------------------ | ------------------------------------ |
| `@container`                         | `container-type: inline-size`        |
| `@container/card`                    | `… ; container-name: card`           |
| `@md:flex` / `@min-md:flex`          | `@container (min-width: 28rem)`      |
| `@max-md:flex`                       | `@container (width < 28rem)`         |
| `@lg/card:flex`                      | `@container card (min-width: 32rem)` |
| `@max-lg/card:flex`                  | `@container card (width < 32rem)`    |
| `@[30rem]:flex`, `@max-[400px]:flex` | arbitrary sizes                      |

Order (verified against `tailwindcss@4.3.3`): all `@max-*` first, widest to
narrowest, then `@min-*` ascending. `variants.containerQueries: false`
disables the whole family. Tailwind **v3**'s `@tailwindcss/container-queries`
plugin has no `@min-*`/`@max-*` — they are a Nakshora / v4 extra.

## Configuration

### `theme.breakpoints` — extend (Nakshora)

Merged into the 10-step scale, numbers are `px`, `null` removes, and the
result is re-sorted by width. Every custom screen gets a matching `max-*`.

```js
theme: {
  breakpoints: { tablet: 900, xxs: null },
},
// → xs sm md tablet lg xl 2xl 3xl 4xl 5xl   (tablet:, max-tablet:)
```

### `theme.screens` — replace (Tailwind)

```js
theme: {
  screens: { mobile: '480px', desktop: { min: '1024px' } },
},
// → only mobile:/desktop: (+ max-mobile:/max-desktop:) exist; md: is gone
```

Presets ship the full scale; a preset can trim it by carrying its own
`theme.screens`.

### Switching families off

```js
variants: {
  responsive: false,     // no xxs:…5xl:, no max-*, no min-[…]/max-[…], .container has no caps
  maxResponsive: false,  // only the max-* half goes away; md: etc. stay
  containerQueries: false,
},
```

### Full builds: 5 screens by default

JIT mode supports all ten screens. The pre-built **full** bundle
(`nakshora build` without `content`, `dist/css/nakshora.css`, the CDN file)
wraps every utility once per screen, so it uses the classic five by default
and lets you opt in:

```js
generator.generate({ mode: 'full', screens: 'all' }); // xxs…5xl
generator.generate({ mode: 'full', screens: ['sm', 'lg', '3xl'] });
```

Measured on this build (`node -e` against `dist/index.cjs`, minified):

| `screens`                     | pretty       | min          | gzip        | brotli    |
| ----------------------------- | ------------ | ------------ | ----------- | --------- |
| `'core'` (default, 5 screens) | 6,533,366 B  | 5,982,601 B  | 592,255 B   | 132,967 B |
| `'all'` (10 screens)          | 12,104,047 B | 11,077,622 B | 1,085,165 B | 184,609 B |

Doubling the screens roughly doubles the raw file (+85 %) but only adds
39 % to the brotli payload; either way, use JIT for real projects.

## Viewport units and `clamp()`

`h-svh` / `h-lvh` / `h-dvh` (and `min-h-*`, `max-h-*`, `w-svw` …) plus
arbitrary `clamp()` values keep working alongside every screen:

```html
<main class="min-h-dvh w-[clamp(1rem,5vw,3rem)] 4xl:max-w-screen-2xl"></main>
```

## Patterns

```html
<!-- scale a grid -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 4xl:grid-cols-6 gap-4">
  …
</div>

<!-- show / hide -->
<span class="block sm:hidden">📱 mobile only</span>
<span class="hidden md:inline">🖥️ desktop only</span>
<span class="max-xs:text-xs">tiny screens get smaller type</span>

<!-- responsive + state -->
<div class="md:hover:scale-105 transition">…</div>
```
