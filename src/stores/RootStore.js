import { observable, extendObservable } from 'mobx';
import request from '../../core/request';

import AppStore from './AppStore';

export default class RootStore {
  @observable title = 'OpenPitrix Dashboard';

  constructor(initialState) {
    this.request = request;

    if (initialState) {
      extendObservable(this, initialState);
    } else {
      this.appStore = new AppStore(this);
    }
  }
}
