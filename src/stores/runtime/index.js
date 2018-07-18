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
  @observable currentPage = 1;
  @observable searchWord = '';
  @observable operateType = '';
  @observable runtimeIds = [];
  @observable selectedRowKeys = [];
  @observable selectStatus = '';
  @observable defaultStatus = ['active'];

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
    let pageOffset = params.page || this.currentPage;
    let defaultParams = {
      limit: this.pageSize,
      offset: (pageOffset - 1) * this.pageSize
    };
    if (this.searchWord) {
      params.search_word = this.searchWord;
    }
    if (!params.status) {
      params.status = this.defaultStatus;
    }
    if (params.page) {
      delete params.page;
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
      iconName: 'appcenter',
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
  };

  @action
  remove = async () => {
    const ids = this.operateType === 'single' ? [this.runtimeId] : this.runtimeIds.toJSON();
    const result = await this.request.delete('runtimes', { runtime_id: ids });
    if (_.get(result, 'runtime_id')) {
      this.hideModal();
      await this.fetchAll();
      this.cancelSelected();
      this.showMsg('Delete runtime successfully.');
    } else {
      let { err, errDetail } = result;
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
    this.currentPage = 1;
    this.searchWord = '';
    this.selectedRowKeys = [];
    this.runtimeIds = [];
  };

  @action
  onChangeStatus = async status => {
    this.selectStatus = this.selectStatus === status ? '' : status;
    await this.fetchAll({ status: this.selectStatus });
  };
}

export Create from './create';
