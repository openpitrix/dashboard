const { resolve } = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MinifyPlugin = require('babel-minify-webpack-plugin');
const baseConfig = require('./webpack.base');
const postCssOptions = require('./postcss.options');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, 'dist/'),
    publicPath: '/dist',
  },
  module: {
    rules: [
      ...baseConfig.moduleRules,
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true,
                importLoaders: 1,
                localIdentName: '[folder]__[local]--[hash:base64:5]',
                modules: true,
              },
            },
            {
              loader: 'postcss-loader',
              options: postCssOptions,
            },
            { loader: 'sass-loader' },
          ],
        }),
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true,
                importLoaders: 2,
                localIdentName: '[folder]__[local]--[hash:base64:5]',
                modules: true,
              },
            },
          ],
        }),
      },
    ],
  },
  resolve: baseConfig.resolve,
  plugins: [
    new ExtractTextPlugin({
      filename: 'bundle.css',
      allChunks: true,
    }),
    // new webpack.optimize.OccurrenceOrderPlugin(),
    // new webpack.optimize.UglifyJsPlugin({
    //   parallel: 4,
    //   uglifyOptions: {
    //     compressor: {
    //       ecma: 6,
    //       screw_ie8: true,
    //       warnings: false,
    //     },
    //     output: {
    //       comments: false,
    //     },
    //   },
    // }),
    new MinifyPlugin({ evaluate: false, mangle: false }, {
      comments: false,
      exclude: /node_modules/,
    }),
    new webpack.DefinePlugin({
      'process.env.DEV': false,
      'process.env.BROWSER': true,
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
};
