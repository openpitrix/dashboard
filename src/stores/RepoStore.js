import { observable, action } from 'mobx';
import Store from './Store';
import { get } from 'lodash';

export default class RepoStore extends Store {
  @observable repos = [];
  @observable repoDetail = {};
  @observable isLoading = false;

  constructor(initialState) {
    super(initialState, 'repoStore');
  }

  @action
  async fetchRepos() {
    this.isLoading = true;
    const result = await this.request.get('api/v1/repos');
    this.repos = get(result, 'repo_set', []);
    this.isLoading = false;
  }

  @action
  async fetchRepoDetail(repoId) {
    this.isLoading = true;
    const result = await this.request.get(`api/v1/repos`, { repo_id: repoId });
    this.repoDetail = result.repo_set.length ? result.repo_set[0] : {};
    this.isLoading = false;
  }
}
