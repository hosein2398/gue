#!/usr/bin/env node
const program = require('commander');
const logger = require('./logger');
const Gue = require('.');

program
  .arguments('<componentName> [direcroty]')
  .option('-u, --unit', 'create unit test of the component too')
  .option('-t, --template <name>', 'define which template to use');

const params = program.parse(process.argv);

try {
  // eslint-disable-next-line no-negated-condition
  if (!params.args[0]) {
    logger.warn(`
    You must supply a name for your component
    Usage: gue <componentName> [directory] [options]`);
  } else {
    const gue = new Gue(params.args[0], params.args[1], params);
    gue.generate();
  }
} catch (error) {
  logger.error(error);
}
