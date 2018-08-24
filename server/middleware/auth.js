const debug = require('debug')('op-dash');

const authPages = ['dashboard'];

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
    return !(cookies.get('user') && cookies.get('role') && cookies.get('last_login'));
  };

  if (needAuth && brokenCookie()) {
    // not login
    ctx.redirect('/login');
  }

  await next();
};
