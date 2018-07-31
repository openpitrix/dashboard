import { observable, action } from 'mobx';
import { get, pick } from 'lodash';

import Store from './Store';

import App, { Deploy as AppDeploy, Version as AppVersion } from './app';
import Category from './category';
import Cluster from './cluster';
import Repo, { Create as RepoCreate } from './repo';
import Runtime, { Create as RuntimeCreate } from './runtime';

import LoginStore from './LoginStore';
import UserStore from './UserStore';
import RoleStore from './RoleStore';

const defaultNotifyOption = { title: '', message: '', type: 'error' };

export default class RootStore extends Store {
  @observable fixNav = false;
  @observable pageInit = {};

  @observable notifications = [];

  constructor(initialState) {
    super(initialState);
    this.state = initialState;
  }

  @action
  setNavFix(fixNav) {
    this.fixNav = !!fixNav;
  }

  @action
  notify(...msg) {
    let notification = {};

    if (typeof msg[0] === 'object') {
      notification = pick(Object.assign(defaultNotifyOption, msg[0]), ['title', 'message', 'type']);
    } else if (typeof msg[0] === 'string') {
      notification = Object.assign(defaultNotifyOption, {
        message: msg[0] || '',
        title: msg[1] || '',
        type: msg[2] || 'error'
      });
    } else {
      throw Error('invalid notification msg');
    }

    this.notifications.push(
      Object.assign(notification, {
        ts: Date.now()
      })
    );
  }

  @action
  detachNotify = ts => {
    // this.notifications=this.notifications.filter(item=> item.ts !== ts);
    const idx = this.notifications.findIndex(item => item.ts === ts);
    this.notifications.splice(idx, 1);
  };

  register(name, store, withState = true) {
    if (typeof store !== 'function') {
      throw Error('store should be constructor function');
    }
    if (!name.endsWith('Store')) {
      name += 'Store';
    }
    this[name] = new store(withState ? this.state : '', name);
    this[name].notify = this.notify.bind(this);
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
