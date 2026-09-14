import { defineConfig } from 'tsup';

const shared = {
  entry: { index: 'src/index.ts' },
  sourcemap: true,
  target: 'es2022',
  platform: 'node',
  noExternal: [/@nakshora\/core/],
  external: ['postcss', 'globby'],
} as const;

export default defineConfig([
  {
    ...shared,
    format: ['esm'],
    dts: true,
    clean: true,
    outExtension: () => ({ js: '.js' }),
  },
  {
    ...shared,
    format: ['cjs'],
    dts: true,
    clean: false,
    outExtension: () => ({ js: '.cjs' }),
    // `require('@nakshora/postcss')` must be the plugin function itself
    // (`require('@nakshora/postcss')({ … })`, and postcss-load-config's
    // `plugins: { '@nakshora/postcss': {} }`), not `{ default }`.
    footer: {
      js: 'module.exports = Object.assign(module.exports.default, module.exports);',
    },
  },
]);
