import { observable, action } from 'mobx';
import Store from './Store';
import { get } from 'lodash';

export default class RuntimeStoreStore extends Store {
  @observable runtimes = [];
  @observable runtimeDetail = {};
  @observable isLoading = false;

  constructor(initialState) {
    super(initialState, 'runtimeStore');
  }

  @action
  async fetchRuntimes() {
    this.isLoading = true;
    const result = await this.request.get('api/v1/runtimes');
    this.runtimes = get(result, 'runtime_set', []);
    this.isLoading = false;
  }

  @action
  async fetchRuntimeDetail(runtimeId) {
    this.isLoading = true;
    const result = await this.request.get(`api/v1/runtimes`, { runtime_id: runtimeId });
    this.runtimeDetail = result.runtime_set.length ? result.runtime_set[0] : {};
    this.isLoading = false;
  }
}
