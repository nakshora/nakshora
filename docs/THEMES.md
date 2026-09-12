# Nakshora 2.0 - Built-in Themes

Nakshora comes with 5 beautiful, carefully crafted themes. Each theme is a complete color palette and design system.

---

## 🎨 Available Themes

1. **Neon Cyber** - Modern, vibrant, high-contrast
2. **Pastel Dream** - Soft, calming, harmonious
3. **Brutalist** - Minimalist, stark, professional
4. **Minimalist** - Clean, modern, professional
5. **Nature** - Organic, earthy, calm

---

## 1️⃣ Neon Cyber Theme

### Description
Modern and vibrant design with high-contrast, neon-inspired colors. Perfect for tech startups, gaming, and cutting-edge projects.

### Primary Colors
```
Primary (Cyan):      #00d9ff
Secondary (Hot Pink): #ff006e
Accent (Yellow):    #ffbe0b
Background (Dark):  #0a1929
```

### Complete Palette

| Color | Light | Base | Dark |
|-------|-------|------|------|
| Primary | #b3edff | #00d9ff | #005563 |
| Secondary | #ffb3d9 | #ff006e | #530016 |
| Accent | #ffffb3 | #ffbe0b | #534000 |

### Use Cases
- Tech websites & apps
- Gaming platforms
- SaaS dashboards
- Modern startups
- Digital agencies
- Creative portfolios

### Example HTML
```html
<style>
  :root {
    --color-primary: #00d9ff;
    --color-secondary: #ff006e;
    --color-accent: #ffbe0b;
    --color-background: #0a1929;
  }
</style>

<div class="bg-slate-900 text-cyan-400 p-8 rounded-lg border-2 border-pink-500">
  <h1 class="text-4xl font-bold text-cyan-300">Neon Cyber</h1>
  <p class="text-pink-200 mb-4">High-tech design system</p>
  <button class="px-6 py-2 bg-yellow-400 text-black font-bold rounded hover:bg-yellow-300">
    Explore
  </button>
</div>
```

---

## 2️⃣ Pastel Dream Theme

### Description
Soft, calming colors perfect for lifestyle, wellness, and creative projects. Harmonious palette designed for relaxation.

### Primary Colors
```
Primary (Soft Blue): #a0c4ff
Secondary (Soft Pink): #ffb7b2
Accent (Peach):     #ffd3b6
Background (Purple): #f5f1ff
```

### Complete Palette

| Color | Light | Base | Dark |
|-------|-------|------|------|
| Primary | #e8eeff | #a0c4ff | #1c0e67 |
| Secondary | #ffe8ed | #ffb7b2 | #671064 |
| Accent | #ffeee6 | #ffd3b6 | #671614 |

### Use Cases
- Wellness & meditation apps
- Fashion & beauty brands
- Interior design portfolios
- Lifestyle blogs
- Children's apps
- Mindfulness platforms

### Example HTML
```html
<div class="bg-purple-100 p-8 rounded-2xl shadow-lg">
  <h1 class="text-3xl font-semibold text-blue-600 mb-4">Pastel Dream</h1>
  <p class="text-pink-600 mb-6">Soft, calming design system</p>
  <button class="px-6 py-2 bg-pink-300 text-pink-900 font-semibold rounded-full hover:bg-pink-400 transition-colors">
    Discover
  </button>
</div>
```

---

## 3️⃣ Brutalist Theme

### Description
Minimalist, stark design with no-nonsense approach. High contrast black and white with emphasis on typography.

### Primary Colors
```
Primary (Black):    #000000
Secondary (White):  #ffffff
Accent (Gray):      #333333
Background (Light): #f5f5f5
```

### Complete Palette

| Color | Component | Usage |
|-------|-----------|-------|
| Primary | Black | Text, borders, emphasis |
| Secondary | White | Backgrounds, surfaces |
| Accent | Dark Gray | Subtle elements |
| Neutral | Light Gray | Dividers, disabled |

### Use Cases
- High-end design studios
- Luxury brands
- Fine art portfolios
- Editorial websites
- Corporate/professional
- Minimalist portfolios

### Example HTML
```html
<div class="bg-white border-4 border-black p-8">
  <h1 class="text-5xl font-black text-black mb-4">Brutalist</h1>
  <p class="text-black text-lg mb-6 border-b-2 border-black pb-4">No-nonsense design</p>
  <button class="px-8 py-3 bg-black text-white font-bold hover:bg-gray-900">
    ENTER
  </button>
</div>
```

---

## 4️⃣ Minimalist Theme

### Description
Clean, modern, professional palette. Balanced and sophisticated, perfect for enterprise applications.

### Primary Colors
```
Primary (Dark Blue): #2c3e50
Secondary (Slate):   #34495e
Accent (Sky Blue):   #3498db
Background (Light):  #ecf0f1
```

### Complete Palette

| Color | Light | Base | Dark |
|-------|-------|------|------|
| Primary | #f0f4f9 | #2c3e50 | #101d2c |
| Secondary | #f7f9fb | #34495e | #181d22 |
| Accent | #ecf5ff | #3498db | #0c244f |

