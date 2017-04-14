#!/usr/bin/env node
/* eslint no-unused-expressions: "off" */

const Sequelize = require('sequelize');
const config = require('./config');
const yargs = require('yargs');

// Set up the connection with db
const db = new Sequelize(config.db.name, config.db.username, config.db.password, config.db.options);

const create = null;
const drop = null;

if (require.main === module) {
  yargs
    .usage('$0 <command> [args]')
    .command('create', 'Creates the database', {}, create)
    .command('drop', 'Deletes the database', {}, drop)
    .demandCommand(1, 1, 'Must provide exactly one subcommand')
    .help()
    .argv;
}

module.exports = db;
