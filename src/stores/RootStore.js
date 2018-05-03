import { action, extendObservable } from 'mobx';

import request from 'lib/request';
import OverviewStore from './OverviewStore';
import AppStore from './AppStore';
import ClusterStore from './ClusterStore';
import RuntimeStore from './RuntimeStore';
import RepoStore from './RepoStore';
import UserStore from './UserStore';
import RoleStore from './RoleStore';
import CategorieStore from './CategorieStore';

export default class RootStore {
  config = {};

  constructor(initialState) {
    if (initialState) {
      extendObservable(this, initialState);
    }

    this.fixNav = false;
    this.overviewStore = new OverviewStore(initialState);
    this.appStore = new AppStore(initialState);
    this.clusterStore = new ClusterStore(initialState);
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

  @action
  async login(params) {
    await request.post('login', params);
  }
}
