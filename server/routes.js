import Router from 'koa-router';
import request from 'core/request';
import config from './config';

const router = new Router();

router.get('/api/*', async (ctx) => {
  const resp = await request.get(config.serverUrl + ctx.url, ctx.query);
  ctx.body = resp;
});

export default router;
