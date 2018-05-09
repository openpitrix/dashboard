import { action, extendObservable } from 'mobx';

import request from 'lib/request';
import Store from './Store';
import AppStore from './AppStore';
import ClusterStore from './ClusterStore';

export default class RootStore extends Store {
  fixNav = false;

  constructor(initialState) {
    super(initialState);

    this.appStore = new AppStore(initialState);
    this.clusterStore = new ClusterStore(initialState);
  }

  @action
  setNavFix(fixNav) {
    this.fixNav = fixNav;
  }

  @action
  async login(params) {
    await request.post('login', params);
  }
}
