import { action } from 'mobx';
import request from 'lib/request';
import Store from './Store';

export default class LoginStore extends Store {
  @action
  async login(params) {
    const result = await request.post('login', params);
    if (!result.success) {
      this.notify(result.msg);
    }
  }
}
