import { observable, action } from 'mobx';
import _, { get, assign } from 'lodash';

import Store from '../Store';
import { getProgress } from 'utils';

export default class ClusterStore extends Store {
  sortKey = 'create_time';
  defaultStatus = ['active', 'stopped', 'ceased', 'pending', 'suspended'];
  @observable currentPage = 1;

  @observable clusters = [];

  @observable cluster = {};
  // @observable clusterNodes = [];
  // @observable clusterJobs = [];

  @observable summaryInfo = {};
  @observable isLoading = false;

  @observable totalCount = 0;
  @observable clusterCount = 0;
  @observable totalNodeCount = 0;

  @observable isModalOpen = false;
  @observable modalType = '';

  // @observable clusterId; // current delete cluster_id
  @observable operateType = '';

  @observable searchWord = '';
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
  @observable name = '';
  @observable pub_key = '';
  @observable description = '';
  @observable env = '';
  @observable versionId = '';


  // cluster job queue
  @observable jobs = {
    // job_id=> cluster_id
  };
  store = {};

  @action
  showModal = type => {
    this.modalType = type;
    this.isModalOpen = true;
  };

  @action
  hideModal = () => {
    this.isModalOpen = false;
  };

  @action
  fetchAll = async (params = {}) => {
    params = this.normalizeParams(params);
    if (this.searchWord) {
      params.search_word = this.searchWord;
    }
    if (this.appId) {
      params.app_id = this.appId;
    }
    if (this.runtimeId) {
      params.runtime_id = this.runtimeId;
    }
    if (this.userId) {
      params.owner = this.userId;
    }

    this.isLoading = true;
    const result = await this.request.get('clusters', params);
    this.clusters = get(result, 'cluster_set', []);
    this.totalCount = get(result, 'total_count', 0);

    if (!this.searchWord && !this.selectStatus) {
      this.clusterCount = this.totalCount;
    }

    const appStore = this.store.app;
    const appIds = this.clusters.map(cluster => cluster.app_id);
    if (appStore && appIds.length > 1) {
      await appStore.fetchAll({ app_id: appIds });
    }

    this.isLoading = false;
  };

  @action
  fetchStatistics = async () => {
    //this.isLoading = true;
    const result = await this.request.get('clusters/statistics');
    this.summaryInfo = {
      name: 'Clusters',
      iconName: 'cluster',
      centerName: 'Runtimes',
      total: get(result, 'cluster_count', 0),
      progressTotal: get(result, 'runtime_count', 0),
      progress: get(result, 'top_ten_runtimes', {}),
      histograms: get(result, 'last_two_week_created', {}),
      topRuntimes: getProgress(get(result, 'top_ten_runtimes', {})),
      topApps: getProgress(get(result, 'top_ten_apps', {})),
      clusterCount: get(result, 'cluster_count', 0),
      runtimeCount: get(result, 'runtime_count', 0)
    };
    //this.isLoading = false;
  };

  @action
  remove = async clusterIds => {
    const result = await this.request.post('clusters/delete', { cluster_id: clusterIds });

    if (_.get(result, 'cluster_id')) {
      this.hideModal();
      await this.fetchAll();
      await this.fetchJobs();
      this.cancelSelected();
      this.success('Delete cluster successfully.');
    }
  };

  @action
  start = async clusterIds => {
    const result = await this.request.post('clusters/start', { cluster_id: clusterIds });
    if (_.get(result, 'cluster_id')) {
      this.hideModal();
      await this.fetchAll();
      this.cancelSelected();
      this.success('Start cluster successfully.');
    }
  };

  @action
  stop = async clusterIds => {
    const result = await this.request.post('clusters/stop', { cluster_id: clusterIds });
    if (_.get(result, 'cluster_id')) {
      this.hideModal();
      await this.fetchAll();
      this.cancelSelected();
      this.success('Stop cluster successfully.');
    }
  };

