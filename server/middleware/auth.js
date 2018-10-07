const debug = require('debug')('app');

const authPages = ['dashboard', 'runtimes', 'purchased', 'profile', 'ssh_keys'];

module.exports = async (ctx, next) => {
  const { cookies } = ctx;

  // filter non-asset types
  if (ctx.url.endsWith('.map')) {
    return;
  }

  debug('PAGE: %s', ctx.url);

  const page = (ctx.params.page || '').split('/')[0];
  const needAuth = authPages.indexOf(page) > -1;

  if (needAuth && !(cookies.get('user') && cookies.get('access_token'))) {
    // not login
    ctx.redirect('/login?url=' + ctx.params.page);
  }

  await next();
};
