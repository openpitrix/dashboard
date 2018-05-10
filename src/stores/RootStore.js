import { action } from 'mobx';

import Store from './Store';
import AppStore from './AppStore';
import ClusterStore from './ClusterStore';
import LoginStore from './LoginStore';

export default class RootStore extends Store {
  fixNav = false;

  constructor(initialState) {
    super(initialState);

    this.appStore = new AppStore(initialState);
    this.clusterStore = new ClusterStore(initialState);
    this.loginStore = new LoginStore();
  }

  @action
  setNavFix(fixNav) {
    this.fixNav = fixNav;
  }
}
