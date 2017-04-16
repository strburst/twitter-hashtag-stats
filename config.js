/**
 * Attempt to read configuration and API tokens from custom.js(on)?, then environment variables.
 */
 /* eslint no-console: "off" */

const debug = require('debug')('tss:orm');
const fs = require('fs');

const custom = JSON.parse(fs.readFileSync('./custom.json'));

function checkKeys(name, config) {
  const unsetKeys = Object.getOwnPropertyNames(config).filter(prop => config[prop] === undefined);
  if (unsetKeys.length > 0) {
    console.error(`Configuration error: '${name}' has unset keys: ${unsetKeys.join(', ')}`);
    process.exit(1);
  }
}

const db = Object.assign({
  clear: true,
  name: 'tss',
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  options: {
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    logging: debug,
  },
}, custom ? custom.db : null);
checkKeys('db', db);

const keys = Object.assign({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
}, custom ? custom.keys : null);
checkKeys('keys', keys);

const server = Object.assign({
  port: process.env.PORT || 3000,
}, custom ? custom.server : null);
checkKeys('server', server);

module.exports = {
  db,
  keys,
  server,
};
