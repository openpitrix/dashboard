import { observable, action } from 'mobx';
import request from 'core/request';

export default class AppStore {
  @observable apps = [];
  @observable app = {};
  @observable installedApps = [];
  @observable clusters = {};
  @observable clusterNodes = {};
  @observable isLoading = false;

  @action async fetchApps() {
    this.isLoading = true;
    const result = await request.get('api/apps');
    this.apps = result.items;
    this.isLoading = false;
  }

  @action async fetchApp(appId) {
    this.isLoading = true;
    const result = await request.get(`api/app/${appId}`);
    this.app = result;
    this.isLoading = false;
  }

  @action async fetchInstalledApps() {
    this.isLoading = true;
    const result = await request.get('api/installedApps');
    this.installedApps = result.items;
    this.isLoading = false;
  }

  @action async fetchClusters() {
    this.isLoading = true;
    const result = await request.get('api/clusters');
    this.clusters = result;
    this.isLoading = false;
  }

  @action async fetchClusterNodes(clusterId) {
    this.isLoading = true;
    const result = await request.get(`api/clusterNodes/${clusterId}`);
    this.clusterNodes = result;
    this.isLoading = false;
  }
}
