---
title: Background Utilities
---

# Background Utilities

> Part of the [Nakshora Utilities Reference](../UTILITIES.md). These tables are **generated from the framework source** — what you see here is exactly what the compiler emits.

Background position, repeat, size, attachment and linear gradients (`bg-gradient-to-*` + `from-*` / `via-*` / `to-*` stops).

## Backgrounds

**25 utilities**

| Class               | CSS                                                                                                                                      | Description                   |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| `bg-top`            | `background-position: top`                                                                                                               | background-position: top      |
| `bg-left`           | `background-position: left`                                                                                                              | background-position: left     |
| `bg-center`         | `background-position: center`                                                                                                            | background-position: center   |
| `bg-right`          | `background-position: right`                                                                                                             | background-position: right    |
| `bg-bottom`         | `background-position: bottom`                                                                                                            | background-position: bottom   |
| `bg-no-repeat`      | `background-repeat: no-repeat`                                                                                                           | background-repeat: no-repeat  |
| `bg-repeat`         | `background-repeat: repeat`                                                                                                              | background-repeat: repeat     |
| `bg-repeat-x`       | `background-repeat: repeat-x`                                                                                                            | background-repeat: repeat-x   |
| `bg-repeat-y`       | `background-repeat: repeat-y`                                                                                                            | background-repeat: repeat-y   |
| `bg-repeat-round`   | `background-repeat: round`                                                                                                               | background-repeat: round      |
| `bg-repeat-space`   | `background-repeat: space`                                                                                                               | background-repeat: space      |
| `bg-auto`           | `background-size: auto`                                                                                                                  | background-size: auto         |
| `bg-cover`          | `background-size: cover`                                                                                                                 | background-size: cover        |
| `bg-contain`        | `background-size: contain`                                                                                                               | background-size: contain      |
| `bg-fixed`          | `background-attachment: fixed`                                                                                                           | background-attachment: fixed  |
| `bg-local`          | `background-attachment: local`                                                                                                           | background-attachment: local  |
| `bg-scroll`         | `background-attachment: scroll`                                                                                                          | background-attachment: scroll |
| `bg-gradient-to-t`  | `backgroundImage: linear-gradient(to top, var(--tw-gradient-from), var(--tw-gradient-via, transparent), var(--tw-gradient-to))`          | linear gradient to t          |
| `bg-gradient-to-tr` | `backgroundImage: linear-gradient(to top right, var(--tw-gradient-from), var(--tw-gradient-via, transparent), var(--tw-gradient-to))`    | linear gradient to tr         |
| `bg-gradient-to-r`  | `backgroundImage: linear-gradient(to right, var(--tw-gradient-from), var(--tw-gradient-via, transparent), var(--tw-gradient-to))`        | linear gradient to r          |
| `bg-gradient-to-br` | `backgroundImage: linear-gradient(to bottom right, var(--tw-gradient-from), var(--tw-gradient-via, transparent), var(--tw-gradient-to))` | linear gradient to br         |
| `bg-gradient-to-b`  | `backgroundImage: linear-gradient(to bottom, var(--tw-gradient-from), var(--tw-gradient-via, transparent), var(--tw-gradient-to))`       | linear gradient to b          |
| `bg-gradient-to-bl` | `backgroundImage: linear-gradient(to bottom left, var(--tw-gradient-from), var(--tw-gradient-via, transparent), var(--tw-gradient-to))`  | linear gradient to bl         |
| `bg-gradient-to-l`  | `backgroundImage: linear-gradient(to left, var(--tw-gradient-from), var(--tw-gradient-via, transparent), var(--tw-gradient-to))`         | linear gradient to l          |
| `bg-gradient-to-tl` | `backgroundImage: linear-gradient(to top left, var(--tw-gradient-from), var(--tw-gradient-via, transparent), var(--tw-gradient-to))`     | linear gradient to tl         |

---

## Responsive & state variants

Every utility above accepts a responsive prefix (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`) and — in JIT mode — a state variant (`hover:`, `focus:`, `active:`, `disabled:`, `dark:`, `group-hover:`, `peer-focus:`, …). See [Variants](../VARIANTS.md) and [Responsive](../RESPONSIVE.md).
