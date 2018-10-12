const Router = require('koa-router');
const { Base64 } = require('js-base64');
const { has } = require('lodash');

const agent = require('lib/request').default;
const debug = require('debug')('app');
const logger = require('../logger');
const utils = require('../utils');

const router = new Router();

const authEndpoint = 'oauth2/token';

router.post(`/api/${authEndpoint}`, async ctx => {
  const { apiServer, clientId, clientSecret } = ctx.store;
  const url = [apiServer, authEndpoint].join('/');
  const { body } = ctx.request;
  const { method } = body;

  Object.assign(body, {
    client_id: clientId,
    client_secret: clientSecret
  });

  logger({ method, url, body });

  delete body.method;

  const res = await agent.send(method, url, body);

  if (has(res, 'err')) {
    ctx.body = res;
    return;
  }

  // debug(`res: %O`, res);

  // extract user info
  const idToken = res.id_token.split('.');
  const user = idToken[1] ? JSON.parse(Base64.decode(idToken[1])) : {};

  utils.saveTokenResponseToCookie(ctx, res, '', {
    user: JSON.stringify({ ...user, loginTime: Date.now() })
  });

  ctx.body = Object.assign(res, { user });
});

module.exports = router;
