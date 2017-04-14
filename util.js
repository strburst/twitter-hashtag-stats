/**
 * Miscellaneous utility functions/classes.
 */
/* eslint global-require: "off", import/no-dynamic-require: "off" */

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

/**
 * Return a list of all own-properties in obj with falsy values.
 */
function falsyProps(obj) {
  return Object.getOwnPropertyNames(obj).filter(prop => !obj[prop]);
}

module.exports = {
  ifRequire,
  falsyProps,
};
