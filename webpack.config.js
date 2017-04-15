/**
 * Configuration file for webpack, the module bundler.
 */

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');

const extractSass = new ExtractTextPlugin({
  filename: '[name].css',
});

module.exports = {
  devtool: 'source-map',
  entry: './server/js/index.js',
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/,
        use: extractSass.extract({
          use: [
            { loader: 'css-loader', options: { sourceMap: true } },
            { loader: 'postcss-loader', options: { sourceMap: true } },
            { loader: 'sass-loader', options: { sourceMap: true } },
          ],
        }),
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env'],
          },
        },
      },
    ],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'server', 'dist'),
  },
  plugins: [
    extractSass,
    new UglifyJSPlugin({ sourceMap: true }),
  ],
};
