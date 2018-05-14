import { action, observable } from 'mobx';
import request from 'lib/request';
import Store from './Store';

export default class LoginStore extends Store {
  @observable errMsg = '';

  @action
  async login(params) {
    try {
      await request.post('login', params);
    } catch (err) {
      this.errMsg = err;
    }
  }
}
