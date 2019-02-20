const { resolve } = require('path');

module.exports = {
  output: {
    pathinfo: false
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
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
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
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor_js: {
          name: 'vendors',
          chunks: 'initial',
          test: /\/node_modules\//,
          priority: -10
        }
      }
    }
  }
};
