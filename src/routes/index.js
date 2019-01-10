import React, { lazy } from 'react';
import { toUrl } from 'utils/url';
import { isEmpty } from 'lodash';

// views without lazy load
import Home from 'pages/Home';

import * as Dash from 'pages/Dashboard';

// views using lazy load
const Login = lazy(() => import('../pages/Login'));
const AppDetail = lazy(() => import('../pages/AppDetail'));

const routes = {
  '/': Home,
  '/cat/:category': Home,
  '/apps/:appId': [AppDetail, { applyHome: true }],

  '/login': Login,

  '/:dash': Dash.Overview,

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

  '/:dash/apps/:appId/deploy/:versionId?': Dash.AppDeploy,

  '/:dash/account/:type?': Dash.Account,

  '*': Home
};

const isValidComponent = comp => (typeof comp === 'object'
    && typeof comp.$$typeof === 'symbol'
    && comp.$$typeof.toString() === 'Symbol(react.lazy)')
  || (typeof comp === 'function'
    && Object.getPrototypeOf(comp) === React.Component);

export default Object.keys(routes).map(path => {
  const routeConf = [].concat(routes[path]);
  if (!isValidComponent(routeConf[0])) {
    throw Error(
      'Invalid route definition, first element should be react component or lazy component'
    );
  }

  const comp = routeConf[0];
  const compOption = routeConf[1] || {};

  const routeDefinition = Object.assign(compOption, {
    path: toUrl(path),
    exact: path !== '/login',
    component: comp,
    needAuth: path.startsWith('/:dash')
  });
  if (path === '*') {
    Object.assign(routeDefinition, { noMatch: true });
  }
  return routeDefinition;
});
