# 🚀 Nakshora CSS Framework v1.0.0 User Guide

**The World's Most Comprehensive CSS Framework**
Created by: Rizwan Rahim Chowdhury
Licensed under MIT Open Source License

---

## Table of Contents

1.  [🌟 Introduction](#-introduction)
    *   [What is Nakshora?](#what-is-nakshora)
    *   [Key Features](#key-features)
2.  [🚀 Getting Started](#-getting-started)
    *   [Installation](#installation)
    *   [Hello World Example](#hello-world-example)
3.  [💡 Core Concepts](#-core-concepts)
    *   [CSS Variables (`:root`)](#css-variables-root)
    *   [Fluid Typography](#fluid-typography)
    *   [Spacing Scale](#spacing-scale)
    *   [Responsive Design](#responsive-design)
    *   [Base Styles & Reset](#base-styles--reset)
4.  [🎨 Color Palettes](#-color-palettes)
    *   [Neon Cyber Palette](#neon-cyber-palette)
    *   [Pastel Dream Palette](#pastel-dream-palette)
    *   [Ultra Minimalist Palette](#ultra-minimalist-palette)
    *   [Nature Inspired Palette](#nature-inspired-palette)
    *   [Brutalist Palette](#brutalist-palette)
5.  [🛠️ Utility Classes](#️-utility-classes)
    *   [Display](#display)
    *   [Flexbox](#flexbox)
    *   [Grid](#grid)
    *   [Spacing (Margin & Padding)](#spacing-margin--padding)
    *   [Typography](#typography)
    *   [Background Colors](#background-colors)
    *   [Text Colors](#text-colors)
    *   [Borders](#borders)
    *   [Shadows](#shadows)
    *   [Glassmorphism](#glassmorphism)
    *   [Neumorphism](#neumorphism)
    *   [Positioning & Z-Index](#positioning--z-index)
    *   [Width & Height](#width--height)
    *   [Overflow](#overflow)
    *   [Transitions & Animations](#transitions--animations)
    *   [Transforms & Hover States](#transforms--hover-states)
    *   [Opacity](#opacity)
    *   [Cursor](#cursor)
    *   [Advanced Utilities](#advanced-utilities)
6.  [📦 Component Classes](#-component-classes)
    *   [Buttons](#buttons)
    *   [Cards](#cards)
    *   [Navbar](#navbar)
    *   [Hero Sections](#hero-sections)
    *   [Modals](#modals)
    *   [Forms](#forms)
    *   [Badges & Pills](#badges--pills)
    *   [Tooltips](#tooltips)
    *   [Progress Bars](#progress-bars)
    *   [Alerts](#alerts)
    *   [Breadcrumbs](#breadcrumbs)
    *   [Pagination](#pagination)
    *   [Tabs](#tabs)
    *   [Accordions](#accordions)
    *   [Dropdowns](#dropdowns)
    *   [Skeleton Loaders](#skeleton-loaders)
    *   [Spinners](#spinners)
7.  [🎨 Thematic Utilities & Components](#-thematic-utilities--components)
    *   [Brutalist Components](#brutalist-components)
    *   [Neon Glow Utilities](#neon-glow-utilities)
    *   [Gradient Utilities](#gradient-utilities)
    *   [Advanced Grid Layouts](#advanced-grid-layouts)
8.  [🔧 Customization](#-customization)
    *   [Overriding CSS Variables](#overriding-css-variables)
9.  [🌐 Contribution](#-contribution)
10. [📄 License](#-license)

---

## 🌟 Introduction

Welcome to **Nakshora CSS Framework v1.0.0**, the world's most comprehensive CSS framework designed to empower developers with a vast array of pre-built styles and utilities. Created by Rizwan Rahim Chowdhury, Nakshora offers a unique blend of modern design paradigms, including vibrant neon, dreamy pastels, stark brutalism, and minimalist aesthetics, all within an intuitive and highly customizable structure.

### What is Nakshora?

Nakshora is a utility-first CSS framework that provides a rich set of pre-defined classes to rapidly build responsive and visually stunning web interfaces. It emphasizes ease of use, maintainability, and flexibility, allowing you to craft unique designs without writing extensive custom CSS.

### Key Features

*   **Diverse Color Palettes**: Explore Neon Cyber, Pastel Dream, Ultra Minimalist, Nature Inspired, and Brutalist themes.
*   **Responsive by Design**: Built-in breakpoints and fluid typography ensure your designs look great on any device.
*   **Comprehensive Utilities**: A wide range of utility classes for layout, spacing, typography, colors, borders, shadows, and more.
*   **Modern Components**: Ready-to-use components like buttons, cards, modals, forms, and navigation elements.
*   **Unique Design Paradigms**: Dedicated classes for Glassmorphism, Neumorphism, Brutalism, and Neon Glow effects.
*   **Advanced Layouts**: Specialized grid layouts for dashboards, holy grails, and masonry.
*   **Animations & Transitions**: Smooth transitions and keyframe animations for dynamic interfaces.
*   **CSS Variable Driven**: Easily customize colors, spacing, and other properties via CSS variables.

---

## 🚀 Getting Started

Getting started with Nakshora is incredibly simple. Just include the CDN link in your HTML, and you're ready to go! No complex build processes or npm installations required.

### Installation

To use Nakshora, add the following `<link>` tag to the `<head>` section of your HTML document:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Nakshora Page</title>
    <!-- Nakshora CSS Framework CDN -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/nakshora/nakshora@main/min.main.css">
    <!-- Your custom styles (optional) -->
    <style>
        /* Add your custom styles here */
    </style>
</head>
<body>
    <!-- Your content goes here -->
</body>
</html>
```

### Hello World Example

Here's a quick example to demonstrate how easy it is to apply Nakshora styles:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nakshora Hello World</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/nakshora/nakshora@main/min.main.css">
</head>
<body class="bg-mono-950 text-mono-white p-8 flex items-center justify-center min-h-screen">
    <div class="card-neon max-w-md text-center p-8">
        <h1 class="text-neon-cyan-400 text-5xl font-bold animate-neonGlow mb-4">Hello, Nakshora!</h1>
        <p class="text-xl text-mono-50">
            This is your first step into a world of powerful and aesthetic web design.
        </p>
        <button class="btn btn-neon mt-6">Get Started</button>
    </div>
</body>
</html>
```

---

## 💡 Core Concepts

Nakshora is built on several core principles and modern CSS features to provide a flexible and powerful development experience.

### CSS Variables (`:root`)

The entire framework leverages CSS Custom Properties (variables) defined in the `:root` pseudo-class. This allows for easy customization and theme management.

**Example of Variables:**

```css
:root {
  /* Neon Cyber Palette */
  --neon-purple-50: hsl(280, 100%, 97%);
  --neon-purple-500: hsl(280, 100%, 55%);
  
  /* Fluid Typography */
  --text-xs: clamp(0.625rem, 0.5rem + 0.25vw, 0.75rem);
  
  /* Spacing Scale */
  --space-1: 0.25rem;
  --space-4: 1rem;
  
  /* Shadows */
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);

  /* Transitions */
  --transition-base: 300ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

You can override these variables in your own CSS to change the entire look and feel of your project. See the [Customization](#-customization) section for more details.

### Fluid Typography

Nakshora utilizes `clamp()` for its typography scale, providing fluid and responsive text sizes that adapt beautifully across different screen widths. This means your text will scale proportionally between a minimum and maximum size, ensuring optimal readability.

**Example:**
`--text-base: clamp(0.875rem, 0.75rem + 0.35vw, 1rem);`
This ensures `text-base` will be at least `0.875rem`, at most `1rem`, and fluidly adjust between those values based on viewport width.

### Spacing Scale

A consistent and intuitive spacing scale is defined using `rem` units for margins and paddings. This ensures uniform spacing throughout your design.

**Example:**
`--space-1: 0.25rem;`
`--space-4: 1rem;`
`--space-16: 4rem;`

These variables are used by classes like `p-4` (padding: `1rem`), `m-8` (margin: `2rem`), `gap-2` (gap: `0.5rem`), etc.

### Responsive Design

Nakshora is built mobile-first, meaning styles are defined for small screens by default, and then overridden for larger screens using media queries.

**Breakpoints:**

| Prefix  | Min-width | Description                           |
| :------ | :-------- | :------------------------------------ |
| `xs:`   | `375px`   | Extra Small screens (e.g., small phones) |
| `sm:`   | `640px`   | Small screens (e.g., large phones, tablets) |
| `md:`   | `768px`   | Medium screens (e.g., tablets, small laptops) |
| `lg:`   | `1024px`  | Large screens (e.g., laptops, desktops) |
| `xl:`   | `1280px`  | Extra Large screens (e.g., larger desktops) |
| `xxl:`  | `1536px`  | Double Extra Large screens            |
| `ultra:`| `1920px`  | Ultra HD / Full HD monitors           |
| `uhd:`  | `2560px`  | Quad HD / 2K monitors                 |
| `k8:`   | `3840px`  | 4K / 8K monitors                      |

**Usage Example:**

```html
<div class="text-base sm:text-lg md:text-xl lg:text-2xl">
    This text changes size based on the screen width.
</div>

<div class="flex-col md:flex-row">
    <!-- This div is a column on small screens, and a row on medium screens and up -->
</div>
```

### Base Styles & Reset

Nakshora includes a lightweight CSS reset to ensure consistent rendering across browsers. It applies `box-sizing: border-box;` globally, removes default margins and paddings, and sets a sensible default font family and line height.

```css
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  line-height: 1.5;
  -webkit-text-size-adjust: 100%;
  -moz-tab-size: 4;
  tab-size: 4;
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

body {
  margin: 0;
  line-height: inherit;
}
```

---

## 🎨 Color Palettes

Nakshora provides five distinct color palettes, each designed to evoke a different aesthetic. All colors are defined using HSL (Hue, Saturation, Lightness) for easy perception and modification.

### Neon Cyber Palette

Vibrant, high-saturation colors perfect for futuristic, cyberpunk, or energetic designs.
All shades from 50 (very light) to 950 (very dark) are available for each color.

*   **Neon Purple**: `hsl(280, 100%, L%)`
    *   `--neon-purple-50` to `--neon-purple-950`
*   **Neon Pink**: `hsl(320, 100%, L%)`
    *   `--neon-pink-50` to `--neon-pink-950`
*   **Neon Cyan**: `hsl(180, 100%, L%)`
    *   `--neon-cyan-50` to `--neon-cyan-950`
*   **Neon Lime**: `hsl(75, 100%, L%)`
    *   `--neon-lime-50` to `--neon-lime-950`
*   **Neon Orange**: `hsl(30, 100%, L%)`
    *   `--neon-orange-50` to `--neon-orange-950`

### Pastel Dream Palette

Soft, muted, and gentle colors ideal for serene, elegant, or childlike designs.
Shades range from 50 to 950.

*   **Pastel Rose**: `hsl(350, S%, L%)` (S changes slightly for darker shades)
    *   `--pastel-rose-50` to `--pastel-rose-950`
*   **Pastel Lavender**: `hsl(270, S%, L%)`
    *   `--pastel-lavender-50` to `--pastel-lavender-950`
*   **Pastel Mint**: `hsl(150, S%, L%)`
    *   `--pastel-mint-50` to `--pastel-mint-950`
*   **Pastel Peach**: `hsl(20, S%, L%)`
    *   `--pastel-peach-50` to `--pastel-peach-950`
*   **Pastel Sky**: `hsl(200, S%, L%)`
    *   `--pastel-sky-50` to `--pastel-sky-950`

### Ultra Minimalist Palette

Monochromatic and near-monochromatic shades for clean, modern, and sophisticated interfaces.

*   **Mono (Grayscale)**: `hsl(0, 0%, L%)`
    *   `--mono-white`, `--mono-50` to `--mono-950`, `--mono-black`
*   **Minimal Ice (Cool Grayscale)**: `hsl(210, 20%, L%)`
    *   `--minimal-ice-50` to `--minimal-ice-950`

### Nature Inspired Palette

Earthy and organic tones reflecting natural landscapes. Shades range from 50 to 950.

*   **Forest**: `hsl(140, S%, L%)`
    *   `--forest-50` to `--forest-950`
*   **Earth**: `hsl(30, S%, L%)`
    *   `--earth-50` to `--earth-950`
*   **Ocean**: `hsl(200, S%, L%)`
    *   `--ocean-50` to `--ocean-950`
*   **Sunset**: `hsl(15, S%, L%)`
    *   `--sunset-50` to `--sunset-950`

### Brutalist Palette

Bold, high-contrast primary colors for a raw, uncompromising aesthetic. Shades range from 50 to 950.

*   **Brutal Red**: `hsl(0, 100%, L%)`
    *   `--brutal-red-50` to `--brutal-red-950`
*   **Brutal Yellow**: `hsl(60, 100%, L%)`
    *   `--brutal-yellow-50` to `--brutal-yellow-950`
*   **Brutal Blue**: `hsl(220, 100%, L%)`
    *   `--brutal-blue-50` to `--brutal-blue-950`

---

## 🛠️ Utility Classes

Nakshora offers a rich set of utility classes for fine-grained control over your elements.

### Display

Control the display behavior of elements.

| Class        | Property          |
| :----------- | :---------------- |
| `.block`     | `display: block;` |
| `.inline-block`| `display: inline-block;` |
| `.inline`    | `display: inline;`|
| `.flex`      | `display: flex;`  |
| `.inline-flex`| `display: inline-flex;` |
| `.grid`      | `display: grid;`  |
| `.inline-grid`| `display: inline-grid;` |
| `.contents`  | `display: contents;` |
| `.hidden`    | `display: none;`  |

### Flexbox

Utilities for Flexbox containers and items.

| Class              | Property              | Description                       |
| :----------------- | :-------------------- | :-------------------------------- |
| `.flex-row`        | `flex-direction: row;`| Items arranged horizontally.      |
| `.flex-row-reverse`| `flex-direction: row-reverse;`| Horizontal, reversed.         |
| `.flex-col`        | `flex-direction: column;`| Items arranged vertically.        |
| `.flex-col-reverse`| `flex-direction: column-reverse;`| Vertical, reversed.         |
| `.flex-wrap`       | `flex-wrap: wrap;`    | Items wrap to next line.          |
| `.flex-wrap-reverse`| `flex-wrap: wrap-reverse;`| Items wrap to previous line.    |
| `.flex-nowrap`     | `flex-wrap: nowrap;`  | Items stay on single line (default). |
| `.items-start`     | `align-items: flex-start;`| Align items to the start of the cross-axis. |
| `.items-end`       | `align-items: flex-end;`| Align items to the end of the cross-axis. |
| `.items-center`    | `align-items: center;`| Align items to the center of the cross-axis. |
| `.items-baseline`  | `align-items: baseline;`| Align items along their baselines. |
| `.items-stretch`   | `align-items: stretch;`| Stretch items to fill the container. |
| `.justify-start`   | `justify-content: flex-start;`| Justify items to the start of the main-axis. |
| `.justify-end`     | `justify-content: flex-end;`| Justify items to the end of the main-axis. |
| `.justify-center`  | `justify-content: center;`| Justify items to the center of the main-axis. |
| `.justify-between` | `justify-content: space-between;`| Distribute items with space between. |
| `.justify-around`  | `justify-content: space-around;`| Distribute items with space around. |
| `.justify-evenly`  | `justify-content: space-evenly;`| Distribute items with equal space around. |
| `.gap-*`           | `gap: var(--space-*);`| Set gap between flex/grid items. (e.g., `gap-4`) |

### Grid

Utilities for Grid containers and items.

| Class           | Property                                  | Description                               |
| :-------------- | :---------------------------------------- | :---------------------------------------- |
| `.grid-cols-N`  | `grid-template-columns: repeat(N, minmax(0, 1fr));` | Create N equally sized columns. (N=1 to 12) |
| `.col-span-N`   | `grid-column: span N / span N;`           | Item spans N columns. (N=1 to 12)         |
| `.col-span-full`| `grid-column: 1 / -1;`                    | Item spans all columns.                   |
| `.gap-*`        | `gap: var(--space-*);`                    | Set gap between flex/grid items. (e.g., `gap-4`) |

**Example:**
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div class="p-4 bg-mono-200">Item 1</div>
    <div class="p-4 bg-mono-200">Item 2</div>
    <div class="p-4 bg-mono-200">Item 3</div>
    <div class="p-4 bg-mono-200 md:col-span-2">Item 4 (spans 2 columns on medium screens)</div>
</div>
```

### Spacing (Margin & Padding)

Nakshora provides a comprehensive spacing scale. Classes for `margin` (`m-`), `margin-x` (`mx-`), `margin-y` (`my-`), `margin-top` (`mt-`), `margin-bottom` (`mb-`), `margin-left` (`ml-`), `margin-right` (`mr-`), and the same for `padding` (`p-`, `px-`, `py-`, `pt-`, `pb-`, `pl-`, `pr-`) are available.

**Syntax:** `[property]-[size]` (e.g., `p-4`, `mx-auto`, `mb-8`)

| Size Class | Value (rem) | Value (px) |
| :--------- | :---------- | :--------- |
| `0`        | `0`         | `0`        |
| `px`       | `1px`       | `1px`      |
| `0-5`      | `0.125`     | `2`        |
| `1`        | `0.25`      | `4`        |
| `1-5`      | `0.375`     | `6`        |
| `2`        | `0.5`       | `8`        |
| `2-5`      | `0.625`     | `10`       |
| `3`        | `0.75`      | `12`       |
| `3-5`      | `0.875`     | `14`       |
| `4`        | `1`         | `16`       |
| ...        | ...         | ...        |
| `96`       | `24`        | `384`      |

`auto` is also available for `margin` (`m-auto`, `mx-auto`, `my-auto`).

**Example:**
```html
<div class="p-4 bg-mono-100 mb-8 mx-auto w-1/2">
    This div has 1rem padding all around, 2rem bottom margin,
    auto left/right margin (to center it), and 50% width.
</div>
```

### Typography

Control text size, weight, style, alignment, transformation, and decoration.

#### Font Size (`font-size`)

Uses fluid typography variables (`--text-*`).

| Class     | Property                   |
| :-------- | :------------------------- |
| `.text-xs`| `font-size: var(--text-xs);`|
| `.text-sm`| `font-size: var(--text-sm);`|
| `.text-base`| `font-size: var(--text-base);`|
| `.text-lg`| `font-size: var(--text-lg);`|
| `.text-xl`| `font-size: var(--text-xl);`|
| `.text-2xl`| `font-size: var(--text-2xl);`|
| `.text-3xl`| `font-size: var(--text-3xl);`|
| `.text-4xl`| `font-size: var(--text-4xl);`|
| `.text-5xl`| `font-size: var(--text-5xl);`|
| `.text-6xl`| `font-size: var(--text-6xl);`|
| `.text-7xl`| `font-size: var(--text-7xl);`|
| `.text-8xl`| `font-size: var(--text-8xl);`|
| `.text-9xl`| `font-size: var(--text-9xl);`|

#### Font Weight (`font-weight`)

| Class         | Property              |
| :------------ | :-------------------- |
| `.font-thin`  | `font-weight: 100;`   |
| `.font-extralight`| `font-weight: 200;` |
| `.font-light` | `font-weight: 300;`   |
| `.font-normal`| `font-weight: 400;`   |
| `.font-medium`| `font-weight: 500;`   |
| `.font-semibold`| `font-weight: 600;` |
| `.font-bold`  | `font-weight: 700;`   |
| `.font-extrabold`| `font-weight: 800;`|
| `.font-black` | `font-weight: 900;`   |

#### Font Style (`font-style`)

| Class         | Property             |
| :------------ | :------------------- |
| `.italic`     | `font-style: italic;`|
| `.not-italic` | `font-style: normal;`|

#### Text Alignment (`text-align`)

| Class          | Property           |
| :------------- | :----------------- |
| `.text-left`   | `text-align: left;`|
| `.text-center` | `text-align: center;`|
| `.text-right`  | `text-align: right;`|
| `.text-justify`| `text-align: justify;`|

#### Text Transform (`text-transform`)

| Class          | Property              |
| :------------- | :-------------------- |
| `.uppercase`   | `text-transform: uppercase;`|
| `.lowercase`   | `text-transform: lowercase;`|
| `.capitalize`  | `text-transform: capitalize;`|
| `.normal-case` | `text-transform: none;`|

#### Text Decoration (`text-decoration`)

| Class          | Property                 |
| :------------- | :----------------------- |
| `.underline`   | `text-decoration: underline;`|
| `.line-through`| `text-decoration: line-through;`|
| `.no-underline`| `text-decoration: none;`|

#### Line Height (`line-height`)

| Class          | Property           |
| :------------- | :----------------- |
| `.leading-none`| `line-height: 1;`  |
| `.leading-tight`| `line-height: 1.25;`|
| `.leading-snug`| `line-height: 1.375;`|
| `.leading-normal`| `line-height: 1.5;`|
| `.leading-relaxed`| `line-height: 1.625;`|
| `.leading-loose`| `line-height: 2;`  |

### Background Colors

Apply background colors using the naming convention `bg-[palette-name]-[shade]`.
Refer to the [Color Palettes](#-color-palettes) section for available palettes and shades.

**Example:**
```html
<div class="bg-neon-purple-500 p-4 text-mono-white">Neon Purple Background</div>
<div class="bg-pastel-mint-300 p-4">Pastel Mint Background</div>
<div class="bg-mono-900 p-4 text-mono-white">Dark Mono Background</div>
<div class="bg-forest-600 p-4 text-mono-white">Forest Green Background</div>
```

### Text Colors

Apply text colors using the naming convention `text-[palette-name]-[shade]`.
Note: Minimalist Ice and Brutalist palettes only have background color utilities, but `mono` palette has both.

**Example:**
```html
<p class="text-neon-cyan-500">This text is Neon Cyan.</p>
<p class="text-mono-700">This text is dark gray.</p>
```

### Borders

Control border width, style, color, and radius.

#### Border Width (`border-width`)

| Class     | Property          |
| :-------- | :---------------- |
| `.border` | `border-width: 1px; border-style: solid;` |
| `.border-0` | `border-width: 0;`|
| `.border-2` | `border-width: 2px; border-style: solid;` |
| `.border-4` | `border-width: 4px; border-style: solid;` |
| `.border-8` | `border-width: 8px; border-style: solid;` |
| `.border-t` | `border-top-width: 1px; border-top-style: solid;` |
| `.border-r` | `border-right-width: 1px; border-right-style: solid;` |
| `.border-b` | `border-bottom-width: 1px; border-bottom-style: solid;` |
| `.border-l` | `border-left-width: 1px; border-left-style: solid;` |

#### Border Style (`border-style`)

| Class         | Property             |
| :------------ | :------------------- |
| `.border-solid`| `border-style: solid;`|
| `.border-dashed`| `border-style: dashed;`|
| `.border-dotted`| `border-style: dotted;`|
| `.border-double`| `border-style: double;`|
| `.border-none`| `border-style: none;`|

#### Border Radius (`border-radius`)

| Class          | Property                   |
| :------------- | :------------------------- |
| `.rounded-none`| `border-radius: var(--radius-none);` |
| `.rounded-sm`  | `border-radius: var(--radius-sm);` |
| `.rounded-md`  | `border-radius: var(--radius-md);` |
| `.rounded-lg`  | `border-radius: var(--radius-lg);` |
| `.rounded-xl`  | `border-radius: var(--radius-xl);` |
| `.rounded-2xl` | `border-radius: var(--radius-2xl);` |
| `.rounded-3xl` | `border-radius: var(--radius-3xl);` |
| `.rounded-full`| `border-radius: var(--radius-full);` |

#### Border Color (`border-color`)

| Class                 | Property                      |
| :-------------------- | :---------------------------- |
| `.border-neon-purple-500`| `border-color: var(--neon-purple-500);`|
| `.border-neon-pink-500`| `border-color: var(--neon-pink-500);`|
| `.border-neon-cyan-500`| `border-color: var(--neon-cyan-500);`|
| `.border-mono-200`    | `border-color: var(--mono-200);`|
| `.border-mono-300`    | `border-color: var(--mono-300);`|
| `.border-mono-400`    | `border-color: var(--mono-400);`|
| `.border-mono-500`    | `border-color: var(--mono-500);`|

**Example:**
```html
<div class="border-2 border-dashed border-neon-cyan-500 rounded-lg p-4">
    A dashed neon cyan border with large rounded corners.
</div>
```

### Shadows

Apply various box-shadow styles.

| Class           | Property             |
| :-------------- | :------------------- |
| `.shadow-xs`    | `box-shadow: var(--shadow-xs);`|
| `.shadow-sm`    | `box-shadow: var(--shadow-sm);`|
| `.shadow-md`    | `box-shadow: var(--shadow-md);`|
| `.shadow-lg`    | `box-shadow: var(--shadow-lg);`|
| `.shadow-xl`    | `box-shadow: var(--shadow-xl);`|
| `.shadow-2xl`   | `box-shadow: var(--shadow-2xl);`|
| `.shadow-inner` | `box-shadow: var(--shadow-inner);`|
| `.shadow-none`  | `box-shadow: var(--shadow-none);`|

**Example:**
```html
<div class="p-8 bg-mono-white shadow-xl rounded-md">
    This box has an extra large shadow.
</div>
```

### Glassmorphism

Apply transparent, blurred backgrounds with subtle borders for a glass effect.

| Class          | Description                                  |
| :------------- | :------------------------------------------- |
| `.glass`       | Default glass effect (md blur).              |
| `.glass-sm`    | Small blur glass effect.                     |
| `.glass-lg`    | Large blur glass effect.                     |
| `.glass-xl`    | Extra-large blur glass effect.               |
| `.glass-dark`  | Darker glass effect, suitable for light backgrounds. |

**CSS Properties for `.glass`:**
```css
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: var(--glass-blur-md);
  -webkit-backdrop-filter: var(--glass-blur-md);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

**Example:**
```html
<div class="glass p-8 rounded-xl text-mono-white">
    <h2 class="text-2xl font-bold">Glassmorphic Card</h2>
    <p class="mt-2">This is a beautiful translucent card with a frosted glass effect.</p>
</div>
```

### Neumorphism

Achieve soft, extruded or embossed UI elements that mimic physical forms. Available in light and dark themes, with inset options.

**Note:** Neumorphism relies on specific background colors to achieve its effect. The `neu-light` classes are designed for a `#e0e5ec` background, and `neu-dark` classes for `#2d3748`.

| Class           | Description                                  |
| :-------------- | :------------------------------------------- |
| `.neu-light`    | Light-themed extruded neumorphic effect.     |
| `.neu-light-inset`| Light-themed embossed neumorphic effect.   |
| `.neu-dark`     | Dark-themed extruded neumorphic effect.      |
| `.neu-dark-inset`| Dark-themed embossed neumorphic effect.    |

**CSS Properties for `.neu-light`:**
```css
.neu-light {
  background: #e0e5ec;
  box-shadow: 9px 9px 16px rgba(163, 177, 198, 0.6), -9px -9px 16px rgba(255, 255, 255, 0.5);
  border-radius: var(--radius-lg);
}
```

**Example:**
```html
<div class="bg-mono-200 p-8 flex gap-8">
    <div class="neu-light p-6 w-40 h-40 flex items-center justify-center">Light Neumorphism</div>
    <div class="neu-light-inset p-6 w-40 h-40 flex items-center justify-center">Light Inset Neumorphism</div>
</div>
<div class="bg-mono-800 p-8 flex gap-8">
    <div class="neu-dark p-6 w-40 h-40 flex items-center justify-center text-mono-white">Dark Neumorphism</div>
    <div class="neu-dark-inset p-6 w-40 h-40 flex items-center justify-center text-mono-white">Dark Inset Neumorphism</div>
</div>
```

### Positioning & Z-Index

Control the positioning context and stack order of elements.

#### Position (`position`)

| Class        | Property          |
| :----------- | :---------------- |
| `.static`    | `position: static;`|
| `.fixed`     | `position: fixed;`|
| `.absolute`  | `position: absolute;`|
| `.relative`  | `position: relative;`|
| `.sticky`    | `position: sticky;`|

#### Inset Properties (`top`, `right`, `bottom`, `left`)

Uses the spacing scale for values.

| Class        | Property          |
| :----------- | :---------------- |
| `.top-0`     | `top: 0;`         |
| `.bottom-1`  | `bottom: var(--space-1);`|
| `.left-4`    | `left: var(--space-4);`|
| `.right-8`   | `right: var(--space-8);`|
| `.inset-0`   | `top: 0; right: 0; bottom: 0; left: 0;`|

#### Z-Index (`z-index`)

| Class           | Property                     |
| :-------------- | :--------------------------- |
| `.z-0`          | `z-index: var(--z-base);`    |
| `.z-10`         | `z-index: 10;`               |
| `.z-20`         | `z-index: 20;`               |
| `.z-30`         | `z-index: 30;`               |
| `.z-40`         | `z-index: 40;`               |
| `.z-50`         | `z-index: 50;`               |
| `.z-dropdown`   | `z-index: var(--z-dropdown);`|
| `.z-sticky`     | `z-index: var(--z-sticky);`  |
| `.z-fixed`      | `z-index: var(--z-fixed);`   |
| `.z-overlay`    | `z-index: var(--z-overlay);` |
| `.z-modal`      | `z-index: var(--z-modal);`   |
| `.z-tooltip`    | `z-index: var(--z-tooltip);` |
| `.z-max`        | `z-index: var(--z-maximum);` |

**Example:**
```html
<div class="relative w-48 h-48 bg-mono-200">
    <div class="absolute top-0 left-0 p-2 bg-brutal-red-500 z-10">Layer 1</div>
    <div class="absolute bottom-0 right-0 p-2 bg-brutal-blue-500 z-20">Layer 2 (above Layer 1)</div>
</div>
```

### Width & Height

Control the dimensions of elements.

#### Width (`width`)

Uses spacing scale variables where applicable.

| Class      | Property           |
| :--------- | :----------------- |
| `.w-0`     | `width: 0;`        |
| `.w-px`    | `width: 1px;`      |
| `.w-auto`  | `width: auto;`     |
| `.w-1`     | `width: var(--space-1);` |
| ...        | ...                |
| `.w-96`    | `width: var(--space-96);` |
| `.w-1-2`   | `width: 50%;`      |
| `.w-1-3`   | `width: 33.333333%;` |
| `.w-full`  | `width: 100%;`     |
| `.w-screen`| `width: 100vw;`    |
| `.w-min`   | `width: min-content;`|
| `.w-max`   | `width: max-content;`|

#### Height (`height`)

Uses spacing scale variables where applicable.

| Class      | Property           |
| :--------- | :----------------- |
| `.h-0`     | `height: 0;`       |
| `.h-px`    | `height: 1px;`     |
| `.h-auto`  | `height: auto;`    |
| `.h-1`     | `height: var(--space-1);` |
| ...        | ...                |
| `.h-96`    | `height: var(--space-96);` |
| `.h-1-2`   | `height: 50%;`     |
| `.h-full`  | `height: 100%;`    |
| `.h-screen`| `height: 100vh;`   |

#### Max Width (`max-width`)

| Class        | Property          |
| :----------- | :---------------- |
| `.max-w-xs`  | `max-width: 20rem;`|
| `.max-w-sm`  | `max-width: 24rem;`|
| `.max-w-md`  | `max-width: 28rem;`|
| `.max-w-lg`  | `max-width: 32rem;`|
| `.max-w-xl`  | `max-width: 36rem;`|
| `.max-w-2xl` | `max-width: 42rem;`|
| `.max-w-3xl` | `max-width: 48rem;`|
| `.max-w-4xl` | `max-width: 56rem;`|
| `.max-w-5xl` | `max-width: 64rem;`|
| `.max-w-6xl` | `max-width: 72rem;`|
| `.max-w-7xl` | `max-width: 80rem;`|
| `.max-w-full`| `max-width: 100%;`|
| `.max-w-screen`| `max-width: 100vw;`|

#### Min Height (`min-height`)

| Class          | Property           |
| :------------- | :----------------- |
| `.min-h-0`     | `min-height: 0;`   |
| `.min-h-full`  | `min-height: 100%;`|
| `.min-h-screen`| `min-height: 100vh;`|

**Example:**
```html
<div class="w-full max-w-md mx-auto h-32 bg-mono-200">
    This div is full width but limited to max-w-md and centered.
</div>
<div class="min-h-screen bg-mono-50">
    This div ensures it fills at least the entire viewport height.
</div>
```

### Overflow

Control how content overflows an element's box.

| Class             | Property          |
| :---------------- | :---------------- |
| `.overflow-auto`  | `overflow: auto;` |
| `.overflow-hidden`| `overflow: hidden;`|
| `.overflow-visible`| `overflow: visible;`|
| `.overflow-scroll`| `overflow: scroll;`|
| `.overflow-x-auto`| `overflow-x: auto;`|
| `.overflow-y-auto`| `overflow-y: auto;`|
| `.overflow-x-hidden`| `overflow-x: hidden;`|
| `.overflow-y-hidden`| `overflow-y: hidden;`|

### Transitions & Animations

Apply smooth transitions and predefined animations.

#### Transitions (`transition`)

Control the duration and timing function of CSS property changes.

| Class           | Property                 |
| :-------------- | :----------------------- |
| `.transition-none`| `transition: none;`      |
| `.transition-all`| `transition: all var(--transition-base);` |
| `.transition-fast`| `transition: all var(--transition-fast);` |
| `.transition-slow`| `transition: all var(--transition-slow);` |
| `.transition-bounce`| `transition: all var(--transition-bounce);` |
| `.transition-colors`| `transition: background-color var(--transition-base), border-color var(--transition-base), color var(--transition-base);` |
| `.transition-opacity`| `transition: opacity var(--transition-base);` |
| `.transition-transform`| `transition: transform var(--transition-base);` |

#### Animations (`animation`)

Apply predefined keyframe animations.

| Class             | Property                      | Description                            |
| :---------------- | :---------------------------- | :------------------------------------- |
| `.animate-fadeIn` | `animation: fadeIn var(--transition-base);` | Fade in from transparent to opaque.    |
| `.animate-fadeOut`| `animation: fadeOut var(--transition-base);`| Fade out from opaque to transparent.   |
| `.animate-slideInUp`| `animation: slideInUp var(--transition-base);`| Slide in from bottom.                  |
| `.animate-slideInDown`| `animation: slideInDown var(--transition-base);`| Slide in from top.                     |
| `.animate-slideInLeft`| `animation: slideInLeft var(--transition-base);`| Slide in from left.                    |
| `.animate-slideInRight`| `animation: slideInRight var(--transition-base);`| Slide in from right.                   |
| `.animate-pulse`  | `animation: pulse 2s ease-in-out infinite;`| Gently fade in and out.                |
| `.animate-bounce` | `animation: bounce 1s infinite;`| Bounce vertically.                     |
| `.animate-spin`   | `animation: spin 1s linear infinite;`| Rotate infinitely.                     |
| `.animate-neonGlow`| `animation: neonGlow 2s ease-in-out infinite;`| Pulsating neon text glow.              |

**Example:**
```html
<button class="bg-neon-purple-500 text-white p-3 rounded-md transition-all hover:scale-110">
    Hover to Scale
</button>

<div class="animate-fadeIn p-4 bg-mono-100">
    This element fades in on load.
</div>

<h2 class="text-3xl font-bold text-neon-cyan-500 animate-neonGlow">
    Glowing Text
</h2>
```

### Transforms & Hover States

Utilities for applying 2D transforms and hover effects.

#### Transforms (`transform`)

| Class           | Property          |
| :-------------- | :---------------- |
| `.transform`    | (Enables transform properties) |
| `.transform-none`| `transform: none;`|

#### Scale (`transform: scale()`)

| Class          | Property                             |
| :------------- | :----------------------------------- |
| `.scale-0`     | `scaleX: 0; scaleY: 0;`              |
| `.scale-50`    | `scaleX: 0.5; scaleY: 0.5;`          |
| ...            | ...                                  |
| `.scale-100`   | `scaleX: 1; scaleY: 1;`              |
| `.scale-105`   | `scaleX: 1.05; scaleY: 1.05;`        |
| `.scale-110`   | `scaleX: 1.1; scaleY: 1.1;`          |
| `.scale-125`   | `scaleX: 1.25; scaleY: 1.25;`        |
| `.scale-150`   | `scaleX: 1.5; scaleY: 1.5;`          |

#### Rotate (`transform: rotate()`)

| Class          | Property            |
| :------------- | :------------------ |
| `.rotate-0`    | `rotate: 0deg;`     |
| `.rotate-45`   | `rotate: 45deg;`    |
| `.rotate-90`   | `rotate: 90deg;`    |
| `.rotate-180`  | `rotate: 180deg;`   |
| `.rotate-270`  | `rotate: 270deg;`   |
| `.-rotate-45`  | `rotate: -45deg;`   |
| `.-rotate-90`  | `rotate: -90deg;`   |
| `.-rotate-180` | `rotate: -180deg;`  |

#### Hover States

Apply transforms or shadows on hover.

| Class              | Property on Hover                      |
| :----------------- | :------------------------------------- |
| `.hover\:scale-105:hover`| `scaleX: 1.05; scaleY: 1.05;`        |
| `.hover\:scale-110:hover`| `scaleX: 1.1; scaleY: 1.1;`          |
| `.hover\:shadow-lg:hover`| `box-shadow: var(--shadow-lg);`      |
| `.hover\:shadow-xl:hover`| `box-shadow: var(--shadow-xl);`      |
| `.hover\:shadow-2xl:hover`| `box-shadow: var(--shadow-2xl);`     |

**Example:**
```html
<div class="w-20 h-20 bg-neon-pink-500 rounded-md transform rotate-45 hover:scale-110 transition-transform"></div>
```

### Opacity

Control the transparency of an element.

| Class          | Property             |
| :------------- | :------------------- |
| `.opacity-0`   | `opacity: 0;`        |
| `.opacity-5`   | `opacity: 0.05;`     |
| ...            | ...                  |
| `.opacity-100` | `opacity: 1;`        |

### Cursor

Change the cursor icon when hovering over an element.

| Class           | Property             |
| :-------------- | :------------------- |
| `.cursor-auto`  | `cursor: auto;`      |
| `.cursor-default`| `cursor: default;`   |
| `.cursor-pointer`| `cursor: pointer;`   |
| `.cursor-wait`  | `cursor: wait;`      |
| `.cursor-text`  | `cursor: text;`      |
| `.cursor-move`  | `cursor: move;`      |
| `.cursor-not-allowed`| `cursor: not-allowed;`|

### Advanced Utilities

These utilities provide more granular control over visual effects and user interactions.

#### Backdrop Filters (`backdrop-filter`)

Apply graphical effects to the area behind an element. Primarily used with transparent or semi-transparent elements, often in conjunction with glassmorphism.

| Class            | Property                  |
| :--------------- | :------------------------ |
| `.backdrop-blur-sm`| `backdrop-filter: blur(4px);`|
| `.backdrop-blur-md`| `backdrop-filter: blur(8px);`|
| `.backdrop-blur-lg`| `backdrop-filter: blur(12px);`|
| `.backdrop-blur-xl`| `backdrop-filter: blur(16px);`|

#### Image Filters (`filter`)

Apply visual effects to an element.

| Class            | Property                  |
| :--------------- | :------------------------ |
| `.grayscale`     | `filter: grayscale(100%);`|
| `.grayscale-0`   | `filter: grayscale(0);`   |
| `.blur-sm`       | `filter: blur(4px);`      |
| `.blur-md`       | `filter: blur(8px);`      |
| `.blur-lg`       | `filter: blur(12px);`     |
| `.brightness-50` | `filter: brightness(0.5);`|
| `.brightness-75` | `filter: brightness(0.75);`|
| `.brightness-100`| `filter: brightness(1);`   |
| `.brightness-125`| `filter: brightness(1.25);`|
| `.brightness-150`| `filter: brightness(1.5);`|
| `.contrast-50`   | `filter: contrast(0.5);`  |
| `.contrast-100`  | `filter: contrast(1);`    |
| `.contrast-125`  | `filter: contrast(1.25);` |
| `.contrast-150`  | `filter: contrast(1.5);`  |
| `.saturate-0`    | `filter: saturate(0);`    |
| `.saturate-50`   | `filter: saturate(0.5);`  |
| `.saturate-100`  | `filter: saturate(1);`    |
| `.saturate-150`  | `filter: saturate(1.5);`  |
| `.saturate-200`  | `filter: saturate(2);`    |

**Example:**
```html
<img src="your-image.jpg" class="w-48 grayscale hover:grayscale-0 transition-all" alt="Grayscale image">
```

#### Object Fit (`object-fit`)

Control how the content of a replaced element (like `<img>` or `<video>`) should be resized to fit its container.

| Class           | Property            |
| :-------------- | :------------------ |
| `.object-contain`| `object-fit: contain;`|
| `.object-cover` | `object-fit: cover;`|
| `.object-fill`  | `object-fit: fill;` |
| `.object-none`  | `object-fit: none;` |

#### Aspect Ratio (`aspect-ratio`)

Set the preferred aspect ratio for an element.

| Class           | Property            |
| :-------------- | :------------------ |
| `.aspect-square`| `aspect-ratio: 1 / 1;`|
| `.aspect-video` | `aspect-ratio: 16 / 9;`|
| `.aspect-auto`  | `aspect-ratio: auto;`|

**Example:**
```html
<div class="w-48 aspect-square bg-mono-200">
    This div maintains a 1:1 aspect ratio.
</div>
```

#### Pointer Events (`pointer-events`)

Control whether an element can be the target of mouse events.

| Class               | Property              |
| :------------------ | :-------------------- |
| `.pointer-events-none`| `pointer-events: none;`|
| `.pointer-events-auto`| `pointer-events: auto;`|

#### User Select (`user-select`)

Control whether the user can select text.

| Class           | Property            |
| :-------------- | :------------------ |
| `.select-none`  | `user-select: none;`|
| `.select-text`  | `user-select: text;`|
| `.select-all`   | `user-select: all;` |

#### Scroll Behavior (`scroll-behavior`)

Control the scrolling behavior for an element when a scroll position is changed.

| Class             | Property              |
| :---------------- | :-------------------- |
| `.scroll-smooth`  | `scroll-behavior: smooth;`|

#### Scroll Snap (`scroll-snap-type`, `scroll-snap-align`)

Create snapping points for scrolling.

| Class             | Property              |
| :---------------- | :-------------------- |
| `.snap-x`         | `scroll-snap-type: x mandatory;`|
| `.snap-y`         | `scroll-snap-type: y mandatory;`|
| `.snap-both`      | `scroll-snap-type: both mandatory;`|
| `.snap-start`     | `scroll-snap-align: start;`|
| `.snap-center`    | `scroll-snap-align: center;`|
| `.snap-end`       | `scroll-snap-align: end;`|

**Example:**
```html
<div class="flex overflow-x-scroll snap-x w-full h-48">
    <div class="flex-none w-full snap-center bg-neon-purple-500 text-white flex items-center justify-center text-4xl">1</div>
    <div class="flex-none w-full snap-center bg-neon-pink-500 text-white flex items-center justify-center text-4xl">2</div>
    <div class="flex-none w-full snap-center bg-neon-cyan-500 text-white flex items-center justify-center text-4xl">3</div>
</div>
```

---

## 📦 Component Classes

Nakshora provides a variety of pre-styled components to accelerate your development.

### Buttons

Buttons with different styles and sizes.

| Class       | Description                       |
| :---------- | :-------------------------------- |
| `.btn`      | Base button style.                |
| `.btn-sm`   | Small button.                     |
| `.btn-lg`   | Large button.                     |
| `.btn-neon` | Neon-themed button with glow.     |
| `.btn-glass`| Glassmorphic button.              |
| `.btn-brutal`| Brutalist button.                 |

**Example:**
```html
<div class="flex gap-4 items-center flex-wrap">
    <button class="btn bg-blue-500 text-white">Default Button</button>
    <button class="btn btn-neon">Neon Button</button>
    <button class="btn btn-glass">Glass Button</button>
    <button class="btn btn-brutal">Brutal Button</button>
    <button class="btn btn-sm btn-neon">Small Neon Button</button>
    <button class="btn btn-lg btn-glass">Large Glass Button</button>
</div>
```

### Cards

Containers for content, with various aesthetic styles.

| Class         | Description                          |
| :------------ | :----------------------------------- |
| `.card`       | Default card with shadow and hover effect. |
| `.card-glass` | Glassmorphic card.                   |
| `.card-neu`   | Light Neumorphic card.               |
| `.card-neon`  | Neon-bordered card with inner glow.  |
| `.card-brutal`| Brutalist card with bold border and shadow. |

**Example:**
```html
<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div class="card">
        <h3 class="text-xl font-bold mb-2">Default Card</h3>
        <p>This is a standard card with a subtle shadow.</p>
    </div>
    <div class="card-glass text-mono-white">
        <h3 class="text-xl font-bold mb-2">Glass Card</h3>
        <p>A transparent, blurred card for modern UIs.</p>
    </div>
    <div class="card-neon text-mono-white">
        <h3 class="text-xl font-bold mb-2">Neon Card</h3>
        <p>A striking card with neon borders and glow.</p>
    </div>
    <div class="card-brutal">
        <h3 class="text-xl font-bold mb-2 brutal-heading">Brutal Card</h3>
        <p>Bold and impactful design for maximum attention.</p>
    </div>
</div>
```

### Navbar

Pre-styled navigation bars.

| Class           | Description                        |
| :-------------- | :--------------------------------- |
| `.navbar`       | Default navbar with shadow.        |
| `.navbar-glass` | Glassmorphic navbar.               |
| `.navbar-brutal`| Brutalist navbar.                  |

**Example:**
```html
<nav class="navbar mb-8">
    <a href="#" class="font-bold text-lg">Nakshora</a>
    <div class="flex gap-4">
        <a href="#" class="text-mono-700 hover:text-neon-cyan-500 transition-colors">Home</a>
        <a href="#" class="text-mono-700 hover:text-neon-cyan-500 transition-colors">About</a>
        <a href="#" class="text-mono-700 hover:text-neon-cyan-500 transition-colors">Services</a>
    </div>
</nav>

<nav class="navbar-glass text-mono-white mb-8">
    <a href="#" class="font-bold text-lg">GlassNav</a>
    <div class="flex gap-4">
        <a href="#" class="hover:text-neon-cyan-200 transition-colors">Home</a>
        <a href="#" class="hover:text-neon-cyan-200 transition-colors">About</a>
    </div>
</nav>
```

### Hero Sections

Large, prominent sections designed for introducing content.

| Class           | Description                          |
| :-------------- | :----------------------------------- |
| `.hero`         | Base hero section styles (min-height, centering, padding). |
| `.hero-gradient`| Hero with a neon gradient background. |
| `.hero-glass`   | Hero with a glassmorphic overlay over a background. |

**Example:**
```html
<section class="hero hero-gradient">
    <div class="max-w-3xl">
        <h1 class="text-5xl font-extrabold mb-4 text-glow-neon-cyan">Welcome to the Future!</h1>
        <p class="text-xl opacity-80 mb-6">Experience cutting-edge design with Nakshora's powerful tools.</p>
        <button class="btn btn-neon btn-lg">Learn More</button>
    </div>
</section>

<!-- For hero-glass, ensure you replace the background image data URI with a real image for better results -->
<section class="hero hero-glass">
    <div class="relative z-10 max-w-3xl text-mono-white">
        <h1 class="text-5xl font-extrabold mb-4">Glassy Innovations</h1>
        <p class="text-xl opacity-80 mb-6">Discover sleek and elegant glassmorphic designs.</p>
        <button class="btn btn-glass btn-lg">Explore</button>
    </div>
</section>
```

### Modals

Overlay content windows for user interaction.

| Class           | Description                          |
| :-------------- | :----------------------------------- |
| `.modal-backdrop`| Full-screen overlay behind the modal. |
| `.modal`        | Default modal container.             |
| `.modal-glass`  | Glassmorphic modal.                  |

**Example:**
```html
<!-- To be used with JavaScript to toggle visibility -->
<div class="modal-backdrop hidden" id="myModal">
    <div class="modal">
        <h3 class="text-2xl font-bold mb-4">Modal Title</h3>
        <p>This is the content of the modal. You can close it by clicking outside or with a button.</p>
        <button class="btn bg-mono-700 text-white mt-6" onclick="document.getElementById('myModal').classList.add('hidden')">Close</button>
    </div>
</div>
<!-- Trigger button -->
<button class="btn btn-neon" onclick="document.getElementById('myModal').classList.remove('hidden')">Open Modal</button>
```

### Forms

Styled input fields, checkboxes, and toggle switches.

| Class           | Description                          |
| :-------------- | :----------------------------------- |
| `.input`        | Default input field.                 |
| `.input-glass`  | Glassmorphic input field.            |
| `.brutal-input` | Brutalist input field.               |
| `.checkbox`     | Styled checkbox.                     |
| `.toggle`       | Styled toggle switch.                |
| `.toggle.active`| State for active toggle switch.      |

**Example:**
```html
<div class="flex flex-col gap-4 max-w-sm">
    <input type="text" placeholder="Your Name" class="input" />
    <input type="email" placeholder="Your Email" class="input-glass text-mono-white" />
    <input type="text" placeholder="Brutalist Input" class="brutal-input" />

    <div class="flex items-center gap-2">
        <input type="checkbox" id="myCheckbox" class="checkbox" />
        <label for="myCheckbox">Remember me</label>
    </div>

    <div class="flex items-center gap-2">
        <div class="toggle active" onclick="this.classList.toggle('active')"></div>
        <span>Toggle Feature</span>
    </div>
</div>
```

### Badges & Pills

Small, informative labels.

| Class         | Description                          |
| :------------ | :----------------------------------- |
| `.badge`      | Default badge.                       |
| `.badge-neon` | Neon-themed badge with glow.         |
| `.badge-pill` | Pill-shaped badge.                   |

**Example:**
```html
<div class="flex gap-2">
    <span class="badge">New</span>
    <span class="badge badge-neon">Pro</span>
    <span class="badge badge-pill bg-pastel-mint-500 text-white">Featured</span>
</div>
```

### Tooltips

Contextual information displayed on hover.

| Class         | Description                          |
| :------------ | :----------------------------------- |
| `.tooltip`    | Container for the tooltip trigger. Requires `data-tooltip` attribute. |

**Example:**
```html
<span class="tooltip cursor-pointer underline" data-tooltip="This is a helpful tip!">
    Hover over me
</span>
```

### Progress Bars

Visual indicators of progress.

| Class           | Description                          |
| :-------------- | :----------------------------------- |
| `.progress`     | Container for the progress bar.      |
| `.progress-bar` | Inner element showing actual progress. |
| `.progress-neon`| Neon-themed progress bar container.  |

**Example:**
```html
<div class="progress mb-4">
    <div class="progress-bar w-1/2"></div> <!-- Width controls progress -->
</div>

<div class="progress progress-neon">
    <div class="progress-bar w-3/4"></div>
</div>
```

### Alerts

Stylized message boxes for user feedback.

| Class           | Description                          |
| :-------------- | :----------------------------------- |
| `.alert`        | Base alert style.                    |
| `.alert-success`| Success message alert.               |
| `.alert-error`  | Error message alert.                 |
| `.alert-warning`| Warning message alert.               |
| `.alert-info`   | Informational message alert.         |

**Example:**
```html
<div class="alert alert-success">
    Operation completed successfully!
</div>
<div class="alert alert-error">
    An error occurred. Please try again.
</div>
```

### Breadcrumbs

Navigation aid showing current page location.

| Class           | Description                          |
| :-------------- | :----------------------------------- |
| `.breadcrumb`   | Container for breadcrumb items.      |
| `.breadcrumb-item`| Individual breadcrumb item.          |

**Example:**
```html
<nav class="breadcrumb">
    <a href="#" class="breadcrumb-item">Home</a>
    <a href="#" class="breadcrumb-item">Products</a>
    <span class="breadcrumb-item">Electronics</span>
</nav>
```

### Pagination

Controls for navigating through paginated content.

| Class            | Description                          |
| :--------------- | :----------------------------------- |
| `.pagination`    | Container for pagination items.      |
| `.pagination-item`| Individual pagination link/button.   |
| `.pagination-item.active`| Active pagination item state.      |

**Example:**
```html
<div class="pagination">
    <span class="pagination-item">&laquo; Previous</span>
    <span class="pagination-item">1</span>
    <span class="pagination-item active">2</span>
    <span class="pagination-item">3</span>
    <span class="pagination-item">Next &raquo;</span>
</div>
```

### Tabs

Content organization using tabbed interfaces.

| Class        | Description                          |
| :----------- | :----------------------------------- |
| `.tabs`      | Container for tab headers.           |
| `.tab`       | Individual tab header.               |
| `.tab.active`| State for the active tab.            |

**Example:**
```html
<div class="tabs">
    <div class="tab active">Tab 1</div>
    <div class="tab">Tab 2</div>
    <div class="tab">Tab 3</div>
</div>
<div class="p-4 border border-t-0 border-mono-200">
    Content for the active tab goes here. (Requires JS for tab switching)
</div>
```

### Accordions

Toggleable content sections.

| Class            | Description                          |
| :--------------- | :----------------------------------- |
| `.accordion`     | Container for accordion items.       |
| `.accordion-item`| Individual accordion section.        |
| `.accordion-header`| Clickable header for an accordion item. |
| `.accordion-content`| Content area of an accordion item.   |
| `.accordion-item.active`| State for an open accordion item.  |

**Example:**
```html
<div class="accordion max-w-lg">
    <div class="accordion-item active">
        <div class="accordion-header">
            Accordion Item 1
            <span>&#9660;</span> <!-- Down arrow -->
        </div>
        <div class="accordion-content">
            <p>This is the content for accordion item 1. It is currently open.</p>
        </div>
    </div>
    <div class="accordion-item">
        <div class="accordion-header">
            Accordion Item 2
            <span>&#9654;</span> <!-- Right arrow -->
        </div>
        <div class="accordion-content">
            <p>This is the content for accordion item 2. It is currently closed.</p>
        </div>
    </div>
</div>
<!-- JavaScript would be needed to toggle the 'active' class on .accordion-item -->
```

### Dropdowns

Toggleable menus attached to a trigger.

| Class           | Description                          |
| :-------------- | :----------------------------------- |
| `.dropdown`     | Container for the dropdown trigger and menu. |
| `.dropdown-menu`| The actual dropdown menu content.    |
| `.dropdown-item`| Individual item within the dropdown menu. |
| `.dropdown-divider`| A visual separator in the dropdown menu. |
| `.dropdown.active`| State for an open dropdown.          |

**Example:**
```html
<div class="dropdown">
    <button class="btn btn-neon" onclick="this.parentNode.classList.toggle('active')">
        Dropdown Menu
    </button>
    <div class="dropdown-menu">
        <a href="#" class="dropdown-item">Action 1</a>
        <a href="#" class="dropdown-item">Action 2</a>
        <div class="dropdown-divider"></div>
        <a href="#" class="dropdown-item">Another Action</a>
    </div>
</div>
```

### Skeleton Loaders

Placeholder elements shown while content is loading.

| Class           | Description                          |
| :-------------- | :----------------------------------- |
| `.skeleton`     | Base skeleton styling with animation. |
| `.skeleton-text`| Skeleton for text lines.             |
| `.skeleton-circle`| Skeleton for circular elements (e.g., avatars). |
| `.skeleton-rect`| Skeleton for rectangular blocks (e.g., images). |

**Example:**
```html
<div class="max-w-sm p-4 bg-mono-white rounded-md shadow-md">
    <div class="flex items-center gap-4 mb-4">
        <div class="skeleton-circle"></div>
        <div class="flex-1">
            <div class="skeleton skeleton-text w-3/4"></div>
            <div class="skeleton skeleton-text w-1/2"></div>
        </div>
    </div>
    <div class="skeleton skeleton-rect h-32 mb-4"></div>
    <div class="skeleton skeleton-text"></div>
    <div class="skeleton skeleton-text w-5/6"></div>
</div>
```

### Spinners

Loading indicators.

| Class           | Description                          |
| :-------------- | :----------------------------------- |
| `.spinner`      | Default spinning loader.             |
| `.spinner-neon` | Neon-themed spinning loader with glow. |

**Example:**
```html
<div class="flex gap-4">
    <div class="spinner"></div>
    <div class="spinner-neon"></div>
</div>
```

---

## 🎨 Thematic Utilities & Components

Beyond the core components, Nakshora offers specialized classes for particular design aesthetics.

### Brutalist Components

These components embody a raw, unrefined aesthetic with bold outlines and strong contrasts.

| Class            | Description                                  |
| :--------------- | :------------------------------------------- |
| `.brutal-input`  | Input field with brutalist styling.          |
| `.brutal-container`| Container with brutalist border and shadow.  |
| `.brutal-heading`| Bold, uppercase heading with text shadow.    |

**Example:**
```html
<div class="brutal-container w-full max-w-lg mx-auto">
    <h2 class="text-3xl brutal-heading text-brutal-blue-700">Brutalist Section Title</h2>
    <p class="mt-4 text-mono-800">This container features a heavy border and an offset shadow, typical of brutalist design.</p>
    <input type="text" placeholder="Enter text here" class="brutal-input mt-4 w-full">
    <button class="btn btn-brutal mt-4">Submit</button>
</div>
```

### Neon Glow Utilities

Add striking neon glow effects to elements and text.

| Class                 | Property                      |
| :-------------------- | :---------------------------- |
| `.glow-neon-purple`   | `box-shadow` with purple neon glow. |
| `.glow-neon-pink`     | `box-shadow` with pink neon glow.   |
| `.glow-neon-cyan`     | `box-shadow` with cyan neon glow.   |
| `.text-glow-neon-purple`| `text-shadow` with purple neon glow. |
| `.text-glow-neon-pink`| `text-shadow` with pink neon glow.   |
| `.text-glow-neon-cyan`| `text-shadow` with cyan neon glow.   |

**Example:**
```html
<div class="p-4 bg-mono-900 rounded-lg glow-neon-cyan text-mono-white">
    <h3 class="text-2xl text-glow-neon-pink font-bold">Awesome Glow Effect!</h3>
    <p>This box and text are radiating with neon energy.</p>
</div>
```

### Gradient Utilities

Predefined background gradients using Nakshora's palettes.

| Class                 | Property                      |
| :-------------------- | :---------------------------- |
| `.bg-gradient-neon`   | Linear gradient using neon purple, pink, cyan. |
| `.bg-gradient-pastel` | Linear gradient using pastel lavender, rose, mint. |
| `.bg-gradient-ocean`  | Linear gradient using ocean colors. |
| `.bg-gradient-sunset` | Linear gradient using sunset colors. |
| `.bg-gradient-forest` | Linear gradient using forest colors. |
| `.bg-gradient-radial-neon`| Radial gradient using neon purple, pink, mono dark. |

**Example:**
```html
<div class="h-32 flex items-center justify-center bg-gradient-neon text-mono-white text-2xl font-bold">
    Neon Gradient
</div>
<div class="h-32 flex items-center justify-center bg-gradient-radial-neon text-mono-white text-2xl font-bold">
    Radial Neon Gradient
</div>
```

### Advanced Grid Layouts

Specialized grid layouts for common web structures.

| Class              | Description                                  |
| :----------------- | :------------------------------------------- |
| `.grid-masonry`    | Responsive masonry layout.                   |
| `.grid-dashboard`  | Two-column layout for dashboards (sidebar & main). |
| `.grid-holy-grail` | Three-column layout (header, left, main, right, footer). |
| `.area-header`     | Assigns element to `header` grid area.       |
| `.area-sidebar`    | Assigns element to `sidebar` grid area.      |
| `.area-main`       | Assigns element to `main` grid area.         |
| `.area-left`       | Assigns element to `left` grid area.         |
| `.area-right`      | Assigns element to `right` grid area.        |
| `.area-footer`     | Assigns element to `footer` grid area.       |

**Example: Dashboard Layout**
```html
<div class="grid-dashboard">
    <header class="area-header bg-mono-700 text-white p-4">Header</header>
    <aside class="area-sidebar bg-mono-800 text-white p-4">Sidebar</aside>
    <main class="area-main bg-mono-100 p-4">Main Content</main>
</div>
```

**Example: Masonry Layout**
```html
<div class="grid-masonry">
    <div class="bg-mono-200 p-4" style="grid-row-end: span 10;">Item 1 (Short)</div>
    <div class="bg-mono-300 p-4" style="grid-row-end: span 20;">Item 2 (Medium)</div>
    <div class="bg-mono-200 p-4" style="grid-row-end: span 15;">Item 3 (Slightly longer)</div>
    <div class="bg-mono-300 p-4" style="grid-row-end: span 25;">Item 4 (Long)</div>
    <div class="bg-mono-200 p-4" style="grid-row-end: span 12;">Item 5</div>
</div>
```

---

## 🔧 Customization

Nakshora is designed with customization in mind, primarily through the use of CSS variables.

### Overriding CSS Variables

You can easily customize any of the framework's default values by redefining the CSS variables in your own stylesheet. This should be done **after** including the Nakshora CDN link, typically in your `<style>` block or a separate `.css` file.

**Example: Changing the Neon Purple color and button transition speed**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Custom Nakshora</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/nakshora/nakshora@main/min.main.css">
    <style>
        /* Override Nakshora variables */
        :root {
            --neon-purple-500: hsl(200, 80%, 50%); /* Change neon purple to a vibrant blue */
            --transition-base: 500ms ease-out;      /* Make transitions slower and different ease */
            --text-base: 1.1rem;                    /* Slightly larger base text */
        }

        /* You can also add your own custom classes */
        .my-custom-element {
            background-color: var(--neon-purple-500); /* Uses the new color */
            padding: var(--space-4);
            border-radius: var(--radius-md);
            color: white;
        }
    </style>
</head>
<body class="bg-mono-950 p-8">
    <h1 class="text-neon-purple-500 text-4xl font-bold mb-4">My Custom Nakshora Page</h1>
    <button class="btn btn-neon mb-4">Button with New Color & Transition</button>
    <div class="my-custom-element">
        This element uses custom styles and overridden Nakshora variables.
    </div>
</body>
</html>
```

By modifying these variables, you can create entirely new themes or subtle adjustments to fit your project's brand.

---

## 🌐 Contribution

Nakshora is an open-source project, and contributions are welcome! If you have ideas for new features, improvements, or bug fixes, please feel free to:

1.  **Fork the repository** on GitHub.
2.  **Create a new branch** (`git checkout -b feature/your-feature-name`).
3.  **Make your changes**.
4.  **Commit your changes** (`git commit -m 'Add new feature'`).
5.  **Push to the branch** (`git push origin feature/your-feature-name`).
6.  **Open a Pull Request** explaining your changes.

---

## 📄 License

Nakshora CSS Framework is licensed under the MIT Open Source License. This means you are free to use, modify, and distribute it for personal or commercial projects. See the `LICENSE` file in the repository for full details.

---
```
