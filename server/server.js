require('lib/logger');

import { resolve } from 'path';
import semver from 'semver';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import favicon from 'koa-favicon';
import convert from 'koa-convert';
import views from 'koa-views';
import mount from 'koa-mount';
import serve from 'koa-static';

import store from './middleware/store';
import render from './middleware/render';
import routes from './routes';
import utils from '../lib/utils';

if (semver.lt(process.version, '7.6.0')) {
  console.error('Node Version should be greater than 7.6.0');
  process.exit(-1);
}

const config = utils.getServerConfig();

global.HOSTNAME = config.http.hostname || 'localhost';
global.PORT = config.http.port || 8000;

const app = new Koa();

// serve static files
const serveFiles = function(env){
  for (const [k, v] of Object.entries(config.http.static[env])) {
    app.use(mount(k, serve(utils.root(v), { index: false })));
  }
};

if (process.env.NODE_ENV === 'development') {
  // disable babel server env plugins transform
  process.env.BABEL_ENV = '';

  const webpack = require('webpack');
  const webpackMiddleware = require('koa-webpack');
  const webpackConfig = require('../webpack.dev');

  app.use(webpackMiddleware({
    compiler: webpack(webpackConfig),
    dev: {
      publicPath: webpackConfig.output.publicPath,
      noInfo: false,
      quiet: false,
      watchOptions: {
        aggregateTimeout: 300,
        poll: false,
        ignored: /node_modules/,
      },
      stats: {
        colors: true,
        // hash: false,
        // timings: false,
        // version: false,
        // chunks: false,
        modules: true,
        // children: false,
        chunkModules: true,
      },
    },
  }));

  serveFiles('development');
}


if (process.env.NODE_ENV === 'production') {
  serveFiles('production');
}

app.use(favicon(utils.root(config.http.favicon)));

app.use(convert(bodyParser({
  formLimit: '200kb',
  jsonLimit: '200kb',
  bufferLimit: '4mb',
})));

app.use(store);

app.use(views(resolve(__dirname, './views'), {
  extension: 'pug',
}));

// Routes
app.use(routes.routes());

// Rendering
app.use(render);

app.listen(config.http.port, (err) => {
  if (err) {
    return console.error(err);
  }
  console.log(`Dashboard app running at port ${config.http.port}`);
});
