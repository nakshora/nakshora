---
title: Layout Utilities
---

# Layout Utilities

> Part of the [Nakshora Utilities Reference](../UTILITIES.md). These tables are **generated from the framework source** — what you see here is exactly what the compiler emits.

Control how elements are displayed, positioned and stacked in the document flow.

## Display

**9 utilities**

| Class          | CSS                     | Description                                 |
| -------------- | ----------------------- | ------------------------------------------- |
| `block`        | `display: block`        | Block-level element                         |
| `inline-block` | `display: inline-block` | Inline block-level element                  |
| `inline`       | `display: inline`       | Inline element                              |
| `flex`         | `display: flex`         | Flex container                              |
| `inline-flex`  | `display: inline-flex`  | Inline flex container                       |
| `grid`         | `display: grid`         | Grid container                              |
| `inline-grid`  | `display: inline-grid`  | Inline grid container                       |
| `contents`     | `display: contents`     | Element becomes transparent to its children |
| `hidden`       | `display: none`         | Visually hidden (display: none)             |

## Position

**5 utilities**

| Class      | CSS                  | Description        |
| ---------- | -------------------- | ------------------ |
| `static`   | `position: static`   | position: static   |
| `relative` | `position: relative` | position: relative |
| `absolute` | `position: absolute` | position: absolute |
| `fixed`    | `position: fixed`    | position: fixed    |
| `sticky`   | `position: sticky`   | position: sticky   |

## Inset (Offset)

**231 utilities**

