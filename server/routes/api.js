const Router = require('koa-router');
const agent = require('lib/request').default;
const debug = require('debug')('app');
const sessConfig = require('../session-config');

const router = new Router();
const header = {};

router.post('/api/*', async ctx => {
  let endpoint = ctx.path.replace(/^\/?api\//, '');

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

  const token_type = ctx.cookies.get('token_type');
  const access_token = ctx.cookies.get('access_token');
  const access_token_home = ctx.cookies.get('access_token_home');
  const refresh_token = ctx.cookies.get('refresh_token');

  debug('api: %s %s %s -- %o', new Date().toLocaleString(), forwardMethod.toUpperCase(), url, body);

  if (endpoint === 'oauth2/token') {
    body.client_id = ctx.store.clientId;
    body.client_secret = ctx.store.clientSecret;
  }
  else if (access_token && !body.noLogin) {
    header.Authorization = token_type + ' ' + access_token;
  }
  else if (access_token_home && body.noLogin) {
    header.Authorization = token_type + ' ' + access_token_home;
  }
  else if (body.noLogin || refresh_token) {
    const refreshUrl = [apiServer, 'oauth2/token'].join('/');
    const tokenData = {
      grant_type: 'refresh_token',
      client_id: ctx.store.clientId,
      client_secret: ctx.store.clientSecret,
      scope: ''
    };
    const accessUrls = ['categories', 'apps', 'repos', 'app_versions', 'app_version/package/files'];

    if (refresh_token) {
      tokenData.refresh_token = refresh_token;
    } else if (body.noLogin && accessUrls.includes(endpoint)) {
      tokenData.grant_type = 'client_credentials';
    }

    const result = await agent.send('post', refreshUrl, tokenData);

    if (result.access_token) {
      sessConfig.maxAge = result.expires_in * 1000;
      const tokenName = body.noLogin ? 'access_token_home' : 'access_token';
      ctx.cookies.set(tokenName, result.access_token, sessConfig);
      ctx.cookies.set('token_type', result.token_type, sessConfig);
      header.Authorization = result.token_type + ' ' + result.access_token;
    } else {
      ctx.throw(401, 'Unauthorized request');
      // ctx.status=301;
      // ctx.body = '/login';
    }
  }

  delete body.noLogin;

  ctx.body = await agent.send(forwardMethod, url, body, {
    header: header
  });
});

module.exports = router;
