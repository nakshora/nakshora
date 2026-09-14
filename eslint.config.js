// Nakshora — ESLint flat config (ESLint 9 + typescript-eslint)

import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/coverage/**',
      '**/*.tsbuildinfo',
      'minified-version/**',
      'min.main.css',
      'pnpm-lock.yaml',
      'ai/corpus.json',
      'ai/corpus.jsonl',
      'img/**',
      '.changeset/**',
      'packages/@nakshora/core/test/compat/.cache/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-console': 'off',
    },
  },
  {
    // browser-only code: the playground runs the core ESM bundle in the page
    files: ['playground/**/*.js'],
    languageOptions: { globals: { ...globals.browser } },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'no-undef': 'off', // TS handles undefined symbols
    },
  },
);
