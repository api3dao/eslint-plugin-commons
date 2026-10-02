const tailwind = require('eslint-plugin-better-tailwindcss');
const tseslint = require('typescript-eslint');

const { scopeToDefaultFiles } = require('./internal');

module.exports = scopeToDefaultFiles([
  {
    plugins: { 'better-tailwindcss': tailwind },
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 2022, // Enable parsing modern ECMAScript features.
      sourceType: 'module', // Enable the use of ES6 import/export syntax.
      parserOptions: {
        ecmaFeatures: {
          jsx: true, // Support JSX syntax.
        },
      },
    },
    settings: {
      'better-tailwindcss': {
        entryPoint: 'src/index.css', // The CSS file that imports Tailwind, relative to the "cwd" setting.
        detectComponentClasses: true, // Treat the classes defined in "@layer components" as known.
      },
    },
    rules: {
      ...tailwind.configs['recommended-error'].rules,

      // Class order and line wrapping are left to "prettier-plugin-tailwindcss".
      'better-tailwindcss/enforce-consistent-class-order': 'off',
      'better-tailwindcss/enforce-consistent-line-wrapping': 'off',

      'better-tailwindcss/enforce-consistent-variant-order': 'error',
    },
  },
]);
