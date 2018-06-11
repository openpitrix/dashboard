import Home from 'pages/Home';
import Login from 'pages/Login';
import AppDeploy from 'pages/AppDeploy';
import AppDetail from 'pages/AppDetail';
import ClusterDetail from 'pages/ClusterDetail';
import * as Admin from 'pages/Admin';

const useExactRoute = true;

const routes = {
  '/': Home,
  '/login': Login,
  '/apps': Home,
  '/app/:category': Home,
  '/app/:appId/deploy': AppDeploy,
  '/app/:appId': AppDetail,
  '/clusters/:clusterId': ClusterDetail,

  '/:admin': Admin.Overview,
  '/:admin/apps': Admin.Apps,
  '/:admin/apps/:appId': Admin.AppDetail,
  '/:admin/clusters': Admin.Clusters,
  '/:admin/cluster/:clusterId': Admin.ClusterDetail,
  '/:admin/runtimes': Admin.Runtimes,
  '/:admin/runtime/create': Admin.RuntimeAdd,
  '/:admin/runtime/edit/:runtimeId': Admin.RuntimeDetail,
  '/:admin/runtime/:runtimeId': Admin.RuntimeDetail,
  '/:admin/repos': Admin.Repos,
  '/:admin/repo/create': Admin.RepoAdd,
  '/:admin/repo/edit/:repoId': Admin.RepoDetail,
  '/:admin/repo/:repoId': Admin.RepoDetail,
  '/:admin/users': Admin.Users,
  '/:admin/roles': Admin.Roles,
  '/:admin/categories': Admin.Categories,
  '/:admin/category/:categoryId': Admin.CategoryDetail,
  '*': Home
};

export default Object.keys(routes).map(route => {
  const routeDefinition = Object.assign(
    {},
    {
      path: route,
      exact: useExactRoute,
      component: routes[route],
      needAuth: route.startsWith('/:admin')
    }
  );
  if (route === '*') {
    Object.assign(routeDefinition, { noMatch: true });
  }
  return routeDefinition;
});
