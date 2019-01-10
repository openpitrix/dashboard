import { lazy } from 'react';
import { toUrl } from 'utils/url';

// views without lazy load
import Home from 'pages/Home';

import * as Dash from 'pages/Dashboard';

// views using lazy load
const Login = lazy(() => import('../pages/Login'));
const AppDetail = lazy(() => import('../pages/AppDetail'));

const routes = {
  '/login': Login,
  '/': Home,
  '/apps': Home,
  '/apps/search/:search': Home,
  '/apps/category/:category': Home,
  '/apps/:appId': AppDetail,

  // only for user
  '/:dash/purchased': Dash.Purchased,
  '/:dash/purchased/:appId': Dash.PurchasedDetail,

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

  '/:dash/clusters': Dash.Clusters,
  '/:dash/cluster/:clusterId': Dash.ClusterDetail,

  '/:dash/runtimes': Dash.Runtimes,
  '/:dash/runtime/create': Dash.CreateRuntime,

  '/:dash/categories': Dash.Categories,

  '/:dash/users': Dash.Users,
  '/:dash/user/:userId': Dash.UserDetail,

  // for admin or isv
  '/:dash/apps': Dash.Apps,
  '/:dash/app/:appId': Dash.AppDetail,

  '/:dash/app-reviews': Dash.Reviews,
  '/:dash/app-review/:reviewId': Dash.ReviewDetail,

  // for all roles
  '/:dash': Dash.Overview,

  '/:dash/apps/:appId/deploy/:versionId?': Dash.AppDeploy,

  '/:dash/account/:type?': Dash.Account,

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
