import { observable, action } from 'mobx';
import _, { pick } from 'lodash';

import Store from './Store';

import App, {
  Deploy as AppDeploy,
  Version as AppVersion,
  Create as AppCreate,
  Uncategoried as AppUncategoried
} from './app';
import Category from './category';
import Cluster, { Detail as ClusterDetail } from './cluster';
import Repo, { Create as RepoCreate } from './repo';
import Runtime, { Credential as RuntimeCredential } from './runtime';
import User, { Role } from './user';
import sshKey from './key_pair';
import TestingEnv, { Create as TestingEnvCreate } from './testing_env';
import Vendor from './vendor';

const defaultNotifyOption = { title: '', message: '', type: 'info' };

export default class RootStore extends Store {
  @observable fixNav = false;

  @observable notifications = [];

  @observable
  user = {
    username: ''
  };

  @observable searchWord=''; // home page search word

  constructor(initialState) {
    super(initialState);
    this.state = initialState;
  }

  // get client side config
  getAppConfig = key => {
    const appConf = _.get(this, 'config.app', {});
    return key ? appConf[key] : appConf;
  };

  @action
  setNavFix = fixNav => {
    this.fixNav = !!fixNav;
  };

  @action
  setUser = user => {
    this.user = user;
  };

  getUser = () => this.user;

  @action
  updateUser = props => {
    this.user.update(props);
  };

  @action
  notify = (...msg) => {
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
  };

  @action
  detachNotify = ts => {
    this.notifications = this.notifications.filter(item => item.ts !== ts);
  };

  @action
  clearNotify = () => {
    this.notifications = [];
  };

  register = (name, Ctor, withState = true) => {
    if (!name.endsWith('Store')) {
      name += 'Store';
    }
    if (typeof Ctor === 'function') {
      this[name] = new Ctor(withState ? this.state : '', name);
    } else if (
      typeof Ctor === 'object'
      && Ctor.opStore.toString() === 'Symbol(op)'
    ) {
      Ctor.setInitialState(withState ? this.state : '', name);
      this[name] = Ctor;
    } else {
      throw Error('Invalid store constructor or instance');
    }

    Object.assign(this[name], {
      notify: this.notify,
      updateUser: this.updateUser,
      getStore: this.getRegisteredStore,
      getUser: this.getUser
    });
  };

  getRegisteredStore = (name = '') => {
    if (!name) {
      throw Error('Bad store name');
    }
    if (!name.endsWith('Store')) {
      name += 'Store';
    }

    if (!(this[name] instanceof Store)) {
      throw Error(`Unregisterd store: ${name}`);
    }

    return this[name];
  };

  registerStores = () => {
    // app
    this.register('app', App);
    this.register('appDeploy', AppDeploy);
    this.register('appVersion', AppVersion);
    this.register('appCreate', AppCreate);
    this.register('appUncategoried', AppUncategoried);

    // cluster
    this.register('cluster', Cluster);
    this.register('clusterDetail', ClusterDetail);

    // runtime
    this.register('runtime', Runtime);
    this.register('runtimeCredential', RuntimeCredential);

    // fixme: testing env contains runtime logic
    // testing env, authorization
    this.register('testingEnv', TestingEnv);
    this.register('testingEnvCreate', TestingEnvCreate);

    // repo
    this.register('repo', Repo);
    this.register('repoCreate', RepoCreate);

    // category
    this.register('category', Category);

    // user, role
    this.register('user', User);
    this.register('role', Role);

    this.register('sshKey', sshKey);

    // Vendor
    this.register('vendor', Vendor);
  };
}
