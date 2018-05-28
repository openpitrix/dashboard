import { observable, action } from 'mobx';

import Store from './Store';
import AppStore from './AppStore';
import ClusterStore from './ClusterStore';
import RuntimeStore from './RuntimeStore';
import RepoStore from './RepoStore';
import UserStore from './UserStore';
import RoleStore from './RoleStore';
import CategoryStore from './CategoryStore';
import LoginStore from './LoginStore';

export default class RootStore extends Store {
  @observable fixNav = false;

  constructor(initialState) {
    super(initialState);

    this.appStore = new AppStore(initialState);
    this.clusterStore = new ClusterStore(initialState);
    this.runtimeStore = new RuntimeStore(initialState);
    this.repoStore = new RepoStore(initialState);
    this.userStore = new UserStore(initialState);
    this.roleStore = new RoleStore(initialState);
    this.categoryStore = new CategoryStore(initialState);
    this.loginStore = new LoginStore();
  }

  @action
  setNavFix(fixNav) {
    this.fixNav = !!fixNav;
  }
}
