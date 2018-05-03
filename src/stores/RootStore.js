import { action } from 'mobx';

import Store from './Store';
import AppStore from './AppStore';
import ClusterStore from './ClusterStore';
import LoginStore from './LoginStore';
import RuntimeStore from './RuntimeStore';
import RepoStore from './RepoStore';
import UserStore from './UserStore';
import RoleStore from './RoleStore';
import CategorieStore from './CategorieStore';

export default class RootStore extends Store {
  fixNav = false;

  constructor(initialState) {
    super(initialState);

    this.appStore = new AppStore(initialState);
    this.clusterStore = new ClusterStore(initialState);
    this.loginStore = new LoginStore();
    this.runtimeStore = new RuntimeStore(initialState);
    this.repoStore = new RepoStore(initialState);
    this.userStore = new UserStore(initialState);
    this.roleStore = new RoleStore(initialState);
    this.categorieStore = new CategorieStore(initialState);
  }

  @action
  setNavFix(fixNav) {
    this.fixNav = fixNav;
  }
}
