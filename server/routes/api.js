const Router = require('koa-router');
const agent = require('lib/request').default;
const debug = require('debug')('op-dash');
const _ = require('lodash');

const router = new Router();

router.post('/api/*', async ctx => {
  let endpoint = ctx.url.replace(/^\/api\//, '');
  // strip query string
  const idxQuery = endpoint.indexOf('?') > -1 ? endpoint.indexOf('?') : endpoint.length;
  endpoint = endpoint.substring(0, idxQuery);

  if (endpoint.startsWith('/')) {
    endpoint = endpoint.substring(1);
  }

  let apiServer = ctx.store.apiServer;
  if (apiServer.endsWith('/')) {
    apiServer = apiServer.substring(0, apiServer.length - 1);
  }

  let url = [apiServer, endpoint].join('/');

  let body = ctx.request.body;
  let forwardMethod = body.method || 'get';
  delete body.method;

  debug('%s %s', forwardMethod.toUpperCase(), url);

  ctx.body = await agent.send(forwardMethod, url, body, {
    header: {
      Authorization: _.get(ctx.app.config, 'accessToken', '')
    }
  });
});

module.exports = router;
