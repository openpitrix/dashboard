import Home from 'containers/Home';
import BrowseApps from 'containers/BrowseApps';
import AppDetail from 'containers/Home';
import AppDeploy from 'containers/Home';
import InstalledApps from 'containers/Home';
import Clusters from 'containers/Home';
import ClusterDetail from 'containers/Home';

const routes = [
  { path: '/', component: Home },
  { path: '/apps', component: BrowseApps },
  { path: '/apps/:category', component: BrowseApps },
  { path: '/app/:appId', component: AppDetail },
  { path: '/app/:appId/deploy', component: AppDeploy },
  { path: '/manage/apps', component: InstalledApps },
  { path: '/manage/clusters', component: Clusters },
  { path: '/manage/cluster/:clusterId', component: ClusterDetail },
];

export default routes;
