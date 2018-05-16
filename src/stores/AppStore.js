import { observable, action } from 'mobx';
import Store from './Store';
import { get } from 'lodash';

export default class AppStore extends Store {
  @observable apps = [];
  @observable app = {};
  @observable appClusters = [];
  @observable installedApps = [];
  @observable versions = [];
  @observable statistics = {};
  @observable isLoading = false;

  constructor(initialState) {
    super(initialState, 'appStore');
    this.totalCount = 0;
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
    const result = await this.request.get('apps/installed');
    this.installedApps = result.items;
    this.isLoading = false;
  }

  @action
  async fetchAppVersions(appId) {
    this.isLoading = true;
    //const result = await this.request.get('app_versions', { app_id: appId });
    const result = await this.request.get('app_versions');
    this.versions = get(result, 'app_version_set', []);
    this.isLoading = false;
  }

  @action
  async fetchStatistics() {
    this.isLoading = true;
    const result = await this.request.get('statistics');
    this.statistics = get(result, 'statistics_set.apps', {});
    this.isLoading = false;
  }
}
