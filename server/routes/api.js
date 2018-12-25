const Router = require('koa-router');
const debug = require('debug')('app');

const agent = require('lib/request').default;
const logger = require('../logger');
const utils = require('../utils');

const router = new Router();
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

  delete body.method;

  // handle oauth login
  if (endpoint === authEndpoint) {
    const res = await agent.send(
      method,
      url,
      Object.assign(body, {
        client_id: clientId,
        client_secret: clientSecret
      })
    );

    if (res && 'err' in res) {
      ctx.body = res;
      return;
    }

    debug(`Auth token res: %O`, res);

    // extract user info
    const user = utils.saveUserFromCtx(ctx, res);
    ctx.body = Object.assign(res, { user });
    return;
  }

  const browserUrl = ctx.headers.referer;
  // todo
  const endUrl = browserUrl
    .split('/')
    .slice(3)
    .join('/');
  const usingNoAuthToken =
    endUrl === '' || endUrl.startsWith('apps') || body.isGlobalQuery;
  delete body.isGlobalQuery;

  const authParams = {
    client_id: clientId,
    client_secret: clientSecret,
    scope: ''
  };

  // get current auth info from cookie
  const prefix = usingNoAuthToken ? 'no_auth' : '';
  const authInfo = utils.getTokenGroupFromCtx(ctx, prefix);
  const { token_type, access_token, refresh_token, expires_in } = authInfo;

  const payload = usingNoAuthToken
    ? Object.assign(authParams, {
        grant_type: 'client_credentials'
      })
    : Object.assign(authParams, {
        grant_type: 'refresh_token',
        refresh_token
      });

  if (!usingNoAuthToken && !refresh_token) {
    // need login
    ctx.throw(401, 'refresh token expired');
  }

  if (!access_token || (expires_in && parseInt(expires_in) < Date.now())) {
    const res = await agent.post([apiServer, authEndpoint].join('/'), payload);
    debug(`Using refresh token to exchange auth info: %O`, res);

    if (!res || !res.access_token) {
      ctx.throw(401, 'Retrieve access token failed');
    }

    utils.saveTokenFromCtx(ctx, res, prefix);
    Object.assign(authInfo, res);
  }

  if (!authInfo.access_token) {
    ctx.throw(401, 'Unauthorized: invalid access token');
  }

  ctx.body = await agent.send(method, url, body, {
    header: {
      Authorization: `${authInfo.token_type} ${authInfo.access_token}`
    }
  });
});

module.exports = router;
