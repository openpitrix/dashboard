import { observable, action } from 'mobx';
import Store from '../Store';
import { get, assign, values } from 'lodash';

export default class RepoStore extends Store {
  @observable repos = [];
  @observable repoEvents = [];
  @observable repoDetail = {};
  @observable isLoading = false;

  @observable repoId = '';
  @observable showDeleteRepo = false;
  @observable curTagName = 'Apps';
  @observable queryProviders = '';
  @observable querySelector = '';

  @observable currentPage = 1; //app table query params
  @observable searchWord = '';
  defaultStatus = ['active'];
  @observable selectStatus = '';
  @observable userId = '';
  @observable totalCount = 0;

  @observable currentEventPage = 1; //events table query params
  @observable totalEventCount = 0;

  initLoadNumber = 3;
  @observable appStore = null;

  @action
  fetchAll = async (params = {}, appStore) => {
    let defaultParams = {
      sort_key: 'status_time',
      limit: this.pageSize,
      offset: (this.currentPage - 1) * this.pageSize,
      status: this.selectStatus ? this.selectStatus : this.defaultStatus
    };

    if (params.noLimit) {
      defaultParams.limit = this.maxLimit;
      defaultParams.offset = 0;
      delete params.noLimit;
    }

    if (this.searchWord) {
      defaultParams.search_word = this.searchWord;
    }
    if (this.userId) {
      defaultParams.user_id = this.userId;
    }

    this.isLoading = true;
    const result = await this.request.get('repos', assign(defaultParams, params));
    this.repos = get(result, 'repo_set', []);
    this.totalCount = get(result, 'total_count', 0);
    if (appStore) {
      for (let i = 0; i < this.initLoadNumber && i < this.repos.length; i++) {
        await appStore.fetchAll({ repo_id: this.repos[i].repo_id });
        this.repos[i] = { total: appStore.totalCount, apps: appStore.apps, ...this.repos[i] };
      }
    }
    this.isLoading = false;
  };

  @action
  onSearch = async word => {
    this.searchWord = word;
    this.currentPage = 1;
    await this.fetchAll();
  };

  @action
  onClearSearch = async () => {
    await this.onSearch('');
  };

  @action
  onRefresh = async () => {
    await this.fetchAll();
  };

  @action
  changePagination = async page => {
    this.currentPage = page;
    await this.fetchAll();
  };

  @action
  onChangeStatus = async status => {
    this.currentPage = 1;
    this.selectStatus = this.selectStatus === status ? '' : status;
    await this.fetchAll();
  };

  @action
  fetchRepoDetail = async repoId => {
    this.isLoading = true;
    const result = await this.request.get(`repos`, { repo_id: repoId });
    this.repoDetail = get(result, 'repo_set[0]', {});
    this.isLoading = false;
    this.pageInitMap = { repo: true };
  };

  @action
  fetchRepoEvents = async (params = {}) => {
    this.isLoading = true;
    let defaultParams = {
      limit: this.pageSize,
      offset: (this.currentEventPage - 1) * this.pageSize
    };
    const result = await this.request.get(`repo_events`, assign(defaultParams, params));
    this.repoEvents = get(result, 'repo_event_set', []);
    this.totalEventCount = get(result, 'total_count', 0);
    this.isLoading = false;
  };

  @action
  deleteRepo = async () => {
    const result = await this.request.delete('repos', { repo_id: [this.repoId] });
    if (get(result, 'repo_id')) {
      this.deleteRepoClose();
      this.fetchAll({}, this.appStore);
      this.showMsg('Delete repo successfully.', 'success');
    }
  };

  // fixme
  @action
  deleteRepoOpen = repoId => {
    this.repoId = repoId;
    this.showDeleteRepo = true;
  };

  @action
  deleteRepoClose = () => {
    this.showDeleteRepo = false;
  };

  // @action
  // deleteRepo = async repoStore => {
  //   await repoStore.deleteRepo([this.repoId]);
  //   this.showDeleteRepo = false;
  //   await repoStore.fetchRepos();
  // };

  @action
  selectCurTag = tagName => {
    this.curTagName = tagName;
  };

  getRepoApps = (repos = [], apps = []) => {
    if (repos.toJSON) {
      repos = repos.toJSON();
    }
    if (apps.toJSON) {
      apps = apps.toJSON();
    }

    return repos.map(repo => {
      repo.apps = apps.filter(app => app.repo_id === repo.repo_id);
      return repo;
    });
  };

  @action
  startIndexer = async repoId => {
    let repoEvent = await this.request.post(`repos/index`, { repo_id: repoId });
    if (repoEvent.repo_id) {
      this.showMsg(`Started repo indexer: ${repoEvent.repo_id}`, 'success');
    } else {
      this.showMsg(`Start repo indexer failed: ${repoEvent.errDetail}`);
    }
  };

  @action
  loadPageInit = () => {
    this.queryProviders = '';
    this.querySelector = '';
    if (!this.pageInitMap.repo) {
      this.currentPage = 1;
      this.selectStatus = '';
      this.searchWord = '';
    }
    this.userId = '';
    this.pageInitMap = {};
  };

  @action
  setCurrentPage = page => {
    this.currentPage = page;
  };

  // get string representation for label / selector
  getStringFor = (type = 'selectors') => {
    if (!['selectors', 'labels'].includes(type)) {
      return '';
    }

    const itemKey = type === 'selectors' ? 'selector_key' : 'label_key';

    return get(this.repoDetail, type, [])
      .filter(item => Boolean(item[itemKey]))
      .map(item => values(item).join('='))
      .join('&');
  };
}

export Create from './create';
