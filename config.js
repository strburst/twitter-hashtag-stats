/**
 * Attempt to read API tokens from secrets.js(on)?, then environment variables.
 */

const { ifRequire } = require('./util');

module.exports = {
  secrets: ifRequire('./secrets') || {
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  },
};
