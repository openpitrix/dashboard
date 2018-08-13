import Home from 'pages/Home';
import Login from 'pages/Login';
import AppDetail from 'pages/AppDetail';
import * as Dash from 'pages/Admin';

import {generateRoutes} from './utils';

const routes = {
  '/': Home,
  '/login': Login,
  '/apps/search/:search': Home,
  '/apps/category/:category': Home,
  '/app/:appId': AppDetail,

  '/:dash': Dash.Overview,

  '/:dash/apps': Dash.Apps,
  '/:dash/app/:appId': Dash.AppDetail,
  '/:dash/app/:appId/deploy': Dash.AppDeploy,

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

  '*': Home
};

export default generateRoutes(routes);
