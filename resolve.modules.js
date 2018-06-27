const { resolve } = require('path');

module.exports = {
  extensions: ['.js', '.jsx', 'scss'],
  alias: {
    scss: resolve(__dirname, 'src/scss')
  },
  modules: [resolve(__dirname, 'src'), resolve(__dirname, 'lib'), 'node_modules']
};
