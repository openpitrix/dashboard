const path = require('path');

module.exports = {
  output: {
    pathinfo: false
  },
  // performance: {
  //   hints: process.env.NODE_ENV === 'development' ? 'warning' : false
  // },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['cache-loader', 'babel-loader'],
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'lib')
        ]
      },
      {
        test: /\.css$/,
        use: ['cache-loader', 'style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.scss', '.css'],
    alias: {
      lib: path.resolve(__dirname, 'lib')
    },
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          name: 'vendors',
          chunks: 'initial',
          test: /[\/\\]node_modules[\/\\]/
        }
      }
    }
  }
};
