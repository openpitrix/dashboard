const debug = require('debug')('app');

module.exports = async (ctx, next) => {
  if (ctx.url.endsWith('.js') || ctx.url.endsWith('.css')) {
    debug('Replace %s with gzipped file %s', ctx.url, ctx.url + '.gz');

    ctx.url = ctx.url + '.gz';
    ctx.set('Content-Encoding', 'gzip');
  }

  await next();
};
