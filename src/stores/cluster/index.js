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

  @observable clusterId; // current delete cluster_id
  @observable operateType = '';

  @observable currentPage = 1;
  @observable searchWord = '';
  @observable runtimeId = '';
  @observable modalType = '';

  @observable selectedRowKeys = [];
  @observable clusterIds = [];

  @observable currentNodePage = 1;
  @observable searchNode = '';
  @observable selectNodeStatus = '';

  @observable selectStatus = '';
  @observable defaultStatus = ['active', 'stopped', 'ceased', 'pending', 'suspended'];

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
      limit: this.pageSize,
      offset: (pageOffset - 1) * this.pageSize
    };
    if (this.searchWord) {
      params.search_word = this.searchWord;
    }
    if (!params.runtime_id && this.runtimeId) {
      params.runtime_id = this.runtimeId;
    }
    if (!params.status) {
      params.status = this.selectStatus ? this.selectStatus : this.defaultStatus;
    }
    if (params.page) {
      delete params.page;
    }

    this.isLoading = true;
    const result = await this.request.get('clusters', assign(defaultParams, params));
    this.clusters = get(result, 'cluster_set', []);
    this.totalCount = get(result, 'total_count', 0);
    if (!this.searchWord && !this.selectStatus) {
      this.clusterCount = this.totalCount;
    }
    this.isLoading = false;
  };

  @action
  clusterStatistics = async () => {
    //this.isLoading = true;
    const result = await this.request.get('clusters/statistics');
    this.summaryInfo = {
      name: 'Clusters',
      iconName: 'cluster',
      centerName: 'Runtimes',
      total: get(result, 'cluster_count', 0),
      progressTotal: get(result, 'runtime_count', 0),
      progress: get(result, 'top_ten_runtimes', {}),
      histograms: get(result, 'last_two_week_created', {})
    };
    //this.isLoading = false;
  };

  @action
  fetch = async clusterId => {
    this.isLoading = true;
    const result = await this.request.get(`clusters`, { cluster_id: clusterId });
    this.cluster = get(result, 'cluster_set[0]', {});
    this.isLoading = false;
    this.pageInitMap = { cluster: true };
  };

  @action
  fetchNodes = async (params = {}) => {
    this.isLoading = true;
    let pageOffset = params.page || this.currentNodePage;
    let defaultParams = {
      sort_key: 'create_time',
      limit: this.pageSize,
      offset: (pageOffset - 1) * this.pageSize
    };

    if (this.searchNode) {
      params.search_word = this.searchNode;
    }
    if (!params.selectNodeStatus) {
      params.status = this.selectNodeStatus ? this.selectNodeStatus : this.cluster.status;
    }
    const result = await this.request.get(`clusters/nodes`, assign(defaultParams, params));
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
    this.hideModal();

    if (_.get(result, 'cluster_id')) {
      await this.fetchAll();
      this.cancelSelected();
      this.showMsg('Delete cluster successfully.', 'success');
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
    this.showModal('jobs');
  };

  @action
  clusterJobsClose = () => {
    this.showClusterJobs = false;
  };

  @action
  clusterParametersOpen = () => {
    this.showModal('parameters');
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
    await this.onSearch('');
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
  onChangeStatus = async status => {
    this.setCurrentPage(1);
    this.selectStatus = this.selectStatus === status ? '' : status;
    await this.fetchAll();
  };

  @action
  changeRuntimeId = id => {
    this.runtimeId = id;
  };

  @action
  loadPageInit = () => {
    if (!this.pageInitMap.cluster) {
      this.currentPage = 1;
      this.selectStatus = '';
      this.searchWord = '';
    }
    this.runtimeId = '';
    this.selectedRowKeys = [];
    this.clusterIds = [];
    this.pageInitMap = {};
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

  @action
  changeSearchNode = word => {
    this.searchNode = word;
  };

  @action
  onSearchNode = async searchWord => {
    this.changeSearchNode(searchWord);
    this.currentNodePage = 1;
    await this.fetchNodes({ cluster_id: this.cluster.cluster_id });
  };

  @action
  onClearNode = async () => {
    await this.onSearchNode('');
  };

  @action
  onRefreshNode = async () => {
    await this.fetchNodes({ cluster_id: this.cluster.cluster_id });
  };

  @action
  changePaginationNode = async page => {
    this.currentNodePage = page;
    await this.fetchNodes({ cluster_id: this.cluster.cluster_id });
  };

  @action
  onChangeNodeStatus = async status => {
    this.currentNodePage = 1;
    this.selectNodeStatus = this.selectNodeStatus === status ? '' : status;
    await this.fetchNodes({
      cluster_id: this.cluster.cluster_id
    });
  };

  @action
  loadNodeInit = () => {
    this.currentNodePage = 1;
    this.selectNodeStatus = '';
    this.searchNode = '';
  };
}
