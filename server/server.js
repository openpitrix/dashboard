import Koa from 'koa';
import bodyParser from 'koa-better-body';
import favicon from 'koa-favicon';
import convert from 'koa-convert';
import config from './config';
import store from './middleware/store';
import render from './middleware/render';
import routes from './routes';

const app = new Koa();

// Serve static files
if (process.env.NODE_ENV !== 'production') {
  const mount = require('koa-mount');
  const serve = require('koa-static');

  for (const [k, v] of Object.entries(config.http.static)) {
    app.use(mount(k, serve(v, { index: false })));
  }
}

// Middleware
app.use(favicon(config.http.favicon));
app.use(convert(bodyParser({
  formLimit: '200kb',
  jsonLimit: '200kb',
  bufferLimit: '4mb',
})));
app.use(store);

// Routes
app.use(routes.routes());
app.use(render);

app.listen(config.http.port, () => {
  console.info(`Listening on port ${config.http.port}`);
});
