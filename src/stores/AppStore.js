import { observable, action } from 'mobx';
import request from 'core/request';

export default class AppStore {
  @observable apps = [];
  @observable isLoading = false;

  @action async fetchApps() {
    this.isLoading = true;
    const result = await request.get('api/apps');
    this.apps = result.items;
    this.isLoading = false;
  }
}
