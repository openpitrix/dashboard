const Router = require('koa-router');
const request = require('lib/request').default;
const { getServerConfig } = require('lib/utils');

const apiServer = getServerConfig('serverUrl');

const router = new Router();

router.get('/api/:version/*', async ctx => {
  try {
    ctx.body = await request.get(apiServer + ctx.url);
  } catch (err) {
    ctx.status = err.code || 404;
  }
});

module.exports = router;
