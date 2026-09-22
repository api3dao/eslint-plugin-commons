const tsPlugin = require('@typescript-eslint/eslint-plugin');

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
  // This repo is plain CommonJS without a tsconfig, so the type aware rules have nothing to run against.
  tsPlugin.configs['flat/disable-type-checked'],
  {
    files: ['**/*.js'],
    rules: {
      // Because some of the modules might be used in browser, prefer import-scope method.
      'lodash/import-scope': ['error', 'method'],
      'sort-keys': 'off', // The rule configurations are grouped by plugin instead of being sorted.
    },
  },
];
