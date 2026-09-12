# Nakshora 2.0 - Complete Utilities Reference

Comprehensive guide to all utility classes available in Nakshora 2.0.

---

## 📑 Table of Contents

1. [Display Utilities](#display-utilities)
2. [Spacing Utilities](#spacing-utilities)
3. [Typography Utilities](#typography-utilities)
4. [Color Utilities](#color-utilities)
5. [Layout Utilities](#layout-utilities)
6. [Border Utilities](#border-utilities)
7. [Effects Utilities](#effects-utilities)
8. [Transform Utilities](#transform-utilities)
9. [Transition Utilities](#transition-utilities)
10. [Responsive Utilities](#responsive-utilities)

---

## Display Utilities

### Display Values
```
.block          → display: block
.inline-block   → display: inline-block
.inline         → display: inline
.flex           → display: flex
.grid           → display: grid
.hidden         → display: none
.contents       → display: contents
```

### Position Utilities
```
.static         → position: static
.relative       → position: relative
.absolute       → position: absolute
.fixed          → position: fixed
.sticky         → position: sticky
```

### Z-Index Utilities
```
.z-auto         → z-index: auto
.z-0 through z-50 → z-index: 0 to 50 (increments of 10)
```

---

## Spacing Utilities

### Margin (All Sides)
```
.m-0 through .m-96
.m-1   → margin: 0.25rem (4px)
.m-2   → margin: 0.5rem (8px)
.m-4   → margin: 1rem (16px)
.m-8   → margin: 2rem (32px)
```

### Margin (Directional)
```
.mt-{size}      → margin-top
.mb-{size}      → margin-bottom
.ml-{size}      → margin-left
.mr-{size}      → margin-right
.mx-{size}      → margin-left & margin-right
.my-{size}      → margin-top & margin-bottom
```

### Padding (All Sides)
```
.p-0 through .p-96
.p-1   → padding: 0.25rem (4px)
.p-2   → padding: 0.5rem (8px)
.p-4   → padding: 1rem (16px)
.p-8   → padding: 2rem (32px)
```

### Padding (Directional)
```
.pt-{size}      → padding-top
.pb-{size}      → padding-bottom
.pl-{size}      → padding-left
.pr-{size}      → padding-right
.px-{size}      → padding-left & padding-right
.py-{size}      → padding-top & padding-bottom
```

### Gap (Flexbox/Grid)
```
.gap-0 through .gap-96
Used with flex and grid containers
```

---

## Typography Utilities

### Font Size
```
.text-xs        → 12px
.text-sm        → 14px
.text-base      → 16px (default)
.text-lg        → 18px
.text-xl        → 20px
.text-2xl       → 24px
.text-3xl       → 30px
.text-4xl       → 36px
```

### Font Weight
```
.font-thin      → 100
.font-extralight → 200
.font-light     → 300
.font-normal    → 400 (default)
.font-medium    → 500
.font-semibold  → 600
.font-bold      → 700
.font-extrabold → 800
.font-black     → 900
```

### Text Alignment
```
.text-left      → text-align: left
.text-center    → text-align: center
.text-right     → text-align: right
.text-justify   → text-align: justify
```

### Text Transform
```
.uppercase      → text-transform: uppercase
.lowercase      → text-transform: lowercase
.capitalize     → text-transform: capitalize
```

### Line Height
```
.leading-tight      → line-height: 1.25
.leading-snug       → line-height: 1.375
.leading-normal     → line-height: 1.5 (default)
.leading-relaxed    → line-height: 1.625
.leading-loose      → line-height: 2
```

### Letter Spacing
```
.tracking-tighter   → letter-spacing: -0.05em
.tracking-tight     → letter-spacing: -0.025em
.tracking-normal    → letter-spacing: 0 (default)
.tracking-wide      → letter-spacing: 0.025em
.tracking-wider     → letter-spacing: 0.05em
.tracking-widest    → letter-spacing: 0.1em
```

---

## Color Utilities

### Text Colors
```
.text-{color}-{shade}

Colors: red, blue, green, yellow, purple, pink, orange, 
        teal, indigo, cyan, slate, gray, and more

Shades: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900

Examples:
.text-blue-500      → Blue text
.text-red-600       → Dark red text
.text-green-100     → Light green text
```

### Background Colors
```
.bg-{color}-{shade}

Same colors and shades as text colors

Examples:
.bg-blue-500        → Blue background
.bg-gray-100        → Light gray background
.bg-purple-900      → Dark purple background
```

### Border Colors
```
.border-{color}-{shade}

Same colors and shades as text and background

Examples:
.border-blue-500    → Blue border
.border-red-300     → Light red border
```

### Gradients
```
.bg-gradient-to-r   → Left to right gradient
.bg-gradient-to-l   → Right to left gradient
.bg-gradient-to-b   → Top to bottom gradient
.bg-gradient-to-t   → Bottom to top gradient
.bg-gradient-to-br  → Top-left to bottom-right
.bg-gradient-to-bl  → Top-right to bottom-left
.bg-gradient-to-tr  → Bottom-left to top-right
.bg-gradient-to-tl  → Bottom-right to top-left

.from-{color}-{shade}  → Starting color
.via-{color}-{shade}   → Middle color
.to-{color}-{shade}    → Ending color

Example:
<div class="bg-gradient-to-r from-blue-500 to-purple-600">
```

---

## Layout Utilities

### Flexbox
```
.flex-row           → flex-direction: row
.flex-col           → flex-direction: column
.flex-row-reverse   → flex-direction: row-reverse
.flex-col-reverse   → flex-direction: column-reverse

.flex-wrap          → flex-wrap: wrap
.flex-nowrap        → flex-wrap: nowrap

.justify-start      → justify-content: flex-start
.justify-center     → justify-content: center
.justify-end        → justify-content: flex-end
.justify-between    → justify-content: space-between
.justify-around     → justify-content: space-around
.justify-evenly     → justify-content: space-evenly

.items-start        → align-items: flex-start
.items-center       → align-items: center
.items-end          → align-items: flex-end
.items-stretch      → align-items: stretch
.items-baseline     → align-items: baseline

.content-start      → align-content: flex-start
.content-center     → align-content: center
.content-end        → align-content: flex-end

.flex-1             → flex: 1 1 0%
.flex-auto          → flex: 1 1 auto
.flex-none          → flex: none
```

### Grid
```
.grid               → display: grid

.grid-cols-1        → grid-template-columns: 1 column
.grid-cols-2        → grid-template-columns: 2 columns
.grid-cols-3        → grid-template-columns: 3 columns
.grid-cols-4        → grid-template-columns: 4 columns
.grid-cols-6        → grid-template-columns: 6 columns
.grid-cols-12       → grid-template-columns: 12 columns

.grid-rows-1 through grid-rows-12
.col-span-1 through col-span-12  → Column spanning
.row-span-1 through row-span-12  → Row spanning
```

### Width & Height
```
.w-full             → width: 100%
.w-auto             → width: auto
.w-screen           → width: 100vw
.w-1/2              → width: 50%
.w-1/3              → width: 33.333%
.w-1/4              → width: 25%
.w-{spacing-size}   → Based on spacing scale

.h-full             → height: 100%
.h-auto             → height: auto
.h-screen           → height: 100vh
.h-{spacing-size}   → Based on spacing scale

.min-w-0            → min-width: 0
.max-w-sm           → max-width: 24rem (384px)
.max-w-md           → max-width: 28rem (448px)
.max-w-lg           → max-width: 32rem (512px)
.max-w-2xl          → max-width: 42rem (672px)

.min-h-screen       → min-height: 100vh
.max-h-{size}       → Maximum height
```

### Overflow
```
.overflow-auto      → overflow: auto
.overflow-hidden    → overflow: hidden
.overflow-visible   → overflow: visible
.overflow-scroll    → overflow: scroll
.overflow-x-auto    → overflow-x: auto
.overflow-y-auto    → overflow-y: auto
```

---

## Border Utilities

### Border Width
```
.border             → border-width: 1px
.border-2           → border-width: 2px
.border-4           → border-width: 4px
.border-8           → border-width: 8px
.border-0           → border-width: 0
```

### Border Sides
```
.border-t           → border-top-width: 1px
.border-b           → border-bottom-width: 1px
.border-l           → border-left-width: 1px
.border-r           → border-right-width: 1px
```

### Border Radius
```
.rounded            → border-radius: 0.25rem (4px)
.rounded-sm         → border-radius: 0.125rem (2px)
.rounded-md         → border-radius: 0.375rem (6px)
.rounded-lg         → border-radius: 0.5rem (8px)
.rounded-xl         → border-radius: 0.75rem (12px)
.rounded-2xl        → border-radius: 1rem (16px)
.rounded-full       → border-radius: 9999px (perfect circle)

.rounded-t          → Top corners
.rounded-b          → Bottom corners
.rounded-l          → Left corners
.rounded-r          → Right corners
.rounded-tl         → Top-left corner
.rounded-tr         → Top-right corner
.rounded-bl         → Bottom-left corner
.rounded-br         → Bottom-right corner
```

---

## Effects Utilities

### Box Shadow
```
.shadow-none        → box-shadow: none
.shadow-sm          → Small shadow
.shadow             → Default shadow
.shadow-md          → Medium shadow
.shadow-lg          → Large shadow
.shadow-xl          → Extra large shadow
.shadow-2xl         → 2X extra large shadow
```

### Opacity
```
.opacity-0          → opacity: 0
.opacity-5          → opacity: 0.05
.opacity-10         → opacity: 0.1
.opacity-25         → opacity: 0.25
.opacity-50         → opacity: 0.5
.opacity-75         → opacity: 0.75
.opacity-100        → opacity: 1 (fully opaque)
```

### Blur
```
.blur-0             → filter: blur(0)
.blur-sm            → filter: blur(4px)
.blur               → filter: blur(8px)
.blur-md            → filter: blur(12px)
.blur-lg            → filter: blur(16px)
```

---

## Transform Utilities

### Scale
```
.scale-50           → transform: scale(0.5)
.scale-75           → transform: scale(0.75)
.scale-90           → transform: scale(0.9)
.scale-100          → transform: scale(1) (default)
.scale-110          → transform: scale(1.1)
.scale-125          → transform: scale(1.25)
.scale-150          → transform: scale(1.5)
```

### Rotate
```
.rotate-0           → transform: rotate(0deg)
.rotate-45          → transform: rotate(45deg)
.rotate-90          → transform: rotate(90deg)
.rotate-180         → transform: rotate(180deg)
.rotate-270         → transform: rotate(270deg)
```

### Translate
```
.translate-x-0      → transform: translateX(0)
.translate-x-1      → transform: translateX(0.25rem)
.translate-x-2      → transform: translateX(0.5rem)
.translate-x-{size} → Translate on X axis

.translate-y-0      → transform: translateY(0)
.translate-y-1      → transform: translateY(0.25rem)
.translate-y-{size} → Translate on Y axis
```

---

## Transition Utilities

### Transition
```
.transition         → All properties
.transition-fast    → 100ms duration
.transition-slow    → 300ms duration
```

### Duration
```
.duration-75        → 75ms
.duration-100       → 100ms
.duration-150       → 150ms
.duration-200       → 200ms
.duration-300       → 300ms
.duration-500       → 500ms
.duration-700       → 700ms
.duration-1000      → 1000ms
```

### Easing
```
.ease-linear        → cubic-bezier(0, 0, 1, 1)
.ease-in            → cubic-bezier(0.4, 0, 1, 1)
.ease-out           → cubic-bezier(0, 0, 0.2, 1)
.ease-in-out        → cubic-bezier(0.4, 0, 0.2, 1)
```

---

## Responsive Utilities

### Breakpoint Prefixes

| Breakpoint | Prefix | Min Width |
|------------|--------|-----------|
| Extra Small | (none) | 0px |
| Small | `sm:` | 640px |
| Medium | `md:` | 768px |
| Large | `lg:` | 1024px |
| Extra Large | `xl:` | 1280px |
| 2X Large | `2xl:` | 1536px |

### Examples

```html
<!-- Width changes at different breakpoints -->
<div class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6">
  Responsive width
</div>

<!-- Font size changes at different breakpoints -->
<p class="text-sm md:text-base lg:text-lg">
  Responsive font size
</p>

<!-- Display changes at different breakpoints -->
<nav class="hidden md:flex flex-col lg:flex-row gap-4">
  Navigation items
</nav>

<!-- Padding changes at different breakpoints -->
<div class="p-4 md:p-6 lg:p-8">
  Responsive padding
</div>
```

---

## 🔗 State Variants

### Hover
```html
<button class="bg-blue-500 hover:bg-blue-600">
  Hover to change color
</button>
```

### Focus
```html
<input class="border focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
```

### Active
```html
<a href="#" class="text-blue-600 active:text-blue-800">
  Link
</a>
```

### Disabled
```html
<button disabled class="opacity-50 cursor-not-allowed">
  Disabled
</button>
```

---

## 💡 Tips

1. **Combine utilities**: Stack multiple classes for complex styles
2. **Use responsive prefixes**: Make designs mobile-first
3. **Leverage spacing scale**: Use consistent spacing throughout
4. **Colorful hierarchy**: Use lighter shades for secondary content
5. **Smooth transitions**: Add `.transition` to interactive elements

---

## 📚 Additional Resources

- [Getting Started](GETTING_STARTED.md)
- [Configuration API](API.md)
- [Code Examples](EXAMPLES.md)
- [Themes Guide](THEMES.md)

---

**Build beautiful UIs with Nakshora utilities! 🚀**