  @action
  cease = async clusterIds => {
    const result = await this.request.post('clusters/cease', { cluster_id: clusterIds });

    if (_.get(result, 'cluster_id')) {
      this.hideModal();
      await this.fetchAll();
      await this.fetchJobs();
      this.cancelSelected();
      this.success('Cease cluster successfully.');
    }
  };

  @action
  rollback = async clusterIds => {
    const result = await this.request.post('clusters/rollback', { cluster_id: clusterIds[0] });
    if (_.get(result, 'cluster_id')) {
      this.hideModal();
      await this.fetchAll();
      await this.fetchJobs();
      this.success('Rollback cluster successfully.');
    }
  };

  @action
  updateEnv = async clusterIds => {
    const result = await this.request.patch('clusters/update_env', {
      cluster_id: clusterIds[0],
      env: this.env
    });
    if (_.get(result, 'cluster_id')) {
      this.hideModal();
      await this.fetchAll();
      await this.fetchJobs();
      this.success('Rollback cluster successfully.');
    }
  };

  @action
  upgradeVersion = async clusterIds => {
    const result = await this.request.post('clusters/upgrade', {
      cluster_id: clusterIds[0],
      version_id: this.versionId
    });
    if (_.get(result, 'cluster_id')) {
      this.hideModal();
      await this.fetchAll();
      await this.fetchJobs();
      this.success('Rollback cluster successfully.');
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
    this.store = {};
  };

  @action
  onChangeSelect = (selectedRowKeys, selectedRows) => {
    this.selectedRowKeys = selectedRowKeys;
    this.clusterIds = selectedRows.map(row => row.cluster_id);
  };

  @action
  cancelSelected = () => {
    this.selectedRowKeys = [];
    this.clusterIds = [];
  };

  @action
  onChangeSelectNodes = (rowKeys, rows) => {
    this.selectedNodeKeys = rowKeys;
    this.selectedNodeIds = rows.map(row => row.node_id);
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

  // @action
  // loadNodeInit = () => {
  //   this.currentNodePage = 1;
  //   this.selectNodeStatus = '';
  //   this.searchNode = '';
  // };

  @action
  fetchKeyPairs = async (params = {}) => {
    const defaultParams = {
      limit: this.maxLimit
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
  addKeyPairs = async () => {
    if (!this.name) {
      this.error('Please input Name!');
    } else if (!this.pub_key) {
      this.error('Please input public key!');
    } else {
      const data = {
        name: this.name,
        pub_key: this.pub_key,
        description: this.description
      };
      const result = await this.request.post('clusters/key_pairs', data);

      if (_.get(result, 'key_pair_id')) {
        this.hideModal();
        await this.fetchKeyPairs();
        this.success('Create SSH Key successful!');
      } else {
        const { err, errDetail } = result;
        this.error(errDetail || err || 'Create SSH key fail!');
      }
    }
  };

  @action
  removeKeyPairs = async () => {
    const result = await this.request.delete('clusters/key_pairs', { key_pair_id: [this.pairId] });
    this.hideModal();

    if (_.get(result, 'key_pair_id')) {
      this.hideModal();
      await this.fetchKeyPairs();
      this.success('Delete SSH Key successfully.');
    } else {
      const { err, errDetail } = result;
      this.error(errDetail || err);
    }
  };

  @action
  changeName = e => {
    this.name = e.target.value;
  };

  @action
  changePubkey = e => {
    this.pub_key = e.target.value;
  };

  @action
  changeDescription = e => {
    this.description = e.target.value;
  };

  @action
  changeEnv = str => {
    this.env = str;
  };

  @action
  changeAppVersion = type => {
    this.versionId = type;
  };

  @action
  keyPairReset = () => {
    this.name = '';
    this.pub_key = '';
    this.description = '';
  };

  @action
  registerStore = (name, store) => {
    this.store[name] = store;
  };
}

export Detail from './detail';
