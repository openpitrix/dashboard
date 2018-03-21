import { action, extendObservable } from 'mobx';

import request from 'core/request';
import AppStore from './AppStore';
import ClusterStore from './ClusterStore';

export default class RootStore {
  config = {}

  constructor(initialState) {
    if (initialState) {
      extendObservable(this, initialState);
    }

    this.fixNav = false;
    this.appStore = new AppStore(initialState);
    this.clusterStore = new ClusterStore(initialState);
  }

  @action setNavFix(fixNav) {
    this.fixNav = fixNav;
  }

  @action async login(params) {
    await request.post('login', params);
  }
}
