/**
 * Attempt to read configuration and API tokens from custom.js(on)?, then environment variables.
 */

const { ifRequire, falsyProps } = require('./util');
const debug = require('debug')('tss:orm');

const custom = ifRequire('./custom');

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
}, custom ? custom.db : undefined);

const keys = Object.assign({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
}, custom ? custom.keys : undefined);

const unsetKeys = falsyProps(keys);
if (unsetKeys.length > 0) {
  throw new Error(`Configuration error: secrets are unset: ${unsetKeys.join(', ')}`);
}

module.exports = {
  db,
  keys,
};
