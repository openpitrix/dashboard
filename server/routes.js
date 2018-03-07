import Router from 'koa-router';
import request from 'lib/request';
import { getServerConfig } from 'lib/utils';

const router = new Router();
const config = getServerConfig();

router.get('/api/*', async (ctx) => {
  ctx.body = await request.get(config.serverUrl + ctx.url, ctx.query);
});

export default router;
