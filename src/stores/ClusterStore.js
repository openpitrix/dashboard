import { observable, action, extendObservable } from 'mobx';
import request from 'lib/request';

export default class ClusterStore {
  @observable clusters = {};
  @observable clusterNodes = {};
  @observable isLoading = false;

  constructor(initialState) {
    if (initialState) {
      extendObservable(this, initialState.clusterStore);
    }
  }

  @action async fetchClusters() {
    this.isLoading = true;
    const result = await request.get('api/v1/clusters');
    this.clusters = result;
    this.isLoading = false;
  }

  @action async fetchClusterDetails(clusterId) {
    this.isLoading = true;
    const result = await request.get(`api/v1/clusters/${clusterId}`);
    this.clusterDetails = result;
    this.isLoading = false;
  }

  @action async fetchClusterNodes(clusterId) {
    this.isLoading = true;
    const result = await request.get(`api/v1/cluster_nodes/${clusterId}`);
    this.clusterNodes = result;
    this.isLoading = false;
  }
}
