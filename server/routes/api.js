const Router = require('koa-router');

const agent = require('lib/request').default;
const debug = require('debug')('app');
const logger = require('../logger');
const utils = require('../utils');

const router = new Router();
const header = {};

const authEndpoint = 'oauth2/token';

/*
 whitelist to bypass auth
 */
const bypassAuthRoutes = [
  'apps',
  'repos',
  'categories',
  'app_versions',
  'app_version/package/files'
];

router.post('/api/*', async ctx => {
  let endpoint = ctx.path.replace(/^\/?api\//, '');

  if (endpoint.startsWith('/')) {
    endpoint = endpoint.substring(1);
  }

  const { apiServer, clientId, clientSecret } = ctx.store;
  const { body } = ctx.request;
  const { method } = body;
  const url = [apiServer, endpoint].join('/');

  const authToken = utils.getTokenGroupFromCtx(ctx);
  const unAuthToken = utils.getTokenGroupFromCtx(ctx, 'un_auth');

  logger({ method, url, body });

  let usingNoAuthToken = false;

  try {
    // use normal token when logged in
    if (!authToken.access_token) {
      ctx.throw(401, 'Unauthorized: invalid access token');
    }
  } catch (err) {
    if (bypassAuthRoutes.includes(endpoint)) {
      usingNoAuthToken = true;

      if (!unAuthToken.access_token) {
        // retrieve special token
        const res = await agent.send('post', [apiServer, authEndpoint].join('/'), {
          grant_type: 'client_credentials',
          client_id: clientId,
          client_secret: clientSecret,
          scope: ''
        });

        if (!res || !res.access_token) {
          ctx.throw(401, 'Retrieve token failed');
        }

        utils.saveTokenResponseToCookie(ctx, res, 'un_auth');

        Object.assign(unAuthToken, res);
      }
    }
  }

  const chooseToken = usingNoAuthToken ? unAuthToken : authToken;

  // check if token expired
  const { expires_in } = chooseToken;

  if (Date.now() > expires_in) {
    // retrieve refresh token
    const res = await agent.send('post', [apiServer, authEndpoint].join('/'), {
      grant_type: 'refresh_token',
      client_id: clientId,
      client_secret: clientSecret,
      scope: '',
      refresh_token: chooseToken.refresh_token
    });

    if (!res || !res.access_token) {
      ctx.throw(401, 'Refresh token failed');
    }

    utils.saveTokenResponseToCookie(ctx, res, usingNoAuthToken ? 'un_auth' : '');
    Object.assign(chooseToken, res);
  }

  header.Authorization = `${chooseToken.token_type} ${chooseToken.access_token}`;

  delete body.method;

  ctx.body = await agent.send(method, url, body, {
    header: header
  });
});

module.exports = router;
