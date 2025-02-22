import globals from 'globals';
import universal from './dist/esm/src/universal.js';

export default [
  ...universal,
  {
    files: ['**/*.{js,mjs,ts,tsx}'],
    ignores: ['**/node_modules/**', '**/dist/**', '**/build/**'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2015,
      },
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        project: './tsconfig.json',
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];
