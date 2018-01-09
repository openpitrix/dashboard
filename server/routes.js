import Router from 'koa-router';
import * as apps from './routes/apps';

const router = new Router();

router.get('/api/apps', apps.getApps);
router.get('/api/app/:id', apps.getApp);
router.get('/api/installedApps', apps.getInstalledApps);

export default router;
