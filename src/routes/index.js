import Home from 'pages/Home';
import Login from 'pages/Login';
import AppDetail from 'pages/AppDetail';
import * as Dash from 'pages/Admin';
import Profile from 'pages/Profile';
import SSHKeys from 'pages/SSHKeys';
import Store from 'pages/Store';
import Purchased from 'pages/Purchased';
import Runtimes from 'pages/Runtimes';

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
  '/apps/search/:search': Home,
  '/apps/category/:category': Home,
  '/app/:appId': AppDetail,

  '/store': Store,
  '/store/search/:search': Store,
  '/store/category/:category': Store,
  '/store/:appId': AppDetail,
  '/store/:appId/deploy': Dash.AppDeploy,

  '/purchased': Purchased,
  '/purchased/:clusterId': Dash.ClusterDetail,

  '/runtimes': Runtimes,

  '/:dash': Dash.Overview,

  '/:dash/apps': Dash.Apps,
  '/:dash/reviews': Dash.AppReview,
  '/:dash/review/:appId/:versionId': AppDetail,
  '/:dash/app/create': Dash.AppAdd,
  '/:dash/app/:appId': Dash.AppDetail,

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

  const paths = ['/runtimes', '/purchased', '/profile', '/ssh_keys'];
  return paths.includes(route);
};

export default Object.keys(routes).map(route => {
  const routeDefinition = Object.assign(
    {},
    {
      path: dashUrl(route),
      exact: useExactRoute,
      component: routes[route],
      needAuth: judgeNeedAuth(route)
    }
  );
  if (route === '*') {
    Object.assign(routeDefinition, { noMatch: true });
  }
  return routeDefinition;
});
