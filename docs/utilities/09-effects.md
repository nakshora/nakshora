---
title: Effect Utilities
---

# Effect Utilities

> Part of the [Nakshora Utilities Reference](../UTILITIES.md). These tables are **generated from the framework source** — what you see here is exactly what the compiler emits.

Shadows, opacity and CSS filters (blur, brightness, grayscale, invert, saturate, drop-shadow, backdrop-*).

## Shadows

**9 utilities**

| Class          | CSS                                                                                     | Description                                                                           |
| -------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `shadow-none`  | `box-shadow: none`                                                                      | box-shadow: none                                                                      |
| `shadow-sm`    | `box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05)`                                           | box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05)                                           |
| `shadow`       | `box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)`           | box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)           |
| `shadow-md`    | `box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`     | box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)     |
| `shadow-lg`    | `box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`   | box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)   |
| `shadow-xl`    | `box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)` | box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) |
| `shadow-2xl`   | `box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25)`                                     | box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25)                                     |
| `shadow-inner` | `box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)`                                     | box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)                                     |
| `shadow-glow`  | `box-shadow: 0 0 20px 0 rgba(59, 130, 246, 0.5)`                                        | box-shadow: 0 0 20px 0 rgba(59, 130, 246, 0.5)                                        |

## Opacity

**15 utilities**

| Class         | CSS             | Description   |
| ------------- | --------------- | ------------- |
| `opacity-0`   | `opacity: 0`    | opacity: 0    |
| `opacity-5`   | `opacity: 0.05` | opacity: 0.05 |
| `opacity-10`  | `opacity: 0.1`  | opacity: 0.1  |
| `opacity-20`  | `opacity: 0.2`  | opacity: 0.2  |
| `opacity-25`  | `opacity: 0.25` | opacity: 0.25 |
| `opacity-30`  | `opacity: 0.3`  | opacity: 0.3  |
| `opacity-40`  | `opacity: 0.4`  | opacity: 0.4  |
| `opacity-50`  | `opacity: 0.5`  | opacity: 0.5  |
| `opacity-60`  | `opacity: 0.6`  | opacity: 0.6  |
| `opacity-70`  | `opacity: 0.7`  | opacity: 0.7  |
| `opacity-75`  | `opacity: 0.75` | opacity: 0.75 |
| `opacity-80`  | `opacity: 0.8`  | opacity: 0.8  |
| `opacity-90`  | `opacity: 0.9`  | opacity: 0.9  |
| `opacity-95`  | `opacity: 0.95` | opacity: 0.95 |
| `opacity-100` | `opacity: 1`    | opacity: 1    |

## Filters

**32 utilities**

| Class                | CSS                                                | Description         |
| -------------------- | -------------------------------------------------- | ------------------- |
| `blur-0`             | `filter: none; backdrop-filter: none`              | no blur             |
| `blur-sm`            | `backdropFilter: blur(4px); filter: blur(4px)`     | backdrop-blur(4px)  |
| `blur`               | `backdropFilter: blur(8px); filter: blur(8px)`     | backdrop-blur(8px)  |
| `blur-md`            | `backdropFilter: blur(12px); filter: blur(12px)`   | backdrop-blur(12px) |
| `blur-lg`            | `backdropFilter: blur(16px); filter: blur(16px)`   | backdrop-blur(16px) |
| `blur-xl`            | `backdropFilter: blur(24px); filter: blur(24px)`   | backdrop-blur(24px) |
| `blur-2xl`           | `backdropFilter: blur(40px); filter: blur(40px)`   | backdrop-blur(40px) |
| `brightness-0`       | `filter: brightness(0)`                            | brightness 0        |
| `brightness-50`      | `filter: brightness(50%)`                          | brightness 50%      |
| `brightness-75`      | `filter: brightness(75%)`                          | brightness 75%      |
| `brightness-90`      | `filter: brightness(90%)`                          | brightness 90%      |
| `brightness-95`      | `filter: brightness(95%)`                          | brightness 95%      |
| `brightness-100`     | `filter: brightness(100%)`                         | brightness 100%     |
| `brightness-105`     | `filter: brightness(105%)`                         | brightness 105%     |
| `brightness-110`     | `filter: brightness(110%)`                         | brightness 110%     |
| `brightness-125`     | `filter: brightness(125%)`                         | brightness 125%     |
| `brightness-150`     | `filter: brightness(150%)`                         | brightness 150%     |
| `brightness-200`     | `filter: brightness(200%)`                         | brightness 200%     |
| `grayscale`          | `filter: grayscale(100%)`                          | grayscale           |
| `invert`             | `filter: invert(100%)`                             | invert colors       |
| `saturate-0`         | `filter: saturate(0)`                              | saturate 0          |
| `saturate-50`        | `filter: saturate(50%)`                            | saturate 50%        |
| `saturate-100`       | `filter: saturate(100%)`                           | saturate 100%       |
| `saturate-150`       | `filter: saturate(150%)`                           | saturate 150%       |
| `saturate-200`       | `filter: saturate(200%)`                           | saturate 200%       |
| `contrast-more`      | `filter: contrast(1.2)`                            | contrast +20%       |
| `contrast-less`      | `filter: contrast(0.8)`                            | contrast -20%       |
| `drop-shadow`        | `filter: drop-shadow(0 1px 2px rgba(0,0,0,0.25))`  | drop shadow         |
| `drop-shadow-lg`     | `filter: drop-shadow(0 10px 15px rgba(0,0,0,0.2))` | large drop shadow   |
| `backdrop-blur`      | `backdrop-filter: blur(8px)`                       | backdrop blur       |
| `backdrop-grayscale` | `backdrop-filter: grayscale(100%)`                 | backdrop grayscale  |
| `backdrop-invert`    | `backdrop-filter: invert(100%)`                    | backdrop invert     |

---

## Responsive & state variants

Every utility above accepts a responsive prefix (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`) and — in JIT mode — a state variant (`hover:`, `focus:`, `active:`, `disabled:`, `dark:`, `group-hover:`, `peer-focus:`, …). See [Variants](../VARIANTS.md) and [Responsive](../RESPONSIVE.md).
