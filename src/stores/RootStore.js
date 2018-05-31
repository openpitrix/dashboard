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
import RuntimeCreateStore from './RuntimeCreateStore';
import RepoCreateStore from './RepoCreateStore';
import AppHandleStore from './AppHandleStore';
import CategoryHandleStore from './CategoryHandleStore';

export default class RootStore extends Store {
  @observable fixNav = false;
  @observable notifyMsg = '';

  register(name, store, withState = true) {
    if (typeof store !== 'function') {
      throw Error('store should be constructor function');
    }
    if (!name.endsWith('Store')) {
      name += 'Store';
    }
    this[name] = new store(withState ? this.state : '');
  }

  constructor(initialState) {
    super(initialState);
    this.state = initialState;

    this.register('app', AppStore);
    this.register('cluster', ClusterStore);
    this.register('runtime', RuntimeStore);
    this.register('repo', RepoStore);
    this.register('user', UserStore);
    this.register('role', RoleStore);
    this.register('category', CategoryStore);
    this.register('login', LoginStore, false);
    this.register('runtimeCreate', RuntimeCreateStore, false);
    this.register('repoCreate', RepoCreateStore, false);
    this.register('appHandle', AppHandleStore, false);
    this.register('categoryHandle', CategoryHandleStore, false);
  }

  @action
  setNavFix(fixNav) {
    this.fixNav = !!fixNav;
  }

  @action.bound
  showMsg(msg) {
    this.notifyMsg = msg;
  }

  @action.bound
  hideMsg() {
    this.notifyMsg = '';
  }
}
