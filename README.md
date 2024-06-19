# eslint-plugin-commons

> ESLint configurations used across API3 projects.

The modules consists of multiple ESLint configurations supporting wide variety of targets:

- `universal` - Linting rules for universal (both FE and BE) JS/TS code (with the emphasis on TS).
- `react` - Linting rules for React code.
- `next-js` - Linting rules for Next.js code.
- `jest` - Linting rules for Jest tests. Note, that these rules are only applied for JS/TS files with `*.test.*`
  extensions.

## Getting started

1. Create an `.eslintrc.js` configuration file in the repo root.
2. Extend the desired configuration(s).
3. Specify the `parserOptions.project` option with the path to the `tsconfig.json` file(s).
4. Install `eslint` (which is a peer dependency of this module) as dev dependencies.

For example:

```js
module.exports = {
  extends: ['plugin:@api3/eslint-plugin-commons/universal', 'plugin:@api3/eslint-plugin-commons/jest'],
  parserOptions: {
    // We focus primarily on TS and for that we need to specify the TS configs which is project specific. The following
    // is a common monorepo setup (root config and a config for each package).
    project: ['./tsconfig.json', './packages/*/tsconfig.json'],
  },
};
```

### Linting commands

We recommend using the following linting commands inside `package.json` scripts:

```json
{
  "eslint:check": "eslint --report-unused-disable-directives --cache --ext js,ts,tsx,jsx . --max-warnings 0",
  "eslint:fix": "pnpm run eslint:check --fix"
}
```

The `--cache` parameter makes ESLint create a `.eslintcache` file in the root of the project. This file should be put to
`.gitignore`.

## Rules

The configurations are a collection of various rulesets and the config is quite strict. In general there are rules that:

- Have a fixer (import ordering)
- Simplify code (combine two nested ifs)
- Make code more consistent (make `return void` pattern be split on two lines)
- Fix outdated stuff (avoid `!` ts operator when not necessary)
- Avoid vulnerabilities and errors (Number.parseInt without radix)

Tip: Some rules do have fixer with multiple variants of the fixes. You need to use the IDE to prompt the fixes and
choose the one you want.

### Overriding rules

To override a rule, you can use the `rules` section key in your `.eslintrc.js` file. For example:

```js
{
  rules: {
    'check-file/folder-naming-convention': 'off', // Turns of the kebab-case convention for folder names.
    'unicorn/filename-case': 'off' // Turns of the kebab-case convention for filenames.
    'import/no-default-export': 'off', // Turns off the rule that disallows default exports.
    'import/prefer-default-export': 'error' // Turns on the rule that prefers default exports.
  }
}
```
