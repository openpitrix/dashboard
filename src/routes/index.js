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

  '/:dash': Dash.Overview,

  // only for user
  '/:dash/purchased': Dash.Purchased,
  '/:dash/purchased/:appId': Dash.PurchasedDetail,
  '/:dash/clusters': Dash.Clusters,

  // only for developer
  '/:dash/my/apps': Dash.MyApps,
  '/:dash/app/create': Dash.AppAdd,
  '/:dash/app/:appId/create-version': Dash.AppAdd,

  '/:dash/app/:appId/versions': Dash.Versions,
  '/:dash/app/:appId/version/:versionId': Dash.VersionDetail,
  '/:dash/app/:appId/audits': Dash.Audits,
  '/:dash/app/:appId/info': Dash.AppInfo,

  '/:dash/app/:appId/user-instances': Dash.Clusters,
  '/:dash/app/:appId/sandbox-instances': Dash.Clusters,
  '/:dash/app/:appId/user-instance/:clusterId': Dash.ClusterDetail,
  '/:dash/app/:appId/sandbox-instance/:clusterId': Dash.ClusterDetail,

  // only for isv
  '/:dash/provider-detail': Dash.ApplicationDetail,
  '/:dash/provider/submit': Dash.ProviderCreate,

  // only for admin
  '/:dash/providers': Dash.Providers,
  '/:dash/provider/:providerId': Dash.ProviderDetail,
  '/:dash/applications': Dash.Applications,
  '/:dash/application/:providerId': Dash.ApplicationDetail,

  '/:dash/categories': Dash.Categories,

  '/:dash/users': Dash.Users,
  '/:dash/user/:userId': Dash.UserDetail,

  // for admin or isv
  '/:dash/apps': Dash.Apps,
  '/:dash/app/:appId': Dash.AppDetail,

  '/:dash/app-reviews': Dash.Reviews,
  '/:dash/app-review/:reviewId': Dash.ReviewDetail,

  // for all roles
  '/:dash/app/:appId/deploy/:versionId?': Dash.AppDeploy,

  '/:dash/runtimes': Dash.TestingEnv,
  '/:dash/runtime/create': Dash.CreateTestingEnv,

  '/:dash/account': Account,

  '/:dash/cluster/:clusterId': Dash.ClusterDetail,

  // todo
  // '/:dash/runtime/:runtimeId': Dash.RuntimeDetail,

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
