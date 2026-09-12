# Nakshora 2.0 - Code Examples

Real-world examples and patterns for building with Nakshora.

---

## 📑 Table of Contents

1. [Common Components](#common-components)
2. [Page Layouts](#page-layouts)
3. [Interactive Patterns](#interactive-patterns)
4. [Advanced Patterns](#advanced-patterns)

---

## Common Components

### Button Variants

```html
<!-- Primary Button -->
<button class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md">
  Primary
</button>

<!-- Secondary Button -->
<button class="px-6 py-3 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300 transition-colors">
  Secondary
</button>

<!-- Danger Button -->
<button class="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors">
  Delete
</button>

<!-- Outline Button -->
<button class="px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors">
  Outline
</button>

<!-- Small Button -->
<button class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
  Small
</button>

<!-- Large Button -->
<button class="px-8 py-4 text-lg bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
  Large
</button>

<!-- Button with Icon -->
<button class="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10.5 1.5H3.75A2.25 2.25 0 001.5 3.75v12.5A2.25 2.25 0 003.75 18.5h12.5a2.25 2.25 0 002.25-2.25V9.5" />
  </svg>
  Download
</button>

<!-- Disabled Button -->
<button disabled class="px-6 py-3 bg-gray-400 text-white font-semibold rounded-lg cursor-not-allowed opacity-60">
  Disabled
</button>
```

### Card Components

```html
<!-- Basic Card -->
<div class="bg-white rounded-lg shadow-md p-6">
  <h3 class="text-xl font-bold text-gray-900 mb-2">Card Title</h3>
  <p class="text-gray-600 mb-4">Card description goes here.</p>
  <a href="#" class="text-blue-600 hover:text-blue-700 font-semibold">Learn more →</a>
</div>

<!-- Card with Image -->
<div class="bg-white rounded-lg shadow-lg overflow-hidden max-w-sm">
  <img src="image.jpg" alt="Card image" class="w-full h-48 object-cover">
  <div class="p-6">
    <h3 class="text-xl font-bold text-gray-900 mb-2">Product Name</h3>
    <p class="text-gray-600 mb-4">Product description with details.</p>
    <button class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
      Add to Cart
    </button>
  </div>
</div>

<!-- Horizontal Card -->
<div class="flex bg-white rounded-lg shadow-md overflow-hidden">
  <img src="image.jpg" alt="Card image" class="w-24 h-24 object-cover">
  <div class="p-4 flex-1">
    <h3 class="font-bold text-gray-900">Card Title</h3>
    <p class="text-sm text-gray-600">Description text here.</p>
  </div>
</div>

<!-- Feature Card -->
<div class="text-center p-8 bg-white rounded-lg shadow-md">
  <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
    <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  </div>
  <h3 class="text-lg font-bold text-gray-900 mb-2">Feature Name</h3>
  <p class="text-gray-600">Feature description and benefits go here.</p>
</div>
```

### Badge & Tags

```html
<!-- Badge Default -->
<span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
  Badge
</span>

<!-- Badge Primary -->
<span class="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full">
  Primary
</span>

<!-- Badge Success -->
<span class="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
  Success
</span>

<!-- Badge Danger -->
<span class="px-3 py-1 bg-red-100 text-red-800 text-sm font-semibold rounded-full">
  Danger
</span>

<!-- Tag with Icon -->
<span class="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
  </svg>
  Upload
</span>
```

---

## Page Layouts

### Landing Page Hero

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="nakshora.min.css">
</head>
<body>
  <!-- Hero Section -->
  <section class="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center">
    <div class="max-w-6xl mx-auto px-4 py-20 text-center">
      <h1 class="text-5xl md:text-6xl font-black text-white mb-6">
        Build Amazing Websites Fast
      </h1>
      <p class="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
        Nakshora is the most advanced utility-first CSS framework for modern web development
      </p>
      <div class="flex gap-4 justify-center">
        <button class="px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-lg">
          Get Started
        </button>
        <button class="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors">
          Learn More
        </button>
      </div>
    </div>
  </section>

  <!-- Features Section -->
  <section class="py-20 px-4 bg-white">
    <div class="max-w-6xl mx-auto">
      <h2 class="text-4xl font-bold text-center text-gray-900 mb-12">Key Features</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Feature 1 -->
        <div class="text-center">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">Ultra Fast</h3>
          <p class="text-gray-600">Lightning-fast CSS generation and minimal bundle size.</p>
        </div>
        <!-- Feature 2 -->
        <div class="text-center">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">Highly Customizable</h3>
          <p class="text-gray-600">Configure every aspect with TypeScript configuration.</p>
        </div>
        <!-- Feature 3 -->
        <div class="text-center">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">Fully Responsive</h3>
          <p class="text-gray-600">Mobile-first approach with 6 responsive breakpoints.</p>
        </div>
      </div>
    </div>
  </section>
</body>
</html>
```

### Dashboard Layout

```html
<div class="flex h-screen bg-gray-100">
  <!-- Sidebar -->
  <aside class="w-64 bg-gray-900 text-white p-6">
    <h1 class="text-2xl font-bold mb-8">Dashboard</h1>
    <nav class="space-y-4">
      <a href="#" class="block px-4 py-2 bg-blue-600 rounded-lg">Dashboard</a>
      <a href="#" class="block px-4 py-2 hover:bg-gray-800 rounded-lg">Analytics</a>
      <a href="#" class="block px-4 py-2 hover:bg-gray-800 rounded-lg">Reports</a>
      <a href="#" class="block px-4 py-2 hover:bg-gray-800 rounded-lg">Settings</a>
    </nav>
  </aside>

  <!-- Main Content -->
  <div class="flex-1 overflow-auto">
    <!-- Header -->
    <header class="bg-white shadow-sm p-6 flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900">Welcome Back</h2>
      <div class="flex items-center gap-4">
        <input type="text" placeholder="Search..." class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
        <button class="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center">U</button>
      </div>
    </header>

    <!-- Content -->
    <main class="p-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white p-6 rounded-lg shadow-sm">
          <p class="text-gray-500 text-sm mb-2">Total Users</p>
          <p class="text-3xl font-bold text-gray-900">12,345</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-sm">
          <p class="text-gray-500 text-sm mb-2">Revenue</p>
          <p class="text-3xl font-bold text-gray-900">$45,678</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-sm">
          <p class="text-gray-500 text-sm mb-2">Growth</p>
          <p class="text-3xl font-bold text-green-600">+23%</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-sm">
          <p class="text-gray-500 text-sm mb-2">Conversion</p>
          <p class="text-3xl font-bold text-gray-900">3.2%</p>
        </div>
      </div>
    </main>
  </div>
</div>
```

---

## Interactive Patterns

### Dropdown Menu

```html
<div class="relative inline-block">
  <button class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
    Menu
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  </button>
  
  <div class="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden hover:block">
    <a href="#" class="block px-4 py-2 hover:bg-gray-100">Option 1</a>
    <a href="#" class="block px-4 py-2 hover:bg-gray-100">Option 2</a>
    <a href="#" class="block px-4 py-2 hover:bg-gray-100">Option 3</a>
  </div>
</div>
```

### Modal Dialog

```html
<!-- Modal Backdrop -->
<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
  <!-- Modal Container -->
  <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold text-gray-900">Confirm Action</h2>
      <button class="text-gray-500 hover:text-gray-700">✕</button>
    </div>
    
    <p class="text-gray-600 mb-6">Are you sure you want to proceed with this action?</p>
    
    <div class="flex gap-4">
      <button class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
        Cancel
      </button>
      <button class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
        Delete
      </button>
    </div>
  </div>
</div>
```

---

## Advanced Patterns

### Gradient Background with Animation

```html
<div class="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-blue-800 animate-pulse flex items-center justify-center">
  <div class="text-center text-white">
    <h1 class="text-5xl font-black mb-4">Animated Background</h1>
    <p class="text-xl opacity-90">Beautiful gradient with smooth animation</p>
  </div>
</div>
```

### Responsive Grid Gallery

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
  <div class="relative group overflow-hidden rounded-lg shadow-lg">
    <img src="image.jpg" alt="Gallery item" class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300">
    <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
      <button class="opacity-0 group-hover:opacity-100 px-6 py-2 bg-white text-black font-bold rounded-lg transition-opacity">
        View
      </button>
    </div>
  </div>
</div>
```

---

## 📚 More Examples

Check out the full documentation for additional patterns and components!

- [Utilities Reference](UTILITIES.md)
- [Getting Started](GETTING_STARTED.md)
- [Themes](THEMES.md)

---

**Start building beautiful UIs with Nakshora! 🚀**
