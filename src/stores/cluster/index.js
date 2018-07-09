import { observable, action } from 'mobx';
import Store from '../Store';
import { get, assign } from 'lodash';
import _ from 'lodash';

export default class ClusterStore extends Store {
  @observable clusters = [];
  @observable cluster = {};

  @observable clusterNodes = [];
  @observable clusterJobs = [];

  @observable summaryInfo = {};
  @observable isLoading = false;
  @observable totalCount = 0;
  @observable clusterCount = 0;
  @observable isModalOpen = false;

  @observable clusterId = ''; // current delete cluster_id
  @observable operateType = '';

  @observable currentPage = 1;
  @observable searchWord = '';
  @observable runtimeId = '';
  @observable modalType = '';

  @observable selectedRowKeys = [];
  @observable clusterIds = [];

  @action.bound
  showModal = type => {
    this.modalType = type;
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
      sort_key: 'upgrade_time',
      limit: this.pageSize,
      offset: (pageOffset - 1) * this.pageSize
    };
    if (this.searchWord) {
      params.search_word = this.searchWord;
    }
    if (!params.runtime_id && this.runtimeId) {
      params.runtime_id = this.runtimeId;
      params.status = ['active', 'stopped', 'ceased', 'pending', 'suspended', 'deleted'];
    }
    if (!params.status) {
      params.status = this.defaultStatus;
    }
    if (params.page) {
      delete params.page;
    }

    this.isLoading = true;
    const result = await this.request.get('clusters', assign(defaultParams, params));
    this.clusters = get(result, 'cluster_set', []);
    this.totalCount = get(result, 'total_count', 0);
    if (!this.searchWord) {
      this.clusterCount = this.totalCount;
    }
    this.isLoading = false;
  };

  @action
  clusterStatistics = async () => {
    this.isLoading = true;
    const result = await this.request.get('clusters/statistics');
    this.summaryInfo = {
      name: 'Clusters',
      centerName: 'Runtimes',
      total: get(result, 'cluster_count', 0),
      progressTotal: get(result, 'runtime_count', 0),
      progress: get(result, 'top_ten_runtimes', {}),
      histograms: get(result, 'last_two_week_created', {})
    };
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
    const result = await this.request.post('clusters/delete', { cluster_id: clusterIds });
    if (_.get(result, 'cluster_id')) {
      this.hideModal();
      await this.fetchAll();
      this.cancelSelected();
      this.showMsg('Delete cluster successfully.');
    } else {
      let { err, errDetail } = result;
      this.showMsg(errDetail || err);
    }
  };

  @action
  start = async clusterIds => {
    const result = await this.request.post('clusters/start', { cluster_id: clusterIds });
    if (_.get(result, 'cluster_id')) {
      this.hideModal();
      await this.fetchAll();
      this.cancelSelected();
      this.showMsg('Start cluster successfully.');
    } else {
      let { err, errDetail } = result;
      this.showMsg(errDetail || err);
    }
  };

  @action
  stop = async clusterIds => {
    const result = await this.request.post('clusters/stop', { cluster_id: clusterIds });
    if (_.get(result, 'cluster_id')) {
      this.hideModal();
      await this.fetchAll();
      this.cancelSelected();
      this.showMsg('Stop cluster successfully.');
    } else {
      let { err, errDetail } = result;
      this.showMsg(errDetail || err);
    }
  };

  @action
  showOperateCluster = (clusterIds, type) => {
    if (typeof clusterIds === 'string') {
      this.clusterId = clusterIds;
      this.operateType = 'single';
    } else {
      this.operateType = 'multiple';
    }
    this.showModal(type);
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

  @action
  changeSearchWord = word => {
    this.searchWord = word;
  };

  @action
  setCurrentPage = page => {
    this.currentPage = page;
  };

  @action
  onSearch = async searchWord => {
    this.changeSearchWord(searchWord);
    this.setCurrentPage(1);
    await this.fetchAll();
  };

  @action
  onClearSearch = async () => {
    this.changeSearchWord('');
    this.setCurrentPage(1);
    await this.fetchAll();
  };

  @action
  onRefresh = async () => {
    await this.fetchAll();
  };

  @action
  changePagination = async page => {
    this.setCurrentPage(page);
    await this.fetchAll();
  };

  @action
  changeRuntimeId = id => {
    this.runtimeId = id;
  };

  @action
  loadPageInit = () => {
    this.currentPage = 1;
    this.searchWord = '';
    this.runtimeId = '';
    this.selectedRowKeys = [];
    this.clusterIds = [];
  };

  @action
  onChangeSelect = (selectedRowKeys, selectedRows) => {
    this.selectedRowKeys = selectedRowKeys;
    this.clusterIds = [];
    selectedRows.map(row => this.clusterIds.push(row.cluster_id));
  };

  @action
  cancelSelected = () => {
    this.selectedRowKeys = [];
    this.clusterIds = [];
  };
}
