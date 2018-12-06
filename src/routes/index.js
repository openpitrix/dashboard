import { lazy } from 'react';

// views without lazy load
import Home from 'pages/Home';

import * as Dash from 'pages/Dashboard';

// views using lazy load
const Login = lazy(() => import('../pages/Login'));
const AppDetail = lazy(() => import('../pages/AppDetail'));
const Profile = lazy(() => import('../pages/Profile'));
const SSHKeys = lazy(() => import('../pages/SSHKeys'));
const Store = lazy(() => import('../pages/Store'));
const Purchased = lazy(() => import('../pages/Purchased'));
const Runtimes = lazy(() => import('../pages/Runtimes'));

const dashboardPrefix = '/dashboard';

const dashUrl = path => {
  if (!path) return dashboardPrefix;
  if (path.startsWith('/:dash')) {
    path = path.replace('/:dash', dashboardPrefix);
  }
  return path;
};

const routes = {
  '/': Home,
  '/login': Login,
  '/apps/search/:search': Home,
  '/apps/category/:category': Home,
  '/apps/:appId': AppDetail,

  '/store': Store,
  '/store/search/:search': Store,
  '/store/category/:category': Store,
  '/store/:appId': AppDetail,
  '/store/:appId/deploy': Dash.AppDeploy,

  '/purchased': Purchased,
  '/purchased/:clusterId': Dash.ClusterDetail,

  '/runtimes': Runtimes,

  '/:dash': Dash.Overview,

  '/:dash/apps/mine': Dash.MyApps,
  '/:dash/apps': Dash.Apps,
  '/dev/apps': Dash.Apps,
  '/:dash/reviews': Dash.AppReview,
  '/:dash/review/:appId/:versionId': AppDetail,
  '/:dash/app/create': Dash.AppAdd,
  '/:dash/app/:appId/create-version': Dash.AppAdd,
  '/:dash/app/:appId': Dash.AppDetail,
  '/:dash/audit/record/:appId': Dash.AuditRecord,
  '/:dash/app/audits/:appId': Dash.Audits,

  '/:dash/clusters': Dash.Clusters,

  '/:dash/cluster/:clusterId': Dash.ClusterDetail,

  '/:dash/runtimes': Dash.Runtimes,
  '/:dash/runtime/create': Dash.RuntimeAdd,
  '/:dash/runtime/edit/:runtimeId': Dash.RuntimeAdd,
  '/:dash/runtime/:runtimeId': Dash.RuntimeDetail,

  '/:dash/repos': Dash.Repos,
  '/:dash/repo/create': Dash.RepoAdd,
  '/:dash/repo/edit/:repoId': Dash.RepoAdd,
  '/:dash/repo/:repoId': Dash.RepoDetail,

  '/:dash/categories': Dash.Categories,
  '/:dash/category/:categoryId': Dash.CategoryDetail,

  '/:dash/users': Dash.Users,
  '/:dash/user/:userId': Dash.UserDetail,

  '/profile': Profile,
  '/ssh_keys': SSHKeys,

  '*': Home
};

const judgeNeedAuth = route => {
  if (route.startsWith('/:dash')) {
    return true;
  }

  if (route.startsWith('/store/:appId/deploy')) {
    return true;
  }

  const paths = ['/runtimes', '/purchased', '/profile', '/ssh_keys', '/store'];
  return paths.includes(route);
};

export default Object.keys(routes).map(route => {
  const routeDefinition = Object.assign(
    {},
    {
      path: dashUrl(route),
      exact: route !== '/login',
      component: routes[route],
      needAuth: judgeNeedAuth(route)
    }
  );
  if (route === '*') {
    Object.assign(routeDefinition, { noMatch: true });
  }
  return routeDefinition;
});
