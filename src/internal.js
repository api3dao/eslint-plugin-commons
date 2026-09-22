const tsPlugin = require('@typescript-eslint/eslint-plugin');
const importX = require('eslint-plugin-import-x');
const lodash = require('eslint-plugin-lodash');

// ESLint refuses to merge configurations that register the same plugin name with two different objects, so plugins
// used by more than one of our rulesets are resolved once, here. Note that the object import-x registers in its own
// shared configurations is not the module namespace, which is why it is unwrapped rather than used directly.
const sharedPlugins = {
  '@typescript-eslint': tsPlugin,
  'import-x': importX.flatConfigs.recommended.plugins['import-x'],
  lodash,
};

// ESLint only lints ".js", ".cjs" and ".mjs" unless a configuration names other extensions, so every configuration
// object we export is scoped to the extensions we care about.
const defaultFiles = ['**/*.{cjs,cts,js,jsx,mjs,mts,ts,tsx}'];

// Plugins ship their shared configurations as frozen objects, so a new object is created rather than mutated. An
// explicit "files" on the incoming configuration always wins.
const scopeToDefaultFiles = (configs) => [configs].flat().map((config) => ({ files: defaultFiles, ...config }));

const universalRestrictedImportsConfig = {
  patterns: [
    {
      group: ['date-fns/*'],
      // The date-fns library is tree-shakeable and it's more convenient to use named imports.
      message: "Please use named imports from 'date-fns'.",
    },
  ],
};

const universalImportOrderConfig = {
  // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/order.md
  groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
  'newlines-between': 'always',
  alphabetize: {
    order: 'asc',
    caseInsensitive: true,
  },
};

// Reserves SCREAMING_SNAKE_CASE for module scope constants. This replaces "@shopify/prefer-module-scope-constants",
// which we dropped along with the rest of the Shopify plugin. Destructured bindings are exempt because they take their
// name from whatever they are destructured out of.
const moduleScopeConstantsNamingConvention = [
  'error',
  { selector: 'variable', modifiers: ['const', 'global'], format: null },
  { selector: 'variable', modifiers: ['destructured'], format: null },
  {
    selector: 'variable',
    format: null,
    custom: { regex: String.raw`^[A-Z][A-Z\d]*(_[A-Z\d]+)*$`, match: false },
  },
];

module.exports = {
  moduleScopeConstantsNamingConvention,
  scopeToDefaultFiles,
  sharedPlugins,
  universalImportOrderConfig,
  universalRestrictedImportsConfig,
};
