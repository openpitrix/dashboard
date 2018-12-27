import { lazy } from 'react';
import { toUrl } from 'utils/url';

// views without lazy load
import Home from 'pages/Home';

import * as Dash from 'pages/Dashboard';

// views using lazy load
const Login = lazy(() => import('../pages/Login'));
const AppDetail = lazy(() => import('../pages/AppDetail'));
const Account = lazy(() => import('../pages/Account'));
const Store = lazy(() => import('../pages/Store'));
const Purchased = lazy(() => import('../pages/Purchased'));

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
  // todo
  '/store/:appId/deploy': Dash.AppDeploy,

  '/:dash/purchased': Purchased,
  '/:dash/purchased/:clusterId': Dash.ClusterDetail,

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

  '/:dash/providers': Dash.Providers,
  '/:dash/provider/submit': Dash.ProviderCreate,
  '/:dash/provider/:providerId': Dash.ProviderDetail,
  '/:dash/applications': Dash.Applications,
  '/:dash/application/:providerId': Dash.ApplicationDetail,
  '/:dash/provider-detail': Dash.ApplicationDetail,

  '/:dash/app/:appId/customer-instances': Dash.Clusters,
  '/:dash/app/:appId/sandbox-instances': Dash.Clusters,
  '/:dash/app/:appId/customer-instance/:clusterId': Dash.ClusterDetail,
  '/:dash/app/:appId/sandbox-instance/:clusterId': Dash.ClusterDetail,

  '/:dash/clusters': Dash.Clusters,
  '/:dash/cluster/:clusterId': Dash.ClusterDetail,

  '/:dash/runtimes': Dash.TestingEnv,
  '/:dash/runtime/create': Dash.CreateTestingEnv,

  // '/:dash/runtime/:runtimeId': Dash.RuntimeDetail,

  '/:dash/categories': Dash.Categories,
  '/:dash/category/:categoryId': Dash.CategoryDetail,

  '/:dash/users': Dash.Users,
  '/:dash/user/:userId': Dash.UserDetail,

  '/:dash/account': Account,

  '*': Home
};

export default Object.keys(routes).map(route => {
  const routeDefinition = Object.assign(
    {},
    {
      path: toUrl(route),
      exact: route !== '/login',
      component: routes[route],
      needAuth: route.startsWith('/:dash')
    }
  );
  if (route === '*') {
    Object.assign(routeDefinition, { noMatch: true });
  }
  return routeDefinition;
});
