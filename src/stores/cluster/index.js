import { observable, action } from 'mobx';
import Store from '../Store';
import { get, assign } from 'lodash';

export default class ClusterStore extends Store {
  @observable clusters = [];
  @observable cluster = {};

  @observable clusterNodes = [];
  @observable clusterJobs = [];

  @observable summaryInfo = {};
  @observable isLoading = false;
  @observable totalCount = 0;
  @observable isModalOpen = false;

  @observable currentPage = 1;

  // @observable clusterId = '';

  @observable currentPage = 1;

  @action.bound
  showModal = () => {
    this.isModalOpen = true;
  };

  @action.bound
  hideModal = () => {
    this.isModalOpen = false;
  };

  @action
  fetchAll = async (params = {}) => {
    let pageOffset = params.page || this.currentPage;
    let defaultParams = {
      limit: this.pageSize,
      offset: (pageOffset - 1) * this.pageSize
    };
    if (params.page) {
      delete params.page;
    }

    this.isLoading = true;
    const result = await this.request.get('clusters', assign(defaultParams, params));
    this.clusters = get(result, 'cluster_set', []);
    this.totalCount = get(result, 'total_count', 0);
    this.isLoading = false;
  };

  @action
  fetch = async clusterId => {
    this.isLoading = true;
    const result = await this.request.get(`clusters`, { cluster_id: clusterId });
    this.cluster = get(result, 'cluster_set[0]', {});
    this.isLoading = false;
  };

  @action
  fetchNodes = async clusterId => {
    this.isLoading = true;
    const result = await this.request.get(`clusters/nodes`, { cluster_id: clusterId });
    this.clusterNodes = get(result, 'cluster_node_set', []);
    this.isLoading = false;
  };

  @action
  fetchJobs = async clusterId => {
    this.isLoading = true;
    const result = await this.request.get(`jobs`, { cluster_id: clusterId });
    this.clusterJobs = get(result, 'job_set', []);
    this.isLoading = false;
  };

  @action
  remove = async clusterIds => {
    this.isLoading = true;
    await this.request.delete('clusters', { cluster_id: clusterIds });
    this.isLoading = false;
  };

  // fixme
  @action
  showDeleteCluster = cluster => {
    this.cluster = cluster;
    this.showModal();
  };

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
