import Router from 'koa-router';
import * as apps from './routes/apps';

const router = new Router();

router.get('/api/apps', apps.getApps);

export default router;
