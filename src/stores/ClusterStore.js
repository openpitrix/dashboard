import { observable, action } from 'mobx';
import Store from './Store';
import { get } from 'lodash';

export default class ClusterStore extends Store {
  @observable clusters = [];
  @observable totalCount = 0;
  @observable clusterDetail = {};
  @observable clusterNodes = {};
  @observable isLoading = false;

  constructor(initialState) {
    super(initialState, 'clusterStore');
  }

  @action
  async fetchClusters({ page }) {
    this.isLoading = true;
    page = page ? page : 1;
    const result = await this.request.get('clusters', { _page: page });
    this.clusters = get(result, 'cluster_set', []);
    this.totalCount = get(result, 'total_count', 0);
    this.isLoading = false;
  }

  @action
  async fetchQueryClusters(query) {
    this.isLoading = true;
    const result = await this.request.get(`clusters`, { q: query });
    this.clusters = get(result, 'cluster_set', []);
    this.totalCount = get(result, 'total_count', 0);
    this.isLoading = false;
  }

  @action
  async fetchClusterDetail(clusterId) {
    this.isLoading = true;
    const result = await this.request.get(`clusters`, { cluster_id: clusterId });
    this.clusterDetail = get(result, 'cluster_set[0]', {});
    this.isLoading = false;
  }

  @action
  async fetchClusterNodes({ clusterId }) {
    this.isLoading = true;
    this.clusterNodes = await this.request.get(`cluster_nodes/${clusterId}`);
    this.isLoading = false;
  }
}
