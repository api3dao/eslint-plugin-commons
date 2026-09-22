const tsParser = require('@typescript-eslint/parser');
const jest = require('eslint-plugin-jest');

const { testFiles } = require('./internal');

module.exports = [
  {
    files: testFiles,
    plugins: jest.configs['flat/recommended'].plugins,
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022, // Enable parsing modern ECMAScript features.
      sourceType: 'module', // Enable the use of ES6 import/export syntax.
      globals: jest.environments.globals.globals,
    },
    rules: {
      ...jest.configs['flat/recommended'].rules,
      ...jest.configs['flat/style'].rules,

      // A mock's signature has to match the function it replaces, so TypeScript rejects the suggested edit.
      '@typescript-eslint/require-await': 'off',

      'jest/valid-title': 'off', // This restriction can prevent using titles like "<function-name>.name".

      // Autofixable mock and matcher rules from the "all" ruleset, which the presets leave out.
      'jest/no-unneeded-async-expect-function': 'error',
      'jest/prefer-mock-promise-shorthand': 'error',
      'jest/prefer-mock-return-shorthand': 'error',
      'jest/prefer-spy-on': 'error', // Assigning "jest.fn()" over a method leaks the mock into later tests.
      'jest/prefer-to-have-been-called-times': 'error',
      'jest/prefer-to-have-been-called': 'error',

      // Padding rules, not part of the presets.
      'jest/padding-around-after-all-blocks': 'error',
      'jest/padding-around-after-each-blocks': 'error',
      'jest/padding-around-before-all-blocks': 'error',
      'jest/padding-around-before-each-blocks': 'error',
      'jest/padding-around-describe-blocks': 'error',
      'jest/padding-around-test-blocks': 'error',
    },
  },
];
