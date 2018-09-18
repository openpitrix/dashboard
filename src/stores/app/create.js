import { observable, action } from 'mobx';
import Store from '../Store';

export default class AppCreateStore extends Store {
  @observable createStep = 2;
  @observable isLoading = false;

  @action
  create = () => {
    return null;
  };

  @action
  create = async (params = {}) => {
    this.isLoading = true;
    await this.request.post('apps', params);
    this.isLoading = false;
  };

  @action
  setCreateStep = step => {
    this.createStep = step;
  };
}
