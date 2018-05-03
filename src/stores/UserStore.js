import { observable, action, extendObservable } from 'mobx';
import request from 'lib/request';

export default class UserStore {
  @observable users = {};
  @observable userDetail = {};
  @observable isLoading = false;

  constructor(initialState) {
    if (initialState) {
      extendObservable(this, initialState.userStore);
    }
  }

  @action
  async fetchUsers() {
    this.isLoading = true;
    const result = await request.get('api/v1/users');
    this.users = result;
    this.isLoading = false;
  }

  @action
  async fetchUsersDetail(userId) {
    this.isLoading = true;
    const result = await request.get(`api/v1/users/${userId}`);
    this.userDetail = result;
    this.isLoading = false;
  }
}
