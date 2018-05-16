import { observable, action } from 'mobx';
import Store from './Store';

export default class RoleStoreStore extends Store {
  @observable roles = [];
  @observable roleDetail = [];
  @observable isLoading = false;

  constructor(initialState) {
    super(initialState, 'roleStore');
  }

  @action
  async fetchRoles() {
    this.isLoading = true;
    const result = await this.request.get('roles');
    this.roles = result.role_set;
    this.isLoading = false;
  }

  @action
  async fetchRoleDetail(repoId) {
    this.isLoading = true;
    const result = await this.request.get(`roles/${repoId}`);
    this.roleDetail = result;
    this.isLoading = false;
  }
}
