const next = require('@next/eslint-plugin-next');
const tsParser = require('@typescript-eslint/parser');

const { scopeToDefaultFiles } = require('./internal');

module.exports = [
  ...scopeToDefaultFiles([
    // Enforce Next.js performance best practices. See: https://nextjs.org/docs/basic-features/eslint.
    next.configs['core-web-vitals'],
    {
      languageOptions: {
        parser: tsParser,
        ecmaVersion: 2022, // Enable parsing of modern ECMAScript features.
        sourceType: 'module', // Enable ES6 import/export syntax.
        parserOptions: {
          ecmaFeatures: {
            jsx: true, // Support JSX syntax.
          },
        },
      },
      settings: {
        react: {
          version: 'detect',
        },
      },
      rules: {
        // The universal configuration bans default exports, but Next.js is built around them.
        // Anonymous default exports stay banned through "unicorn/no-anonymous-default-export".
        'import-x/no-default-export': 'off',
      },
    },
  ]),
];
