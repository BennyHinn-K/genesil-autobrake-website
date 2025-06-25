// ESLint config for Next.js, React, and TypeScript
import js from '@eslint/js';
import globals from 'globals';
import next from 'eslint-config-next';

export default [
  js.config({
    env: { browser: true, es2021: true, node: true },
    globals: globals.browser,
  }),
  ...next(),
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      '@next/next/no-html-link-for-pages': 'off',
      'no-unused-vars': 'warn',
      'no-console': 'warn',
      'react/jsx-key': 'error',
      'react/jsx-no-undef': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
]; 