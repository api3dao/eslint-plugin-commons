const path = require('node:path');

const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');

const compat = new FlatCompat({
  baseDirectory: path.join(__dirname, '..'),
  recommendedConfig: js.configs.recommended,
});

const unwrapDefaultExport = (module) => (module.rules ? module : module.default);

const pluginOverrides = {
  functional: unwrapDefaultExport(require('eslint-plugin-functional')),
};

const defaultFiles = ['**/*.{cjs,js,jsx,mjs,ts,tsx}'];

const compatConfig = (config) =>
  [
    {
      linterOptions: {
        reportUnusedDisableDirectives: 'off',
      },
    },
    ...compat.config(config),
  ].map((flatConfig) => {
    const configWithFiles =
      flatConfig.files || flatConfig.ignores ? flatConfig : { files: defaultFiles, ...flatConfig };

    if (!configWithFiles.plugins) return configWithFiles;

    return {
      ...configWithFiles,
      plugins: {
        ...configWithFiles.plugins,
        ...Object.fromEntries(
          Object.entries(pluginOverrides).filter(([pluginName]) =>
            Object.prototype.hasOwnProperty.call(configWithFiles.plugins, pluginName)
          )
        ),
      },
    };
  });

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
  // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/order.md
  groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
  'newlines-between': 'always',
  alphabetize: {
    order: 'asc',
    caseInsensitive: true,
  },
};

module.exports = {
  compat,
  compatConfig,
  pluginOverrides,
  universalRestrictedImportsConfig,
  universalImportOrderConfig,
};
