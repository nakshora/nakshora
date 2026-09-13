# Responsive Design

Nakshora is **mobile-first**: base styles apply to all viewports; breakpoint
prefixes override as the viewport grows.

## Default breakpoints

| Prefix   | Min-width | Typical devices                   |
| -------- | --------- | --------------------------------- |
| _(none)_ | 0         | phones (portrait)                 |
| `sm:`    | 640px     | large phones / small tablets      |
| `md:`    | 768px     | tablets                           |
| `lg:`    | 1024px    | landscape tablets / small laptops |
| `xl:`    | 1280px    | laptops                           |
| `2xl:`   | 1536px    | desktops                          |

```html
<div class="text-base sm:text-lg md:text-xl">Grows with the viewport</div>
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
```

## Pattern: scale a grid

```html
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">…</div>
```

## Pattern: show/hide per breakpoint

```html
<span class="block sm:hidden">📱 mobile only</span>
<span class="hidden md:inline">🖥️ desktop only</span>
```

## Responsive + state variants (JIT)

```html
<div class="md:hover:scale-105 transition">…</div>
```

```css
@media (min-width: 768px) {
  .md\:hover\:scale-105:hover {
    transform: scale(1.05);
  }
}
```

## Custom breakpoints

```js
// nakshora.config.js
export default {
  theme: {
    breakpoints: {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536,
      '4k': 2160, // ← your own breakpoint → 4k: prefix
    },
  },
};
```

```html
<div class="4k:text-5xl">4K displays get bigger type</div>
```

All breakpoints except `0` participate in responsive generation; they are
sorted ascending and emitted as `@media (min-width: Npx)` blocks.

## Disabling responsive generation

```js
variants: {
  responsive: false;
}
```
