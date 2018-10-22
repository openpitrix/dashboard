const { isEmpty, without, map } = require('lodash');
const sessConfig = require('./session-config');

const oauthResFields = ['access_token', 'refresh_token', 'token_type', 'expires_in', 'id_token'];

const getTokenGroupFromCtx = (ctx, group = '') => {
  return oauthResFields.reduce((obj, prop) => {
    if (group) {
      prop = [group, prop].join('_');
    }

    obj[prop] = ctx.cookies.get(prop);
    return obj;
  }, {});
};

const saveTokenResponseToCookie = (ctx, token_res, prefix = '', additional = {}) => {
  const { expires_in } = token_res;
  const msExpireIn = parseInt(expires_in) * 1000;
  const cookieOption = Object.assign({}, sessConfig, { maxAge: msExpireIn });

  without(oauthResFields, 'id_token').forEach(prop => {
    const val = prop === 'expires_in' ? Date.now() + msExpireIn : token_res[prop];
    // refresh_token cookie expires after 2 days
    if (prop === 'refresh_token') {
      cookieOption.maxAge = 2 * 24 * 60 * 60 * 1000;
    } else {
      cookieOption.maxAge = msExpireIn;
    }

    ctx.cookies.set(prefix ? [prefix, prop].join('_') : prop, val, cookieOption);
  });

  if (!isEmpty(additional)) {
    map(additional, (v, k) => {
      ctx.cookies.set(k, v, cookieOption);
    });
  }
};

module.exports = {
  oauthResFields,
  getTokenGroupFromCtx,
  saveTokenResponseToCookie
};
