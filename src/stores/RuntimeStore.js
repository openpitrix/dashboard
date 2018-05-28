import { observable, action, toJS } from 'mobx';
import Store from './Store';
import { get } from 'lodash';

export default class RuntimeStoreStore extends Store {
  @observable runtimes = [];
  @observable runtimeDetail = {};
  @observable statistics = {};
  @observable isLoading = false;
  @observable totalCount = 0;
  @observable lastCreatedRuntime = null;

  constructor(initialState) {
    super(initialState, 'runtimeStore');
  }

  @action
  async fetchRuntimes({ page }) {
    this.isLoading = true;
    page = page ? page : 1;
    const result = await this.request.get('runtimes', { _page: page });
    this.runtimes = get(result, 'runtime_set', []);
    this.totalCount = get(result, 'total_count', 0);
    this.isLoading = false;
  }

  @action
  async fetchQueryRuntimes(query) {
    this.isLoading = true;
    const result = await this.request.get('runtimes', { q: query });
    this.runtimes = get(result, 'runtime_set', []);
    this.totalCount = get(result, 'total_count', 0);
    this.isLoading = false;
  }

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

  async create(params) {
    this.isLoading = true;
    this.lastCreatedRuntime = await this.request.post('runtimes', params);
    this.isLoading = false;
  }
}
