const path = require('node:path');

const { tagAndRelease } = require('@api3/commons');

function main() {
  return tagAndRelease('eslint-plugin-commons', path.join(__dirname, '../package.json'));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.info(error);
    process.exitCode = 1;
  });
