import Home from 'containers/Home';
import Login from 'containers/Login';
import AppDetail from 'containers/AppDetail';
import AppDeploy from 'containers/AppDeploy';
import InstalledApps from 'containers/InstalledApps';
import Clusters from 'containers/Clusters';
import ClusterDetail from 'containers/ClusterDetail';

const routes = [
  { path: '/', exact: true, component: Home },
  { path: '/login', exact: true, component: Login },
  { path: '/apps', exact: true, component: Home },
  { path: '/apps/:category', exact: true, component: Home },
  { path: '/app/:appId', exact: true, component: AppDetail },
  { path: '/app/:appId/deploy', exact: true, component: AppDeploy },
  { path: '/manage/apps', exact: true, component: InstalledApps },
  { path: '/manage/clusters', exact: true, component: Clusters },
  { path: '/manage/cluster/:clusterId', exact: true, component: ClusterDetail }
];

export default routes;
