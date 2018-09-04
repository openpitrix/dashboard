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
  @observable totalNodeCount = 0;
  @observable isModalOpen = false;
  @observable modalType = '';

  @observable clusterId; // current delete cluster_id
  @observable operateType = '';

  @observable currentPage = 1; //cluster table query params
  @observable searchWord = '';
  defaultStatus = ['active', 'stopped', 'ceased', 'pending', 'suspended'];
  @observable selectStatus = '';
  @observable appId = '';
  @observable runtimeId = '';
  @observable userId = '';

  @observable selectedRowKeys = [];
  @observable clusterIds = [];

  @observable currentNodePage = 1;
  @observable searchNode = '';
  @observable selectNodeStatus = '';

  @observable keyPairs = [];
  @observable pairId = '';
  @observable currentPairId = '';

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
    let defaultParams = {
      sort_key: 'status_time',
      limit: this.pageSize,
      offset: (this.currentPage - 1) * this.pageSize,
      status: this.selectStatus ? this.selectStatus : this.defaultStatus
    };

    if (params.noLimit) {
      defaultParams.limit = this.maxLimit;
      defaultParams.offset = 0;
      delete params.noLimit;
    }

    if (this.searchWord) {
      defaultParams.search_word = this.searchWord;
    }
    if (this.appId) {
      defaultParams.app_id = this.appId;
    }
    if (this.runtimeId) {
      defaultParams.runtime_id = this.runtimeId;
    }
    if (this.userId) {
      defaultParams.user_id = this.userId;
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
    if (!params.status) {
      params.status = this.selectNodeStatus ? this.selectNodeStatus : this.defaultStatus;
    }
    const result = await this.request.get(`clusters/nodes`, assign(defaultParams, params));
    this.clusterNodes = get(result, 'cluster_node_set', []);
    this.totalNodeCount = get(result, 'total_count', 0);
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
  onSearch = async word => {
    this.searchWord = word;
    this.currentPage = 1;
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
    this.currentPage = page;
    await this.fetchAll();
  };

  @action
  onChangeStatus = async status => {
    this.currentPage = 1;
    this.selectStatus = this.selectStatus === status ? '' : status;
    await this.fetchAll();
  };

  @action
  loadPageInit = () => {
    if (!this.pageInitMap.cluster) {
      this.currentPage = 1;
      this.selectStatus = '';
      this.searchWord = '';
    }
    this.appId = '';
    this.runtimeId = '';
    this.userId = '';
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
  onSearchNode = async word => {
    this.searchNode = word;
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

  @action
  fetchKeyPairs = async (params = {}) => {
    let defaultParams = {
      limit: 200
    };
    const result = await this.request.get('clusters/key_pairs', assign(defaultParams, params));
    this.keyPairs = get(result, 'key_pair_set', []);
    if (!this.currentPairId || this.currentPairId === this.pairId) {
      const nodeIds = get(this.keyPairs[0], 'node_id', '');
      this.currentPairId = get(this.keyPairs[0], 'key_pair_id', '');
      await this.fetchNodes({ node_id: nodeIds });
    }
  };

  @action
  addKeyPairs = async (params = {}) => {
    if (!this.pairName) {
      this.showMsg('Please input Name!');
    } else {
      const data = {
        name: this.pairName,
        mode: this.pairMode,
        pub_key: this.pubKey
      };
      const result = await this.request.post('clusters/key_pairs', data);
      this.apiMsg(result, 'Create SSH Key successful!', async () => {
        this.hideModal();
        await this.fetchKeyPairs();
      });
    }
  };

  @action
  removeKeyPairs = async () => {
    const result = await this.request.delete('clusters/key_pairs', { key_pair_id: [this.pairId] });
    this.hideModal();

    if (_.get(result, 'key_pair_id')) {
      await this.fetchKeyPairs();
      this.showMsg('Delete SSH Key successfully.', 'success');
    } else {
      let { err, errDetail } = result;
      this.showMsg(errDetail || err);
    }
  };
}
