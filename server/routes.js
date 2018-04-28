const Router = require('koa-router');
const request = require('lib/request').default;
const { getServerConfig } = require('lib/utils');

const router = new Router();
const config = getServerConfig();

router.get('/api/:version/*', async ctx => {
  try {
    ctx.body = await request.get(config.serverUrl + ctx.url, ctx.query);
  } catch (err) {
    ctx.status = err.code || 404;
  }
});

router.post('/login', async ctx => {
  const resp = await request.post(`${config.serverUrl}/api/v1/login`, ctx.request.body);
  if (resp.ret_code === 0) {
    // todo: handle session
    ctx.redirect('/');
  } else {
    ctx.body = resp;
  }
});

// fallback to handle all request
// router.all('*', (ctx, next)=> {
//   console.log('ctx.url', ctx.url);
//   console.log('ctx.query', ctx.query);
//
//   ctx.body = 'Bad request';
//   ctx.status = 403;
// });

module.exports = router;
