import { action, toJS } from 'mobx';
import request from 'lib/request';
import Store from './Store';

export default class LoginStore extends Store {
  @action
  async login(params) {
    let apiMsg = await request.post('login', params);

    apiMsg = toJS(apiMsg);

    if (!apiMsg.success) {
      this.notifyMsg = toJS(apiMsg).msg;
    }
  }
}
