import { observable, action } from 'mobx';
import _ from 'lodash';

import { providers } from 'config/runtimes';

import Store from '../Store';

export default class CloudEnvironmentStore extends Store {
  @observable environment = [];

  @action
  fetchAll = async () => {
    this.environment = providers;
  };

  @action
  changeEnv = item => checked => {
    const env = _.find(this.environment, { key: item });
    if (item) {
      env.disabled = !checked;
    }
  };
}
