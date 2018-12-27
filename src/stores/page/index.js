import { observable, action } from 'mobx';

import Store from '../Store';

export default class PageStore extends Store {
  @observable isModalOpen = false;

  @observable modalType = '';

  @action
  showModal = type => {
    this.modalType = type;
    this.isModalOpen = true;
  };

  @action
  hideModal = () => {
    this.modalType = '';
    this.isModalOpen = false;
  };
}
