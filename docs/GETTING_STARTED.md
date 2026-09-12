# Nakshora 2.0 - Getting Started Guide

## 👋 Welcome to Nakshora!

Nakshora is a modern, utility-first CSS framework that lets you build beautiful, responsive designs without leaving your HTML. Get started in 5 minutes!

---

## ⚡ Your First Component

### Basic Button
```html
<button class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
  Click Me
</button>
```

### Card Component
```html
<div class="bg-white rounded-lg shadow-lg p-6 max-w-sm">
  <h2 class="text-2xl font-bold text-gray-900 mb-2">Hello World</h2>
  <p class="text-gray-600 mb-4">Build beautiful UIs with utility classes.</p>
  <a href="#" class="text-blue-500 hover:text-blue-600">Learn more →</a>
</div>
```

### Hero Section
```html
<div class="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
  <div class="text-center">
    <h1 class="text-5xl font-bold text-white mb-4">Welcome to Nakshora</h1>
    <p class="text-xl text-blue-100 mb-8">Build modern web experiences with utility-first CSS</p>
    <button class="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
      Get Started
    </button>
  </div>
</div>
```

---

## 🎨 Understanding Utility Classes

### What are Utility Classes?

Instead of writing custom CSS, you combine predefined utility classes:

```html
<!-- Traditional CSS approach -->
<style>
  .welcome {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background-color: #3b82f6;
    color: white;
  }
</style>
<div class="welcome">Welcome</div>

<!-- Nakshora Utility-First Approach -->
<div class="flex items-center justify-center p-8 bg-blue-500 text-white">
  Welcome
</div>
```

### Key Benefits

✅ **Faster Development** - No need to create CSS files  
✅ **Consistent Design** - Uses predefined design tokens  
✅ **Responsive** - Built-in responsive modifiers  
✅ **Maintainable** - Changes are visible in HTML  
✅ **Scalable** - Easy to manage large projects  

---

## 📱 Responsive Design

### Breakpoint Prefixes

Use breakpoint prefixes to apply styles at different screen sizes:

```html
<!-- Width adapts to screen size -->
<div class="w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
  <p class="text-base md:text-lg lg:text-xl">
    Text size changes on different screens
  </p>
</div>
```

### Available Breakpoints

| Prefix | Screen Size | Min Width |
|--------|-------------|-----------|
| (none) | All screens | 0px |
| `sm:` | Small | 640px |
| `md:` | Medium | 768px |
| `lg:` | Large | 1024px |
| `xl:` | Extra Large | 1280px |
| `2xl:` | 2X Extra Large | 1536px |

### Mobile-First Approach

Always start with mobile styles, then add larger screen modifications:

```html
<!-- Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div class="bg-white p-4 rounded-lg shadow">Card 1</div>
  <div class="bg-white p-4 rounded-lg shadow">Card 2</div>
  <div class="bg-white p-4 rounded-lg shadow">Card 3</div>
</div>
```

---

## 🎯 Common Patterns

### Flexbox Layout
```html
<!-- Centered content -->
<div class="flex items-center justify-center h-screen">
  <div class="text-center">
    <h1 class="text-4xl font-bold">Centered Content</h1>
  </div>
</div>

<!-- Space between items -->
<div class="flex justify-between items-center p-4 bg-white">
  <div>Logo</div>
  <nav class="flex gap-4">
    <a href="#" class="hover:text-blue-500">Home</a>
    <a href="#" class="hover:text-blue-500">About</a>
    <a href="#" class="hover:text-blue-500">Contact</a>
  </nav>
</div>
```

### Grid Layout
```html
<!-- 12-column grid -->
<div class="grid grid-cols-12 gap-4">
  <div class="col-span-8 bg-blue-500 p-4 rounded">Main Content</div>
  <div class="col-span-4 bg-gray-200 p-4 rounded">Sidebar</div>
</div>

<!-- Auto-responsive grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div class="bg-white p-6 rounded-lg shadow">Item 1</div>
  <div class="bg-white p-6 rounded-lg shadow">Item 2</div>
  <div class="bg-white p-6 rounded-lg shadow">Item 3</div>
</div>
```

### Forms
```html
<form class="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
  <div class="mb-4">
    <label class="block text-gray-700 font-semibold mb-2">Email</label>
    <input type="email" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
  </div>
  
  <div class="mb-6">
    <label class="block text-gray-700 font-semibold mb-2">Password</label>
    <input type="password" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
  </div>
  
  <button class="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold transition-colors">
    Sign In
  </button>
</form>
```

