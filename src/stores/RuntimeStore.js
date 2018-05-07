import { observable, action, extendObservable } from 'mobx';
import request from 'lib/request';

export default class RuntimeStoreStore {
  @observable runtimes = {};
  @observable runtimeDetail = {};
  @observable isLoading = false;

  constructor(initialState) {
    if (initialState) {
      extendObservable(this, initialState.runtimeStore);
    }
  }

  @action
  async fetchRuntimes() {
    this.isLoading = true;
    const result = await request.get('api/v1/runtimes');
    this.runtimes = result;
    this.isLoading = false;
  }

  @action
  async fetchRuntimeDetail(runtimeId) {
    this.isLoading = true;
    const result = await request.get(`api/v1/roles/${runtimeId}`);
    this.runtimeDetail = result;
    this.isLoading = false;
  }
}
