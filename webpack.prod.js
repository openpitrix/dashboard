const { resolve } = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const CompressionPlugin = require('compression-webpack-plugin');
const postCssOptions = require('./config/postcss.options');
const baseConfig = require('./webpack.base');
const ManifestPlugin = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const staticFileRule = {
  test: /\.(jpg|png|svg)(\?.+)?$/,
  loader: 'url-loader?limit=100000',
  include: [resolve(__dirname, 'public'), resolve(__dirname, 'src/components')]
};

const fontRule = {
  test: /\.(ttf|otf|eot|woff2?)(\?.+)?$/,
  loader: 'file-loader',
  include: [resolve(__dirname, 'public'), resolve(__dirname, 'src/components')]
};

const clientConfig = merge.smart(baseConfig, {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: resolve(__dirname, 'dist'),
    filename: '[name].[contenthash:6].js',
    chunkFilename: '[name].[chunkhash:6].js',
    publicPath: '/dist/'
  },
  module: {
    rules: [
      { ...staticFileRule },
      { ...fontRule },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
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
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new ManifestPlugin({
      publicPath: '/dist/'
    }),
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      cache: true,
      test: /\.(js|css)$/,
      threshold: 1024 * 10 // bytes
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[id].css'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
});

const serverConfig = merge.smartStrategy({
  'module.rules': 'replace',
  optimization: 'replace'
})(baseConfig, {
  mode: 'production',
  entry: './server/server.js',
  target: 'node',
  externals: [nodeExternals()],
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'server.js',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/
      },
      merge(staticFileRule, {
        options: {
          emit: false // don't copy files when pack server code
        }
      }),
      merge(fontRule, {
        options: {
          emit: false
        }
      }),
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'css-loader/locals',
            options: {
              importLoaders: 1,
              modules: {
                localIdentName: '[folder]__[local]--[hash:base64:5]'
              }
            }
          },
          { loader: 'sass-loader' }
        ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ],
  optimization: {}
});

module.exports = [clientConfig, serverConfig];
