// Smoke tests for the exported configurations. These assert that the rules are actually applied to the files they are
// meant to apply to. A configuration that silently matches nothing still lints "successfully", so without these checks
// a broken ruleset looks exactly like a passing one.

const tsPlugin = require('@typescript-eslint/eslint-plugin');
const { ESLint } = require('eslint');
const jestPlugin = require('eslint-plugin-jest');

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
  tsPlugin.configs['flat/disable-type-checked'],
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
    code: 'export const run = (a: number) => {\n  if (a > 0) {\n    console.info(a);\n    console.info(a);\n  }\n};\n',
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
    name: 'universal enables the type aware ruleset',
    configs: commons.configs.universal,
    filePath: 'src/example.ts',
    code: 'export const a = 1;\n',
    enabledInBaseConfig: ['@typescript-eslint/await-thenable', '@typescript-eslint/only-throw-error'],
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
    name: 'jest applies to test files',
    configs: [...commons.configs.universal, ...commons.configs.jest],
    filePath: 'src/example.test.ts',
    code: "describe('a', () => {\n  it.only('b', () => {\n    expect(1).toBe(1);\n  });\n});\n",
    reports: ['jest/no-focused-tests'],
    enabled: ['jest/no-identical-title', 'jest/padding-around-test-blocks'],
  },
  {
    name: 'jest does not leak into non test files',
    configs: [...commons.configs.universal, ...commons.configs.jest],
    filePath: 'src/example.ts',
    code: "export const a = it.only('b');\n",
    notEnabled: ['jest/'],
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
