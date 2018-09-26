const Router = require('koa-router');
const agent = require('lib/request').default;
const debug = require('debug')('op-dash');
const sessConfig = require('../session-config');
const _ = require('lodash');

const router = new Router();
const header = {};

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

  if (endpoint === 'oauth2/token') {
    body.client_id = ctx.store.clientId;
    body.client_secret = ctx.store.clientSecret;
  } else {
    const token_type = ctx.cookies.get('token_type');
    const access_token = ctx.cookies.get('access_token');
    const refresh_token = ctx.cookies.get('refresh_token');

    if (access_token) {
      header.Authorization = token_type + ' ' + access_token;
    } else if (refresh_token) {
      const res = await agent.post([apiServer, 'oauth2/token'].join('/')).send({
        grant_type: 'refresh_token',
        client_id: ctx.store.clientId,
        client_secret: ctx.store.clientSecret,
        scope: '',
        refresh_token: refresh_token
      });
      const result = (res && res.body) || {};

      if (result.access_token) {
        sessConfig.maxAge = result.expires_in * 1000;
        ctx.cookies.set('access_token', result.access_token, sessConfig);
        ctx.cookies.set('token_type', result.token_type, sessConfig);
        header.Authorization = result.token_type + ' ' + result.access_token;
      } else {
        ctx.redirect('/login');
      }
    }
  }

  debug('%s %s', forwardMethod.toUpperCase(), url);

  ctx.body = await agent.send(forwardMethod, url, body, {
    header: header
  });
});

module.exports = router;
