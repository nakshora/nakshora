---
title: Typography Utilities
---

# Typography Utilities

> Part of the [Nakshora Utilities Reference](../UTILITIES.md). These tables are **generated from the framework source** — what you see here is exactly what the compiler emits.

Font size, weight, family, spacing, alignment, transforms and decorations.

## Typography

**52 utilities**

| Class              | CSS                                                                                                               | Description                |
| ------------------ | ----------------------------------------------------------------------------------------------------------------- | -------------------------- |
| `text-xs`          | `font-size: 0.75rem; line-height: 1rem`                                                                           | font-size: 0.75rem         |
| `text-sm`          | `font-size: 0.875rem; line-height: 1.25rem`                                                                       | font-size: 0.875rem        |
| `text-base`        | `font-size: 1rem; line-height: 1.5rem`                                                                            | font-size: 1rem            |
| `text-lg`          | `font-size: 1.125rem; line-height: 1.75rem`                                                                       | font-size: 1.125rem        |
| `text-xl`          | `font-size: 1.25rem; line-height: 1.75rem`                                                                        | font-size: 1.25rem         |
| `text-2xl`         | `font-size: 1.5rem; line-height: 2rem`                                                                            | font-size: 1.5rem          |
| `text-3xl`         | `font-size: 1.875rem; line-height: 2.25rem`                                                                       | font-size: 1.875rem        |
| `text-4xl`         | `font-size: 2.25rem; line-height: 2.5rem`                                                                         | font-size: 2.25rem         |
| `text-5xl`         | `font-size: 3rem; line-height: 1`                                                                                 | font-size: 3rem            |
| `text-6xl`         | `font-size: 3.75rem; line-height: 1`                                                                              | font-size: 3.75rem         |
| `text-7xl`         | `font-size: 4.5rem; line-height: 1`                                                                               | font-size: 4.5rem          |
| `text-8xl`         | `font-size: 6rem; line-height: 1`                                                                                 | font-size: 6rem            |
| `text-9xl`         | `font-size: 8rem; line-height: 1`                                                                                 | font-size: 8rem            |
| `font-thin`        | `font-weight: 100`                                                                                                | font-weight: 100           |
| `font-extralight`  | `font-weight: 200`                                                                                                | font-weight: 200           |
| `font-light`       | `font-weight: 300`                                                                                                | font-weight: 300           |
| `font-normal`      | `font-weight: 400`                                                                                                | font-weight: 400           |
| `font-medium`      | `font-weight: 500`                                                                                                | font-weight: 500           |
| `font-semibold`    | `font-weight: 600`                                                                                                | font-weight: 600           |
| `font-bold`        | `font-weight: 700`                                                                                                | font-weight: 700           |
| `font-extrabold`   | `font-weight: 800`                                                                                                | font-weight: 800           |
| `font-black`       | `font-weight: 900`                                                                                                | font-weight: 900           |
| `font-sans`        | `font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`         | font-family: sans          |
| `font-mono`        | `font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace` | font-family: mono          |
| `leading-none`     | `line-height: 1`                                                                                                  | line-height: 1             |
| `leading-tight`    | `line-height: 1.25`                                                                                               | line-height: 1.25          |
| `leading-snug`     | `line-height: 1.375`                                                                                              | line-height: 1.375         |
| `leading-base`     | `line-height: 1.5`                                                                                                | line-height: 1.5           |
| `leading-relaxed`  | `line-height: 1.625`                                                                                              | line-height: 1.625         |
| `leading-loose`    | `line-height: 2`                                                                                                  | line-height: 2             |
| `tracking-tighter` | `letter-spacing: -0.05em`                                                                                         | letter-spacing: -0.05em    |
| `tracking-tight`   | `letter-spacing: -0.025em`                                                                                        | letter-spacing: -0.025em   |
| `tracking-normal`  | `letter-spacing: 0em`                                                                                             | letter-spacing: 0em        |
| `tracking-wide`    | `letter-spacing: 0.025em`                                                                                         | letter-spacing: 0.025em    |
| `tracking-wider`   | `letter-spacing: 0.05em`                                                                                          | letter-spacing: 0.05em     |
| `tracking-widest`  | `letter-spacing: 0.1em`                                                                                           | letter-spacing: 0.1em      |
| `text-left`        | `text-align: left`                                                                                                | text-align: left           |
| `text-center`      | `text-align: center`                                                                                              | text-align: center         |
| `text-right`       | `text-align: right`                                                                                               | text-align: right          |
| `text-justify`     | `text-align: justify`                                                                                             | text-align: justify        |
| `text-start`       | `text-align: start`                                                                                               | text-align: start          |
| `text-end`         | `text-align: end`                                                                                                 | text-align: end            |
| `uppercase`        | `text-transform: uppercase`                                                                                       | text-transform: uppercase  |
| `lowercase`        | `text-transform: lowercase`                                                                                       | text-transform: lowercase  |
| `capitalize`       | `text-transform: capitalize`                                                                                      | text-transform: capitalize |
| `normal-case`      | `text-transform: none`                                                                                            | text-transform: none       |
| `italic`           | `fontStyle: italic`                                                                                               | italic                     |
| `not-italic`       | `fontStyle: normal`                                                                                               | not-italic                 |
| `truncate`         | `overflow: hidden; text-overflow: ellipsis; whiteSpace: nowrap`                                                   | single-line ellipsis       |
| `text-ellipsis`    | `text-overflow: ellipsis`                                                                                         | text-overflow: ellipsis    |
| `text-clip`        | `text-overflow: clip`                                                                                             | text-overflow: clip        |
| `antialiased`      | `-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale`                                         | font smoothing             |

## Text Decoration

**13 utilities**

| Class                | CSS                                  | Description                        |
| -------------------- | ------------------------------------ | ---------------------------------- |
| `underline`          | `text-decoration-line: underline`    | text-decoration-line: underline    |
| `overline`           | `text-decoration-line: overline`     | text-decoration-line: overline     |
| `line-through`       | `text-decoration-line: line-through` | text-decoration-line: line-through |
| `no-underline`       | `text-decoration-line: none`         | text-decoration-line: none         |
| `decoration-thin`    | `text-decoration-thickness: 1px`     | decoration thickness               |
| `decoration-2`       | `text-decoration-thickness: 2px`     | decoration thickness               |
| `decoration-4`       | `text-decoration-thickness: 4px`     | decoration thickness               |
| `decoration-8`       | `text-decoration-thickness: 8px`     | decoration thickness               |
| `underline-offset-0` | `text-underline-offset: 0px`         | underline offset                   |
| `underline-offset-1` | `text-underline-offset: 1px`         | underline offset                   |
| `underline-offset-2` | `text-underline-offset: 2px`         | underline offset                   |
| `underline-offset-4` | `text-underline-offset: 4px`         | underline offset                   |
| `underline-offset-8` | `text-underline-offset: 8px`         | underline offset                   |

---

## Responsive & state variants

Every utility above accepts a responsive prefix (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`) and — in JIT mode — a state variant (`hover:`, `focus:`, `active:`, `disabled:`, `dark:`, `group-hover:`, `peer-focus:`, …). See [Variants](../VARIANTS.md) and [Responsive](../RESPONSIVE.md).
