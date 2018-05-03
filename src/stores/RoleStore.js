import { observable, action, extendObservable } from 'mobx';
import request from 'lib/request';

export default class RoleStoreStore {
  @observable roles = [];
  @observable roleDetail = [];
  @observable isLoading = false;

  constructor(initialState) {
    if (initialState) {
      extendObservable(this, initialState.roleStore);
    }
  }

  @action
  async fetchRoles() {
    this.isLoading = true;
    const result = await request.get('api/v1/roles');
    this.roles = result;
    this.isLoading = false;
  }

  @action
  async fetchRoleDetail(repoId) {
    this.isLoading = true;
    const result = await request.get(`api/v1/roles/${repoId}`);
    this.roleDetail = result;
    this.isLoading = false;
  }
}
