import { observable, action, extendObservable } from 'mobx';
import request from 'lib/request';

export default class AppStore {
  @observable apps = [];
  @observable app = {};
  @observable installedApps = [];
  @observable isLoading = false;

  constructor(initialState) {
    if (initialState) {
      extendObservable(this, initialState.appStore);
    }
  }

  @action
  async fetchAll() {
    this.isLoading = true;
    const result = await request.get('api/v1/apps');
    this.apps = result.items;
    this.isLoading = false;
  }

  @action
  async fetchApp({ appId }) {
    this.isLoading = true;
    this.app = await request.get(`api/v1/apps/${appId}`);
    this.isLoading = false;
  }

  @action
  async fetchInstalledApps() {
    this.isLoading = true;
    const result = await request.get('api/v1/apps/installed');
    this.installedApps = result.items;
    this.isLoading = false;
  }
}
