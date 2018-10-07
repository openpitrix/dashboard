import { observable, action } from 'mobx';
import _, { assign, get } from 'lodash';

import Store from '../Store';
import { getProgress } from 'utils';

export default class RuntimeStore extends Store {
  sortKey = 'status_time';
  defaultStatus = ['active'];

  @observable runtimes = []; // current runtimes
  @observable runtimeDetail = {};
  @observable summaryInfo = {}; // replace original statistic
  @observable statistics = {};
  @observable isLoading = false;
  @observable totalCount = 0;
  @observable runtimeId = '';
  @observable isModalOpen = false;
  @observable isK8s = false;

  @observable currentPage = 1;
  @observable searchWord = '';
  @observable selectStatus = '';
  @observable userId = '';

  @observable operateType = '';
  @observable runtimeIds = [];
  @observable selectedRowKeys = [];
  @observable runtimeDeleted = null;

  @observable
  handleRuntime = {
    action: '' // delete
  };

  @observable allRuntimes = [];

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
    params = this.normalizeParams(params);

    if (this.searchWord) {
      params.search_word = this.searchWord;
    }
    if (this.userId) {
      params.owner = this.userId;
    }

    this.isLoading = true;

    if (!params.simpleQuery) {
      let result = await this.request.get('runtimes', params);
      this.runtimes = get(result, 'runtime_set', []);
      this.totalCount = get(result, 'total_count', 0);
    } else {
      // simple query: just fetch runtime data used in other pages
      // no need to set totalCount
      delete params.simpleQuery;
      let result = await this.request.get('runtimes', params);
      this.allRuntimes = get(result, 'runtime_set', []);
    }

    this.isLoading = false;
  };

  @action
  fetchStatistics = async () => {
    //this.isLoading = true;
    const result = await this.request.get('runtimes/statistics');
    this.summaryInfo = {
      name: 'Runtimes',
      iconName: 'stateful-set',
      centerName: 'Provider',
      total: get(result, 'runtime_count', 0),
      progressTotal: get(result, 'provider_count', 0),
      progress: get(result, 'top_ten_providers', {}),
      histograms: get(result, 'last_two_week_created', {}),
      topProviders: getProgress(get(result, 'top_ten_providers', {})),
      runtimeCount: get(result, 'runtime_count', 0),
      providerount: get(result, 'provider_count', 0)
    };
    //this.isLoading = false;
  };

  @action
  fetch = async runtimeId => {
    this.isLoading = true;
    const result = await this.request.get(`runtimes`, { runtime_id: runtimeId });
    this.runtimeDetail = get(result, 'runtime_set[0]', {});
    this.isK8s = get(this.runtimeDetail, 'provider') === 'kubernetes';
    this.isLoading = false;
  };

  @action
  remove = async () => {
    const ids = this.operateType === 'single' ? [this.runtimeId] : this.runtimeIds.toJSON();
    this.runtimeDeleted = await this.request.delete('runtimes', { runtime_id: ids });
    if (_.get(this.runtimeDeleted, 'runtime_id')) {
      this.hideModal();
      await this.fetchAll();
      this.cancelSelected();
      this.success('Delete runtime successfully.');
    }
  };

  @action
  showDeleteRuntime = runtimeIds => {
    if (typeof runtimeIds === 'string') {
      this.runtimeId = runtimeIds;
      this.operateType = 'single';
    } else {
      this.operateType = 'multiple';
    }
    this.showModal();
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
    this.selectStatus = this.selectStatus === status ? '' : status;
    this.currentPage = 1;
    await this.fetchAll({ status: this.selectStatus });
  };

  @action
  onChangeSelect = (selectedRowKeys, selectedRows) => {
    this.selectedRowKeys = selectedRowKeys;
    this.runtimeIds = [];
    selectedRows.map(row => this.runtimeIds.push(row.runtime_id));
  };

  @action
  cancelSelected = () => {
    this.selectedRowKeys = [];
    this.runtimeIds = [];
  };

  // loadPageInit = () => {
  //   if (!this.pageInitMap.runtime) {
  //     this.currentPage = 1;
  //     this.selectStatus = '';
  //     this.searchWord = '';
  //   }
  //   this.userId = '';
  //   this.selectedRowKeys = [];
  //   this.runtimeIds = [];
  //   this.pageInitMap = {};
  //   this.runtimeDeleted = null;
  // };

  checkK8s = runtimeId => {
    if (!runtimeId || _.isEmpty(this.runtimes)) {
      return false;
    }
    return _.some(this.runtimes, rt => rt.runtime_id === runtimeId && rt.provider === 'kubernetes');
  };
}

export Create from './create';
