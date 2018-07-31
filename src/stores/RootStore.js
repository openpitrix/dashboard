import { observable, action } from 'mobx';

import Store from './Store';

import App, { Deploy as AppDeploy, Version as AppVersion } from './app';
import Category from './category';
import Cluster from './cluster';
import Repo, { Create as RepoCreate } from './repo';
import Runtime, { Create as RuntimeCreate } from './runtime';

import LoginStore from './LoginStore';
import UserStore from './UserStore';
import RoleStore from './RoleStore';

export default class RootStore extends Store {
  @observable fixNav = false;
  //@observable pageInit = {};

  constructor(initialState) {
    super(initialState);
    this.state = initialState;
  }

  @action
  setNavFix(fixNav) {
    this.fixNav = !!fixNav;
  }

  register(name, store, withState = true) {
    if (typeof store !== 'function') {
      throw Error('store should be constructor function');
    }
    if (!name.endsWith('Store')) {
      name += 'Store';
    }
    this[name] = new store(withState ? this.state : '', name);
  }

  registerStores() {
    // app
    this.register('app', App);
    this.register('appDeploy', AppDeploy);
    this.register('appVersion', AppVersion);

    // cluster
    this.register('cluster', Cluster);

    // runtime
    this.register('runtime', Runtime);
    this.register('runtimeCreate', RuntimeCreate);

    // repo
    this.register('repo', Repo);
    this.register('repoCreate', RepoCreate);

    // category
    this.register('category', Category);

    this.register('login', LoginStore, false);

    // user, role
    this.register('user', UserStore);
    this.register('role', RoleStore);
  }
}
