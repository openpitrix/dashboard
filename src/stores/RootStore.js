import { observable, action } from 'mobx';
import _, { pick } from 'lodash';

import Store from './Store';

import App, {
  Deploy as AppDeploy,
  Version as AppVersion,
  Create as AppCreate
} from './app';
import Category from './category';
import Cluster, { Detail as ClusterDetail } from './cluster';
import Repo, { Create as RepoCreate } from './repo';
import Runtime, { Create as RuntimeCreate } from './runtime';
import User, { Role } from './user';
import sshKey from './key_pair';

const defaultNotifyOption = { title: '', message: '', type: 'info' };

export default class RootStore extends Store {
  @observable fixNav = false;

  @observable notifications = [];

  @observable
  user = {
    username: ''
  };

  constructor(initialState) {
    super(initialState);
    this.state = initialState;
  }

  @action
  setNavFix(fixNav) {
    this.fixNav = !!fixNav;
  }

  @action
  setUser(user) {
    this.user = user;
  }

  @action
  updateUser(props) {
    _.isFunction(this.user.update) && this.user.update(props);
  }

  @action
  notify(...msg) {
    let notification = {};

    if (typeof msg[0] === 'object') {
      notification = pick(Object.assign(defaultNotifyOption, msg[0]), [
        'title',
        'message',
        'type'
      ]);
    } else if (typeof msg[0] === 'string') {
      notification = Object.assign(defaultNotifyOption, {
        message: msg[0],
        type: msg[1],
        title: msg[2]
      });
    } else {
      throw Error('invalid notification message');
    }

    this.notifications.push(
      Object.assign(notification, {
        ts: Date.now()
      })
    );
  }

  @action
  detachNotify = ts => {
    this.notifications = this.notifications.filter(item => item.ts !== ts);
  };

  register(name, Ctor, withState = true) {
    if (typeof Ctor !== 'function') {
      throw Error('store should be constructor function');
    }
    if (!name.endsWith('Store')) {
      name += 'Store';
    }
    this[name] = new Ctor(withState ? this.state : '', name);
    this[name].notify = this.notify.bind(this);
    this[name].updateUser = this.updateUser.bind(this);
  }

  registerStores() {
    // app
    this.register('app', App);
    this.register('appDeploy', AppDeploy);
    this.register('appVersion', AppVersion);
    this.register('appCreate', AppCreate);

    // cluster
    this.register('cluster', Cluster);
    this.register('clusterDetail', ClusterDetail);

    // runtime
    this.register('runtime', Runtime);
    this.register('runtimeCreate', RuntimeCreate);

    // repo
    this.register('repo', Repo);
    this.register('repoCreate', RepoCreate);

    // category
    this.register('category', Category);

    // user, role
    this.register('user', User);
    this.register('role', Role);

    this.register('sshKey', sshKey);
  }
}
