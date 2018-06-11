const authPages = ['manage', 'develop', 'deploy'];

module.exports = async (ctx, next) => {
  const page = (ctx.params.page || '').split('/')[0];
  const needAuth = authPages.indexOf(page) > -1;

  if (needAuth && !ctx.cookies.get('user')) {
    // not login
    ctx.redirect('/login');
  }

  await next();
};
