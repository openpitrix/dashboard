import { observable, action } from 'mobx';
import Store from '../Store';
import { get, assign } from 'lodash';

export default class ClusterStore extends Store {
  @observable clusters = [];
  @observable clusterDetail = {};
  @observable clusterNodes = [];
  @observable clusterJobs = [];
  @observable statistics = {};
  @observable isLoading = false;
  @observable totalCount = 0;

  @observable clusterId = '';
  @observable showDeleteCluster = false;
  @observable showClusterJobs = false;
  @observable showClusterParameters = false;

  @action
  fetchAll = async page => {
    this.isLoading = true;
    page = page && !isNaN(page) ? page : 1;
    const params = {
      limit: this.pageSize,
      offset: (page - 1) * this.pageSize
    };
    const result = await this.request.get('clusters', params);
    this.clusters = get(result, 'cluster_set', []);
    this.totalCount = get(result, 'total_count', 0);
    this.isLoading = false;
  };

  @action
  fetchQueryClusters = async query => {
    this.isLoading = true;
    let params = {
      limit: this.pageSize
    };
    if (typeof query === 'object') assign(params, query);
    if (typeof query === 'string') assign(params, { search_word: query });
    const result = await this.request.get(`clusters`, params);
    this.clusters = get(result, 'cluster_set', []);
    this.totalCount = get(result, 'total_count', 0);
    this.isLoading = false;
  };

  @action
  async fetchClusterDetail(clusterId) {
    this.isLoading = true;
    const result = await this.request.get(`clusters`, { cluster_id: clusterId });
    this.clusterDetail = get(result, 'cluster_set[0]', {});
    this.isLoading = false;
  }

  @action
  fetchClusterNodes = async clusterId => {
    this.isLoading = true;
    const result = await this.request.get(`clusters/nodes`, { cluster_id: clusterId });
    this.clusterNodes = get(result, 'cluster_node_set', []);
    this.isLoading = false;
  };

  @action
  async fetchClusterJobs(clusterId) {
    this.isLoading = true;
    const result = await this.request.get(`jobs`, { cluster_id: clusterId });
    this.clusterJobs = get(result, 'job_set', []);
    this.isLoading = false;
  }

  // @action
  // async fetchStatistics() {
  //   this.isLoading = true;
  //   const result = await this.request.get('statistics');
  //   this.statistics = get(result, 'statistics_set.clusters', {});
  //   this.isLoading = false;
  // }

  @action
  async deleteCluster(clusterIds) {
    this.isLoading = true;
    await this.request.delete('clusters', { cluster_id: clusterIds });
    this.isLoading = false;
  }

  // fixme: ///
  @action
  deleteClusterShow = clusterId => {
    this.clusterId = clusterId;
    this.showDeleteCluster = true;
  };

  @action
  deleteClusterClose = () => {
    this.showDeleteCluster = false;
  };

  // @action
  // deleteCluster = async clusterStore => {
  //   await clusterStore.deleteCluster([this.clusterId]);
  //   this.showDeleteCluster = false;
  //   await clusterStore.fetchClusters();
  // };

  @action
  clusterJobsOpen = () => {
    this.showClusterJobs = true;
  };

  @action
  clusterJobsClose = () => {
    this.showClusterJobs = false;
  };

  @action
  clusterParametersOpen = () => {
    this.showClusterParameters = true;
  };

  @action
  clusterParametersClose = () => {
    this.showClusterParameters = false;
  };
}
