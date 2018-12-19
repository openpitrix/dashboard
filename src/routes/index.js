import { lazy } from 'react';
import { toUrl, needAuth } from 'utils/url';

// views without lazy load
import Home from 'pages/Home';

import * as Dash from 'pages/Dashboard';

// views using lazy load
const Login = lazy(() => import('../pages/Login'));
const AppDetail = lazy(() => import('../pages/AppDetail'));
const Account = lazy(() => import('../pages/Account'));
const Store = lazy(() => import('../pages/Store'));
const Purchased = lazy(() => import('../pages/Purchased'));
const Runtimes = lazy(() => import('../pages/Runtimes'));

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

  '/:dash/my/apps': Dash.MyApps,
  '/:dash/apps': Dash.Apps,
  '/:dash/review/:appId/:versionId': AppDetail,
  '/:dash/app/create': Dash.AppAdd,
  '/:dash/app/:appId/create-version': Dash.AppAdd,
  '/:dash/app/:appId': Dash.AppDetail,
  '/:dash/app/:appId/audit-record': Dash.AuditRecord,
  '/:dash/app/:appId/audits': Dash.Audits,
  '/:dash/app/:appId/versions': Dash.Versions,
  '/:dash/app/:appId/version/:versionId': Dash.VersionDetail,
  '/:dash/app/:appId/deploy/:versionId?': Dash.AppDeploy,
  '/:dash/app/:appId/info': Dash.AppInfo,

  '/:dash/app-reviews': Dash.Reviews,
  '/:dash/app-review/:appId/:versionId': Dash.ReviewDetail,

  '/:dash/app/:appId/customer-instances': Dash.Clusters,
  '/:dash/app/:appId/sandbox-instances': Dash.Clusters,
  '/:dash/app/:appId/customer-instance/:clusterId': Dash.ClusterDetail,
  '/:dash/app/:appId/sandbox-instance/:clusterId': Dash.ClusterDetail,

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

  '/:dash/account': Account,

  '/:dash/testing-runtime': Dash.TestingEnv,
  '/:dash/testing-runtime/add': Dash.CreateTestingEnv,

  '*': Home
};

export default Object.keys(routes).map(route => {
  const routeDefinition = Object.assign(
    {},
    {
      path: toUrl(route),
      exact: route !== '/login',
      component: routes[route],
      needAuth: needAuth(route)
    }
  );
  if (route === '*') {
    Object.assign(routeDefinition, { noMatch: true });
  }
  return routeDefinition;
});
