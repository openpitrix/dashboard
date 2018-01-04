// Enable ES2018 support
require('babel-register');

// Bootstrap core
require('./logger');
require('./polyfills');

// Ignore files on server render
require.extensions['.scss'] = function () {};

const WebpackIsomorphicTools = require('webpack-isomorphic-tools');
const projectBasePath = require('path').resolve(__dirname, '..');

global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('../config/isomorphic-config'))
  .server(projectBasePath, () => {
    require('../server/server');
  });
