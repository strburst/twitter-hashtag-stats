/**
 * Attempt to read API tokens from secrets.js(on)?, then environment variables.
 */

const { ifRequire, falsyProps } = require('./util');

const secrets = Object.assign({}, {
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
}, ifRequire('./secrets'));

const unsetSecrets = falsyProps(secrets);
if (unsetSecrets.length > 0) {
  throw new Error(`Configuration error: secrets are unset: ${unsetSecrets.join(', ')}`);
}

module.exports = {
  secrets,
};
