import { observable, action } from 'mobx';
import Store from '../Store';
import _, { get } from 'lodash';

export default class RepoStore extends Store {
  @observable repos = [];
  @observable repoEvents = [];
  @observable repoDetail = {};
  @observable isLoading = false;

  @observable repoId = '';
  @observable showDeleteRepo = false;
  @observable curTagName = 'Apps';
  @observable searchWord = '';
  @observable detailSearch = '';
  @observable defaultStatus = ['active'];
  @observable eventStatus = '';

  initLoadNumber = 3;
  @observable appStore = null;

  @action
  fetchAll = async (params = {}, appStore) => {
    this.isLoading = true;
    if (!params.status) {
      params.status = this.defaultStatus;
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
  fetchQueryRepos = async query => {
    this.changeSearchWord(query);
    this.isLoading = true;
    const result = await this.request.get('repos', {
      status: this.defaultStatus,
      search_word: query
    });
    this.repos = get(result, 'repo_set', []);
    this.isLoading = false;
  };

  @action
  onClearSearch = async () => {
    await this.fetchQueryRepos('');
  };

  @action
  onRefresh = async () => {
    await this.fetchQueryRepos(this.searchWord);
  };

  @action
  fetchRepoDetail = async repoId => {
    this.isLoading = true;
    const result = await this.request.get(`repos`, { repo_id: repoId });
    this.repoDetail = get(result, 'repo_set[0]', {});
    this.isLoading = false;
  };

  @action
  fetchRepoEvents = async (params = {}) => {
    this.isLoading = true;
    const result = await this.request.get(`repo_events`, params);
    this.repoEvents = get(result, 'repo_event_set', []);
    this.isLoading = false;
  };

  @action
  deleteRepo = async () => {
    const result = await this.request.delete('repos', { repo_id: [this.repoId] });
    if (_.get(result, 'repo_id')) {
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
}

export Create from './create';
