const debug = require('debug')('app');

const authPages = [
  'dashboard',
  'runtimes',
  'purchased',
  'profile',
  'ssh_keys',
  'store'
];

module.exports = async (ctx, next) => {
  const { cookies, url } = ctx;

  // filter non-asset types
  if (url.endsWith('.map')) {
    return;
  }

  debug('PAGE: %s', url);

  /* eslint prefer-destructuring: off */
  const page = (ctx.params.page || '').split('/')[0];
  const needAuth = authPages.includes(page);

  if (needAuth && !cookies.get('refresh_token')) {
    // not login
    ctx.redirect(`/login?redirect_url=${url}`);
  }

  await next();
};
