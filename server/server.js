const semver = require('semver');
if (semver.lt(process.version, '7.6.0')) {
  console.error('Node version should be greater than 7.6');
  process.exit(-1);
}

const env = process.env.NODE_ENV || 'development';
const isDev = env === 'development';

isDev && require('babel-register')({ cache: true });

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const favicon = require('koa-favicon');
const views = require('koa-views');
const mount = require('koa-mount');
const serve = require('koa-static');
const get = require('lodash/get');
const chokidar = require('chokidar');

const log = require('./log');
const { root, getServerConfig, watchServerConfig } = require('../lib/utils');

const app = new Koa();
const config = getServerConfig();
const httpConf = get(config, 'http', {});

global.HOSTNAME = get(httpConf, 'hostname', 'localhost');
global.PORT = get(httpConf, 'port', 8000);

// serve static files
const serveStatic = (mount_points = {}) => {
  let opt = { index: false, maxage: 864000000 };
  for (let [k, v] of Object.entries(mount_points)) {
    if (typeof v === 'string') {
      app.use(mount(k, serve(root(v), opt)));
    } else if (typeof v === 'object' && k === env) {
      serveStatic(v);
    }
  }
};
serveStatic(get(httpConf, 'static', {}));

const favIconPath = get(httpConf, 'favicon', 'favicon.ico');
app.use(favicon(root(favIconPath)));

app.use(
  bodyParser({
    formLimit: '200kb',
    jsonLimit: '200kb',
    bufferLimit: '4mb'
  })
);

// handle session
app.use(require('./middleware/session')(app));

app.use(
  views(root('server/views'), {
    extension: 'pug'
  })
);

app.use(require('./middleware/store'));

// add routes
app.use(require('./routes/login').routes());
app.use(require('./routes/api').routes());
app.use(require('./routes/page').routes());

// pack client side assets
if (isDev && process.env.COMPILE_CLIENT) {
  require('./pack-client')(app);
}

app.use(require('./middleware/render'));

app.listen(PORT, err => {
  if (err) {
    return console.error(err);
  }
  log(`Dashboard app running at port ${PORT}`);
});

// watch files and reload server gracefully
if (isDev) {
  watchServerConfig();

  // watch server w/ lib change
  const watcher = chokidar.watch([root('server'), root('lib')]);
  watcher.on('ready', function() {
    watcher.on('all', function() {
      log('Clearing */server/*, */lib/* module cache from server');
      Object.keys(require.cache).forEach(function(id) {
        if (/[\/\\](server|lib)[\/\\]/.test(id)) delete require.cache[id];
      });
    });
  });
}
