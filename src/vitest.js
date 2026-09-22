const tsParser = require('@typescript-eslint/parser');
const vitest = require('@vitest/eslint-plugin');

const { testFiles } = require('./internal');

// Vitest and Jest claim the same file names, so a repo composes either this configuration or the Jest one, never both.
module.exports = [
  {
    files: testFiles,
    plugins: { vitest },
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022, // Enable parsing modern ECMAScript features.
      sourceType: 'module', // Enable the use of ES6 import/export syntax.
      globals: vitest.environments.env.globals,
    },
    rules: {
      ...vitest.configs.recommended.rules,

      // A mock's signature has to match the function it replaces, so TypeScript rejects the suggested edit.
      '@typescript-eslint/require-await': 'off',

      'vitest/valid-title': 'off', // This restriction can prevent using titles like "<function-name>.name".

      // Matcher rules that the recommended ruleset leaves out. They mirror what the Jest configuration enables.
      'vitest/prefer-to-be': 'error',
      'vitest/prefer-to-contain': 'error',
      'vitest/prefer-to-have-length': 'error',
      'vitest/prefer-mock-promise-shorthand': 'error',
      'vitest/prefer-mock-return-shorthand': 'error',
      'vitest/prefer-spy-on': 'error', // Assigning "vi.fn()" over a method leaks the mock into later tests.
      'vitest/prefer-to-have-been-called-times': 'error',

      // Padding rules are not part of the presets, so each one is enabled explicitly.
      'vitest/padding-around-after-all-blocks': 'error',
      'vitest/padding-around-after-each-blocks': 'error',
      'vitest/padding-around-before-all-blocks': 'error',
      'vitest/padding-around-before-each-blocks': 'error',
      'vitest/padding-around-describe-blocks': 'error',
      'vitest/padding-around-test-blocks': 'error',
    },
  },
];
