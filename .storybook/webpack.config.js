const path = require('path');
const postCssOptions = require('../config/postcss.options');

module.exports = {
  context: path.resolve(__dirname, '..', 'src'),

  resolve: {
    alias: {
      scss: path.resolve(__dirname, '../src/scss')
    }
  },
  module: {
    rules: [
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
      },
      {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, '../stories'),
        use: {
          loader: require.resolve('@storybook/addon-storysource/loader')
        },
        enforce: 'pre'
      }
    ]
  }
};
