const path = require('path');
const ExtractCSS = require('extract-text-webpack-plugin');

const root = (dir) => path.resolve(__dirname, '..', dir);

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
      scss: root('src/scss'),
    },
  },

  plugins: [
    new ExtractCSS({
      filename: 'bundle.css',
      allChunks: true,
    }),
  ],
};
