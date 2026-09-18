const tsParser = require('@typescript-eslint/parser');
const jest = require('eslint-plugin-jest');

// These rules are only applied to test files, so that the rest of the repo is unaffected.
const testFiles = [
  '**/*.test.ts',
  '**/*.test.tsx',
  '**/*.feature.ts',
  '**/*.feature.tsx',
  '**/*.test.js',
  '**/*.test.jsx',
];

module.exports = [
  {
    files: testFiles,
    plugins: jest.configs['flat/all'].plugins,
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022, // Enable parsing modern ECMAScript features.
      sourceType: 'module', // Enable the use of ES6 import/export syntax.
      globals: jest.environments.globals.globals,
    },
    rules: {
      ...jest.configs['flat/all'].rules,

      'jest/max-expects': 'off', // Limiting expect statements is beneficial, but enforcing a strict count can be restrictive.
      'jest/no-unnecessary-assertion': 'off', // With "noUncheckedIndexedAccess" disabled in some repos, indexed access is incorrectly typed as always defined, and so the rule flags useful assertions.
      'jest/no-hooks': 'off', // Would be time consuming to implement in existing repos.
      'jest/prefer-each': 'off', // We find traditional for-loops more readable in certain contexts.
      'jest/prefer-ending-with-an-expect': 'off', // It flags tests ending in a loop.
      'jest/prefer-expect-assertions': 'off', // While useful, enforcing this can lead to verbose tests.
      'jest/prefer-importing-jest-globals': 'off', // This would be very bothersome for existing repos.
      'jest/prefer-todo': 'off',
      'jest/require-top-level-describe': 'off', // Multiple top-level describe blocks or tests can be acceptable.
      'jest/valid-title': 'off', // This restriction can prevent using titles like "<function-name>.name".

      // Padding rules have to be enabled individually if any are disabled.
      'jest/padding-around-all': 'off', // This meta rule needs to be off if any individual padding rules are off.
      'jest/padding-around-expect-groups': 'off', // Adds a lot of excess whitespace.
      'jest/padding-around-after-all-blocks': 'error',
      'jest/padding-around-after-each-blocks': 'error',
      'jest/padding-around-before-all-blocks': 'error',
      'jest/padding-around-before-each-blocks': 'error',
      'jest/padding-around-describe-blocks': 'error',
      'jest/padding-around-test-blocks': 'error',
    },
  },
];
