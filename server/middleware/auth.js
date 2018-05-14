module.exports = async (ctx, next) => {
  if (!ctx.cookies.get('user')) {
    // not login
    ctx.redirect('/login');
  }

  await next();
};
