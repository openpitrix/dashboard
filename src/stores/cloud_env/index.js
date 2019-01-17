import { observable, action } from 'mobx';

import { providers } from 'config/runtimes';

import Store from '../Store';

export default class CloudEnvironmentStore extends Store {
  @observable environment = [];

  @action
  fetchAll = async () => {
    this.environment = providers;
  };
}
