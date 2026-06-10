const configs = {};

Object.defineProperties(configs, {
  universal: {
    enumerable: true,
    get: () => require('./src/universal'),
  },
  react: {
    enumerable: true,
    get: () => require('./src/react'),
  },
  nextJs: {
    enumerable: true,
    get: () => require('./src/next-js'),
  },
  'next-js': {
    enumerable: true,
    get: () => require('./src/next-js'),
  },
  jest: {
    enumerable: true,
    get: () => require('./src/jest'),
  },
});

module.exports = {
  configs,
};
