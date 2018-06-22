const path = require('path');
const webpack = require('webpack');

module.exports = {
  context: process.cwd(),
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
    modules: [__dirname, 'node_modules']
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]',
      path: path.resolve(__dirname, 'build/[name].json')
    })
  ]
};
