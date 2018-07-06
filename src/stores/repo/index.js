import { observable, action } from 'mobx';
import Store from '../Store';
import { get } from 'lodash';
import _ from 'lodash';

export default class RepoStore extends Store {
  @observable repos = [];
  @observable repoEvents = [];
  @observable repoDetail = {};
  @observable isLoading = false;

  @observable repoId = '';
  @observable showDeleteRepo = false;
  @observable curTagName = 'Apps';
  @observable searchWord = '';

  tags = [{ id: 1, name: 'Apps' }, { id: 2, name: 'Runtimes' }, { id: 3, name: 'Events' }];

  @action
  fetchAll = async (params = {}) => {
    this.isLoading = true;
    if (!params.status) {
      params.status = this.defaultStatus;
    }
    const result = await this.request.get('repos', params);
    this.repos = get(result, 'repo_set', []);
    console.log(params, this.repos);
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
  async fetchRepoDetail(repoId) {
    this.isLoading = true;
    const result = await this.request.get(`repos`, { repo_id: repoId });
    this.repoDetail = get(result, 'repo_set[0]', {});
    this.isLoading = false;
  }

  @action
  async fetchRepoEvents(repoId) {
    this.isLoading = true;
    const result = await this.request.get(`repo_events`, { repo_id: repoId });
    this.repoEvents = get(result, 'repo_event_set', {});
    this.isLoading = false;
  }

  @action
  deleteRepo = async () => {
    const result = await this.request.delete('repos', { repo_id: [this.repoId] });
    if (_.get(result, 'repo_id')) {
      this.deleteRepoClose();
      this.fetchAll();
      this.showMsg('Delete repo successfully.');
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
    repos = repos.map(repo => {
      repo.apps = apps.filter(app => {
        return app.repo_id == repo.repo_id;
      });
      return repo;
    });
    return repos;
  };
}

export Create from './create';