### Navigation Bar
```html
<nav class="bg-white shadow-md sticky top-0 z-50">
  <div class="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
    <div class="text-2xl font-bold text-blue-600">Nakshora</div>
    
    <ul class="hidden md:flex gap-6">
      <li><a href="#" class="text-gray-700 hover:text-blue-600 transition-colors">Home</a></li>
      <li><a href="#" class="text-gray-700 hover:text-blue-600 transition-colors">Features</a></li>
      <li><a href="#" class="text-gray-700 hover:text-blue-600 transition-colors">Docs</a></li>
      <li><a href="#" class="text-gray-700 hover:text-blue-600 transition-colors">Contact</a></li>
    </ul>
    
    <button class="md:hidden text-gray-700">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  </div>
</nav>
```

---

## 🎨 Color System

### Using Colors

```html
<!-- Text colors -->
<p class="text-red-500">Error message</p>
<p class="text-green-600">Success message</p>
<p class="text-yellow-400">Warning message</p>

<!-- Background colors -->
<div class="bg-blue-100 p-4">Light blue background</div>

<!-- Border colors -->
<div class="border-2 border-gray-300 p-4">Gray border</div>
```

### Color Shades

Each color has 10 shades (50-900):
- `50` - Lightest
- `100-400` - Light variants
- `500` - Base color
- `600-900` - Dark variants

```html
<div class="bg-blue-50">Lightest blue</div>
<div class="bg-blue-500">Base blue</div>
<div class="bg-blue-900">Darkest blue</div>
```

---

## ✨ Interactive States

### Hover Effects
```html
<button class="bg-blue-500 hover:bg-blue-600 transition-colors">
  Hover me
</button>

<a href="#" class="text-blue-500 hover:text-blue-700 hover:underline">
  Link
</a>
```

### Focus States
```html
<input type="text" class="px-4 py-2 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
```

### Active States
```html
<nav class="flex gap-4">
  <a href="#" class="text-gray-600 hover:text-gray-900">Home</a>
  <a href="#" class="text-blue-600 font-semibold border-b-2 border-blue-600">Active</a>
  <a href="#" class="text-gray-600 hover:text-gray-900">About</a>
</nav>
```

---

## 🔗 Text Utilities

```html
<!-- Font sizes -->
<p class="text-xs">Extra small text</p>
<p class="text-sm">Small text</p>
<p class="text-base">Base text (default)</p>
<p class="text-lg">Large text</p>
<p class="text-xl">Extra large text</p>
<p class="text-2xl">2x Large text</p>

<!-- Font weights -->
<p class="font-thin">Thin</p>
<p class="font-light">Light</p>
<p class="font-normal">Normal</p>
<p class="font-semibold">Semi-bold</p>
<p class="font-bold">Bold</p>
<p class="font-black">Black</p>

<!-- Text alignment -->
<p class="text-left">Left aligned</p>
<p class="text-center">Centered</p>
<p class="text-right">Right aligned</p>

<!-- Text transform -->
<p class="uppercase">UPPERCASE</p>
<p class="lowercase">lowercase</p>
<p class="capitalize">capitalize each word</p>
```

---

## 📐 Spacing Utilities

```html
<!-- Margin -->
<div class="m-4">Margin on all sides</div>
<div class="mx-4">Margin left and right</div>
<div class="my-4">Margin top and bottom</div>
<div class="mt-4 mb-2">Margin top and bottom (different)</div>

<!-- Padding -->
<div class="p-4">Padding on all sides</div>
<div class="px-6 py-3">Padding horizontal and vertical</div>

<!-- Gap (in flex/grid) -->
<div class="flex gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

---

## 🚀 Tips & Tricks

1. **Use negative margins**: Add `-` prefix like `m-[-4]`
2. **Combine utilities**: Stack multiple classes for complex styles
3. **Use CSS variables**: Override theme colors with custom properties
4. **Group hover**: Use `group` and `group-hover:` for parent-child interactions
5. **Dark mode**: Use `dark:` prefix for dark mode styles (when enabled)

---

## 📚 What's Next?

- Read [Utilities Reference](UTILITIES.md) for complete class list
- Explore [Themes](THEMES.md) for design inspiration
- Check [Configuration API](API.md) for customization
- Review [Code Examples](EXAMPLES.md) for more patterns

---

**Start building beautiful web experiences with Nakshora 2.0! 🎉**
