import { observable, action } from 'mobx';
import { get } from 'lodash';
import Store from '../Store';

export default class RoleStoreStore extends Store {
  @observable roles = [];

  @observable roleDetail = [];

  @observable isLoading = false;

  @action
  async fetchRoles() {
    this.isLoading = true;
    const result = await this.request.get('roles');
    this.roles = get(result, 'role_set', []);
    this.isLoading = false;
  }

  @action
  async fetchRoleDetail(repoId) {
    this.isLoading = true;
    this.roleDetail = await this.request.get(`roles/${repoId}`);
    this.isLoading = false;
  }
}
