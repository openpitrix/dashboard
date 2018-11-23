const { resolve } = require('path');
const webpack = require('webpack');
const webpackNotifier = require('webpack-notifier');
const postCssOptions = require('./config/postcss.options');

module.exports = {
  mode: 'development',
  entry: [
    // 'webpack-hot-middleware/client',
    './src/index.js'
  ],
  output: {
    filename: '[name].js',
    // chunkFilename: "[name].[chunkhash].js",
    path: resolve(__dirname, 'build/'),
    publicPath: '/build/',
    pathinfo: false
  },
  performance: {
    hints: 'warning'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: '.cache/babel-loader'
            }
          }
        ],
        include: [resolve(__dirname, 'src'), resolve(__dirname, 'lib')]
      },
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
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        use: [
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
  resolve: {
    extensions: ['.js', '.jsx', '.scss', '.css'],
    alias: {
      scss: resolve(__dirname, 'src/scss')
    },
    modules: [
      resolve(__dirname, 'src'),
      resolve(__dirname, 'lib'),
      'node_modules'
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
      'process.env.BROWSER': true,
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          name: 'vendors',
          chunks: 'initial',
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        commons: {
          name: 'commons',
          chunks: 'all',
          minChunks: 2
        },
        default: {
          minSize: 0,
          minChunks: 1,
          reuseExistingChunk: true
        }
      }
    }
  }
};
