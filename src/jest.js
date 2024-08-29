module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022, // Enable parsing modern ECMAScript features.
    sourceType: 'module', // Enable the use of ES6 import/export syntax.
  },
  env: {
    node: true,
    browser: true,
  },
  // Configuration for specific files is done under 'overrides'.
  overrides: [
    {
      files: ['**/*.test.ts', '**/*.test.tsx', '**/*.test.js', '**/*.test.jsx'],
      env: {
        jest: true,
      },
      plugins: ['jest'],
      extends: ['plugin:jest/recommended', 'plugin:jest-formatting/recommended'],
      rules: {
        'jest/max-expects': 'off', // Limiting expect statements is beneficial, but enforcing a strict count can be restrictive.
        'jest/no-hooks': 'off', // Would be time consuming to implement in existing repos.
        'jest/prefer-each': 'off', // We find traditional for-loops more readable in certain contexts.
        'jest/prefer-expect-assertions': 'off', // While useful, enforcing this can lead to verbose tests.
        'jest/prefer-importing-jest-globals': 'off', // This would be very bothersome for existing repos.
        'jest/prefer-todo': 'off',
        'jest/require-top-level-describe': 'off', // Multiple top-level describe blocks or tests can be acceptable.
        'jest/valid-title': 'off', // This restriction can prevent using titles like "<function-name>.name".
        'prefer-lowercase-title': 'off', // Sometimes we want to start the test with a capital letter and some words are all uppercase (e.g. AWS).,
        // Padding rules have to be enabled individually if any are disabled
        'jest/padding-around-all': 'off', // This meta rule needs to be off if any individual padding rules are off
        'jest/padding-around-expect-groups': 'off', // Adds a lot of excess whitespace
        'jest/padding-around-after-all-blocks': 'error',
        'jest/padding-around-after-each-blocks': 'error',
        'jest/padding-around-before-all-blocks': 'error',
        'jest/padding-around-before-each-blocks': 'error',
        'jest/padding-around-describe-blocks': 'error',
        'jest/padding-around-test-blocks': 'error',
      },
    },
  ],
};
