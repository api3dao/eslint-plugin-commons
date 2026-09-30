const playwright = require('eslint-plugin-playwright');
const tseslint = require('typescript-eslint');

const { playwrightFiles } = require('./internal');

module.exports = [
  {
    files: playwrightFiles,
    plugins: { playwright },
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 2022, // Enable parsing modern ECMAScript features.
      sourceType: 'module', // Enable the use of ES6 import/export syntax.
    },
    rules: {
      // Also turns off "no-empty-pattern", because tests that use no fixtures still destructure an empty "{}".
      ...playwright.configs['flat/recommended'].rules,

      'playwright/no-conditional-in-test': 'off', // The Jest version of this rule is not enabled either.
      'playwright/no-skipped-test': ['error', { allowConditional: true }], // Runtime skips such as "test.skip(!HAS_DB, 'reason')" are intentional.

      'unicorn/no-global-object-property-assignment': 'off', // Tests replace globals like "fetch" or "window" to mock them.
      'unicorn/prefer-https': 'off', // E2E tests target local servers such as "http://localhost:5173".
    },
  },
];
