const Router = require('koa-router');
const auth = require('../middleware/auth');

const router = new Router();

router.get('/:page(/?.*)', auth, async (ctx, next) => {
  await next();
});

module.exports = router;
