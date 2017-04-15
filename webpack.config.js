/**
 * Configuration file for webpack, the module bundler.
 */

const path = require('path');

module.exports = {
  entry: './server/js/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'server', 'dist'),
  },
};
