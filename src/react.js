import { fixupConfigRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import tsEslint from '@typescript-eslint/eslint-plugin';
// @ts-ignore
import tsParser from '@typescript-eslint/parser';
import _import from 'eslint-plugin-import';
import lodash from 'eslint-plugin-lodash';
import react from 'eslint-plugin-react';
import globals from 'globals';

const compat = new FlatCompat({
  recommendedConfig: js.configs.recommended,
});

export default [
  react.configs.all,
  ...fixupConfigRules(compat.extends('plugin:react-hooks/recommended')),
  {
    plugins: {
      '@typescript-eslint': tsEslint,
      _import,
      lodash,
    },

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },

      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          pathGroups: [
            {
              pattern: 'react',
              group: 'builtin',
              position: 'before',
            },
          ],
        },
      ],

      'lodash/import-scope': ['error', 'method'],

      'react/destructuring-assignment': [
        'error',
        'always',
        {
          destructureInSignature: 'ignore',
        },
      ],
      'react/forbid-component-props': [
        'error',
        {
          forbid: [],
        },
      ],
      'react/forbid-dom-props': [
        'error',
        {
          forbid: [],
        },
      ],
      'react/jsx-curly-brace-presence': [
        'error',
        {
          props: 'never',
          children: 'never',
          propElementValues: 'always',
        },
      ],
      'react/jsx-curly-newline': 'off',
      'react/jsx-filename-extension': 'off',
      'react/jsx-handler-names': 'off',
      'react/jsx-indent': 'off',
      'react/jsx-indent-props': 'off',
      'react/jsx-max-depth': 'off',
      'react/jsx-max-props-per-line': 'off',
      'react/jsx-newline': 'off',
      'react/jsx-no-bind': 'off',
      'react/jsx-no-leaked-render': 'off',
      'react/jsx-no-literals': 'off',
      'react/jsx-one-expression-per-line': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/jsx-sort-props': 'off',
      'react/no-multi-comp': 'off',
      'react/no-unescaped-entities': 'off',
      'react/no-unused-prop-types': 'off',
      'react/prefer-read-only-props': 'off',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/require-default-props': 'off',
      'react/self-closing-comp': [
        'error',
        {
          component: true,
          html: true,
        },
      ],
      'react/void-dom-elements-no-children': 'error',

      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['date-fns/*'],
              message: "Please use named imports from 'date-fns'.",
            },
          ],
          paths: [
            {
              name: 'react',
              importNames: ['default'],
              message:
                'Starting from React version 17, there is no need to globally import React. Use named imports for specific React APIs.',
            },
          ],
        },
      ],
    },
  },
];
