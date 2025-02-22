// @ts-ignore
import tsParser from '@typescript-eslint/parser';
import jest from 'eslint-plugin-jest';
import globals from 'globals';

export default [
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },

      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: 'module',
    },
  },
  {
    files: ['**/*.test.ts', '**/*.test.tsx', '**/*.feature.ts', '**/*.feature.tsx', '**/*.test.js', '**/*.test.jsx'],

    plugins: {
      jest,
    },

    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },

    rules: {
      'jest/max-expects': 'off',
      'jest/no-hooks': 'off',
      'jest/padding-around-all': 'off',
      /* eslint-disable-next-line sort-keys */
      'jest/padding-around-after-all-blocks': 'error',
      'jest/padding-around-after-each-blocks': 'error',
      'jest/padding-around-before-all-blocks': 'error',
      'jest/padding-around-before-each-blocks': 'error',
      'jest/padding-around-describe-blocks': 'error',
      'jest/padding-around-expect-groups': 'off',
      'jest/padding-around-test-blocks': 'error',
      'jest/prefer-each': 'off',
      'jest/prefer-expect-assertions': 'off',
      'jest/prefer-importing-jest-globals': 'off',
      'jest/prefer-todo': 'off',
      'jest/require-top-level-describe': 'off',
      'jest/valid-title': 'off',
      'prefer-lowercase-title': 'off',
    },
  },
];
