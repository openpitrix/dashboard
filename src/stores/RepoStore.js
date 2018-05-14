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
    const result = await this.request.get('repos');
    this.repos = get(result, 'repo_set', []);
    this.isLoading = false;
  }

  @action
  async fetchQueryRepos(query) {
    this.isLoading = true;
    const result = await this.request.get('repos', { q: query });
    this.repos = get(result, 'repo_set', []);
    this.isLoading = false;
  }

  @action
  async fetchRepoDetail(repoId) {
    this.isLoading = true;
    const result = await this.request.get(`repos`, { repo_id: repoId });
    this.repoDetail = get(result, 'repo_set[0]', {});
    this.isLoading = false;
  }
}
