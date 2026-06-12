const next = require('@next/eslint-plugin-next');

const { compatConfig } = require('./internal');

module.exports = [
  ...compatConfig({
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 2022, // Enable parsing of modern ECMAScript features.
      ecmaFeatures: {
        jsx: true, // Support JSX syntax.
      },
      sourceType: 'module', // Enable ES6 import/export syntax.
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    env: {
      node: true,
      browser: true,
    },
  }),
  {
    files: ['**/*.{cjs,js,jsx,mjs,ts,tsx}'],
    plugins: {
      '@next/next': next,
    },
    rules: {
      ...next.configs.recommended.rules,
      ...next.configs['core-web-vitals'].rules,
    },
  },
  {
    files: ['pages/**/*'],
    rules: {
      'import-x/no-default-export': 'off',
      'import-x/prefer-default-export': 'error', // Next.js expects default exports in the pages directory.
    },
  },
];
