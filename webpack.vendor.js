// bundle common vendor libraries for development env
// using webpack dll plugin
const path = require('path');
const webpack = require('webpack');

module.exports = {
  context: process.cwd(),
  // devtool: 'cheap-module-eval-source-map',
  entry: {
    vendor: [
      'react',
      'react-dom',
      'classnames',
      // 'lodash',
      // 'react-router',
      'react-router-dom',
      'mobx',
      'mobx-react'
    ]
  },
  output: {
    filename: '[name].dll.js',
    path: path.resolve(__dirname, 'build/'),
    publicPath: '/build',
    library: '[name]'
  },
  resolve: {
    // extensions: ['.js', '.jsx'],
    modules: [__dirname, 'node_modules']
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]',
      path: path.resolve(__dirname, 'build/[name].json')
    })
  ]
};
