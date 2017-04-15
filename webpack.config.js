/**
 * Configuration file for webpack, the module bundler.
 */

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

const extractSass = new ExtractTextPlugin({
  filename: '[name].css',
});

module.exports = {
  entry: './server/js/index.js',
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/,
        use: extractSass.extract({
          use: [
            { loader: 'css-loader' },
            { loader: 'sass-loader' },
          ],
        }),
      },
    ],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'server', 'dist'),
  },
  plugins: [
    extractSass,
  ],
};
