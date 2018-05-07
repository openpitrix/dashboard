import { observable, action, extendObservable } from 'mobx';
import request from 'lib/request';

export default class ClusterStore {
  @observable clusters = {};
  @observable clusterDetails = {};
  @observable clusterNodes = {};
  @observable isLoading = false;

  constructor(initialState) {
    if (initialState) {
      extendObservable(this, initialState.clusterStore);
    }
  }

  @action
  async fetchClusters() {
    this.isLoading = true;
    this.clusters = await request.get('api/v1/clusters');
    this.isLoading = false;
  }

  @action
  async fetchClusterDetails({ clusterId }) {
    this.isLoading = true;
    this.clusterDetails = await request.get(`api/v1/clusters/${clusterId}`);
    this.isLoading = false;
  }

  @action
  async fetchClusterNodes({ clusterId }) {
    this.isLoading = true;
    this.clusterNodes = await request.get(`api/v1/cluster_nodes/${clusterId}`);
    this.isLoading = false;
  }
}
