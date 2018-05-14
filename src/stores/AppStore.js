import { observable, action } from 'mobx';
import Store from './Store';
import { get } from 'lodash';

export default class AppStore extends Store {
  @observable apps = [];
  @observable totalCount = 0;
  @observable app = {};
  @observable appClusters = [];
  @observable installedApps = [];
  @observable isLoading = false;

  constructor(initialState) {
    super(initialState, 'appStore');
  }

  @action
  async fetchAll({ page }) {
    this.isLoading = true;
    page = page ? page : 1;
    const result = await this.request.get('apps', { _page: page });
    this.apps = get(result, 'app_set', []);
    this.totalCount = get(result, 'total_count', 0);
    this.isLoading = false;
  }

  @action
  async fetchQueryApps(query) {
    this.isLoading = true;
    const result = await this.request.get(`apps`, { q: query });
    this.apps = get(result, 'app_set', []);
    this.totalCount = get(result, 'total_count', 0);
    this.isLoading = false;
  }

  @action
  async fetchApp({ appId }) {
    this.isLoading = true;
    const result = await this.request.get(`apps`, { app_id: appId });
    this.app = get(result, 'app_set[0]', {});
    this.isLoading = false;
  }

  // todo: fetch user's installed apps
  // api: /user_apps?uid=xxx
  @action
  async fetchInstalledApps() {
    this.isLoading = true;
    const result = await this.request.get('api/v1/apps/installed');
    this.installedApps = result.items;
    this.isLoading = false;
  }
}
