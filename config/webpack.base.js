const path = require('path');
const ExtractCSS = require('extract-text-webpack-plugin');
const postCssOptions = require('./postcss.options');

const root = (dir) => path.resolve(__dirname, '..', dir);
const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  entry: {},
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: [
          root('src'),
          root('core'),
        ],
      },
      {
        test: /\.(jpg|png|svg)(\?.+)?$/,
        loader: 'url-loader?limit=100000',
        include: [
          root('src/assets'),
          root('src/components'),
        ],
      },
      {
        test: /\.(ttf|otf|eot|woff2?)(\?.+)?$/,
        loader: 'file-loader',
        include: [
          root('src/assets'),
          root('src/components'),
        ],
      },
      {
        test: /\.s[ac]ss$/,
        loader: ExtractCSS.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: isProd,
                importLoaders: 1,
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
    ],
  },

  output: {
    filename: 'bundle.js',
    sourcePrefix: '',
  },

  resolve: {
    extensions: [
      '.js',
      '.jsx',
    ],
    alias: {
      core: root('core'),
    },
  },

  plugins: [
    new ExtractCSS({
      filename: 'bundle.css',
      allChunks: true,
    }),
  ],
};
