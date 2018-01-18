const fs = require('fs-extra-promise');
const mergeWith = require('lodash/mergeWith');
const path = require('path');
const webpack = require('webpack');
const config = require('./webpack.base.js');
const ExtractCSS = require('extract-text-webpack-plugin');
const postCssOptions = require('./postcss.options');

const root = (dir) => path.resolve(__dirname, '..', dir);

console.info('Clearing Build Path');

fs.emptyDirSync(root('build'));

console.info('Environment: Production');

mergeWith(config, {
  cache: false,
  entry: {
    bundle: root('src/index.js'),
  },
  output: {
    path: root('build'),
    publicPath: '/build/',
  },
  module: {
    loaders: [
      {
        test: /\.s[ac]ss$/,
        loader: ExtractCSS.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true,
                importLoaders: 1,
                localIdentName: '[folder]__[local]___[hash:base64:5]',
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
        include: [root('src')],
      },
      {
        test: /\.css$/,
        loader: ExtractCSS.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true,
                importLoaders: 1,
              },
            },
          ],
        }),
      },
    ],
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        screw_ie8: true,
        warnings: false,
      },
      output: {
        comments: false,
      },
    }),
    new webpack.DefinePlugin({
      'process.env.DEV': false,
      'process.env.BROWSER': true,
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
}, (objValue, srcValue) => {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
});

const compiler = webpack(config);
compiler.run((err, stats) => {
  if (err) throw err;

  console.log(stats.toString({
    colors: true,
  }));

  if (stats.hasErrors()) {
    console.error(stats.compilation.errors.toString());
  }
  console.info('Finished compiling');
});
