const { isEmpty, without, map } = require('lodash');
const sessConfig = require('./session-config');
const { Base64 } = require('js-base64');

const oauthResFields = [
  'access_token',
  'refresh_token',
  'token_type',
  'expires_in',
  'id_token'
];

const getTokenGroupFromCtx = (ctx, group = '') =>
  oauthResFields.reduce((obj, prop) => {
    const key = group ? [group, prop].join('_') : prop;
    obj[prop] = ctx.cookies.get(key);
    return obj;
  }, {});

const saveTokenFromCtx = (ctx, token_res, prefix = '', additional = {}) => {
  const { expires_in } = token_res;
  const msExpireIn = parseInt(expires_in) * 1000;
  const cookieOption = Object.assign({}, sessConfig, { maxAge: msExpireIn });

  without(oauthResFields, 'id_token').forEach(prop => {
    const val =
      prop === 'expires_in' ? Date.now() + msExpireIn : token_res[prop];
    // refresh_token cookie expires after 2 weeks
    if (prop === 'refresh_token') {
      cookieOption.maxAge = 2 * 7 * 24 * 60 * 60 * 1000;
    } else {
      cookieOption.maxAge = msExpireIn;
    }

    ctx.cookies.set(
      prefix ? [prefix, prop].join('_') : prop,
      val,
      cookieOption
    );
  });

  if (!isEmpty(additional)) {
    map(additional, (v, k) => {
      ctx.cookies.set(k, v, cookieOption);
    });
  }
};

const saveUserFromCtx = (ctx, res) => {
  if (!res || !res.id_token) {
    return {};
  }

  const idToken = res.id_token.split('.');
  const user = idToken[1] ? JSON.parse(Base64.decode(idToken[1])) : {};

  saveTokenFromCtx(ctx, res, '', {
    user: JSON.stringify({ ...user, loginTime: Date.now() })
  });

  return user;
};

module.exports = {
  oauthResFields,
  getTokenGroupFromCtx,
  saveTokenFromCtx,
  saveUserFromCtx
};
