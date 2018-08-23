import {generateRoutes} from './utils';

const routes = {
  '/':  'Home',
  '/login': 'Login',
  '/apps/search/:search': 'Home',
  '/apps/:category': 'Home',
  '/app/:appId': 'AppDetail',

  '/:dash': 'Admin/Overview',

  '/:dash/apps': 'Admin/Apps',
  '/:dash/app/:appId': 'Admin/Apps/Detail',
  '/:dash/app/:appId/deploy': 'Admin/Apps/Deploy',

  '/:dash/clusters': 'Admin/Clusters',
  '/:dash/cluster/:clusterId': 'Admin/Clusters/Detail',

  '/:dash/runtimes': 'Admin/Runtimes',
  '/:dash/runtime/create': 'Admin/Runtimes/Add',
  '/:dash/runtime/edit/:runtimeId': 'Admin/Runtimes/Add',
  '/:dash/runtime/:runtimeId': 'Admin/Runtimes/Detail',

  '/:dash/repos': 'Admin/Repos',
  '/:dash/repo/create': 'Admin/Repos/Add',
  '/:dash/repo/edit/:repoId': 'Admin/Repos/Add',
  '/:dash/repo/:repoId': 'Admin/Repos/Detail',

  '/:dash/categories': 'Admin/Categories',
  '/:dash/category/:categoryId': 'Admin/Categories/Detail',

  '*': 'Home'
};

export default generateRoutes(routes);
