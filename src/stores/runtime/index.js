import { observable, action } from 'mobx';
import Store from '../Store';
import { assign, get } from 'lodash';
import _ from 'lodash';

export default class RuntimeStore extends Store {
  @observable runtimes = [];
  @observable runtimeDetail = {};
  @observable summaryInfo = {}; // replace original statistic
  @observable statistics = {};
  @observable isLoading = false;
  @observable totalCount = 0;
  @observable runtimeId = '';
  @observable isModalOpen = false;

  @observable currentPage = 1; //runtime table query params
  @observable searchWord = '';
  @observable defaultStatus = ['active'];
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
    if (this.userId) {
      defaultParams.user_id = this.userId;
    }

    this.isLoading = true;
    const result = await this.request.get('runtimes', assign(defaultParams, params));
    this.runtimes = get(result, 'runtime_set', []);
    this.totalCount = get(result, 'total_count', 0);
    this.isLoading = false;
  };

  @action
  runtimeStatistics = async () => {
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
    this.runtimeDetail = get(result, 'runtime_set[0]', {});
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
      this.showMsg('Delete runtime successfully.', 'success');
    } else {
      let { err, errDetail } = this.runtimeDeleted;
      this.showMsg(errDetail || err);
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
}

export Create from './create';
