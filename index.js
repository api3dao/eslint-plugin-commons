const configs = {};

// Exposed as lazy getters so that a repo only pays for loading the plugins of the rulesets it actually uses. A backend
// repo spreading just "universal" never loads the React, Next.js or Jest plugins.
Object.defineProperties(configs, {
  universal: { enumerable: true, get: () => require('./src/universal') },
  react: { enumerable: true, get: () => require('./src/react') },
  nextJs: { enumerable: true, get: () => require('./src/next-js') },
  jest: { enumerable: true, get: () => require('./src/jest') },
  vitest: { enumerable: true, get: () => require('./src/vitest') },
});

module.exports = {
  configs,
};
