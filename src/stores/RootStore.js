import { extendObservable } from 'mobx';

import AppStore from './AppStore';

export default class RootStore {
  config = {}

  constructor(initialState) {
    if (initialState) {
      extendObservable(this, initialState);
    }

    this.appStore = new AppStore(initialState);
  }
}
