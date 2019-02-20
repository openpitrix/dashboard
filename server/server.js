if (require('semver').lt(process.version, '7.6.0')) {
  console.error('Node version should be greater than 7.6');
  process.exit(-1);
}

const env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  require('@babel/register');
}

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const favicon = require('koa-favicon');
const mount = require('koa-mount');
const serve = require('koa-static');
const helmet = require('koa-helmet');
const { get } = require('lodash');
const { reportErr, renderErrPage } = require('./report-error');
const { root, getServerConfig, watchConfig } = require('../lib/utils');
const logger = require('./logger');
const proxyServer = require('./proxy-server');

const app = new Koa();
const config = getServerConfig();

app.reportErr = reportErr;
app.config = config;

global.HOSTNAME = get(config, 'host', '127.0.0.1');
global.PORT = get(config, 'port', 8000);

// centralize error handling
app.on('error', (err, ctx) => {
  logger.error(`server err: %s`, err.stack);

  ctx.status = err.status || 500;
  ctx.body = renderErrPage(err);
});

app.use(helmet());

// serve static files
const serveStatic = (mount_points = {}) => {
  const opt = { index: false, maxage: 3600 * 24 * 1000 };
  for (const [k, v] of Object.entries(mount_points)) {
    if (typeof v === 'string') {
      app.use(mount(k, serve(root(v), opt)));
    } else if (typeof v === 'object' && k === env) {
      serveStatic(v);
    }
  }
};
serveStatic(get(config, 'static', {}));

app.use(favicon(root(get(config, 'favicon', 'favicon.ico'))));

app.use(
  bodyParser({
    formLimit: '2mb',
    jsonLimit: '2mb',
    bufferLimit: '4mb'
  })
);

// handle session
app.use(require('./middleware/session')(app));

// attach store to ctx
app.use(require('./middleware/store'));

// add routes
app.use(require('./routes/page').routes());
app.use(require('./routes/api').routes());

// render page
app.use(require('./middleware/render'));

app.listen(PORT, err => {
  if (err) {
    logger.error(`Start app failed: %s`, err.stack);
    throw err;
  }
  logger.info(`OpenPitrix Dashboard running at %s`, `${HOSTNAME}:${PORT}`);
});

watchConfig(() => {
  app.config = getServerConfig();
});

const socketUrl = process.env.socketUrl || config.socketUrl;
// setup websocket proxy server
proxyServer.run(socketUrl, config.socketProxyPort);
