import { defineConfig } from 'vite';

// Nakshora Playground — SPA bundle; static SEO shells are written afterwards
// by scripts/prerender.mjs (reads the manifest for hashed asset names).
export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    target: 'es2020',
    manifest: true,
    cssCodeSplit: false,
    rollupOptions: { input: 'index.html' }
  },
  server: { host: '0.0.0.0', port: 5174, allowedHosts: true },
  preview: { host: '0.0.0.0', port: 4174, allowedHosts: true }
});
