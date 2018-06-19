import { observable, action } from 'mobx';
import { assign, get, isArray } from 'lodash';
import Store from '../Store';

export default class RuntimeStore extends Store {
  @observable runtimes = [];
  @observable runtimeDetail = {};
  @observable statistics = {};
  @observable isLoading = false;
  @observable totalCount = 0;
  @observable runtimeId = '';
  @observable isModalOpen = false;
  @observable currentPage = 1;
  @observable currentClusterPage = 1;
  @observable searchWord = '';

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
  remove = async runtimeIds => {
    runtimeIds = runtimeIds || [this.runtimeId];
    if (!isArray(runtimeIds)) {
      runtimeIds = [runtimeIds];
    }
    const result = await this.request.delete('runtimes', { runtime_id: runtimeIds });

    this.postHandleApi(result, () => {
      this.hideModal();
      setTimeout(async () => {
        await this.fetchAll();
      }, 500);
    });
  };

  @action
  showDeleteRuntime = runtimeId => {
    this.runtimeId = runtimeId;
    this.showModal();
  };

  @action
  setCurrentPage = page => {
    this.currentPage = page;
  };

  @action
  changePagination = page => {
    this.setCurrentPage(page);
    this.fetchAll({ page });
  };

  @action
  changeSearchWord = word => {
    this.searchWord = word;
  };

  @action
  setClusterPage = page => {
    this.currentClusterPage = page;
  };
}

export Create from './create';
