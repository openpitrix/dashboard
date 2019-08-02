/* eslint no-console:0 */
if (require('semver').lt(process.version, '7.6.0')) {
  console.error('Node version should be greater than 7.6');
  process.exit(-1);
}

const env = process.env.NODE_ENV || 'development';
const isProd = env === 'production';
const mockMode = !!process.env.MOCKAPI;

if (!isProd) {
  require('@babel/register');
}

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const favicon = require('koa-favicon');
const mount = require('koa-mount');
const serve = require('koa-static');
const helmet = require('koa-helmet');
const { get, pick } = require('lodash');
const { reportErr, renderErrPage } = require('./report-error');
const { root, getServerConfig, watchConfig } = require('../lib/utils');
const logger = require('./logger');
const proxyServer = require('./proxy-server');
const renderPage = require('./render-page');

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

// enable hmr
if (!isProd && !mockMode) {
  const webpack = require('webpack');
  const koaWebpack = require('koa-webpack');
  const compiler = webpack(require('../webpack.dev'));

  (async () => {
    const hmrMiddleware = await koaWebpack({
      compiler,
      hotClient: {},
      devMiddleware: {
        writeToDisk: true,
        noInfo: false,
        watchOptions: {
          watch: true,
          aggregateTimeout: 200,
          poll: 1000,
          ignored: /node_modules/
        }
      }
    });

    app.use(hmrMiddleware);
  })();
}

// send page html
app.use(ctx => {
  ctx.body = renderPage(ctx, {
    title: get(ctx.store, 'config.app.title'),
    lang: ctx.cookies.get('lang'),
    state: JSON.stringify(pick(ctx.store, ['socketProxyPort']))
  });
});

app.listen(PORT, err => {
  if (err) {
    logger.error(`Start app failed: %s`, err.stack);
    throw err;
  }
  logger.info(`OpenPitrix Dashboard running at %s`, `${HOSTNAME}:${PORT}`);
});

if (!mockMode) {
  watchConfig(() => {
    app.config = getServerConfig();
  });

  // setup websocket proxy server
  const socketUrl = process.env.socketUrl || config.socketUrl;
  const socketProxyPort = process.env.socketProxyPort || config.socketProxyPort;

  proxyServer.run(socketUrl, socketProxyPort);
}
