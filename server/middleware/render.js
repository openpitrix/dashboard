const get = require('lodash/get');

const renderPage = require('../render-page');

module.exports = async (ctx, next) => {
  const context = {};

  if (context.url) {
    ctx.redirect(context.url);
    ctx.body = '<!DOCTYPE html>redirecting';
    return await next();
  }

  try {
    ctx.body = renderPage({
      isProd: process.env.NODE_ENV === 'production',
      title: get(ctx.store, 'config.app.title'),
      lang: ctx.cookies.get('lang'),
      children: null,
      state: JSON.stringify(ctx.store)
    });
  } catch (err) {
    ctx.app.reportErr(err, ctx);
  }
};
