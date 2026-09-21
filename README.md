# eslint-plugin-commons

> ESLint configurations used across API3 projects.

The modules consists of multiple ESLint configurations supporting wide variety of targets:

- `universal` - Linting rules for universal (both FE and BE) JS/TS code (with the emphasis on TS).
- `react` - Linting rules for React code, including JSX accessibility rules.
- `nextJs` - Next.js specific rules only. It carries no React or accessibility rules of its own, so spread it alongside
  `react`.
- `jest` - Linting rules for Jest tests. Note, that these rules are only applied for JS/TS files with `*.test.*`
  extensions.

Requires ESLint v10 and Node.js v22.13 or newer.

## Getting started

1. Create an `eslint.config.js` configuration file in the repo root.
2. Import this plugin and spread the desired configuration(s).
3. Point `languageOptions.parserOptions` at the `tsconfig.json` file(s). The configuration enables type aware rules, so
   this step is required.
4. Install `eslint` (which is a peer dependency of this module) as a dev dependency.

For example:

```js
const commons = require('@api3/eslint-plugin-commons');

module.exports = [
  ...commons.configs.universal,
  ...commons.configs.jest,
  {
    languageOptions: {
      parserOptions: {
        // We focus primarily on TS and for that we need to specify the TS configs which is project specific. The following
        // is a common monorepo setup (root config and a config for each package).
        project: ['./tsconfig.json', './packages/*/tsconfig.json'],
      },
    },
  },
];
```

The configurations are plain CommonJS, so they can also be imported from an ESM `eslint.config.js`:

```js
import commons from '@api3/eslint-plugin-commons';

export default [...commons.configs.universal];
```

If you are using TS, it's possible that ESLint will complain about `.js` files not being present in the project. This
can likely be fixed by adding `"allowJs": true` to the `tsconfig.json` file.

### Linting commands

We recommend using the following linting commands inside `package.json` scripts:

```json
{
  "eslint:check": "eslint --report-unused-disable-directives --cache . --max-warnings 0",
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

To override a rule, add a config object with a `rules` key after the shared configs in your `eslint.config.js` file. For
example:

```js
module.exports = [
  ...commons.configs.universal,
  {
    rules: {
      'check-file/folder-naming-convention': 'off', // Turns of the kebab-case convention for folder names.
      'unicorn/filename-case': 'off', // Turns of the kebab-case convention for filenames.
      'import-x/no-default-export': 'off', // Turns off the rule that disallows default exports.
      'import-x/prefer-default-export': 'error', // Turns on the rule that prefers default exports.
    },
  },
];
```

To scope an override to a subset of files, give the config object a `files` key:

```js
module.exports = [
  ...commons.configs.universal,
  {
    files: ['packages/frontend/**/*'],
    rules: {
      'unicorn/prefer-global-this': 'off',
    },
  },
];
```

## Migrating from v3

v4 requires ESLint v10 and flat configuration. To migrate a repo:

1. Bump `eslint` to `^10.4.0` and `@api3/eslint-plugin-commons` to `^4.0.0`.
2. Replace `.eslintrc.*` with an `eslint.config.js` as shown above. Move the contents of `.eslintignore` into an
   `{ ignores: [...] }` config object, and move `parserOptions` under `languageOptions`.
3. Drop `--ext js,ts,tsx,jsx` from the lint script. Flat config decides which files to lint, and these configurations
   already cover `cjs`, `cts`, `js`, `jsx`, `mjs`, `mts`, `ts` and `tsx`.
4. Rename `import/*` rules and `eslint-disable` comments to `import-x/*`. `eslint-plugin-import` does not support ESLint
   v10, so it was replaced by the maintained `eslint-plugin-import-x` fork. The rules and their options are unchanged.
5. Rename `deprecation/deprecation` comments to `@typescript-eslint/no-deprecated`. The `eslint-plugin-deprecation`
   plugin only supports ESLint v8 and was removed.
6. Rename `@shopify/prefer-early-return` comments to `unicorn/prefer-early-return` and
   `@shopify/prefer-module-scope-constants` ones to `@typescript-eslint/naming-convention`. The `@shopify/eslint-plugin`
   dependency was dropped and `prefer-early-return` now comes from `eslint-plugin-unicorn`.
7. Scope any rule overrides of your own with a `files` key. v4 lints `package.json` as well as source, so a config
   object with `rules` but no `files` now applies to `package.json` too and will fail with "could not find plugin".
8. Run `eslint --fix` and then clean up whatever is left. Expect some stale `eslint-disable` directives to be reported,
   because `eslint-plugin-unicorn` renamed a number of rules.

## For developers

This sections is intended for developers of this repo.

### Release

1. Run `pnpm version [major|minor|patch]` by choosing the appropriate version bump.
2. Push the changes to the `main`, either directly or via a pull request.
3. The CI will register a new version and handle the release process.
