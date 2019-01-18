import React, { lazy } from 'react';
import { toUrl } from 'utils/url';
import { roleTypes as r } from 'config/roles';

// pages without lazy load
import Home from 'pages/Home';
import * as Dash from 'pages/Dashboard';

// pages using lazy load
const Login = lazy(() => import('../pages/Login'));
const AppDetail = lazy(() => import('../pages/AppDetail'));

const routes = {
  '/': Home,

  '/apps/:appId': [AppDetail, { applyHome: true }],

  '/login': Login,

  '/:dash': Dash.Overview,

  '/:dash/apps/:appId/deploy/:versionId?': Dash.AppDeploy,

  '/:dash/purchased': [Dash.Purchased, { acl: r.user }],
  '/:dash/purchased/:appId': [Dash.PurchasedDetail, { acl: r.user }],

  '/:dash/my/apps': [Dash.MyApps, { acl: r.dev }],
  '/:dash/app/create': [Dash.AppAdd, { acl: r.dev }],
  '/:dash/app/:appId/create-version': [Dash.AppAdd, { acl: r.dev }],

  '/:dash/app/:appId/versions': [Dash.Versions, { acl: r.dev }],
  '/:dash/app/:appId/version/:versionId': [Dash.VersionDetail, { acl: r.dev }],
  '/:dash/app/:appId/audits': [Dash.Audits, { acl: r.dev }],
  '/:dash/app/:appId/info': [Dash.AppInfo, { acl: r.dev }],

  '/:dash/app/:appId/user-instances': [Dash.Clusters, { acl: r.dev }],
  '/:dash/app/:appId/sandbox-instances': [Dash.Clusters, { acl: r.dev }],
  '/:dash/app/:appId/user-instance/:clusterId': [
    Dash.ClusterDetail,
    { acl: r.dev }
  ],
  '/:dash/app/:appId/sandbox-instance/:clusterId': [
    Dash.ClusterDetail,
    { acl: r.dev }
  ],

  '/:dash/provider-detail': [Dash.ApplicationDetail, { acl: r.isv }],
  '/:dash/provider/submit': [Dash.ProviderCreate, { acl: [r.isv, r.user] }],

  '/:dash/providers': [Dash.Providers, { acl: r.admin }],
  '/:dash/provider/:providerId': [Dash.ProviderDetail, { acl: r.admin }],
  '/:dash/applications': [Dash.Applications, { acl: r.admin }],
  '/:dash/application/:providerId': [Dash.ApplicationDetail, { acl: r.admin }],

  '/:dash/clusters': [Dash.Clusters, { acl: [r.admin, r.user] }],
  '/:dash/cluster/:clusterId': [Dash.ClusterDetail, { acl: [r.admin, r.user] }],

  '/:dash/runtimes': Dash.Runtimes,
  '/:dash/runtime/create': Dash.CreateRuntime,

  '/:dash/categories': [Dash.Categories, { acl: r.admin }],

  '/:dash/users': [Dash.Users, { acl: r.admin }],
  '/:dash/user/:userId': [Dash.UserDetail, { acl: r.admin }],

  '/:dash/apps': [Dash.Apps, { acl: [r.admin, r.isv] }],
  '/:dash/app/:appId': [Dash.AppDetail, { acl: [r.admin, r.isv] }],

  '/:dash/app-reviews': [Dash.Reviews, { acl: [r.admin, r.isv] }],
  '/:dash/app-review/:reviewId': [Dash.ReviewDetail, { acl: [r.admin, r.isv] }],

  '/:dash/account/:type?': Dash.Account,

  '/:dash/setting/cloud-env': [Dash.CloudEnv, { acl: r.admin }],
  '/:dash/setting/notification-server': [
    Dash.NotificationServer,
    { acl: r.admin }
  ],

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
    needAuth: path.startsWith('/:dash'),
    acl: compOption.acl || []
  });
  if (path === '*') {
    Object.assign(routeDefinition, { noMatch: true });
  }
  return routeDefinition;
});
