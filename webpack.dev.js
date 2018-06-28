const { resolve } = require('path');
const webpack = require('webpack');
const postCssOptions = require('./config/postcss.options');

module.exports = {
  devtool: 'eval',
  entry: [
    // 'webpack-hot-middleware/client',
    './src/index.js'
  ],
  output: {
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    path: resolve(__dirname, 'build/'),
    publicPath: '/build',
    pathinfo: false // for speed
  },
  // profile: true,
  performance: {
    hints: 'warning'
  },
  module: {
    // noParse: function(content){
    //   return /lodash/.test(content);
    // },
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
      // {
      //   test: /\.(jpg|png|svg)(\?.+)?$/,
      //   use: 'url-loader?limit=100000',
      //   include: [resolve(__dirname, 'src/assets'), resolve(__dirname, 'src/components')]
      // },
      // {
      //   test: /\.(ttf|otf|eot|woff2?)(\?.+)?$/,
      //   use: 'file-loader',
      //   include: [resolve(__dirname, 'src/assets'), resolve(__dirname, 'src/components')]
      // },
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
    extensions: ['.js', '.jsx', '.scss'],
    alias: {
      scss: resolve(__dirname, 'src/scss')
    },
    modules: [resolve(__dirname, 'src'), resolve(__dirname, 'lib'), 'node_modules']
  },
  plugins: [
    // new webpack.HotModuleReplacementPlugin(),
    // new webpack.WatchIgnorePlugin([
    //   resolve(__dirname, 'lib'),
    //   resolve(__dirname, 'server'),
    //   resolve(__dirname, 'build'),
    //   resolve(__dirname, 'dist')
    // ]),
    new webpack.DefinePlugin({
      'process.env.BROWSER': true,
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    // new webpack.DllReferencePlugin({
    //   context: __dirname,
    //   manifest: require('./build/vendor.json')
    // }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function(module) {
        return module.context && module.context.includes('node_modules');
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    })

    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'common',
    //   filename: 'common.js',
    //   chunks: 'all',
    //   // async: true,
    //   // children: true,
    //   minChunks: 2
    // })
  ]
};
