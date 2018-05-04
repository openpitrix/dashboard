import { observable, action } from 'mobx';
// import request from 'lib/request';
import Store from './Store';

export default class AppStore extends Store {
  @observable apps = [];
  @observable app = {};
  @observable installedApps = [];
  @observable isLoading = false;

  constructor(initialState) {
    super(initialState, 'appStore');
  }

  @action
  async fetchAll() {
    this.isLoading = true;
    const result = await this.request.get('api/v1/apps');
    this.apps = result.app_set;
    this.isLoading = false;
  }

  @action
  async fetchApp({ appId }) {
    this.isLoading = true;
    const result = await this.request.get(`api/v1/apps`, { app_id: appId });
    this.app = result.app_set.length ? result.app_set[0] : {};
    this.isLoading = false;
  }

  @action
  async fetchInstalledApps() {
    this.isLoading = true;
    const result = await this.request.get('api/v1/apps/installed');
    this.installedApps = result.items;
    this.isLoading = false;
  }
}
