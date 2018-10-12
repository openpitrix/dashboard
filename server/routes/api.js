const Router = require('koa-router');

const agent = require('lib/request').default;
const debug = require('debug')('app');
const logger = require('../logger');
const utils = require('../utils');

const router = new Router();
const header = {};

const authEndpoint = 'oauth2/token';

router.post('/api/*', async ctx => {
  let endpoint = ctx.path.replace(/^\/?api\//, '');

  if (endpoint.startsWith('/')) {
    endpoint = endpoint.substring(1);
  }

  const { apiServer, clientId, clientSecret } = ctx.store;
  const { body } = ctx.request;
  const { method } = body;
  const url = [apiServer, endpoint].join('/');

  logger({ method, url, body });

  const authToken = utils.getTokenGroupFromCtx(ctx);
  const unAuthToken = utils.getTokenGroupFromCtx(ctx, 'un_auth');

  const browserUrl = ctx.headers.referer;
  const endUrl = browserUrl
    .split('/')
    .slice(3)
    .join('/');
  const usingNoAuthToken =
    endUrl === '' ||
    endUrl.startsWith('apps') ||
    endUrl.startsWith('store') ||
    endUrl.endsWith('deploy');

  // defalut special token params
  const tokenData = {
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
    scope: ''
  };

  // retrieve special token
  if (usingNoAuthToken && !unAuthToken.access_token) {
    const res = await agent.send('post', [apiServer, authEndpoint].join('/'), tokenData);

    if (!res || !res.access_token) {
      ctx.throw(401, 'Retrieve token failed');
    }

    utils.saveTokenResponseToCookie(ctx, res, 'un_auth');

    Object.assign(unAuthToken, res);
  }

  const chooseToken = usingNoAuthToken ? unAuthToken : authToken;

  // check if token expired, retrieve refresh token or special token
  const { expires_in } = chooseToken;
  if (Date.now() > expires_in) {
    // refresh token params
    if (!usingNoAuthToken) {
      tokenData.grant_type = 'refresh_token';
      tokenData.refresh_token = chooseToken.refresh_token;
    }

    const res = await agent.send('post', [apiServer, authEndpoint].join('/'), tokenData);

    if (!res || !res.access_token) {
      ctx.throw(401, 'Refresh token failed');
    }

    utils.saveTokenResponseToCookie(ctx, res, usingNoAuthToken ? 'un_auth' : '');
    Object.assign(chooseToken, res);
  }

  if (!chooseToken.access_token) {
    ctx.throw(401, 'Unauthorized: invalid access token');
  }

  header.Authorization = `${chooseToken.token_type} ${chooseToken.access_token}`;

  delete body.method;

  ctx.body = await agent.send(method, url, body, {
    header: header
  });

});

module.exports = router;
