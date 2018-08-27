const Router = require('koa-router');
const auth = require('../middleware/auth');
const gzip = require('../middleware/gzip');

const router = new Router();

router.get('/:page(/?.*)', auth, gzip, async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.app.reportErr(err, ctx);
  }
});

module.exports = router;
