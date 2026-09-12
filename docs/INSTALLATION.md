# Nakshora CSS Framework 2.0 - Installation Guide

## 📦 Installation Methods

### Method 1: NPM (Recommended)
```bash
npm install nakshora
```

### Method 2: Yarn
```bash
yarn add nakshora
```

### Method 3: PNPM
```bash
pnpm add nakshora
```

### Method 4: CDN
```html
<!-- Latest version -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/nakshora@latest/dist/nakshora.min.css">

<!-- Specific version -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/nakshora@2.0.0/dist/nakshora.min.css">
```

---

## 🚀 Quick Setup

### Step 1: Install Nakshora
```bash
npm install nakshora --save
```

### Step 2: Import in Your Project

#### HTML
```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="node_modules/nakshora/dist/nakshora.min.css">
</head>
<body>
  <!-- Your content here -->
</body>
</html>
```

#### React
```javascript
// App.js or main.jsx
import 'nakshora/dist/nakshora.css';

export default function App() {
  return (
    <div className="flex items-center justify-center h-screen bg-blue-500">
      <h1 className="text-white text-4xl font-bold">Welcome to Nakshora</h1>
    </div>
  );
}
```

#### Vue.js
```vue
<script setup>
import 'nakshora/dist/nakshora.css';
</script>

<template>
  <div class="flex items-center justify-center h-screen bg-blue-500">
    <h1 class="text-white text-4xl font-bold">Welcome to Nakshora</h1>
  </div>
</template>
```

#### Svelte
```svelte
<script>
  import 'nakshora/dist/nakshora.css';
</script>

<div class="flex items-center justify-center h-screen bg-blue-500">
  <h1 class="text-white text-4xl font-bold">Welcome to Nakshora</h1>
</div>

<style>
  :global(html, body) {
    margin: 0;
    padding: 0;
  }
</style>
```

#### Next.js
```jsx
// pages/_app.js
import 'nakshora/dist/nakshora.css';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
```

#### Angular
In `angular.json`:
```json
{
  "projects": {
    "your-app": {
      "architect": {
        "build": {
          "options": {
            "styles": [
              "node_modules/nakshora/dist/nakshora.css",
              "src/styles.css"
            ]
          }
        }
      }
    }
  }
}
```

#### Webpack
In `webpack.config.js`:
```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
};
```

Then import in your JS:
```javascript
import 'nakshora/dist/nakshora.css';
```

#### Vite
In `main.js`:
```javascript
import 'nakshora/dist/nakshora.css';
```

---

## ⚙️ Configuration

### Using with TypeScript

Create `nakshora.config.ts`:
```typescript
import { NakshoraConfig } from 'nakshora';

const config: NakshoraConfig = {
  theme: {
    colors: {
      brand: '#3b82f6',
    },
    spacing: {
      custom: '10px',
    },
  },
  variants: {
    hover: true,
    focus: true,
    responsive: true,
  },
};

export default config;
```

### Customization

You can customize Nakshora by creating a custom CSS file:

```css
/* custom-nakshora.css */
@import 'nakshora/dist/nakshora.css';

:root {
  --color-brand-primary: #ff6b6b;
  --color-brand-secondary: #4ecdc4;
  --font-size-base: 16px;
  --spacing-unit: 4px;
}
```

---

## 🎯 Verifying Installation

Create a simple HTML file to test:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nakshora Test</title>
  <link rel="stylesheet" href="node_modules/nakshora/dist/nakshora.min.css">
</head>
<body>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
    <div class="bg-white p-8 rounded-lg shadow-lg text-center">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">Nakshora 2.0</h1>
      <p class="text-gray-600 mb-6">Installation Successful!</p>
      <button class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        Get Started
      </button>
    </div>
  </div>
</body>
</html>
```

---

## 📁 Project Structure After Installation

```
your-project/
├── node_modules/
│   ├── nakshora/
│   │   ├── dist/
│   │   │   ├── nakshora.css
│   │   │   ├── nakshora.min.css
│   │   │   └── nakshora.esm.js
│   │   ├── src/
│   │   └── package.json
│   └── ...
├── src/
│   ├── index.html
│   ├── styles.css
│   └── index.js
├── package.json
└── ...
```

---

## 🆘 Troubleshooting

### CSS not loading?
- Verify the path in your `<link>` tag
- Check that `node_modules/nakshora` exists
- Try using an absolute path: `/node_modules/nakshora/dist/nakshora.min.css`

### Classes not applying?
- Make sure you've imported the CSS file
- Check the class names (they are case-sensitive)
- Open DevTools and verify the CSS is loaded

### Performance issues?
- Use the minified version: `nakshora.min.css`
- Consider using PurgeCSS to remove unused utilities
- Lazy load CSS if using multiple themes

---

## 🔄 Updating Nakshora

To update to the latest version:

```bash
npm update nakshora
```

Or to update to a specific version:

```bash
npm install nakshora@2.1.0
```

Check the [changelog](CHANGELOG.md) for breaking changes before updating.

---

## 📚 Next Steps

1. Read the [Getting Started Guide](GETTING_STARTED.md)
2. Explore [Utility Classes Reference](UTILITIES.md)
3. Learn about [Built-in Themes](THEMES.md)
4. Review [Configuration API](API.md)
5. Check out [Code Examples](EXAMPLES.md)

---

**Happy coding with Nakshora! 🚀**
