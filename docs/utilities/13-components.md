---
title: Design Components
---

# Design Components (Paradigms)

Nakshora ships first-class **design-paradigm components**: glassmorphism, neon
cyber, brutalism, minimalism and skeleton loaders. They are always included in
every build (they are small) and work in both full and JIT mode.

## Glassmorphism

Frosted-glass surfaces with backdrop blur.

```html
<div class="glass p-8">
  <!-- standard glass -->
  <h3>Glass card</h3>
</div>

<div class="glass-light p-8">
  <!-- lighter, for light backgrounds -->
  <h3>Light glass</h3>
</div>

<div class="glass-dark p-8">
  <!-- dark tint, for dark backgrounds -->
  <h3>Dark glass</h3>
</div>
```

| Class          | Effect                                                                                  |
| -------------- | --------------------------------------------------------------------------------------- |
| `.glass`       | translucent white, `backdrop-filter: blur(12px) saturate(140%)`, subtle border + shadow |
| `.glass-light` | stronger light tint, best over photography                                              |
| `.glass-dark`  | slate tint, best over dark backgrounds                                                  |

> Combine with utilities freely: `class="glass p-6 rounded-xl"`.

## Neon Cyber

High-saturation, glowing UI for dark backgrounds.

```html
<div class="neon-card p-6 text-center">
  <p class="neon-text text-lg font-bold">SYSTEM ONLINE</p>
  <button class="neon-btn mt-4">Engage</button>
</div>
```

| Class        | Effect                                                     |
| ------------ | ---------------------------------------------------------- |
| `.neon-card` | navy card with cyan glow border; glow intensifies on hover |
| `.neon-btn`  | cyan→pink gradient button with neon glow, lifts on hover   |
| `.neon-glow` | adds a cyan glow shadow to any element                     |
| `.neon-text` | cyan text with layered text-shadow glow                    |

## Brutalism

Raw, high-contrast, zero ornamentation.

```html
<div class="brutalist-card p-6">
  <h3 class="font-black uppercase">No frills</h3>
  <button class="brutalist-btn mt-4">SMASH</button>
</div>
```

| Class             | Effect                                                             |
| ----------------- | ------------------------------------------------------------------ |
| `.brutalist-card` | white card, 3px black border, hard offset shadow; shifts on hover  |
| `.brutalist-btn`  | yellow block button, hard shadow, uppercase; presses down on click |

## Minimalist

Quiet, professional surfaces.

```html
<div class="minimalist-card p-6">
  <h3 class="text-lg font-semibold">Simple</h3>
  <button class="minimalist-btn mt-4">Continue</button>
</div>
```

| Class              | Effect                                           |
| ------------------ | ------------------------------------------------ |
| `.minimalist-card` | white card, hairline border, barely-there shadow |
| `.minimalist-btn`  | dark pill button, inverts on hover               |

## Skeletons (loading states)

Shimmer placeholders while content loads.

```html
<div class="flex items-center gap-4 p-4">
  <div class="skeleton-circle w-12 h-12 shrink-0"></div>
  <div class="flex-1 space-y-2">
    <div class="skeleton-text w-3/4"></div>
    <div class="skeleton-text w-1/2"></div>
  </div>
</div>
```

| Class              | Effect                                                     |
| ------------------ | ---------------------------------------------------------- |
| `.skeleton-rect`   | rounded rectangle shimmer (set `w-*`/`h-*` on the element) |
| `.skeleton-circle` | circular shimmer (avatars)                                 |
| `.skeleton-text`   | text-line shimmer (`height: 1em`)                          |

## Helpers

| Class                 | Effect                                                   |
| --------------------- | -------------------------------------------------------- |
| `.hover-lift`         | lifts the element 4px with a shadow on hover             |
| `.gradient-text`      | blue→purple→pink gradient text (`background-clip: text`) |
| `.gradient-neon`      | dark navy diagonal gradient background                   |
| `.gradient-pastel`    | soft pink→blue→green gradient background                 |
| `.gradient-nature`    | deep forest gradient background                          |
| `.gradient-brutalist` | yellow→red gradient background                           |

## Extending with plugins

Add your own components through the plugin API — they are emitted right after
the built-in set:

```js
// nakshora.config.js
export default {
  plugins: [
    {
      name: 'my-components',
      handler(api) {
        api.addComponents({
          '.price-tag': {
            display: 'inline-block',
            padding: '0.25rem 0.75rem',
            background: '#fef3c7',
            color: '#92400e',
            borderRadius: '9999px',
            fontWeight: '600',
          },
        });
      },
    },
  ],
};
```

See [API — Plugins](../API.md#plugins).
