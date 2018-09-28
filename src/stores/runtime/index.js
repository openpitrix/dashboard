import { observable, action } from 'mobx';
import Store from '../Store';
import { assign, get } from 'lodash';
import _ from 'lodash';

const defaultStatus = ['active'];

export default class RuntimeStore extends Store {
  @observable runtimes = []; // current runtimes
  @observable runtimeDetail = {};
  @observable summaryInfo = {}; // replace original statistic
  @observable statistics = {};
  @observable isLoading = false;
  @observable totalCount = 0;
  @observable runtimeId = '';
  @observable isModalOpen = false;
  @observable isKubernetes = false;

  @observable currentPage = 1; //runtime table query params
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
    let defaultParams = {
      sort_key: 'status_time',
      limit: this.pageSize,
      offset: (this.currentPage - 1) * this.pageSize,
      status: this.selectStatus ? this.selectStatus : defaultStatus
    };

    if (params.noLimit) {
      defaultParams.limit = this.maxLimit;
      defaultParams.offset = 0;
      delete params.noLimit;
    }

    if (this.searchWord) {
      defaultParams.search_word = this.searchWord;
    }
    if (this.userId) {
      defaultParams.user_id = this.userId;
    }

    this.isLoading = true;
    let finalParams = assign(defaultParams, params);

    if (!params.simpleQuery) {
      let result = await this.request.get('runtimes', finalParams);
      this.runtimes = get(result, 'runtime_set', []);
      this.totalCount = get(result, 'total_count', 0);
    } else {
      // simple query: just fetch runtime data used in other pages
      // no need to set totalCount
      delete finalParams.simpleQuery;
      let result = await this.request.get('runtimes', finalParams);
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
      histograms: get(result, 'last_two_week_created', {})
    };
    //this.isLoading = false;
  };

  @action
  fetch = async runtimeId => {
    this.isLoading = true;
    const result = await this.request.get(`runtimes`, { runtime_id: runtimeId });
    const runtimeDetail = get(result, 'runtime_set[0]', {});
    const provider = get(runtimeDetail, 'provider', '');
    this.isKubernetes = provider === 'kubernetes';
    this.runtimeDetail = runtimeDetail;
    this.isLoading = false;
    this.pageInitMap = { runtime: true };
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

  loadPageInit = () => {
    if (!this.pageInitMap.runtime) {
      this.currentPage = 1;
      this.selectStatus = '';
      this.searchWord = '';
    }
    this.userId = '';
    this.selectedRowKeys = [];
    this.runtimeIds = [];
    this.pageInitMap = {};
    this.runtimeDeleted = null;
  };

  checkKubernetes = runtimeId => {
    if (!runtimeId) return false;
    if (!this.runtimes) return false;

    let isKubernetes = false;
    this.runtimes.forEach(runtime => {
      if (runtime.runtime_id === runtimeId) {
        isKubernetes = runtime.provider === 'kubernetes';
      }
    });
    return isKubernetes;
  };
}

export Create from './create';
