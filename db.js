#!/usr/bin/env node
/* eslint no-unused-expressions: off */

function create() {
}

function drop() {
}

require('yargs')
  .usage('$0 <command> [args]')
  .command('create', 'Creates the database', {}, create)
  .command('drop', 'Deletes the database', {}, drop)
  .demandCommand(1, 1, 'Must provide exactly one subcommand')
  .help()
  .argv;