| Class         | CSS                      | Description                  |
| ------------- | ------------------------ | ---------------------------- |
| `inset-0`     | `inset: 0`               | inset on all sides           |
| `inset-x-0`   | `inset-inline: 0`        | inset on the horizontal axis |
| `inset-y-0`   | `inset-block: 0`         | inset on the vertical axis   |
| `top-0`       | `top: 0`                 | top offset                   |
| `right-0`     | `right: 0`               | right offset                 |
| `bottom-0`    | `bottom: 0`              | bottom offset                |
| `left-0`      | `left: 0`                | left offset                  |
| `inset-1`     | `inset: 0.25rem`         | inset on all sides           |
| `inset-x-1`   | `inset-inline: 0.25rem`  | inset on the horizontal axis |
| `inset-y-1`   | `inset-block: 0.25rem`   | inset on the vertical axis   |
| `top-1`       | `top: 0.25rem`           | top offset                   |
| `right-1`     | `right: 0.25rem`         | right offset                 |
| `bottom-1`    | `bottom: 0.25rem`        | bottom offset                |
| `left-1`      | `left: 0.25rem`          | left offset                  |
| `inset-2`     | `inset: 0.5rem`          | inset on all sides           |
| `inset-x-2`   | `inset-inline: 0.5rem`   | inset on the horizontal axis |
| `inset-y-2`   | `inset-block: 0.5rem`    | inset on the vertical axis   |
| `top-2`       | `top: 0.5rem`            | top offset                   |
| `right-2`     | `right: 0.5rem`          | right offset                 |
| `bottom-2`    | `bottom: 0.5rem`         | bottom offset                |
| `left-2`      | `left: 0.5rem`           | left offset                  |
| `inset-3`     | `inset: 0.75rem`         | inset on all sides           |
| `inset-x-3`   | `inset-inline: 0.75rem`  | inset on the horizontal axis |
| `inset-y-3`   | `inset-block: 0.75rem`   | inset on the vertical axis   |
| `top-3`       | `top: 0.75rem`           | top offset                   |
| `right-3`     | `right: 0.75rem`         | right offset                 |
| `bottom-3`    | `bottom: 0.75rem`        | bottom offset                |
| `left-3`      | `left: 0.75rem`          | left offset                  |
| `inset-4`     | `inset: 1rem`            | inset on all sides           |
| `inset-x-4`   | `inset-inline: 1rem`     | inset on the horizontal axis |
| `inset-y-4`   | `inset-block: 1rem`      | inset on the vertical axis   |
| `top-4`       | `top: 1rem`              | top offset                   |
| `right-4`     | `right: 1rem`            | right offset                 |
| `bottom-4`    | `bottom: 1rem`           | bottom offset                |
| `left-4`      | `left: 1rem`             | left offset                  |
| `inset-5`     | `inset: 1.25rem`         | inset on all sides           |
| `inset-x-5`   | `inset-inline: 1.25rem`  | inset on the horizontal axis |
| `inset-y-5`   | `inset-block: 1.25rem`   | inset on the vertical axis   |
| `top-5`       | `top: 1.25rem`           | top offset                   |
| `right-5`     | `right: 1.25rem`         | right offset                 |
| `bottom-5`    | `bottom: 1.25rem`        | bottom offset                |
| `left-5`      | `left: 1.25rem`          | left offset                  |
| `inset-6`     | `inset: 1.5rem`          | inset on all sides           |
| `inset-x-6`   | `inset-inline: 1.5rem`   | inset on the horizontal axis |
| `inset-y-6`   | `inset-block: 1.5rem`    | inset on the vertical axis   |
| `top-6`       | `top: 1.5rem`            | top offset                   |
| `right-6`     | `right: 1.5rem`          | right offset                 |
| `bottom-6`    | `bottom: 1.5rem`         | bottom offset                |
| `left-6`      | `left: 1.5rem`           | left offset                  |
| `inset-7`     | `inset: 1.75rem`         | inset on all sides           |
| `inset-x-7`   | `inset-inline: 1.75rem`  | inset on the horizontal axis |
| `inset-y-7`   | `inset-block: 1.75rem`   | inset on the vertical axis   |
| `top-7`       | `top: 1.75rem`           | top offset                   |
| `right-7`     | `right: 1.75rem`         | right offset                 |
| `bottom-7`    | `bottom: 1.75rem`        | bottom offset                |
| `left-7`      | `left: 1.75rem`          | left offset                  |
| `inset-8`     | `inset: 2rem`            | inset on all sides           |
| `inset-x-8`   | `inset-inline: 2rem`     | inset on the horizontal axis |
| `inset-y-8`   | `inset-block: 2rem`      | inset on the vertical axis   |
| `top-8`       | `top: 2rem`              | top offset                   |
| `right-8`     | `right: 2rem`            | right offset                 |
| `bottom-8`    | `bottom: 2rem`           | bottom offset                |
| `left-8`      | `left: 2rem`             | left offset                  |
| `inset-9`     | `inset: 2.25rem`         | inset on all sides           |
| `inset-x-9`   | `inset-inline: 2.25rem`  | inset on the horizontal axis |
| `inset-y-9`   | `inset-block: 2.25rem`   | inset on the vertical axis   |
| `top-9`       | `top: 2.25rem`           | top offset                   |
| `right-9`     | `right: 2.25rem`         | right offset                 |
| `bottom-9`    | `bottom: 2.25rem`        | bottom offset                |
| `left-9`      | `left: 2.25rem`          | left offset                  |
| `inset-10`    | `inset: 2.5rem`          | inset on all sides           |
| `inset-x-10`  | `inset-inline: 2.5rem`   | inset on the horizontal axis |
| `inset-y-10`  | `inset-block: 2.5rem`    | inset on the vertical axis   |
| `top-10`      | `top: 2.5rem`            | top offset                   |
| `right-10`    | `right: 2.5rem`          | right offset                 |
| `bottom-10`   | `bottom: 2.5rem`         | bottom offset                |
| `left-10`     | `left: 2.5rem`           | left offset                  |
| `inset-11`    | `inset: 2.75rem`         | inset on all sides           |
| `inset-x-11`  | `inset-inline: 2.75rem`  | inset on the horizontal axis |
| `inset-y-11`  | `inset-block: 2.75rem`   | inset on the vertical axis   |
| `top-11`      | `top: 2.75rem`           | top offset                   |
| `right-11`    | `right: 2.75rem`         | right offset                 |
| `bottom-11`   | `bottom: 2.75rem`        | bottom offset                |
| `left-11`     | `left: 2.75rem`          | left offset                  |
| `inset-12`    | `inset: 3rem`            | inset on all sides           |
| `inset-x-12`  | `inset-inline: 3rem`     | inset on the horizontal axis |
| `inset-y-12`  | `inset-block: 3rem`      | inset on the vertical axis   |
| `top-12`      | `top: 3rem`              | top offset                   |
| `right-12`    | `right: 3rem`            | right offset                 |
| `bottom-12`   | `bottom: 3rem`           | bottom offset                |
| `left-12`     | `left: 3rem`             | left offset                  |
| `inset-14`    | `inset: 3.5rem`          | inset on all sides           |
| `inset-x-14`  | `inset-inline: 3.5rem`   | inset on the horizontal axis |
| `inset-y-14`  | `inset-block: 3.5rem`    | inset on the vertical axis   |
| `top-14`      | `top: 3.5rem`            | top offset                   |
| `right-14`    | `right: 3.5rem`          | right offset                 |
| `bottom-14`   | `bottom: 3.5rem`         | bottom offset                |
| `left-14`     | `left: 3.5rem`           | left offset                  |
| `inset-16`    | `inset: 4rem`            | inset on all sides           |
| `inset-x-16`  | `inset-inline: 4rem`     | inset on the horizontal axis |
| `inset-y-16`  | `inset-block: 4rem`      | inset on the vertical axis   |
| `top-16`      | `top: 4rem`              | top offset                   |
| `right-16`    | `right: 4rem`            | right offset                 |
| `bottom-16`   | `bottom: 4rem`           | bottom offset                |
| `left-16`     | `left: 4rem`             | left offset                  |
| `inset-20`    | `inset: 5rem`            | inset on all sides           |
| `inset-x-20`  | `inset-inline: 5rem`     | inset on the horizontal axis |
| `inset-y-20`  | `inset-block: 5rem`      | inset on the vertical axis   |
| `top-20`      | `top: 5rem`              | top offset                   |
| `right-20`    | `right: 5rem`            | right offset                 |
| `bottom-20`   | `bottom: 5rem`           | bottom offset                |
| `left-20`     | `left: 5rem`             | left offset                  |
| `inset-24`    | `inset: 6rem`            | inset on all sides           |
| `inset-x-24`  | `inset-inline: 6rem`     | inset on the horizontal axis |
| `inset-y-24`  | `inset-block: 6rem`      | inset on the vertical axis   |
| `top-24`      | `top: 6rem`              | top offset                   |
| `right-24`    | `right: 6rem`            | right offset                 |
| `bottom-24`   | `bottom: 6rem`           | bottom offset                |
| `left-24`     | `left: 6rem`             | left offset                  |
| `inset-28`    | `inset: 7rem`            | inset on all sides           |
| `inset-x-28`  | `inset-inline: 7rem`     | inset on the horizontal axis |
| `inset-y-28`  | `inset-block: 7rem`      | inset on the vertical axis   |
| `top-28`      | `top: 7rem`              | top offset                   |
| `right-28`    | `right: 7rem`            | right offset                 |
| `bottom-28`   | `bottom: 7rem`           | bottom offset                |
| `left-28`     | `left: 7rem`             | left offset                  |
| `inset-32`    | `inset: 8rem`            | inset on all sides           |
| `inset-x-32`  | `inset-inline: 8rem`     | inset on the horizontal axis |
| `inset-y-32`  | `inset-block: 8rem`      | inset on the vertical axis   |
| `top-32`      | `top: 8rem`              | top offset                   |
| `right-32`    | `right: 8rem`            | right offset                 |
| `bottom-32`   | `bottom: 8rem`           | bottom offset                |
| `left-32`     | `left: 8rem`             | left offset                  |
| `inset-36`    | `inset: 9rem`            | inset on all sides           |
| `inset-x-36`  | `inset-inline: 9rem`     | inset on the horizontal axis |
| `inset-y-36`  | `inset-block: 9rem`      | inset on the vertical axis   |
| `top-36`      | `top: 9rem`              | top offset                   |
| `right-36`    | `right: 9rem`            | right offset                 |
| `bottom-36`   | `bottom: 9rem`           | bottom offset                |
| `left-36`     | `left: 9rem`             | left offset                  |
| `inset-40`    | `inset: 10rem`           | inset on all sides           |
| `inset-x-40`  | `inset-inline: 10rem`    | inset on the horizontal axis |
| `inset-y-40`  | `inset-block: 10rem`     | inset on the vertical axis   |
| `top-40`      | `top: 10rem`             | top offset                   |
| `right-40`    | `right: 10rem`           | right offset                 |
| `bottom-40`   | `bottom: 10rem`          | bottom offset                |
| `left-40`     | `left: 10rem`            | left offset                  |
| `inset-44`    | `inset: 11rem`           | inset on all sides           |
| `inset-x-44`  | `inset-inline: 11rem`    | inset on the horizontal axis |
| `inset-y-44`  | `inset-block: 11rem`     | inset on the vertical axis   |
| `top-44`      | `top: 11rem`             | top offset                   |
| `right-44`    | `right: 11rem`           | right offset                 |
| `bottom-44`   | `bottom: 11rem`          | bottom offset                |
| `left-44`     | `left: 11rem`            | left offset                  |
| `inset-48`    | `inset: 12rem`           | inset on all sides           |
| `inset-x-48`  | `inset-inline: 12rem`    | inset on the horizontal axis |
| `inset-y-48`  | `inset-block: 12rem`     | inset on the vertical axis   |
| `top-48`      | `top: 12rem`             | top offset                   |
| `right-48`    | `right: 12rem`           | right offset                 |
| `bottom-48`   | `bottom: 12rem`          | bottom offset                |
| `left-48`     | `left: 12rem`            | left offset                  |
| `inset-56`    | `inset: 14rem`           | inset on all sides           |
| `inset-x-56`  | `inset-inline: 14rem`    | inset on the horizontal axis |
| `inset-y-56`  | `inset-block: 14rem`     | inset on the vertical axis   |
| `top-56`      | `top: 14rem`             | top offset                   |
| `right-56`    | `right: 14rem`           | right offset                 |
| `bottom-56`   | `bottom: 14rem`          | bottom offset                |
| `left-56`     | `left: 14rem`            | left offset                  |
| `inset-64`    | `inset: 16rem`           | inset on all sides           |
| `inset-x-64`  | `inset-inline: 16rem`    | inset on the horizontal axis |
| `inset-y-64`  | `inset-block: 16rem`     | inset on the vertical axis   |
| `top-64`      | `top: 16rem`             | top offset                   |
| `right-64`    | `right: 16rem`           | right offset                 |
| `bottom-64`   | `bottom: 16rem`          | bottom offset                |
| `left-64`     | `left: 16rem`            | left offset                  |
| `inset-72`    | `inset: 18rem`           | inset on all sides           |
| `inset-x-72`  | `inset-inline: 18rem`    | inset on the horizontal axis |
| `inset-y-72`  | `inset-block: 18rem`     | inset on the vertical axis   |
| `top-72`      | `top: 18rem`             | top offset                   |
| `right-72`    | `right: 18rem`           | right offset                 |
| `bottom-72`   | `bottom: 18rem`          | bottom offset                |
| `left-72`     | `left: 18rem`            | left offset                  |
| `inset-80`    | `inset: 20rem`           | inset on all sides           |
| `inset-x-80`  | `inset-inline: 20rem`    | inset on the horizontal axis |
| `inset-y-80`  | `inset-block: 20rem`     | inset on the vertical axis   |
| `top-80`      | `top: 20rem`             | top offset                   |
| `right-80`    | `right: 20rem`           | right offset                 |
| `bottom-80`   | `bottom: 20rem`          | bottom offset                |
| `left-80`     | `left: 20rem`            | left offset                  |
| `inset-96`    | `inset: 24rem`           | inset on all sides           |
| `inset-x-96`  | `inset-inline: 24rem`    | inset on the horizontal axis |
| `inset-y-96`  | `inset-block: 24rem`     | inset on the vertical axis   |
| `top-96`      | `top: 24rem`             | top offset                   |
| `right-96`    | `right: 24rem`           | right offset                 |
| `bottom-96`   | `bottom: 24rem`          | bottom offset                |
| `left-96`     | `left: 24rem`            | left offset                  |
| `inset-px`    | `inset: 1px`             | inset on all sides           |
| `inset-x-px`  | `inset-inline: 1px`      | inset on the horizontal axis |
| `inset-y-px`  | `inset-block: 1px`       | inset on the vertical axis   |
| `top-px`      | `top: 1px`               | top offset                   |
| `right-px`    | `right: 1px`             | right offset                 |
| `bottom-px`   | `bottom: 1px`            | bottom offset                |
| `left-px`     | `left: 1px`              | left offset                  |
| `inset-0.5`   | `inset: 0.125rem`        | inset on all sides           |
| `inset-x-0.5` | `inset-inline: 0.125rem` | inset on the horizontal axis |
| `inset-y-0.5` | `inset-block: 0.125rem`  | inset on the vertical axis   |
| `top-0.5`     | `top: 0.125rem`          | top offset                   |
| `right-0.5`   | `right: 0.125rem`        | right offset                 |
| `bottom-0.5`  | `bottom: 0.125rem`       | bottom offset                |
| `left-0.5`    | `left: 0.125rem`         | left offset                  |
| `inset-1.5`   | `inset: 0.375rem`        | inset on all sides           |
| `inset-x-1.5` | `inset-inline: 0.375rem` | inset on the horizontal axis |
| `inset-y-1.5` | `inset-block: 0.375rem`  | inset on the vertical axis   |
| `top-1.5`     | `top: 0.375rem`          | top offset                   |
| `right-1.5`   | `right: 0.375rem`        | right offset                 |
| `bottom-1.5`  | `bottom: 0.375rem`       | bottom offset                |
| `left-1.5`    | `left: 0.375rem`         | left offset                  |
| `inset-2.5`   | `inset: 0.625rem`        | inset on all sides           |
| `inset-x-2.5` | `inset-inline: 0.625rem` | inset on the horizontal axis |
| `inset-y-2.5` | `inset-block: 0.625rem`  | inset on the vertical axis   |
| `top-2.5`     | `top: 0.625rem`          | top offset                   |
| `right-2.5`   | `right: 0.625rem`        | right offset                 |
| `bottom-2.5`  | `bottom: 0.625rem`       | bottom offset                |
| `left-2.5`    | `left: 0.625rem`         | left offset                  |
| `inset-3.5`   | `inset: 0.875rem`        | inset on all sides           |
| `inset-x-3.5` | `inset-inline: 0.875rem` | inset on the horizontal axis |
| `inset-y-3.5` | `inset-block: 0.875rem`  | inset on the vertical axis   |
| `top-3.5`     | `top: 0.875rem`          | top offset                   |
| `right-3.5`   | `right: 0.875rem`        | right offset                 |
| `bottom-3.5`  | `bottom: 0.875rem`       | bottom offset                |
| `left-3.5`    | `left: 0.875rem`         | left offset                  |

