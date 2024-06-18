module.exports = {
  env: {
    node: true,
    browser: true,
    es6: true,
  },
  plugins: ['lodash'],
  rules: {
    // Because some of the modules might be used in browser, prefer import-scope method.
    'lodash/import-scope': ['error', 'method'],
  },
};
