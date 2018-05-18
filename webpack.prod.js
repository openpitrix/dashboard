const { resolve } = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MinifyPlugin = require('babel-minify-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const commonConfig = require('./webpack.common');
const postCssOptions = require('./postcss.options');

const distDir = resolve(__dirname, 'dist');

const clientConfig = {
  entry: './src/index.js',
  output: {
    path: distDir,
    filename: 'bundle.js'
  },
  // devtool: 'eval',  // cheap-module-eval-source-map
  module: {
    rules: [
      ...commonConfig.moduleRules,
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true,
                importLoaders: 2,
                localIdentName: '[folder]__[local]--[hash:base64:5]',
                modules: true
              }
            },
            {
              loader: 'postcss-loader',
              options: postCssOptions
            },
            { loader: 'sass-loader' }
          ]
        })
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              minimize: false,
              importLoaders: 0,
              localIdentName: '[folder]__[local]--[hash:base64:5]',
              modules: true
            }
          }
        ]
      }
    ]
  },
  resolve: commonConfig.resolve,
  plugins: [
    new ExtractTextPlugin({
      filename: 'bundle.css',
      allChunks: true
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
    new MinifyPlugin(
      { evaluate: false, mangle: false },
      {
        comments: false,
        exclude: /node_modules/
      }
    ),
    new webpack.DefinePlugin({
      'process.env.BROWSER': true,
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
};

const serverConfig = {
  entry: './server/server.js',
  target: 'node',
  externals: [nodeExternals()],
  output: {
    path: distDir,
    filename: 'server.js',
    libraryTarget: 'commonjs2'
  },
  devtool: 'cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: 'babel-loader',
        // include: [resolve(__dirname, 'src'), resolve(__dirname, 'lib')],
        exclude: /(node_modules)/
      },
      {
        test: /\.(jpg|png|svg)(\?.+)?$/,
        loader: 'url-loader?limit=100000',
        include: [resolve(__dirname, 'src/assets'), resolve(__dirname, 'src/components')],
        options: {
          emit: false // don't copy the files
        }
      },
      {
        test: /\.(ttf|otf|eot|woff2?)(\?.+)?$/,
        loader: 'file-loader',
        include: [resolve(__dirname, 'src/assets'), resolve(__dirname, 'src/components')],
        options: {
          emit: false
        }
      },
      {
        test: /\.s?css$/,
        use: [
          {
            loader: 'css-loader/locals'
          }
        ]
      }
    ]
  },
  resolve: commonConfig.resolve,
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
};

module.exports = [
  // clientConfig,
  serverConfig
];
