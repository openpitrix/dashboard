const { resolve } = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const postCssOptions = require('./postcss.options');
const WriteHashPlugin = require('./lib/webpack-plugin/WriteHash');
const ManifestPlugin = require('webpack-manifest-plugin');
const { ReactLoadablePlugin } = require('react-loadable/webpack');

const resolveModules = {
  extensions: ['.js', '.jsx', '.scss'],
  alias: {
    scss: resolve(__dirname, 'src/scss')
  },
  modules: [
    resolve(__dirname, 'src'),
    resolve(__dirname, 'lib'),
    resolve(__dirname, 'dist'),
    'node_modules'
  ]
};

const distDir = resolve(__dirname, 'dist');

const clientConfig = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: distDir,
    filename: '[name].js',
    // chunkFilename: '[name].js',
    pathinfo: false,
    publicPath: '/dist/'
  },
  performance: {
    hints: false
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
        test: /\.(jpg|png|svg)(\?.+)?$/,
        use: 'url-loader?limit=100000',
        include: [resolve(__dirname, 'src/assets'), resolve(__dirname, 'src/components')]
      },
      {
        test: /\.(ttf|otf|eot|woff2?)(\?.+)?$/,
        use: 'file-loader',
        include: [resolve(__dirname, 'src/assets'), resolve(__dirname, 'src/components')]
      },
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
      }
    ]
  },
  resolve: resolveModules,
  plugins: [
    new ExtractTextPlugin({
      filename: 'bundle.css',
      allChunks: true
    }),
    new webpack.NamedModulesPlugin(),
    // new ManifestPlugin(),
    new WriteHashPlugin(),
    new ReactLoadablePlugin({
      filename: resolve(__dirname, './server/react-loadable.json'),
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
    new webpack.DefinePlugin({
      'process.env.BROWSER': true,
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ],
  optimization: {
    minimize: false,
    // runtimeChunk: {
    //   name: 'runtime'
    // },
    // namedModules: true,
    // splitChunks: {
    //   cacheGroups: {
    //     vendors: {
    //       name: 'vendors',
    //       test: /[\\/]node_modules[\\/]/,
    //       priority: -10,
    //       chunks: 'all'
    //     }
    //   }
    // }
  }
};

const serverConfig = {
  mode: 'production',
  entry: './server/server.js',
  target: 'node',
  externals: [nodeExternals()],
  output: {
    path: distDir,
    filename: 'server.js',
    libraryTarget: 'commonjs2'
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
        test: /\.scss$/,
        use: [
          {
            loader: 'css-loader/locals',
            options: {
              importLoaders: 1,
              localIdentName: '[folder]__[local]--[hash:base64:5]',
              modules: true
            }
          },
          { loader: 'sass-loader' }
        ]
      }
    ]
  },
  resolve: resolveModules,
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ],
  optimization: {
    minimize: false
  }
};

module.exports = [clientConfig, serverConfig];
