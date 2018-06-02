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
  @observable totalCount = 0;

  constructor(initialState) {
    super(initialState, 'appStore');
  }

  @action
  async fetchAll(page) {
    this.isLoading = true;
    page = page ? page : 1;
    const params = {
      limit: this.pageSize,
      offset: (page - 1) * this.pageSize
    };
    const result = await this.request.get('apps', params);
    this.apps = get(result, 'app_set', []);
    this.totalCount = get(result, 'total_count', 0);
    this.isLoading = false;
  }

  @action
  fetchQueryApps = async query => {
    this.isLoading = true;
    const params = {
      limit: this.pageSize,
      search_word: query
    };
    const result = await this.request.get(`apps`, params);
    this.apps = get(result, 'app_set', []);
    this.totalCount = get(result, 'total_count', 0);
    this.isLoading = false;
  };

  // todo: fetch user's installed apps
  // api: /user_apps?uid=xxx
  @action
  async fetchApp(appId) {
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
    const result = await this.request.get('app_versions', {
      app_id: appId,
      sort_key: 'create_time'
    });
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

  @action
  async deleteApp(appIds) {
    this.isLoading = true;
    await this.request.delete('apps', { app_id: appIds });
    this.isLoading = false;
  }

  @action
  async createApp(params) {
    this.isLoading = true;
    await this.request.post('apps', params);
    this.isLoading = false;
  }

  @action
  async modifyApp(params) {
    this.isLoading = true;
    await this.request.patch('apps', params);
    this.isLoading = false;
  }

  @action
  async createVersion(params) {
    this.isLoading = true;
    await this.request.post('app_versions', params);
    this.isLoading = false;
  }

  @action
  async deleteVersion(versionId) {
    this.isLoading = true;
    await this.request.delete('app_versions', { version_id: [versionId] });
    this.isLoading = false;
  }
}
