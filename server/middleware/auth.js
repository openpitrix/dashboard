const debug = require('debug')('op-dash');

const authPages = ['dashboard', 'runtimes', 'purchased', 'profile', 'ssh_keys'];

module.exports = async (ctx, next) => {
  // filter non-asset types
  if (ctx.url.endsWith('.map')) {
    return;
  }

  debug('PAGE: %s', ctx.url);

  const page = (ctx.params.page || '').split('/')[0];
  const needAuth = authPages.indexOf(page) > -1;

  const brokenCookie = () => {
    let cookies = ctx.cookies;
    return !(cookies.get('loginUser') && cookies.get('access_token'));
  };

  if (needAuth && brokenCookie()) {
    // not login
    ctx.redirect('/login?url=' + ctx.params.page);
  }

  await next();
};