### Use Cases
- Corporate websites
- SaaS applications
- Business dashboards
- Professional portfolios
- Administration panels
- Financial platforms
- Enterprise applications

### Example HTML
```html
<div class="bg-gradient-to-br from-blue-50 to-white p-8 rounded-lg shadow-md border border-gray-200">
  <h1 class="text-3xl font-bold text-blue-900 mb-3">Minimalist</h1>
  <p class="text-gray-700 mb-6">Clean, professional design system</p>
  <button class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
    Get Started
  </button>
</div>
```

---

## 5️⃣ Nature Theme

### Description
Organic, earthy, and calm color palette. Inspired by nature with greens, olives, and sage tones.

### Primary Colors
```
Primary (Forest Green): #2d5016
Secondary (Olive):     #6b8e23
Accent (Sage Green):   #8fbc8f
Background (Cream):    #f5f5f0
```

### Complete Palette

| Color | Light | Base | Dark |
|-------|-------|------|------|
| Primary | #f1f7f0 | #2d5016 | #110e0a |
| Secondary | #f8f9f2 | #6b8e23 | #272607 |
| Accent | #f5fbf6 | #8fbc8f | #373437 |

### Use Cases
- Environmental/green projects
- Organic/health brands
- Agriculture tech
- Eco-friendly businesses
- Nature documentaries
- Wellness products
- Sustainable living blogs
- Farm-to-table restaurants

### Example HTML
```html
<div class="bg-green-50 p-8 rounded-lg border-l-4 border-green-600">
  <h1 class="text-3xl font-bold text-green-900 mb-3">Nature</h1>
  <p class="text-green-700 mb-6">Organic, earthy design system</p>
  <button class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
    Explore
  </button>
</div>
```

---

## 🔄 Switching Themes

### Method 1: CSS Variables Override

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="nakshora.min.css">
  <style>
    /* Override for Neon theme */
    body.theme-neon {
      --color-primary: #00d9ff;
      --color-secondary: #ff006e;
    }
    
    /* Override for Pastel theme */
    body.theme-pastel {
      --color-primary: #a0c4ff;
      --color-secondary: #ffb7b2;
    }
  </style>
</head>
<body class="theme-neon">
  <!-- Content -->
</body>
</html>
```

### Method 2: JavaScript Theme Switcher

```javascript
const themes = ['neon', 'pastel', 'brutalist', 'minimalist', 'nature'];

function switchTheme(themeName) {
  document.body.setAttribute('data-theme', themeName);
  localStorage.setItem('nakshora-theme', themeName);
}

// Load saved theme on page load
window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('nakshora-theme') || 'minimalist';
  switchTheme(savedTheme);
});
```

### Method 3: CSS Media Query

```css
/* Automatically use Pastel theme in dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --color-primary: #a0c4ff;
    --color-secondary: #ffb7b2;
  }
}
```

---

## 🎨 Customizing Themes

### Extending a Theme

```typescript
import { minimalistTheme } from 'nakshora';

const customTheme = {
  ...minimalistTheme,
  colors: {
    ...minimalistTheme.colors,
    custom: {
      50: '#f0f0f0',
      500: '#your-color',
      900: '#your-dark-color',
    }
  }
};
```

### Creating a New Theme

```typescript
const myTheme: PresetConfig = {
  name: 'custom',
  colors: {
    primary: {
      50: '#f0f0f0',
      500: '#3b82f6',
      900: '#1e3a8a',
    },
    // ... other colors
  },
  typography: {
    // ... typography config
  },
};
```

---

## 📊 Theme Comparison

| Feature | Neon | Pastel | Brutalist | Minimalist | Nature |
|---------|------|--------|-----------|-----------|--------|
| Contrast | High | Low | Very High | Medium | Medium |
| Warmth | Cool | Warm | Neutral | Cool | Warm |
| Use Case | Tech | Wellness | Luxury | Business | Eco |
| Colors | Vibrant | Soft | B&W | Professional | Earthy |
| Complexity | High | Low | Very Low | Medium | Medium |

---

## 🎯 Choosing a Theme

**Choose Neon Cyber if:**
- Building tech products
- Creating a modern, vibrant look
- Targeting younger audiences
- Making gaming or creative apps

**Choose Pastel Dream if:**
- Creating wellness/lifestyle content
- Want a soft, calming aesthetic
- Building beauty or fashion brands
- Focusing on emotion & creativity

**Choose Brutalist if:**
- Creating luxury/high-end brands
- Want maximum simplicity
- Building design portfolios
- Emphasizing content over style

**Choose Minimalist if:**
- Building corporate/business apps
- Creating SaaS platforms
- Want professional appearance
- Building dashboards or admin panels

**Choose Nature if:**
- Creating eco-friendly brands
- Building agricultural platforms
- Want organic, earthy feel
- Focusing on sustainability

---

## 📚 Additional Resources

- [Getting Started](GETTING_STARTED.md)
- [Utilities Reference](UTILITIES.md)
- [Configuration API](API.md)
- [Code Examples](EXAMPLES.md)

---

**Pick your perfect theme and start building! 🎨**
