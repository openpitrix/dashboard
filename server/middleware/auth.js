const logger = require('../logger');

const authPages = ['dashboard', 'store'];

module.exports = async (ctx, next) => {
  const { cookies, url } = ctx;

  // filter non-asset types
  if (url.endsWith('.map')) {
    return;
  }

  logger.info('PAGE: %s', url);

  // check if user logged in
  const loggedIn = cookies.get('access_token')
    && cookies.get('refresh_token')
    && cookies.get('user_id');

  /* eslint prefer-destructuring: off */
  const page = (ctx.params.page || '').split('/')[0];

  if (authPages.includes(page) && !loggedIn) {
    // not login
    ctx.redirect(`/login?redirect_url=${url}`);
  }

  await next();
};
