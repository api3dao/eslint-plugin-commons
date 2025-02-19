import globals from 'globals';
import lodash from 'eslint-plugin-lodash';

export default {
  files: ['**/*.{js,ts,tsx,jsx}'],
  ignores: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/coverage/**'],
  languageOptions: {
    globals: {
      ...globals.browser,
      ...globals.node,
      ...globals.es2015,
    },
  },
  plugins: {
    lodash: lodash,
  },
  rules: {
    // Because some of the modules might be used in browser, prefer import-scope method.
    'lodash/import-scope': ['error', 'method'],
  },
};