## Stacking (Z-Index)

**8 utilities**

| Class    | CSS             | Description   |
| -------- | --------------- | ------------- |
| `z-0`    | `z-index: 0`    | z-index: 0    |
| `z-10`   | `z-index: 10`   | z-index: 10   |
| `z-20`   | `z-index: 20`   | z-index: 20   |
| `z-30`   | `z-index: 30`   | z-index: 30   |
| `z-40`   | `z-index: 40`   | z-index: 40   |
| `z-50`   | `z-index: 50`   | z-index: 50   |
| `z-auto` | `z-index: auto` | z-index: auto |
| `z-hide` | `z-index: -1`   | z-index: -1   |

## Overflow

**15 utilities**

| Class                | CSS                   | Description         |
| -------------------- | --------------------- | ------------------- |
| `overflow-auto`      | `overflow: auto`      | overflow: auto      |
| `overflow-x-auto`    | `overflow-x: auto`    | overflow-x: auto    |
| `overflow-y-auto`    | `overflow-y: auto`    | overflow-y: auto    |
| `overflow-scroll`    | `overflow: scroll`    | overflow: scroll    |
| `overflow-x-scroll`  | `overflow-x: scroll`  | overflow-x: scroll  |
| `overflow-y-scroll`  | `overflow-y: scroll`  | overflow-y: scroll  |
| `overflow-hidden`    | `overflow: hidden`    | overflow: hidden    |
| `overflow-x-hidden`  | `overflow-x: hidden`  | overflow-x: hidden  |
| `overflow-y-hidden`  | `overflow-y: hidden`  | overflow-y: hidden  |
| `overflow-visible`   | `overflow: visible`   | overflow: visible   |
| `overflow-x-visible` | `overflow-x: visible` | overflow-x: visible |
| `overflow-y-visible` | `overflow-y: visible` | overflow-y: visible |
| `overflow-clip`      | `overflow: clip`      | overflow: clip      |
| `overflow-x-clip`    | `overflow-x: clip`    | overflow-x: clip    |
| `overflow-y-clip`    | `overflow-y: clip`    | overflow-y: clip    |

## Visibility

**4 utilities**

| Class         | CSS                                                                                                                                              | Description                                      |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------ |
| `visible`     | `visibility: visible`                                                                                                                            | visible                                          |
| `invisible`   | `visibility: hidden`                                                                                                                             | invisible                                        |
| `sr-only`     | `position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); whiteSpace: nowrap; border: 0` | Visually hidden but accessible to screen readers |
| `not-sr-only` | `position: static; width: auto; height: auto; padding: 0; margin: 0; overflow: visible; clip: auto; whiteSpace: normal`                          | Restore an sr-only element                       |

---

## Responsive & state variants

Every utility above accepts a responsive prefix (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`) and — in JIT mode — a state variant (`hover:`, `focus:`, `active:`, `disabled:`, `dark:`, `group-hover:`, `peer-focus:`, …). See [Variants](../VARIANTS.md) and [Responsive](../RESPONSIVE.md).
