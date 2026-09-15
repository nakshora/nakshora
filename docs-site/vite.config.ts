import { defineConfig } from 'vite';

// Nakshora Docs — client bundle.
// All pages are statically pre-rendered by scripts/prerender.mjs after this
// build; the bundle only powers the interactive layer (search, theme, nav).
export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    target: 'es2020',
    manifest: true,
    cssCodeSplit: false,
    rollupOptions: {
      input: 'index.html',
      output: {
        manualChunks: undefined
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173
  },
  preview: {
    host: '0.0.0.0',
    port: 4173
  }
});
