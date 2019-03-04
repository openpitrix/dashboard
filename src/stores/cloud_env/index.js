import { observable, action } from 'mobx';
import _ from 'lodash';

import { providers } from 'config/runtimes';

import Store from '../Store';

export default class CloudEnvironmentStore extends Store {
  @observable environment = [];

  @observable config_set = [];

  @action
  fetchAll = async () => {
    const result = await this.request.post('service_configs/get', {
      service_type: ['runtime']
    });
    this.config_set = _.get(result, 'runtime_config.config_set', []);

    this.environment = this.intersection(providers, this.config_set);
  };

  intersection = (arr1, arr2) => {
    _.forEach(arr1, item => {
      _.forEach(arr2, runtime => {
        if (item.key === runtime.name) {
          item.enable = runtime.enable;
        }
      });
    });

    return arr1;
  };

  @action
  changeEnv = async (checked, item) => {
    const set = _.find(this.config_set, { name: item });
    set.enable = checked;
    const result = await this.update();
    if (result.is_succ) {
      const env = _.find(this.environment, { key: item });
      if (item) {
        env.enable = checked;
      }
    }
  };

  update = () => this.request.post('service_configs/set', {
    runtime_config: {
      config_set: this.config_set
    }
  });
}
