// Smoke tests for the exported configurations. These assert that the rules are actually applied to the files they are
// meant to apply to. A configuration that silently matches nothing still lints "successfully", so without these checks
// a broken ruleset looks exactly like a passing one.

const { ESLint } = require('eslint');
const jestPlugin = require('eslint-plugin-jest');
const tseslint = require('typescript-eslint');

const commons = require('../index');

const typeAwareRules = (pluginName, plugin) =>
  Object.fromEntries(
    Object.entries(plugin.rules)
      .filter(([, rule]) => rule.meta?.docs?.requiresTypeChecking)
      .map(([ruleName]) => [`${pluginName}/${ruleName}`, 'off'])
  );

// The type aware rules need a real TypeScript program, which these checks deliberately do not set up. The remaining
// rules need either jest, react or a Next.js project on disk, none of which this repo has.
const linterOverrides = [
  tseslint.configs.disableTypeChecked,
  {
    settings: { react: { version: '19.0' } },
    rules: {
      ...typeAwareRules('jest', jestPlugin),
      '@next/next/no-html-link-for-pages': 'off',
      'jest/no-deprecated-functions': 'off',
    },
  },
];

const checks = [
  {
    name: 'universal applies to TypeScript sources',
    configs: commons.configs.universal,
    filePath: 'src/example.ts',
    code: 'export default () => {\n  try {\n    return 1;\n  } catch {\n    return 2;\n  }\n};\n',
    reports: ['import-x/no-default-export', 'functional/no-try-statements'],
  },
  {
    name: 'universal replaces the rules of the dropped plugins',
    configs: commons.configs.universal,
    filePath: 'src/example.ts',
    code: 'export const run = (a: number) => {\n  if (a > 0) {\n    console.info(a);\n    console.info(a);\n    console.info(a);\n  }\n};\n',
    reports: ['unicorn/prefer-early-return'],
    enabledInBaseConfig: ['@typescript-eslint/naming-convention', '@typescript-eslint/no-deprecated'],
  },
  {
    name: 'universal keeps allowing named imports from node:path',
    configs: commons.configs.universal,
    filePath: 'src/example.ts',
    code: "import { join } from 'node:path';\n\nexport const a = join('b', 'c');\n",
    enabled: ['unicorn/import-style'],
    notReported: ['unicorn/import-style'],
  },
  {
    // A single declaration cannot be out of order with another one, so only the sorting of named imports can report it.
    name: 'universal sorts the names inside an import',
    configs: commons.configs.universal,
    filePath: 'src/example.ts',
    code: "import { join, basename } from 'node:path';\n\nexport const a = join(basename('b'), 'c');\n",
    reports: ['import-x/order'],
  },
  {
    name: 'universal removes unused imports on fix',
    configs: commons.configs.universal,
    filePath: 'src/example.ts',
    code: "import { basename, join } from 'node:path';\n\nexport const a = join('b', 'c');\n",
    reports: ['@typescript-eslint/no-unused-vars'],
    fixes: ['@typescript-eslint/no-unused-vars'],
  },
  {
    // The fixer of this rule calls "context.getSourceCode", which ESLint v10 removed, so it crashes unless patched.
    name: 'universal reports lodash method imports',
    configs: commons.configs.universal,
    filePath: 'src/example.ts',
    code: "import map from 'lodash/map';\n\nexport const doubled = map([1], (value) => value * 2);\n",
    reports: ['lodash/import-scope'],
  },
  {
    name: 'universal applies the regexp rules',
    configs: commons.configs.universal,
    filePath: 'src/example.ts',
    code: 'export const pattern = /^(a+)+$/;\n',
    reports: ['regexp/no-super-linear-backtracking'],
  },
  {
    name: 'universal enables the type aware ruleset',
    configs: commons.configs.universal,
    filePath: 'src/example.ts',
    code: 'export const a = 1;\n',
    enabledInBaseConfig: ['@typescript-eslint/await-thenable', '@typescript-eslint/only-throw-error'],
  },
  {
    name: 'universal enables the hand picked strict rules',
    configs: commons.configs.universal,
    filePath: 'src/example.ts',
    code: 'export const a = 1;\n',
    enabledInBaseConfig: [
      '@typescript-eslint/no-mixed-enums',
      '@typescript-eslint/no-non-null-asserted-nullish-coalescing',
      '@typescript-eslint/no-useless-default-assignment',
      '@typescript-eslint/prefer-reduce-type-parameter',
      '@typescript-eslint/switch-exhaustiveness-check',
    ],
  },
  {
    // ESLint only lints ".js", ".cjs" and ".mjs" by default, so an extension missing from "defaultFiles" is
    // silently skipped rather than reported.
    name: 'universal covers every TypeScript and JavaScript extension',
    configs: commons.configs.universal,
    filePath: 'src/example.mts',
    code: 'export const a = 1;\n',
    enabled: ['import-x/no-default-export'],
  },
  {
    name: 'universal allows default exports in tool config files',
    configs: commons.configs.universal,
    filePath: 'packages/app/hardhat.build.config.ts',
    code: 'const config = {};\n\nexport default config;\n',
    enabled: ['import-x/order'],
    notEnabled: ['import-x/no-default-export'],
  },
  {
    name: 'universal allows default exports in global setup files',
    configs: commons.configs.universal,
    filePath: 'tests/e2e/global-setup.ts',
    code: 'export default async function globalSetup() {}\n',
    enabled: ['import-x/order'],
    notEnabled: ['import-x/no-default-export'],
  },
  {
    // Hardhat has no test configuration of our own, so universal is what relaxes the test rules for its files.
    name: 'universal relaxes the test rules in Hardhat tests',
    configs: commons.configs.universal,
    filePath: 'test/api3-server-v1/Api3ServerV1.sol.ts',
    code: 'export const a = 1;\n',
    notReported: ['unicorn/filename-case'],
    enabled: ['import-x/order', 'unicorn/filename-case'],
    notEnabled: [
      'unicorn/consistent-function-scoping',
      'unicorn/no-global-object-property-assignment',
      'unicorn/prefer-https',
    ],
  },
  {
    name: 'universal relaxes the test rules in files that only tests use',
    configs: commons.configs.universal,
    filePath: 'tests/e2e/fixtures/wallet.ts',
    code: 'export const a = 1;\n',
    enabled: ['import-x/order'],
    notEnabled: [
      'unicorn/consistent-function-scoping',
      'unicorn/no-global-object-property-assignment',
      'unicorn/prefer-https',
    ],
  },
  {
    name: 'universal relaxes the test rules in test setup files',
    configs: commons.configs.universal,
    filePath: 'jest.setup.js',
    code: 'export const a = 1;\n',
    enabled: ['import-x/order'],
    notEnabled: [
      'unicorn/consistent-function-scoping',
      'unicorn/no-global-object-property-assignment',
      'unicorn/prefer-https',
    ],
  },
  {
    // A bare "setup" name is common in source code, so it must not relax the test rules.
    name: 'universal keeps the test rules in source setup files',
    configs: commons.configs.universal,
    filePath: 'src/bots/example/setup.ts',
    code: 'export const a = 1;\n',
    enabled: [
      'unicorn/consistent-function-scoping',
      'unicorn/no-global-object-property-assignment',
      'unicorn/prefer-https',
    ],
  },
  {
    name: 'universal still checks the file name casing of Hardhat tests',
    configs: commons.configs.universal,
    filePath: 'test/helpers/someHelper.sol.ts',
    code: 'export const a = 1;\n',
    reports: ['unicorn/filename-case'],
  },
  {
    name: 'jest applies to test files',
    configs: [...commons.configs.universal, ...commons.configs.jest],
    filePath: 'src/example.test.ts',
    code: "describe('a', () => {\n  it.only('b', () => {\n    expect(1).toBe(1);\n  });\n});\n",
    reports: ['jest/no-focused-tests'],
    enabled: ['jest/no-identical-title', 'jest/padding-around-test-blocks'],
    notEnabled: [
      'unicorn/consistent-function-scoping',
      'unicorn/no-global-object-property-assignment',
      'unicorn/prefer-https',
    ],
  },
  {
    name: 'jest and vitest leave spec files to playwright',
    configs: [...commons.configs.universal, ...commons.configs.jest, ...commons.configs.vitest],
    filePath: 'src/example.spec.ts',
    code: "describe('a', () => {\n  it.only('b', () => {\n    expect(1).toBe(1);\n  });\n});\n",
    notEnabled: ['jest/', 'vitest/'],
  },
  {
    name: 'jest does not leak into non test files',
    configs: [...commons.configs.universal, ...commons.configs.jest],
    filePath: 'src/example.ts',
    code: "export const a = it.only('b');\n",
    enabled: [
      'unicorn/consistent-function-scoping',
      'unicorn/no-global-object-property-assignment',
      'unicorn/prefer-https',
    ],
    notEnabled: ['jest/'],
  },
  {
    name: 'vitest applies to test files',
    configs: [...commons.configs.universal, ...commons.configs.vitest],
    filePath: 'src/example.test.ts',
    code: "describe('a', () => {\n  it.only('b', () => {\n    expect(1).toBe(1);\n  });\n});\n",
    reports: ['vitest/no-focused-tests'],
    enabled: ['vitest/no-identical-title', 'vitest/padding-around-test-blocks'],
    notEnabled: [
      'unicorn/consistent-function-scoping',
      'unicorn/no-global-object-property-assignment',
      'unicorn/prefer-https',
    ],
  },
  {
    name: 'vitest does not leak into non test files',
    configs: [...commons.configs.universal, ...commons.configs.vitest],
    filePath: 'src/example.ts',
    code: "export const a = it.only('b');\n",
    enabled: [
      'unicorn/consistent-function-scoping',
      'unicorn/no-global-object-property-assignment',
      'unicorn/prefer-https',
    ],
    notEnabled: ['vitest/'],
  },
  {
    name: 'playwright applies to spec files',
    configs: [...commons.configs.universal, ...commons.configs.playwright],
    filePath: 'e2e/example.spec.ts',
    code: "import { expect, test } from '@playwright/test';\n\ntest.only('a', async ({ page }) => {\n  test.skip(!process.env.BASE_URL, 'Needs a running app');\n  await expect(page).toHaveTitle('b');\n});\n",
    reports: ['playwright/no-focused-test'],
    notReported: ['playwright/no-skipped-test'],
    enabled: ['playwright/missing-playwright-await'],
    notEnabled: [
      'no-empty-pattern',
      'unicorn/consistent-function-scoping',
      'unicorn/no-global-object-property-assignment',
      'unicorn/prefer-https',
    ],
  },
  {
    name: 'playwright does not leak into test files',
    configs: [...commons.configs.universal, ...commons.configs.playwright],
    filePath: 'src/example.test.ts',
    code: "export const a = test.only('b');\n",
    notEnabled: ['playwright/'],
  },
  {
    name: 'react applies to TSX files',
    configs: [...commons.configs.universal, ...commons.configs.react],
    filePath: 'src/widget.tsx',
    code: 'export const Widget = () => <div></div>;\n',
    reports: ['react/self-closing-comp'],
    enabled: ['react-hooks/rules-of-hooks', 'react-hooks/purity'],
  },
  {
    name: 'react applies the accessibility rules',
    configs: [...commons.configs.universal, ...commons.configs.react],
    filePath: 'src/widget.tsx',
    code: 'export const Widget = () => <img src="/a.png" />;\n',
    reports: ['jsx-a11y/alt-text'],
    enabled: ['jsx-a11y/aria-role', 'jsx-a11y/anchor-is-valid'],
  },
  {
    name: 'nextJs applies its plugin rules',
    configs: [...commons.configs.universal, ...commons.configs.react, ...commons.configs.nextJs],
    filePath: 'pages/index.tsx',
    code: 'export const Page = () => <img src="/a.png" alt="a" />;\n',
    reports: ['@next/next/no-img-element'],
  },
];

