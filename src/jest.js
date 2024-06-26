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
        'jest/no-hooks': [
          'error', // We advocate for setup functions over beforeXXX hooks. However, afterXyz hooks are sometimes indispensable, like for resetting Jest timers. See: https://kentcdodds.com/blog/avoid-nesting-when-youre-testing#inline-it.
          {
            allow: ['afterEach', 'afterAll'],
          },
        ],
        'jest/prefer-each': 'off', // We find traditional for-loops more readable in certain contexts.
        'jest/prefer-expect-assertions': 'off', // While useful, enforcing this can lead to verbose tests.
        'jest/prefer-importing-jest-globals': 'off', // This would be very bothersome for existing repos.
        'jest/require-top-level-describe': 'off', // Multiple top-level describe blocks or tests can be acceptable.
        'jest/valid-title': 'off', // This restriction can prevent using titles like "<function-name>.name".
        'prefer-lowercase-title': 'off', // Sometimes we want to start the test with a capital letter and some words are all uppercase (e.g. AWS).,
      },
    },
  ],
};
