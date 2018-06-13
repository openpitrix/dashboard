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
  @observable showDeleteRuntime = false;

  @action
  fetchRuntimes = async page => {
    this.isLoading = true;
    page = page && !isNaN(page) ? page : 1;
    const params = {
      limit: this.pageSize,
      offset: (page - 1) * this.pageSize
    };
    const result = await this.request.get('runtimes', params);
    this.runtimes = get(result, 'runtime_set', []);
    this.totalCount = get(result, 'total_count', 0);
    this.isLoading = false;
  };

  @action
  fetchQueryRuntimes = async query => {
    this.isLoading = true;
    let params = {
      limit: this.pageSize
    };
    if (typeof query === 'object') assign(params, query);
    if (typeof query === 'string') assign(params, { search_word: query });
    const result = await this.request.get('runtimes', params);
    this.runtimes = get(result, 'runtime_set', []);
    this.totalCount = get(result, 'total_count', 0);
    this.isLoading = false;
  };

  @action
  async fetchRuntimeDetail(runtimeId) {
    this.isLoading = true;
    const result = await this.request.get(`runtimes`, { runtime_id: runtimeId });
    this.runtimeDetail = get(result, 'runtime_set[0]', {});
    this.isLoading = false;
  }

  @action
  async fetchStatistics() {
    this.isLoading = true;
    const result = await this.request.get('statistics');
    this.statistics = get(result, 'statistics_set.runtimes', {});
    this.isLoading = false;
  }

  @action
  async deleteRuntime(runtimeIds) {
    this.isLoading = true;
    await this.request.delete('runtimes', { runtime_id: runtimeIds });
    this.isLoading = false;
  }

  // fixme //
  @action
  deleteRuntimeOpen = runtimeId => {
    this.runtimeId = runtimeId;
    this.showDeleteRuntime = true;
  };

  @action
  deleteRuntimeClose = () => {
    this.showDeleteRuntime = false;
  };

  // @action
  // deleteRuntime = async runtimeStore => {
  //   await runtimeStore.deleteRuntime([this.runtimeId]);
  //   this.showDeleteRuntime = false;
  //   await runtimeStore.fetchRuntimes();
  // };
}

export Create from './create';
