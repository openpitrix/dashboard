import Home from 'pages/Home';
import Login from 'pages/Login';
import AppDeploy from 'pages/AppDeploy';
import AppDetail from 'pages/AppDetail';
// import InstalledApps from 'pages/InstalledApps';
import ClusterDetail from 'pages/ClusterDetail';
import * as Manage from 'pages/Manage';

const routes = [
  { path: '/', exact: true, component: Home },
  { path: '/login', exact: true, component: Login },
  { path: '/apps', exact: true, component: Home },
  { path: '/apps/:category', exact: true, component: Home },
  { path: '/app/:appId/deploy', exact: true, component: AppDeploy },
  { path: '/app/:appId', exact: true, component: AppDetail },
  { path: '/clusters/:clusterId', exact: true, component: ClusterDetail },

  { path: '/:manage', exact: true, component: Manage.Overview },
  { path: '/:manage/apps', exact: true, component: Manage.Apps },
  { path: '/:manage/apps/:appId', exact: true, component: Manage.AppDetail },
  { path: '/:manage/clusters', exact: true, component: Manage.Clusters },
  { path: '/:manage/clusters/:clusterId', exact: true, component: Manage.ClusterDetail },
  { path: '/:manage/runtimes', exact: true, component: Manage.Runtimes },
  { path: '/:manage/runtimes/create', exact: true, component: Manage.RuntimeAdd },
  { path: '/:manage/runtimes/:runtimeId', exact: true, component: Manage.RuntimeDetail },
  { path: '/:manage/repos', exact: true, component: Manage.Repos },
  { path: '/:manage/repos/create', exact: true, component: Manage.RepoAdd },
  { path: '/:manage/repos/:repoId', exact: true, component: Manage.RepoDetail },

  { path: '/manage/users', exact: true, component: Manage.Users },
  { path: '/manage/roles', exact: true, component: Manage.Roles },
  { path: '/manage/categories', exact: true, component: Manage.Categories },
  { path: '/manage/categories/:categoryId', exact: true, component: Manage.CategoryDetail },
  { path: '*', noMatch: true, component: Home }
];

export default routes.map(route => {
  // add needAuth flag for /manage admin page
  const path = route.path;
  if (path.indexOf('/:manage') === 0 || path.indexOf('/manage') === 0) {
    return { ...route, needAuth: true };
  }
  return route;
});
