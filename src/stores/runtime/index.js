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
  fetch = async runtimeId => {
    this.isLoading = true;
    const result = await this.request.get(`runtimes`, { runtime_id: runtimeId });
    this.runtimeDetail = get(result, 'runtime_set[0]', {});
    this.isLoading = false;
  };

  @action
  remove = async () => {
    const result = await this.request.delete('runtimes', { runtime_id: [this.runtimeId] });
    if (_.get(result, 'runtime_id')) {
      this.hideModal();
      await this.fetchAll();
      this.showMsg('Delete runtime successfully.');
    } else {
      let { err, errDetail } = result;
      this.showMsg(errDetail || err);
    }
  };

  @action
  showDeleteRuntime = runtimeId => {
    this.runtimeId = runtimeId;
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
}

export Create from './create';
