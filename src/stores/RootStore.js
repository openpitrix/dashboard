import { extendObservable } from 'mobx';
import request from 'core/request';

import AppStore from './AppStore';

export default class RootStore {
  config = {}

  constructor(initialState) {
    this.request = request;

    if (initialState) {
      extendObservable(this, initialState);
    } else {
      this.appStore = new AppStore(this);
    }
  }
}
