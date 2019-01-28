import { observable, action } from 'mobx';

import Store from '../Store';

export default class ModalStore extends Store {
  @observable isOpen = false;

  @observable type = '';

  @action
  show = type => {
    this.type = type;
    this.isOpen = true;
  };

  @action
  hide = () => {
    this.type = '';
    this.isOpen = false;
  };
}
