import { observable, action } from 'mobx';
import _, { get, assign } from 'lodash';

import Store from '../Store';
import { getProgress } from 'utils';

export default class ClusterStore extends Store {
  defaultStatus = ['active', 'stopped', 'ceased', 'pending', 'suspended'];

  @observable currentPage = 1;
  @observable clusters = [];
  @observable isLoading = false;

  @observable modalType = '';
  @observable isModalOpen = false;

  @observable summaryInfo = {};
  @observable totalCount = 0;
  @observable clusterCount = 0;

  @observable clusterId = '';
  @observable operateType = '';

  @observable searchWord = '';
  @observable selectStatus = '';
  @observable appId = '';
  @observable runtimeId = '';
  @observable userId = '';

  @observable selectedRowKeys = [];
  @observable clusterIds = [];

  @observable env = '';
  @observable versionId = '';

  // cluster job queue
  @observable
  jobs = {
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
    this.modalType = '';
    this.isModalOpen = false;
  };

  @action
  fetchAll = async params => {
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

    // fixme
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
  changeEnv = str => {
    this.env = str;
  };

  @action
  changeAppVersion = type => {
    this.versionId = type;
  };

  @action
  registerStore = (name, store) => {
    this.store[name] = store;
  };
}

export Detail from './detail';
