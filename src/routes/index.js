import Home from 'pages/Home';
import Login from 'pages/Login';
import AppDetail from 'pages/AppDetail';
import ClusterDetail from 'pages/ClusterDetail';
import * as Dash from 'pages/Admin';

const useExactRoute = true;
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
  '/apps': Home,
  '/apps/:category': Home,
  '/app/:appId': AppDetail,
  '/clusters/:clusterId': ClusterDetail,

  '/:dash': Dash.Overview,
  '/:dash/apps': Dash.Apps,
  '/:dash/apps/:appId': Dash.AppDetail,
  // '/:dash/apps/installed': Dash.AppsInstalled,
  '/:dash/app/:appId/deploy': Dash.AppDeploy,
  '/:dash/clusters': Dash.Clusters,
  '/:dash/cluster/:clusterId': Dash.ClusterDetail,
  '/:dash/runtimes': Dash.Runtimes,
  '/:dash/runtime/create': Dash.RuntimeAdd,
  '/:dash/runtime/edit/:runtimeId': Dash.RuntimeDetail,
  '/:dash/runtime/:runtimeId': Dash.RuntimeDetail,
  '/:dash/repos': Dash.Repos,
  '/:dash/repo/create': Dash.RepoAdd,
  '/:dash/repo/edit/:repoId': Dash.RepoDetail,
  '/:dash/repo/:repoId': Dash.RepoDetail,
  '/:dash/users': Dash.Users,
  '/:dash/roles': Dash.Roles,
  '/:dash/categories': Dash.Categories,
  '/:dash/category/:categoryId': Dash.CategoryDetail,
  '*': Home
};

export default Object.keys(routes).map(route => {
  const routeDefinition = Object.assign(
    {},
    {
      path: dashUrl(route),
      exact: useExactRoute,
      component: routes[route],
      needAuth: route.startsWith('/:dash')
    }
  );
  if (route === '*') {
    Object.assign(routeDefinition, { noMatch: true });
  }
  return routeDefinition;
});
