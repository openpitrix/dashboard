import { observable, action } from 'mobx';
import Store from '../Store';

export default class AppCreateStore extends Store {
  @observable createStep = 1;
  @observable isLoading = false;

  @action
  create = () => {
    return null;
  };

  @action
  setCreateStep = step => {
    this.createStep = step;
  };
}
