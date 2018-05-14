module.exports = async (ctx, next) => {
  if (ctx.session.isNew) {
    // not login
    ctx.redirect('/login');
  }

  await next();
};
