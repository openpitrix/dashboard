module.exports = async (ctx, next) => {
  if (ctx.url.endsWith('.js') || ctx.url.endsWith('.css')) {
    ctx.url += '.gz';
    ctx.set('Content-Encoding', 'gzip');
  }

  await next();
};
