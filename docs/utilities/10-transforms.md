---
title: Transform Utilities
---

# Transform Utilities

> Part of the [Nakshora Utilities Reference](../UTILITIES.md). These tables are **generated from the framework source** — what you see here is exactly what the compiler emits.

Scale, rotate and translate. Negative values via the `-` prefix, e.g. `-rotate-45`, `-translate-x-4`. Note: combining transforms (scale + rotate) overrides the previous transform utility — chain with `transform` + CSS variables if you need more.

## Transforms

**158 utilities**

| Class              | CSS                                                                                           | Description      |
| ------------------ | --------------------------------------------------------------------------------------------- | ---------------- |
| `scale-50`         | `transform: scale(0.5)`                                                                       | scale 50%        |
| `scale-75`         | `transform: scale(0.75)`                                                                      | scale 75%        |
| `scale-90`         | `transform: scale(0.9)`                                                                       | scale 90%        |
| `scale-95`         | `transform: scale(0.95)`                                                                      | scale 95%        |
| `scale-100`        | `transform: scale(1)`                                                                         | scale 100%       |
| `scale-105`        | `transform: scale(1.05)`                                                                      | scale 105%       |
| `scale-110`        | `transform: scale(1.1)`                                                                       | scale 110%       |
| `scale-125`        | `transform: scale(1.25)`                                                                      | scale 125%       |
| `scale-150`        | `transform: scale(1.5)`                                                                       | scale 150%       |
| `scale-175`        | `transform: scale(1.75)`                                                                      | scale 175%       |
| `scale-200`        | `transform: scale(2)`                                                                         | scale 200%       |
| `rotate-0`         | `transform: rotate(0deg)`                                                                     | rotate 0deg      |
| `rotate-45`        | `transform: rotate(45deg)`                                                                    | rotate 45deg     |
| `rotate-90`        | `transform: rotate(90deg)`                                                                    | rotate 90deg     |
| `rotate-135`       | `transform: rotate(135deg)`                                                                   | rotate 135deg    |
| `rotate-180`       | `transform: rotate(180deg)`                                                                   | rotate 180deg    |
| `rotate-225`       | `transform: rotate(225deg)`                                                                   | rotate 225deg    |
| `rotate-270`       | `transform: rotate(270deg)`                                                                   | rotate 270deg    |
| `rotate-315`       | `transform: rotate(315deg)`                                                                   | rotate 315deg    |
| `rotate-360`       | `transform: rotate(360deg)`                                                                   | rotate 360deg    |
| `-rotate-45`       | `transform: rotate(-45deg)`                                                                   | rotate -45deg    |
| `-rotate-90`       | `transform: rotate(-90deg)`                                                                   | rotate -90deg    |
| `-rotate-180`      | `transform: rotate(-180deg)`                                                                  | rotate -180deg   |
| `translate-x-0`    | `transform: translateX(0)`                                                                    | translateX       |
| `translate-y-0`    | `transform: translateY(0)`                                                                    | translateY       |
| `-translate-x-0`   | `transform: translateX(calc(-1 * 0))`                                                         | -translateX      |
| `-translate-y-0`   | `transform: translateY(calc(-1 * 0))`                                                         | -translateY      |
| `translate-x-1`    | `transform: translateX(0.25rem)`                                                              | translateX       |
| `translate-y-1`    | `transform: translateY(0.25rem)`                                                              | translateY       |
| `-translate-x-1`   | `transform: translateX(calc(-1 * 0.25rem))`                                                   | -translateX      |
| `-translate-y-1`   | `transform: translateY(calc(-1 * 0.25rem))`                                                   | -translateY      |
| `translate-x-2`    | `transform: translateX(0.5rem)`                                                               | translateX       |
| `translate-y-2`    | `transform: translateY(0.5rem)`                                                               | translateY       |
| `-translate-x-2`   | `transform: translateX(calc(-1 * 0.5rem))`                                                    | -translateX      |
| `-translate-y-2`   | `transform: translateY(calc(-1 * 0.5rem))`                                                    | -translateY      |
| `translate-x-3`    | `transform: translateX(0.75rem)`                                                              | translateX       |
| `translate-y-3`    | `transform: translateY(0.75rem)`                                                              | translateY       |
| `-translate-x-3`   | `transform: translateX(calc(-1 * 0.75rem))`                                                   | -translateX      |
| `-translate-y-3`   | `transform: translateY(calc(-1 * 0.75rem))`                                                   | -translateY      |
| `translate-x-4`    | `transform: translateX(1rem)`                                                                 | translateX       |
| `translate-y-4`    | `transform: translateY(1rem)`                                                                 | translateY       |
| `-translate-x-4`   | `transform: translateX(calc(-1 * 1rem))`                                                      | -translateX      |
| `-translate-y-4`   | `transform: translateY(calc(-1 * 1rem))`                                                      | -translateY      |
| `translate-x-5`    | `transform: translateX(1.25rem)`                                                              | translateX       |
| `translate-y-5`    | `transform: translateY(1.25rem)`                                                              | translateY       |
| `-translate-x-5`   | `transform: translateX(calc(-1 * 1.25rem))`                                                   | -translateX      |
| `-translate-y-5`   | `transform: translateY(calc(-1 * 1.25rem))`                                                   | -translateY      |
| `translate-x-6`    | `transform: translateX(1.5rem)`                                                               | translateX       |
| `translate-y-6`    | `transform: translateY(1.5rem)`                                                               | translateY       |
| `-translate-x-6`   | `transform: translateX(calc(-1 * 1.5rem))`                                                    | -translateX      |
| `-translate-y-6`   | `transform: translateY(calc(-1 * 1.5rem))`                                                    | -translateY      |
| `translate-x-7`    | `transform: translateX(1.75rem)`                                                              | translateX       |
| `translate-y-7`    | `transform: translateY(1.75rem)`                                                              | translateY       |
| `-translate-x-7`   | `transform: translateX(calc(-1 * 1.75rem))`                                                   | -translateX      |
| `-translate-y-7`   | `transform: translateY(calc(-1 * 1.75rem))`                                                   | -translateY      |
| `translate-x-8`    | `transform: translateX(2rem)`                                                                 | translateX       |
| `translate-y-8`    | `transform: translateY(2rem)`                                                                 | translateY       |
| `-translate-x-8`   | `transform: translateX(calc(-1 * 2rem))`                                                      | -translateX      |
| `-translate-y-8`   | `transform: translateY(calc(-1 * 2rem))`                                                      | -translateY      |
| `translate-x-9`    | `transform: translateX(2.25rem)`                                                              | translateX       |
| `translate-y-9`    | `transform: translateY(2.25rem)`                                                              | translateY       |
| `-translate-x-9`   | `transform: translateX(calc(-1 * 2.25rem))`                                                   | -translateX      |
| `-translate-y-9`   | `transform: translateY(calc(-1 * 2.25rem))`                                                   | -translateY      |
| `translate-x-10`   | `transform: translateX(2.5rem)`                                                               | translateX       |
| `translate-y-10`   | `transform: translateY(2.5rem)`                                                               | translateY       |
| `-translate-x-10`  | `transform: translateX(calc(-1 * 2.5rem))`                                                    | -translateX      |
| `-translate-y-10`  | `transform: translateY(calc(-1 * 2.5rem))`                                                    | -translateY      |
| `translate-x-11`   | `transform: translateX(2.75rem)`                                                              | translateX       |
| `translate-y-11`   | `transform: translateY(2.75rem)`                                                              | translateY       |
| `-translate-x-11`  | `transform: translateX(calc(-1 * 2.75rem))`                                                   | -translateX      |
| `-translate-y-11`  | `transform: translateY(calc(-1 * 2.75rem))`                                                   | -translateY      |
| `translate-x-12`   | `transform: translateX(3rem)`                                                                 | translateX       |
| `translate-y-12`   | `transform: translateY(3rem)`                                                                 | translateY       |
| `-translate-x-12`  | `transform: translateX(calc(-1 * 3rem))`                                                      | -translateX      |
| `-translate-y-12`  | `transform: translateY(calc(-1 * 3rem))`                                                      | -translateY      |
| `translate-x-14`   | `transform: translateX(3.5rem)`                                                               | translateX       |
| `translate-y-14`   | `transform: translateY(3.5rem)`                                                               | translateY       |
| `-translate-x-14`  | `transform: translateX(calc(-1 * 3.5rem))`                                                    | -translateX      |
| `-translate-y-14`  | `transform: translateY(calc(-1 * 3.5rem))`                                                    | -translateY      |
| `translate-x-16`   | `transform: translateX(4rem)`                                                                 | translateX       |
| `translate-y-16`   | `transform: translateY(4rem)`                                                                 | translateY       |
| `-translate-x-16`  | `transform: translateX(calc(-1 * 4rem))`                                                      | -translateX      |
| `-translate-y-16`  | `transform: translateY(calc(-1 * 4rem))`                                                      | -translateY      |
| `translate-x-20`   | `transform: translateX(5rem)`                                                                 | translateX       |
| `translate-y-20`   | `transform: translateY(5rem)`                                                                 | translateY       |
| `-translate-x-20`  | `transform: translateX(calc(-1 * 5rem))`                                                      | -translateX      |
| `-translate-y-20`  | `transform: translateY(calc(-1 * 5rem))`                                                      | -translateY      |
| `translate-x-24`   | `transform: translateX(6rem)`                                                                 | translateX       |
| `translate-y-24`   | `transform: translateY(6rem)`                                                                 | translateY       |
| `-translate-x-24`  | `transform: translateX(calc(-1 * 6rem))`                                                      | -translateX      |
| `-translate-y-24`  | `transform: translateY(calc(-1 * 6rem))`                                                      | -translateY      |
| `translate-x-28`   | `transform: translateX(7rem)`                                                                 | translateX       |
| `translate-y-28`   | `transform: translateY(7rem)`                                                                 | translateY       |
| `-translate-x-28`  | `transform: translateX(calc(-1 * 7rem))`                                                      | -translateX      |
| `-translate-y-28`  | `transform: translateY(calc(-1 * 7rem))`                                                      | -translateY      |
| `translate-x-32`   | `transform: translateX(8rem)`                                                                 | translateX       |
| `translate-y-32`   | `transform: translateY(8rem)`                                                                 | translateY       |
| `-translate-x-32`  | `transform: translateX(calc(-1 * 8rem))`                                                      | -translateX      |
| `-translate-y-32`  | `transform: translateY(calc(-1 * 8rem))`                                                      | -translateY      |
| `translate-x-36`   | `transform: translateX(9rem)`                                                                 | translateX       |
| `translate-y-36`   | `transform: translateY(9rem)`                                                                 | translateY       |
| `-translate-x-36`  | `transform: translateX(calc(-1 * 9rem))`                                                      | -translateX      |
| `-translate-y-36`  | `transform: translateY(calc(-1 * 9rem))`                                                      | -translateY      |
| `translate-x-40`   | `transform: translateX(10rem)`                                                                | translateX       |
| `translate-y-40`   | `transform: translateY(10rem)`                                                                | translateY       |
| `-translate-x-40`  | `transform: translateX(calc(-1 * 10rem))`                                                     | -translateX      |
| `-translate-y-40`  | `transform: translateY(calc(-1 * 10rem))`                                                     | -translateY      |
| `translate-x-44`   | `transform: translateX(11rem)`                                                                | translateX       |
| `translate-y-44`   | `transform: translateY(11rem)`                                                                | translateY       |
| `-translate-x-44`  | `transform: translateX(calc(-1 * 11rem))`                                                     | -translateX      |
| `-translate-y-44`  | `transform: translateY(calc(-1 * 11rem))`                                                     | -translateY      |
| `translate-x-48`   | `transform: translateX(12rem)`                                                                | translateX       |
| `translate-y-48`   | `transform: translateY(12rem)`                                                                | translateY       |
| `-translate-x-48`  | `transform: translateX(calc(-1 * 12rem))`                                                     | -translateX      |
| `-translate-y-48`  | `transform: translateY(calc(-1 * 12rem))`                                                     | -translateY      |
| `translate-x-56`   | `transform: translateX(14rem)`                                                                | translateX       |
| `translate-y-56`   | `transform: translateY(14rem)`                                                                | translateY       |
| `-translate-x-56`  | `transform: translateX(calc(-1 * 14rem))`                                                     | -translateX      |
| `-translate-y-56`  | `transform: translateY(calc(-1 * 14rem))`                                                     | -translateY      |
| `translate-x-64`   | `transform: translateX(16rem)`                                                                | translateX       |
| `translate-y-64`   | `transform: translateY(16rem)`                                                                | translateY       |
| `-translate-x-64`  | `transform: translateX(calc(-1 * 16rem))`                                                     | -translateX      |
| `-translate-y-64`  | `transform: translateY(calc(-1 * 16rem))`                                                     | -translateY      |
| `translate-x-72`   | `transform: translateX(18rem)`                                                                | translateX       |
| `translate-y-72`   | `transform: translateY(18rem)`                                                                | translateY       |
| `-translate-x-72`  | `transform: translateX(calc(-1 * 18rem))`                                                     | -translateX      |
| `-translate-y-72`  | `transform: translateY(calc(-1 * 18rem))`                                                     | -translateY      |
| `translate-x-80`   | `transform: translateX(20rem)`                                                                | translateX       |
| `translate-y-80`   | `transform: translateY(20rem)`                                                                | translateY       |
| `-translate-x-80`  | `transform: translateX(calc(-1 * 20rem))`                                                     | -translateX      |
| `-translate-y-80`  | `transform: translateY(calc(-1 * 20rem))`                                                     | -translateY      |
| `translate-x-96`   | `transform: translateX(24rem)`                                                                | translateX       |
| `translate-y-96`   | `transform: translateY(24rem)`                                                                | translateY       |
| `-translate-x-96`  | `transform: translateX(calc(-1 * 24rem))`                                                     | -translateX      |
| `-translate-y-96`  | `transform: translateY(calc(-1 * 24rem))`                                                     | -translateY      |
| `translate-x-px`   | `transform: translateX(1px)`                                                                  | translateX       |
| `translate-y-px`   | `transform: translateY(1px)`                                                                  | translateY       |
| `-translate-x-px`  | `transform: translateX(calc(-1 * 1px))`                                                       | -translateX      |
| `-translate-y-px`  | `transform: translateY(calc(-1 * 1px))`                                                       | -translateY      |
| `translate-x-0.5`  | `transform: translateX(0.125rem)`                                                             | translateX       |
| `translate-y-0.5`  | `transform: translateY(0.125rem)`                                                             | translateY       |
| `-translate-x-0.5` | `transform: translateX(calc(-1 * 0.125rem))`                                                  | -translateX      |
| `-translate-y-0.5` | `transform: translateY(calc(-1 * 0.125rem))`                                                  | -translateY      |
| `translate-x-1.5`  | `transform: translateX(0.375rem)`                                                             | translateX       |
| `translate-y-1.5`  | `transform: translateY(0.375rem)`                                                             | translateY       |
| `-translate-x-1.5` | `transform: translateX(calc(-1 * 0.375rem))`                                                  | -translateX      |
| `-translate-y-1.5` | `transform: translateY(calc(-1 * 0.375rem))`                                                  | -translateY      |
| `translate-x-2.5`  | `transform: translateX(0.625rem)`                                                             | translateX       |
| `translate-y-2.5`  | `transform: translateY(0.625rem)`                                                             | translateY       |
| `-translate-x-2.5` | `transform: translateX(calc(-1 * 0.625rem))`                                                  | -translateX      |
| `-translate-y-2.5` | `transform: translateY(calc(-1 * 0.625rem))`                                                  | -translateY      |
| `translate-x-3.5`  | `transform: translateX(0.875rem)`                                                             | translateX       |
| `translate-y-3.5`  | `transform: translateY(0.875rem)`                                                             | translateY       |
| `-translate-x-3.5` | `transform: translateX(calc(-1 * 0.875rem))`                                                  | -translateX      |
| `-translate-y-3.5` | `transform: translateY(calc(-1 * 0.875rem))`                                                  | -translateY      |
| `transform`        | `transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))` | enable transform |
| `transform-gpu`    | `transform: translate3d(var(--tw-translate-x), var(--tw-translate-y), 0)`                     | GPU transform    |
| `transform-none`   | `transform: none`                                                                             | no transform     |

---

## Responsive & state variants

Every utility above accepts a responsive prefix (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`) and — in JIT mode — a state variant (`hover:`, `focus:`, `active:`, `disabled:`, `dark:`, `group-hover:`, `peer-focus:`, …). See [Variants](../VARIANTS.md) and [Responsive](../RESPONSIVE.md).
