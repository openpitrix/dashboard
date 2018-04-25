const Router = require('koa-router');
const request = require('lib/request').default;
const { getServerConfig } = require('lib/utils');

const router = new Router();
const config = getServerConfig();

router.get('/api/*', async ctx => {
  ctx.body = await request.get(config.serverUrl + ctx.url, ctx.query);
});

router.post('/login', async ctx => {
  const resp = await request.post(`${config.serverUrl}/api/v1/login`, ctx.request.body);
  if (resp.ret_code === 0) {
    ctx.redirect('/');
  } else {
    ctx.body = resp;
  }
});

module.exports = router;
