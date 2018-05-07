import { observable, action, extendObservable } from 'mobx';
import request from 'lib/request';

export default class RepoStore {
  @observable repos = {};
  @observable repoDetail = {};
  @observable isLoading = false;

  constructor(initialState) {
    if (initialState) {
      extendObservable(this, initialState.repoStore);
    }
  }

  @action
  async fetchRepos() {
    this.isLoading = true;
    const result = await request.get('api/v1/repos');
    this.repos = result;
    this.isLoading = false;
  }

  @action
  async fetchRepoDetail(repoId) {
    this.isLoading = true;
    const result = await request.get(`api/v1/repos/${repoId}`);
    this.repoDetail = result;
    this.isLoading = false;
  }
}
