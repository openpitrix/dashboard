import { observable, action } from 'mobx';

export default class AppStore {
  @observable apps = [];
  @observable isLoading = false;

  constructor({ appStore, request }) {
    this.store = appStore;
    this.request = request;
  }

  @action async fetchApps() {
    this.store.isLoading = true;
    this.store.apps = await this.request.get('api/apps');
    this.store.isLoading = false;
  }
}
