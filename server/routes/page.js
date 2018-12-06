const Router = require('koa-router');
const agent = require('lib/request').default;
const auth = require('../middleware/auth');
const gzip = require('../middleware/gzip');

const router = new Router();

router.get('/attachments/:id', async ctx => {
  const { apiServer } = ctx.store;
  const apiUrl = `${apiServer.split('/v')[0]}/attachments/${ctx.params.id}/raw`;

  ctx.body = await agent.send('get', apiUrl);
});

router.get('/:page(/?.*)', auth, gzip, async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.app.reportErr(err, ctx);
  }
});

module.exports = router;
