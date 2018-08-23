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
  @observable searchWord = '';
  @observable detailSearch = '';
  @observable defaultStatus = ['active'];
  @observable eventStatus = '';
  @observable currentPage = 1;
  @observable totalCount = 0;

  initLoadNumber = 3;
  @observable appStore = null;

  @action
  fetchAll = async (params = {}, appStore) => {
    this.isLoading = true;
    if (!params.status) {
      params.status = this.defaultStatus;
    }
    if (this.searchWord) {
      params.search_word = this.searchWord;
    }
    const result = await this.request.get('repos', params);
    this.repos = get(result, 'repo_set', []);
    if (appStore) {
      for (let i = 0; i < this.initLoadNumber && i < this.repos.length; i++) {
        await appStore.fetchAll({ repo_id: this.repos[i].repo_id });
        this.repos[i] = { total: appStore.totalCount, apps: appStore.apps, ...this.repos[i] };
      }
    }
    this.isLoading = false;
  };

  @action
  onSearch = async query => {
    this.changeSearchWord(query);
    await this.fetchAll();
  };

  @action
  onClearSearch = async () => {
    await this.onSearch('');
  };

  @action
  onRefresh = async () => {
    await this.onSearch(this.searchWord);
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
    let pageOffset = params.page || this.currentPage;
    let defaultParams = {
      limit: this.pageSize,
      offset: (pageOffset - 1) * this.pageSize
    };
    const result = await this.request.get(`repo_events`, assign(defaultParams, params));
    this.repoEvents = get(result, 'repo_event_set', []);
    this.totalCount = get(result, 'total_count', 0);
    this.isLoading = false;
  };

  @action
  deleteRepo = async () => {
    const result = await this.request.delete('repos', { repo_id: [this.repoId] });
    if (get(result, 'repo_id')) {
      this.deleteRepoClose();
      this.fetchAll({}, this.appStore);
      this.showMsg('Delete repo successfully.', 'success');
    } else {
      let { err, errDetail } = result;
      this.showMsg(errDetail || err);
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

  @action
  changeSearchWord = word => {
    this.searchWord = word;
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
      this.searchWord = '';
    }
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
