const { fixupPluginRules } = require('@eslint/compat');
const tsParser = require('@typescript-eslint/parser');
const a11y = require('eslint-plugin-jsx-a11y');
const react = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');

const {
  scopeToDefaultFiles,
  sharedPlugins,
  universalImportOrderConfig,
  universalRestrictedImportsConfig,
} = require('./internal');

// eslint-plugin-react has no ESLint v10 support (its rules still call the removed "context.getFilename"), so the
// plugin is patched. Everything else about its "all" configuration is kept as is.
const patchedReact = fixupPluginRules(react);

module.exports = scopeToDefaultFiles([
  { ...react.configs.flat.all, plugins: { react: patchedReact } },
  reactHooks.configs.flat.recommended,
  a11y.flatConfigs.recommended, // Accessibility rules for JSX.
  {
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022, // Enable parsing of modern ECMAScript features.
      sourceType: 'module', // Enable ES6 import/export syntax.
      parserOptions: {
        ecmaFeatures: {
          jsx: true, // Support JSX syntax.
        },
      },
    },
    settings: {
      react: {
        version: 'detect', // Automatically detect the version of React.
      },
    },
    // Registered so that this configuration also works when it is not composed with the universal one.
    plugins: sharedPlugins,
    rules: {
      'import-x/order': [
        'error',
        {
          ...universalImportOrderConfig,
          // Prioritize react imports.
          pathGroups: [
            {
              pattern: 'react',
              group: 'builtin',
              position: 'before',
            },
          ],
        },
      ],

      /* Overrides for "react" plugin */
      'react/destructuring-assignment': ['error', 'always', { destructureInSignature: 'ignore' }],
      'react/forbid-component-props': ['error', { forbid: [] }],
      'react/forbid-dom-props': ['error', { forbid: [] }],
      'react/jsx-closing-bracket-location': 'off', // Conflicts with prettier's "bracketSameLine" option.
      'react/jsx-closing-tag-location': 'off', // Handled by prettier and "react/self-closing-comp".
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never', propElementValues: 'always' }],
      'react/jsx-curly-newline': 'off', // Conflicts with prettier.
      'react/jsx-curly-spacing': 'off', // Handled by prettier.
      'react/jsx-equals-spacing': 'off', // Handled by prettier.
      'react/jsx-filename-extension': 'off', // We use .tsx extension.
      'react/jsx-first-prop-new-line': 'off', // Handled by prettier.
      'react/jsx-handler-names': 'off',
      'react/jsx-indent': 'off', // Conflicts with prettier.
      'react/jsx-indent-props': 'off', // Conflicts with prettier.
      'react/jsx-max-depth': 'off', // Conflicts with prettier.
      'react/jsx-max-props-per-line': 'off', // Conflicts with prettier.
      'react/jsx-newline': 'off', // Conflicts with prettier.
      'react/jsx-no-bind': 'off', // Conflicts with prettier.
      'react/jsx-no-leaked-render': 'off',
      'react/jsx-no-literals': 'off',
      'react/jsx-one-expression-per-line': 'off', // Conflicts with prettier.
      'react/jsx-props-no-multi-spaces': 'off', // Handled by prettier.
      'react/jsx-props-no-spreading': 'off',
      'react/jsx-sort-props': 'off',
      'react/jsx-tag-spacing': 'off', // Handled by prettier.
      'react/jsx-wrap-multilines': 'off', // Handled by prettier.
      'react/no-multi-comp': 'off',
      'react/no-unescaped-entities': 'off',
      'react/no-unused-prop-types': 'off',
      'react/prefer-read-only-props': 'off',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/require-default-props': 'off',
      'react/self-closing-comp': ['error', { component: true, html: true }],
      'react/void-dom-elements-no-children': 'error',

      /* Overrides for standard ESLint rules */
      'no-restricted-imports': [
        'error',
        {
          ...universalRestrictedImportsConfig,
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

      /* Overrides for "lodash" plugin */
      'lodash/import-scope': ['error', 'method'],
    },
  },
]);
