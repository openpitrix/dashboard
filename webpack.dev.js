const { resolve } = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const webpackNotifier = require('webpack-notifier');
const postCssOptions = require('./config/postcss.options');
const baseConfig = require('./webpack.base');

module.exports = merge(baseConfig, {
  mode: 'development',
  entry: [
    // 'webpack-hot-middleware/client',
    './src/index.js'
  ],
  output: {
    filename: '[name].js',
    path: resolve(__dirname, 'build/'),
    publicPath: '/build/'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        enforce: 'pre',
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          fix: true
        }
      },
      {
        test: /\.scss$/,
        use: [
          'cache-loader',
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              minimize: false,
              importLoaders: 2,
              localIdentName: '[folder]__[local]--[hash:base64:5]',
              modules: true
            }
          },
          {
            loader: 'postcss-loader',
            options: postCssOptions
          },
          {
            loader: 'sass-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    // new webpack.HotModuleReplacementPlugin(),
    new webpackNotifier({
      title: `Openpitrix dashboard`,
      alwaysNotify: true,
      excludeWarnings: true
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ]
});
