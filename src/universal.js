import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import shopify from '@shopify/eslint-plugin';
// @ts-ignore
import tsParser from '@typescript-eslint/parser';
import checkFile from 'eslint-plugin-check-file';
// import functional from 'eslint-plugin-functional';
import _import from 'eslint-plugin-import';
import jest from 'eslint-plugin-jest';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';

const compat = new FlatCompat();

export default [
  js.configs.recommended,
  ...fixupConfigRules(
    compat.extends(
      'plugin:import/recommended',
      'plugin:import/typescript',
      'plugin:promise/recommended',
      'plugin:lodash/recommended',
      'plugin:unicorn/recommended',
      'plugin:@typescript-eslint/recommended-type-checked'
    )
  ),
  {
    plugins: {
      '@shopify': shopify,
      'check-file': checkFile,
      // functional: fixupPluginRules(functional),
      unicorn: fixupPluginRules(unicorn),
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      camelcase: 'error',
      curly: ['error', 'multi-line', 'consistent'],
      eqeqeq: 'error',
      'no-await-in-loop': 'off',

      'no-console': [
        'error',
        {
          allow: ['info', 'groupCollapsed', 'groupEnd'],
        },
      ],

      'import/no-default-export': 'error',
      'import/no-duplicates': 'error',
      'import/no-named-as-default': 'off',
      'import/no-unresolved': 'off',
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',

          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],

      'no-constant-condition': 'off',
      'no-fallthrough': 'off',
      'no-inline-comments': 'off',
      'no-lonely-if': 'error',
      'no-nested-ternary': 'error',
      'no-new-wrappers': 'error',
      'no-return-await': 'off',
      'no-unexpected-multiline': 'off',
      'no-unused-expressions': 'off',
      'object-shorthand': 'error',

      'prefer-destructuring': [
        'error',
        {
          array: false,
          object: true,
        },
        {
          enforceForRenamedProperties: false,
        },
      ],

      'prefer-exponentiation-operator': 'error',
      'prefer-named-capture-group': 'off',
      'prefer-object-spread': 'error',
      'prefer-spread': 'error',
      'prefer-template': 'error',
      radix: 'error',

      'sort-keys': [
        'error',
        'asc',
        {
          caseSensitive: true,
          natural: true,
          minKeys: 10,
          allowLineSeparatedGroups: true,
        },
      ],

      'spaced-comment': [
        'error',
        'always',
        {
          line: {
            markers: ['/'],
          },
        },
      ],

      'check-file/folder-naming-convention': [
        'error',
        {
          '**/': 'KEBAB_CASE',
        },
      ],

      'unicorn/consistent-function-scoping': 'off',
      'unicorn/filename-case': [
        'error',
        {
          case: 'kebabCase',
          ignore: [],
        },
      ],
      'unicorn/import-style': [
        'error',
        {
          styles: {
            'node:path': {
              named: true,
            },

            'node:util': {
              default: true,
            },
          },
        },
      ],
      'unicorn/no-abusive-eslint-disable': 'off',
      'unicorn/no-array-callback-reference': 'error',
      'unicorn/no-array-for-each': 'off',
      'unicorn/no-array-reduce': 'off',
      'unicorn/no-for-loop': 'off',
      'unicorn/no-nested-ternary': 'off',
      'unicorn/no-null': 'off',
      'unicorn/no-object-as-default-parameter': 'off',
      'unicorn/no-process-exit': 'off',
      'unicorn/no-useless-undefined': [
        'error',
        {
          checkArguments: false,
        },
      ],
      'unicorn/prefer-module': 'off',
      'unicorn/prefer-string-raw': 'off',
      'unicorn/prefer-top-level-await': 'off',
      'unicorn/prevent-abbreviations': 'off',

      '@shopify/prefer-early-return': 'error',
      '@shopify/prefer-module-scope-constants': 'error',

      '@typescript-eslint/comma-dangle': 'off',
      '@typescript-eslint/consistent-return': 'off',
      '@typescript-eslint/consistent-type-exports': [
        'error',
        {
          fixMixedExportsWithInlineTypeSpecifier: true,
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: false,
          fixStyle: 'inline-type-imports',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/indent': 'off',
      '@typescript-eslint/init-declarations': 'off',
      '@typescript-eslint/lines-around-comment': 'off',
      '@typescript-eslint/max-params': 'off',
      '@typescript-eslint/member-delimiter-style': 'off',
      '@typescript-eslint/member-ordering': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/no-confusing-void-expression': [
        'error',
        {
          ignoreArrowShorthand: true,
        },
      ],
      '@typescript-eslint/no-deprecated': 'error',
      '@typescript-eslint/no-dynamic-delete': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-extra-parens': 'off',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-magic-numbers': 'off',
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: {
            arguments: false,
            attributes: false,
          },
        },
      ],
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['date-fns/*'],
              message: "Please use named imports from 'date-fns'.",
            },
          ],
        },
      ],
      '@typescript-eslint/no-shadow': 'off',
      '@typescript-eslint/no-type-alias': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          vars: 'all',
        },
      ],
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/object-curly-spacing': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': [
        'error',
        {
          ignoreConditionalTests: true,
        },
      ],
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
      '@typescript-eslint/quotes': 'off',
      '@typescript-eslint/semi': 'off',
      '@typescript-eslint/space-before-function-paren': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/use-unknown-in-catch-callback-variable': 'off',

      // 'functional/no-classes': 'error',
      // 'functional/no-promise-reject': 'off',
      // 'functional/no-try-statements': 'error',
      // 'functional/prefer-tacit': 'off',

      'lodash/import-scope': ['error', 'member'],
      'lodash/path-style': 'off',
      'lodash/prefer-immutable-method': 'off',
      'lodash/prefer-lodash-method': 'off',
      'lodash/prop-shorthand': 'off',
    },
  },
  ...compat.extends('plugin:jest/all', 'plugin:jest-formatting/recommended').map((config) => ({
    ...config,
    files: ['**/*.test.ts', '**/*.test.tsx'],
  })),
  {
    files: ['**/*.test.ts', '**/*.test.tsx'],

    plugins: {
      jest,
    },

    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },

    rules: {
      'jest/prefer-expect-assertions': 'off',
      'jest/prefer-each': 'off',
      'jest/require-top-level-describe': 'off',
      'jest/max-expects': 'off',
      'jest/valid-title': 'off',
    },
  },
];
