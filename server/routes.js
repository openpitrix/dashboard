import Router from 'koa-router';
import request from 'core/request';
import config from './config';

const router = new Router();

router.get('/api/*', async (ctx) => {
  const resp = await request.get(config.serverUrl + ctx.url, ctx.query);
  ctx.body = resp;
});

router.post('/login', async (ctx) => {
  const resp = await request.post(`${config.serverUrl}/api/v1/login`, ctx.request.body);
  if (resp.ret_code === 0) {
    ctx.redirect('/');
  } else {
    ctx.body = resp;
  }
});

export default router;
