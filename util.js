/**
 * Miscellaneous utility functions/classes.
 */
/* eslint global-require: off, import/no-dynamic-require: off */

const conforms = require('lodash.conforms');
const isObject = require('lodash.isobject');
const isString = require('lodash.isstring');

/**
 * Attempt to require(module) and return the result if successful; otherwise
 * return undefined.
 */
function ifRequire(module) {
  try {
    return require(module);
  } catch (error) {
    if (error.code !== 'MODULE_NOT_FOUND') {
      throw error;
    }
    return undefined;
  }
}

const MessageTypes = Object.freeze({
  TWEET: 0,
  DISCONNECT: 1,
  STALL_WARNING: 2,

  isTweet: conforms({
    id_str: isString,
    text: isString,
    user: isObject,
  }),

  isDisconnect: conforms({
    disconnect: isObject,
  }),

  isStallWarning: conforms({
    warning: isObject,
  }),

  detect(message) {
    if (this.isTweet(message)) {
      return this.TWEET;
    }
    if (this.isDisconnect(message)) {
      return this.DISCONNECT;
    }
    if (this.isStallWarning(message)) {
      return this.STALL_WARNING;
    }

    // Unexpected message type
    return null;
  },
});

module.exports = {
  ifRequire, MessageTypes,
};
