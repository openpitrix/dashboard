const Router = require('koa-router');
const auth = require('../middleware/auth');

const router = new Router();

router.get('/:page(/?.*)', auth, async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.app.reportErr(err, ctx);
  }
});

module.exports = router;
