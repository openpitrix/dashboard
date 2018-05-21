const { resolve } = require('path');

module.exports = {
  moduleRules: [
    {
      test: /\.jsx?$/,
      use: 'babel-loader',
      // include: [resolve(__dirname, 'src'), resolve(__dirname, 'lib')],
      exclude: /(node_modules)/
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
    }
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.css', 'scss'],
    alias: {
      scss: resolve(__dirname, 'src/scss')
    },
    modules: [resolve(__dirname, 'src'), resolve(__dirname, 'lib'), 'node_modules']
  }
};
