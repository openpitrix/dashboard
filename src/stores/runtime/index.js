import { observable, action } from 'mobx';
import Store from '../Store';
import { assign, get } from 'lodash';

export default class RuntimeStore extends Store {
  @observable runtimes = [];
  @observable runtimeDetail = {};
  @observable statistics = {};
  @observable isLoading = false;
  @observable totalCount = 0;
  @observable runtimeId = '';
  @observable isModalOpen = false;
  @observable currentPage = 1;

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
    let pageOffset = params.page || 1;
    let defaultParams = {
      limit: this.pageSize,
      offset: (pageOffset - 1) * this.pageSize
    };
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
  async fetch(runtimeId) {
    this.isLoading = true;
    const result = await this.request.get(`runtimes`, { runtime_id: runtimeId });
    this.runtimeDetail = get(result, 'runtime_set[0]', {});
    this.isLoading = false;
  }

  @action
  async onRefresh() {
    await this.fetchAll();
    this.currentPage = 1;
  }

  @action
  async onSearch(value) {
    await this.fetchAll({
      search_word: value
    });
  }

  @action
  async onChangePagination(page) {
    this.currentPage = page;
    await this.fetchAll({
      page: page
    });
  }

  @action
  async remove(runtimeIds) {
    this.isLoading = true;
    await this.request.delete('runtimes', { runtime_id: runtimeIds });
    this.isLoading = false;
  }

  @action
  showDeleteRuntime = runtimeId => {
    this.runtimeId = runtimeId;
    this.showModal();
  };
}

export Create from './create';
