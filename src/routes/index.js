import Home from 'containers/Home';
import Login from 'containers/Login';
import AppDeploy from 'containers/AppDeploy';
import InstalledApps from 'containers/InstalledApps';
import ClusterDetail from 'containers/ClusterDetail';
import Overview from 'containers/Manage/Overview';
import Apps from 'containers/Manage/Apps';
import AppDetail from 'containers/Manage/Apps/Detail';
import Clusters from 'containers/Manage/Clusters';
import Runtimes from 'containers/Manage/Runtimes';
import RuntimeDetail from 'containers/Manage/Runtimes/Detail';
import RuntimeAdd from 'containers/Manage/Runtimes/Add';
import Repos from 'containers/Manage/Repos';
import RepoDetail from 'containers/Manage/Repos/Detail';
import RepoAdd from 'containers/Manage/Repos/Add';
import Users from 'containers/Manage/Users';
import Roles from 'containers/Manage/Roles';
import Categories from 'containers/Manage/Categories';
import CategoryDetail from 'containers/Manage/Categories/Detail';

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
  { path: '/clusters/:clusterId', exact: true, component: ClusterDetail },
  { path: '/manage/clusters/:clusterId', exact: true, component: Clusters.Detail },
  { path: '/manage/runtimes', exact: true, component: Runtimes },
  { path: '/manage/runtimes/:runtimeId', exact: true, component: RuntimeDetail },
  { path: '/manage/addruntime', exact: true, component: RuntimeAdd },
  { path: '/manage/repos', exact: true, component: Repos },
  { path: '/manage/repos/:repoId', exact: true, component: RepoDetail },
  { path: '/manage/addrepo', exact: true, component: RepoAdd },
  { path: '/manage/users', exact: true, component: Users },
  { path: '/manage/roles', exact: true, component: Roles },
  { path: '/manage/categories', exact: true, component: Categories },
  { path: '/manage/categories/:categoryId', exact: true, component: CategoryDetail }
];

export default routes.map(route => {
  // add needAuth flag for /manage admin page
  if (route.path.indexOf('/manage/') === 0) {
    return { ...route, needAuth: true };
  }
  return route;
});
