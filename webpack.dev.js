const { resolve } = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const webpackNotifier = require('webpack-notifier');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const postCssOptions = require('./config/postcss.options');
const baseConfig = require('./webpack.base');

module.exports = merge(baseConfig, {
  mode: 'development',
  entry: [
    // 'webpack-hot-client/client',
    './src/index.js'
  ],
  output: {
    filename: '[name].js',
    path: resolve(__dirname, 'build/'),
    publicPath: '/build/'
  },
  module: {
    rules: [
      // {
      //   test: /\.jsx?$/,
      //   enforce: 'pre',
      //   exclude: /node_modules/,
      //   loader: 'eslint-loader',
      //   options: {
      //     fix: true
      //   }
      // },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              modules: {
                localIdentName: '[folder]__[local]--[hash:base64:5]'
              }
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
  // optimization: {
  //   splitChunks: {
  //     minSize: 60 * 1000,
  //     maxSize: 3000 * 1000,
  //   }
  // },
  plugins: [
    // new webpack.NamedModulesPlugin(),
    // new webpack.HotModuleReplacementPlugin(),

    new webpackNotifier({
      title: `Openpitrix dashboard`,
      alwaysNotify: true,
      excludeWarnings: true
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
    // new webpack.ProgressPlugin(),
    // new BundleAnalyzerPlugin()
  ]
});
