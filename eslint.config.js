const commons = require('./index');

module.exports = [
  {
    ignores: [
      '.build',
      '.env',
      '.idea',
      '.log',
      '.tsbuildinfo',
      '.vscode',
      'build',
      'dist',
      'node_modules',
      'coverage',
      '.DS_Store',
      '.eslintcache',
    ],
  },
  ...commons.configs.universal,
  {
    rules: {
      // Because some of the modules might be used in browser, prefer import-scope method.
      'lodash/import-scope': ['error', 'method'],

      '@typescript-eslint/consistent-return': 'off',
      '@typescript-eslint/consistent-type-exports': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/no-confusing-void-expression': 'off',
      '@typescript-eslint/no-deprecated': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/use-unknown-in-catch-callback-variable': 'off',
      'sort-keys': 'off',
    },
  },
];
