import { observable, action } from 'mobx';
import Store from './Store';

export default class ClusterStore extends Store {
  @observable clusters = {};
  @observable clusterDetails = {};
  @observable clusterNodes = {};
  @observable isLoading = false;

  constructor(initialState) {
    super(initialState, 'clusterStore');
  }

  @action
  async fetchClusters() {
    this.isLoading = true;
    this.clusters = await this.request.get('api/v1/clusters');
    this.isLoading = false;
  }

  @action
  async fetchClusterDetails({ clusterId }) {
    this.isLoading = true;
    this.clusterDetails = await this.request.get(`api/v1/clusters/${clusterId}`);
    this.isLoading = false;
  }

  @action
  async fetchClusterNodes({ clusterId }) {
    this.isLoading = true;
    this.clusterNodes = await this.request.get(`api/v1/cluster_nodes/${clusterId}`);
    this.isLoading = false;
  }
}
