import Home from 'containers/Home';
import Login from 'containers/Login';
import Overview from 'containers/Overview';
import AppDeploy from 'containers/AppDeploy';
import InstalledApps from 'containers/InstalledApps';
import Apps from 'containers/Apps';
import AppDetail from 'containers/Apps/AppDetail';
import Clusters from 'containers/Clusters';
import ClusterDetail from 'containers/ClusterDetail';
import Runtimes from 'containers/Runtimes';
import RuntimeDetail from 'containers/Runtimes/RuntimeDetail';
import Repos from 'containers/Repos';
import RepoDetail from 'containers/Repos/RepoDetail';
import Users from 'containers/Users';
import Roles from 'containers/Roles';
import Categories from 'containers/Categories';
import CategorieDetail from 'containers/Categories/CategorieDetail';

const routes = [
  { path: '/', exact: true, component: Home },
  { path: '/login', exact: true, component: Login },
  { path: '/apps', exact: true, component: Home },
  { path: '/apps/:category', exact: true, component: Home },
  { path: '/app/:appId/deploy', exact: true, component: AppDeploy },
  { path: '/manage/overview', exact: true, component: Overview },
  { path: '/manage/apps', exact: true, component: Apps },
  { path: '/manage/apps/:appId', exact: true, component: AppDetail },
  { path: '/manage/clusters', exact: true, component: Clusters },
  { path: '/manage/cluster/:clusterId', exact: true, component: ClusterDetail },
  { path: '/manage/runtimes', exact: true, component: Runtimes },
  { path: '/manage/runtimes/:runtimeId', exact: true, component: RuntimeDetail },
  { path: '/manage/repos', exact: true, component: Repos },
  { path: '/manage/repos/:repoId', exact: true, component: RepoDetail },
  { path: '/manage/users', exact: true, component: Users },
  { path: '/manage/roles', exact: true, component: Roles },
  { path: '/manage/categories', exact: true, component: Categories },
  { path: '/manage/categories/:categorieId', exact: true, component: CategorieDetail }
];

export default routes.map(route => {
  // add needAuth flag for /manage admin page
  if (route.path.indexOf('/manage/') === 0) {
    return { ...route, needAuth: true };
  }
  return route;
});
