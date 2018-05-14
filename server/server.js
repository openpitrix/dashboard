const semver = require('semver');
if (semver.lt(process.version, '7.6.0')) {
  console.error('Node version should be greater than 7.6, to support async/await');
  process.exit(-1);
}

require('babel-register')({
  cache: true
});

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const favicon = require('koa-favicon');
const convert = require('koa-convert');
const views = require('koa-views');
const mount = require('koa-mount');
const serve = require('koa-static');

const session = require('./middleware/session');
const store = require('./middleware/store');
const render = require('./middleware/render');
const loginRoute = require('./routes/login');
const apiRoute = require('./routes/api');
const pageRoute = require('./routes/page');
const packClient = require('./pack-client');

const { root, getServerConfig, watchServerConfig } = require('../lib/utils');

const env = process.env.NODE_ENV || 'development';
const app = new Koa();
const config = getServerConfig();

global.HOSTNAME = config.http.hostname || 'localhost';
global.PORT = config.http.port || 8000;

// in favor of debug on server, bypass client webpack
const shouldPackClient = true;

watchServerConfig();

// serve static files
const staticMount = config.http.static;
for (const [k, v] of Object.entries(staticMount[env] || staticMount['development'])) {
  app.use(mount(k, serve(root(v), { index: false })));
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

// handle session
app.use(session(app));

// add routes
app.use(loginRoute.routes());
app.use(apiRoute.routes());
app.use(pageRoute.routes());

// pack client side assets
packClient(app, shouldPackClient);

app.use(
  views(root('server/views'), {
    extension: 'pug'
  })
);

app.use(store);
app.use(render);

app.listen(PORT, err => {
  if (err) {
    return console.error(err);
  }
  console.log(`Dashboard app running at port ${PORT}\n`);
});
