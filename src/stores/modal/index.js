import { observable, action } from 'mobx';

import Store from '../Store';

export default class ModalStore extends Store {
  @observable isOpen = false;

  @observable type = '';

  item = {};

  @action
  show = (type, item) => {
    this.type = type;
    this.isOpen = true;
    if (item) {
      this.item = item;
    }
  };

  @action
  hide = () => {
    this.type = '';
    this.item = {};
    this.isOpen = false;
  };
}
