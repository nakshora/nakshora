---
title: Background Utilities
---

# Background Utilities

> Part of the [Nakshora Utilities Reference](../UTILITIES.md). These tables are **generated from the framework source** — what you see here is exactly what the compiler emits.

Background position, repeat, size, attachment and linear gradients (`bg-gradient-to-*` + `from-*` / `via-*` / `to-*` stops).

## Backgrounds

**41 utilities**

| Class | CSS | Description |
| --- | --- | --- |
| `decoration-slice` | `box-decoration-break: slice` | box-decoration-break: slice |
| `decoration-clone` | `box-decoration-break: clone` | box-decoration-break: clone |
| `box-decoration-slice` | `box-decoration-break: slice` | box-decoration-break: slice |
| `box-decoration-clone` | `box-decoration-break: clone` | box-decoration-break: clone |
| `bg-fixed` | `background-attachment: fixed` | background-attachment: fixed |
| `bg-local` | `background-attachment: local` | background-attachment: local |
| `bg-scroll` | `background-attachment: scroll` | background-attachment: scroll |
| `bg-clip-border` | `background-clip: border-box` | background-clip: border-box |
| `bg-clip-padding` | `background-clip: padding-box` | background-clip: padding-box |
| `bg-clip-content` | `background-clip: content-box` | background-clip: content-box |
| `bg-clip-text` | `background-clip: text` | background-clip: text |
| `bg-repeat` | `background-repeat: repeat` | background-repeat: repeat |
| `bg-no-repeat` | `background-repeat: no-repeat` | background-repeat: no-repeat |
| `bg-repeat-x` | `background-repeat: repeat-x` | background-repeat: repeat-x |
| `bg-repeat-y` | `background-repeat: repeat-y` | background-repeat: repeat-y |
| `bg-repeat-round` | `background-repeat: round` | background-repeat: round |
| `bg-repeat-space` | `background-repeat: space` | background-repeat: space |
| `bg-origin-border` | `background-origin: border-box` | background-origin: border-box |
| `bg-origin-padding` | `background-origin: padding-box` | background-origin: padding-box |
| `bg-origin-content` | `background-origin: content-box` | background-origin: content-box |
| `bg-none` | `background-image: none` | background-image: none |
| `bg-gradient-to-t` | `background-image: linear-gradient(to top, var(--tw-gradient-stops))` | background-image: linear-gradient(to top, var(--tw-gradient-stops)) |
| `bg-gradient-to-tr` | `background-image: linear-gradient(to top right, var(--tw-gradient-stops))` | background-image: linear-gradient(to top right, var(--tw-gradient-stops)) |
| `bg-gradient-to-r` | `background-image: linear-gradient(to right, var(--tw-gradient-stops))` | background-image: linear-gradient(to right, var(--tw-gradient-stops)) |
| `bg-gradient-to-br` | `background-image: linear-gradient(to bottom right, var(--tw-gradient-stops))` | background-image: linear-gradient(to bottom right, var(--tw-gradient-stops)) |
| `bg-gradient-to-b` | `background-image: linear-gradient(to bottom, var(--tw-gradient-stops))` | background-image: linear-gradient(to bottom, var(--tw-gradient-stops)) |
| `bg-gradient-to-bl` | `background-image: linear-gradient(to bottom left, var(--tw-gradient-stops))` | background-image: linear-gradient(to bottom left, var(--tw-gradient-stops)) |
| `bg-gradient-to-l` | `background-image: linear-gradient(to left, var(--tw-gradient-stops))` | background-image: linear-gradient(to left, var(--tw-gradient-stops)) |
| `bg-gradient-to-tl` | `background-image: linear-gradient(to top left, var(--tw-gradient-stops))` | background-image: linear-gradient(to top left, var(--tw-gradient-stops)) |
| `bg-auto` | `background-size: auto` | background-size: auto |
| `bg-cover` | `background-size: cover` | background-size: cover |
| `bg-contain` | `background-size: contain` | background-size: contain |
| `bg-bottom` | `background-position: bottom` | background-position: bottom |
| `bg-center` | `background-position: center` | background-position: center |
| `bg-left` | `background-position: left` | background-position: left |
| `bg-left-bottom` | `background-position: left bottom` | background-position: left bottom |
| `bg-left-top` | `background-position: left top` | background-position: left top |
| `bg-right` | `background-position: right` | background-position: right |
| `bg-right-bottom` | `background-position: right bottom` | background-position: right bottom |
| `bg-right-top` | `background-position: right top` | background-position: right top |
| `bg-top` | `background-position: top` | background-position: top |

---

## Responsive & state variants

Every utility above accepts a responsive prefix (`xxs:` … `5xl:`, `max-md:`, container `@md:`) and — in JIT mode — a state variant (`hover:`, `focus:`, `active:`, `disabled:`, `dark:`, `group-hover:`, `peer-focus:`, …). See [Variants](../VARIANTS.md) and [Responsive](../RESPONSIVE.md).
