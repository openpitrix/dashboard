require('babel-register')({
  cache: true
});

const semver = require('semver');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const favicon = require('koa-favicon');
const convert = require('koa-convert');
const views = require('koa-views');
const mount = require('koa-mount');
const serve = require('koa-static');

const store = require('./middleware/store');
const render = require('./middleware/render');
const routes = require('./routes');
const auth = require('./middleware/auth');

const { root, getServerConfig, watchServerConfig } = require('../lib/utils');

if (semver.lt(process.version, '7.6.0')) {
  console.error('Node version should be greater than 7.6.0');
  process.exit(-1);
}

const config = getServerConfig();
watchServerConfig();

global.HOSTNAME = config.http.hostname || 'localhost';
global.PORT = config.http.port || 8000;

const env = process.env.NODE_ENV || 'development';
const app = new Koa();

app.use(auth);

// serve static files
const staticMount = config.http.static;
for (const [k, v] of Object.entries(staticMount[env] || staticMount['development'])) {
  app.use(mount(k, serve(root(v), { index: false })));
}

if (env === 'development') {
  // disable babel server env plugins transform
  process.env.BABEL_ENV = '';

  const webpack = require('webpack');
  const webpackMiddleware = require('koa-webpack');
  const webpackConfig = require('../webpack.dev');

  // todo: bundle client assets
  app.use(
    webpackMiddleware({
      compiler: webpack(webpackConfig),
      dev: {
        noInfo: false,
        quiet: false,
        watchOptions: {
          aggregateTimeout: 300,
          poll: true,
          ignored: /node_modules/
        },
        stats: {
          colors: true,
          hash: true,
          timings: true,
          // version: false,
          chunks: true,
          modules: true,
          // children: false,
          chunkModules: true
        }
      }
    })
  );
}

app.use(favicon(root(config.http.favicon)));

app.use(
  convert(
    bodyParser({
      formLimit: '200kb',
      jsonLimit: '200kb',
      bufferLimit: '4mb'
    })
  )
);

app.use(store);

app.use(
  views(root('server/views'), {
    extension: 'pug'
  })
);

// Routes
app.use(routes.routes());

// Rendering
app.use(render);

app.listen(PORT, err => {
  if (err) {
    return console.error(err);
  }
  console.log(`Dashboard app running at port ${config.http.port}\n`);
});