const isEnabled = (entry) => {
  const severity = Array.isArray(entry) ? entry[0] : entry;
  return severity !== 'off' && severity !== 0;
};

const runCheck = async (check) => {
  const eslint = new ESLint({ overrideConfigFile: true, overrideConfig: [...check.configs, ...linterOverrides] });
  const [result] = await eslint.lintText(check.code, { filePath: check.filePath });

  const fatal = result.messages.filter((message) => message.fatal);
  if (fatal.length > 0) return `crashed: ${fatal.map((message) => message.message).join('; ')}`;

  const reported = new Set(result.messages.map((message) => message.ruleId));
  const missing = (check.reports ?? []).filter((ruleId) => !reported.has(ruleId));
  if (missing.length > 0) return `expected rules did not report: ${missing.join(', ')}`;

  const unfixable = (check.fixes ?? []).filter((ruleId) =>
    result.messages.every((message) => !(message.ruleId === ruleId && message.fix))
  );
  if (unfixable.length > 0) return `rules reported without an autofix: ${unfixable.join(', ')}`;

  const unexpected = (check.notReported ?? []).filter((ruleId) => reported.has(ruleId));
  if (unexpected.length > 0) return `rules reported but should not have: ${unexpected.join(', ')}`;

  // A rule that is configured but never applied to the file is the failure mode these checks exist for, so what ends
  // up in the resolved configuration is asserted separately from what the rules report on the sample code.
  const { rules } = await eslint.calculateConfigForFile(check.filePath);
  const off = [...(check.reports ?? []), ...(check.enabled ?? [])].filter(
    (ruleId) => !isEnabled(rules[ruleId] ?? 'off')
  );
  if (off.length > 0) return `rules are not enabled in the resolved config: ${off.join(', ')}`;

  const leaked = (check.notEnabled ?? []).flatMap((prefix) =>
    Object.entries(rules)
      .filter(([ruleId, entry]) => ruleId.startsWith(prefix) && isEnabled(entry))
      .map(([ruleId]) => ruleId)
  );
  if (leaked.length > 0) return `rules leaked into the resolved config: ${leaked.slice(0, 5).join(', ')}`;

  // The type aware rules are switched off by the overrides above, so they are asserted against the config the ruleset
  // exports rather than against the one the linter ends up with.
  const exported = {};
  for (const block of check.configs) Object.assign(exported, block.rules ?? {});
  const notInBase = (check.enabledInBaseConfig ?? []).filter((ruleId) => !isEnabled(exported[ruleId] ?? 'off'));
  return notInBase.length > 0 ? `rules are not enabled by the exported config: ${notInBase.join(', ')}` : null;
};

const main = async () => {
  const results = await Promise.all(checks.map(async (check) => ({ check, failure: await runCheck(check) })));

  for (const { check, failure } of results) {
    const detail = failure ? `\n        ${failure}` : '';
    console.info(`${failure ? 'FAIL' : 'ok  '}  ${check.name}${detail}`);
  }

  const failed = results.filter(({ failure }) => failure);
  console.info(`\n${results.length - failed.length}/${results.length} config checks passed`);
  if (failed.length > 0) process.exitCode = 1;
};

main().catch((error) => {
  console.info(error);
  process.exitCode = 1;
});
