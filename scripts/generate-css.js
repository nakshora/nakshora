#!/usr/bin/env node
// Build script for generating CSS from TypeScript configuration
// Usage: node scripts/generate-css.js

const fs = require('fs');
const path = require('path');
const CSSGenerator = require('../dist/generator.js').default;

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, '../dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Generate CSS
const generator = new CSSGenerator();
const css = generator.generate({ minify: false });
const minifiedCss = generator.generate({ minify: true });

// Write full version
fs.writeFileSync(
  path.join(distDir, 'nakshora.css'),
  css,
  'utf-8'
);

console.log('✅ Generated: dist/nakshora.css');

// Write minified version
fs.writeFileSync(
  path.join(distDir, 'nakshora.min.css'),
  minifiedCss,
  'utf-8'
);

console.log('✅ Generated: dist/nakshora.min.css');
console.log(`📦 Total size: ${(css.length / 1024).toFixed(2)} KB (${(minifiedCss.length / 1024).toFixed(2)} KB minified)`);
