const js = require('@eslint/js');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const { createTypeScriptImportResolver } = require('eslint-import-resolver-typescript');
const checkFile = require('eslint-plugin-check-file');
const functional = require('eslint-plugin-functional').default;
const importX = require('eslint-plugin-import-x');
const lodash = require('eslint-plugin-lodash');
const promise = require('eslint-plugin-promise');
const unicorn = require('eslint-plugin-unicorn').default;
const globals = require('globals');

const {
  moduleScopeConstantsNamingConvention,
  scopeToDefaultFiles,
  universalImportOrderConfig,
  universalRestrictedImportsConfig,
} = require('./internal');

module.exports = scopeToDefaultFiles([
  js.configs.recommended,
  // The type aware ruleset is used because every API3 repo is TypeScript. Consumers therefore have to point
  // "languageOptions.parserOptions" at their tsconfig, as documented in the README.
  ...tsPlugin.configs['flat/recommended-type-checked'],
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  unicorn.configs.recommended,
  promise.configs['flat/recommended'],
  // The lodash plugin does not ship a flat configuration, so its recommended rules are wired up by hand.
  { plugins: { lodash }, rules: lodash.configs.recommended.rules },
  {
    settings: {
      // The TypeScript resolver is pinned here rather than looked up by name from the consumer's node_modules, where a
      // stale copy with the old resolver interface breaks every import-x rule. "resolver-next" also takes precedence
      // over the legacy "import-x/resolver" setting, so such a copy is never consulted.
      'import-x/resolver-next': [createTypeScriptImportResolver()],
    },
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022, // Allows for the parsing of modern ECMAScript features.
      sourceType: 'module', // Allows for the use of imports.
      globals: { ...globals.node, ...globals.browser },
    },
    // The "functional" and "check-file" plugins are registered without their shared configurations, because we only
    // enable a handful of their rules.
    plugins: { 'check-file': checkFile, functional },
    rules: {
      /* Rule definitions and overrides for standard ESLint rules */
      camelcase: 'error',
      curly: ['error', 'multi-line', 'consistent'],
      eqeqeq: 'error',
      'no-await-in-loop': 'off', // Too restrictive, often false yields to more verbose code.
      'no-console': ['error', { allow: ['info', 'groupCollapsed', 'groupEnd'] }],
      'no-constant-condition': 'off', // Writing a "while(true)"" loop is often the most readable way to express the intent.
      'no-fallthrough': 'off', // Does not work well with typescript exhaustive enums.
      'no-inline-comments': 'off',
      'no-lonely-if': 'error',
      'no-nested-ternary': 'error',
      'no-restricted-imports': ['error', universalRestrictedImportsConfig], // The "@typescript-eslint" version is deprecated, the core rule now covers type imports too.
      'no-return-await': 'off', // Deprecated and no longer recommended.
      'no-shadow': 'off', // Superceded by @typescript-eslint/no-shadow.
      'no-unexpected-multiline': 'off', // Conflicts with prettier.
      'object-shorthand': 'error',
      'prefer-destructuring': 'off', // Superceded by @typescript-eslint/prefer-destructuring.
      'prefer-exponentiation-operator': 'error',
      'prefer-named-capture-group': 'off', // Forces you to add a group name even if it is useless.
      'prefer-object-spread': 'error',
      'prefer-template': 'error',
      radix: 'error',
      // Sort keys does not have a fixer, but sorting lines can be trivially done by IDE (or some plugin). This rule has a
      // nice configuration option "minKeys" which can specify how many keys should be present in an object before sorting
      // is enforced. This is useful for small objects, where sorting is not necessary. Also, it allows creating groups
      // (separated by newlines) which are sorted independently.
      'sort-keys': [
        'error',
        'asc',
        { caseSensitive: true, natural: true, minKeys: 10, allowLineSeparatedGroups: true },
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

      /* Rules to enforce kebab-case folder structure */
      'check-file/folder-naming-convention': [
        'error',
        {
          '**/': 'KEBAB_CASE',
        },
      ],
      'unicorn/filename-case': [
        'error',
        {
          case: 'kebabCase',
          ignore: [],
        },
      ],

      /* Rule overrides for "unicorn" plugin */
      'unicorn/consistent-function-scoping': 'off', // Disabling due to the rule's constraints conflicting with established patterns, especially in test suites where local helper or mocking functions are prevalent and do not necessitate exports.
      'unicorn/import-style': [
        'error',
        {
          styles: {
            'node:path': { named: true }, // Allows import { join } from 'node:path';
            'node:util': { default: true }, // Allows import util from 'node:util';
          },
        },
      ],
      'unicorn/no-abusive-eslint-disable': 'off', // Already covered by different ruleset.
      'unicorn/no-array-for-each': 'off', // We use .forEach extensively across the api3dao org and even though this can be solved with --fix and there are benefits, it will generate a lot of friction.
      'unicorn/no-array-reduce': 'off', // We are OK with using reduce occasionally, but I agree with the author that the code using reduce can easily get complex.
      'unicorn/no-for-loop': 'off', // Simple for loops are sometimes fine.
      'unicorn/no-nested-ternary': 'off', // This rule is smarter than the standard ESLint rule, but conflicts with prettier so it needs to be turned off. Nested ternaries are very unreadable so it's OK if all of them are flagged.
      'unicorn/no-null': 'off', // We use both null and undefined for representing three state objects. We could use a string union instead, but using combination of null and undefined is less verbose.
      'unicorn/no-object-as-default-parameter': 'off', // Too restrictive. TypeScript can ensure that the default value matches the type.
      'unicorn/no-process-exit': 'off',
      'unicorn/no-useless-undefined': ['error', { checkArguments: false }], // We need to disable "checkArguments", because if a function expects a value of type "T | undefined" the undefined value needs to be passed explicitly.
      'unicorn/prefer-module': 'off', // We use CJS for configuration files and tests. There is no rush to migrate to ESM and the configuration files are probably not yet ready for ESM yet.
      'unicorn/prefer-string-raw': 'off', // We commonly escape \ in strings.
      'unicorn/prefer-top-level-await': 'off',
      'unicorn/prevent-abbreviations': 'off', // This rule reports many false positives and leads to more verbose code.

      /* Rule overrides for "import-x" plugin */
      'import-x/namespace': 'off', // Analyses a module's literal exports, so it cannot see the type augmentation that plugins rely on and reports valid members such as "hre.ethers". TypeScript checks the same thing and gets it right.
      'import-x/no-default-export': 'error',
      'import-x/no-duplicates': 'error',
      'import-x/no-named-as-default': 'off',
      'import-x/no-named-as-default-member': 'off', // Fires on the documented usage of CommonJS interop packages, e.g. "dotenv.config()" or "winston.format(...)", where the default import is the intended API.
      'import-x/no-unresolved': 'off', // Does not accept exports keyword. See: https://github.com/import-js/eslint-plugin-import/issues/1810.
      'import-x/order': ['error', universalImportOrderConfig],

      /* Rule overrides for "@typescript-eslint" plugin */
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
          disallowTypeAnnotations: false, // It is quite common to do so. See: https://typescript-eslint.io/rules/consistent-type-imports/#disallowtypeannotations.
          fixStyle: 'inline-type-imports',
        },
      ],
      '@typescript-eslint/consistent-return': 'off', // Does not play with no useless undefined when function return type is "T | undefined" and does not have a fixer.
      '@typescript-eslint/explicit-function-return-type': 'off', // Prefer inferring types to explicit annotations.
      '@typescript-eslint/explicit-module-boundary-types': 'off', // We export lot of functions in order to test them. Typing them all is not a good idea.
      '@typescript-eslint/init-declarations': 'off', // Too restrictive, TS is able to infer if value is initialized or not. This pattern does not work with declaring a variable and then initializing it conditionally (or later).
      '@typescript-eslint/max-params': 'off',
      '@typescript-eslint/member-ordering': 'off', // Does not have a fixer. Also, sometimes it's beneficial to group related members together.
      '@typescript-eslint/naming-convention': moduleScopeConstantsNamingConvention,
      '@typescript-eslint/no-confusing-void-expression': [
        'error',
        {
          ignoreArrowShorthand: true, // See: https://typescript-eslint.io/rules/no-confusing-void-expression/#ignorearrowshorthand.
        },
      ],
      '@typescript-eslint/no-deprecated': 'error', // Replaces the "deprecation/deprecation" rule, whose plugin only supports ESLint v8.
      '@typescript-eslint/no-dynamic-delete': 'off',
      '@typescript-eslint/no-empty-function': 'off', // Too restrictive, often false yields to more verbose code.
      '@typescript-eslint/no-explicit-any': 'off', // Using "any" is sometimes necessary.
      '@typescript-eslint/no-magic-numbers': 'off', // Too restrictive. There is often nothing wrong with inlining numbers.
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: {
            arguments: false, // It's common to pass async function where one expects a function returning void.
            attributes: false, // It's common to pass async function where one expects a function returning void.
          },
        },
      ],
      '@typescript-eslint/no-non-null-assertion': 'off', // Too restrictive. The inference is often not powerful enough or there is not enough context.
      '@typescript-eslint/no-require-imports': 'off', // We use a similar rule called "@typescript-eslint/no-var-imports" which bans require imports alltogether.
      '@typescript-eslint/no-shadow': ['error', { ignoreOnInitialization: true }], // "ignoreOnInitialization" permits the common "const x = xs.find((x) => ...)" pattern, where the shadowed binding is not initialized yet.
      '@typescript-eslint/no-unnecessary-condition': 'off', // Suggests removing useful conditionals for index signatures and arrays. Would require enabling additional strict checks in TS, which is hard to ask.
      '@typescript-eslint/no-unsafe-argument': 'off', // Too restrictive, often false yields to more verbose code.
      '@typescript-eslint/no-unsafe-assignment': 'off', // Too restrictive, often false yields to more verbose code.
      '@typescript-eslint/no-unsafe-call': 'off', // Too restrictive, often false yields to more verbose code.
      '@typescript-eslint/no-unsafe-member-access': 'off', // Too restrictive, often false yields to more verbose code.
      '@typescript-eslint/no-unsafe-return': 'off', // Too restrictive, often false yields to more verbose code.
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          vars: 'all',
          ignoreRestSiblings: true, // Allow dropping a property by destructuring the rest of the object.
        },
      ],
      '@typescript-eslint/no-use-before-define': 'off', // Too restrictive, does not have a fixer and is not important.
      // The base rule also flags declarations that carry an explicit type annotation, which cannot be rewritten as a
      // destructuring without making them worse. This version knows about the annotation and leaves them alone.
      '@typescript-eslint/prefer-destructuring': [
        'error',
        {
          array: false, // For arrays it is often confusing to use destructuring.
          object: true,
        },
        {
          enforceForRenamedProperties: false,
        },
      ],
      '@typescript-eslint/prefer-nullish-coalescing': [
        'error',
        {
          ignoreConditionalTests: true, // Its more intuitive to use logical operators in conditionals.
        },
      ],
      '@typescript-eslint/prefer-readonly-parameter-types': 'off', // Too restrictive, often false yields to more verbose code.
      '@typescript-eslint/strict-boolean-expressions': 'off', // While the rule is reasonable, it is often convenient and intended to just check whether the value is not null or undefined. Enabling this rule would make the code more verbose. See: https://typescript-eslint.io/rules/strict-boolean-expressions/
      '@typescript-eslint/unbound-method': 'off', // Reports issues for common patterns in tests (e.g. "expect(logger.warn)..."). Often the issue yields false positives.
      '@typescript-eslint/use-unknown-in-catch-callback-variable': 'off',

      /* Rule overrides for "functional" plugin */
      'functional/no-classes': 'error', // Functions are all we need.
      'functional/no-try-statements': 'error', // Use go utils instead.

      /* Overrides for "lodash" plugin */
      'lodash/import-scope': ['error', 'member'], // We prefer member imports in node.js code. This is not recommended for FE projects, because lodash can't be tree shaken (written in CJS not ESM). This rule should be overridden for FE projects (and we do so in React ruleset).
      'lodash/path-style': 'off', // Can potentially trigger TS errors. Both variants have use cases when they are more readable.
      'lodash/prefer-immutable-method': 'off',
      'lodash/prefer-lodash-method': 'off', // Disagree with this rule. Using the native method is often simpler.
      'lodash/prop-shorthand': 'off',
    },
  },
]);
