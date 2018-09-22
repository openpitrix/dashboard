import { action } from 'mobx';
import Store from './Store';

export default class LoginStore extends Store {
  @action
  async login(params) {
    const result = await this.request.post('login', params);
    if (!result.success) {
      this.notify(result.msg);
    }
  }
}
