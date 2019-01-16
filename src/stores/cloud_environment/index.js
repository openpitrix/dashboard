import { observable, action } from 'mobx';
import _ from 'lodash';

import mockData from './mock-data';

import Store from '../Store';

export default class CloudEnvironmentStore extends Store {
  @observable environment = [];

  @action
  fetchAll = async () => {
    const result = mockData;
    this.environment = _.get(result, 'environment_set', []);
    const totalCount = _.get(result, 'total_count', 0);
    this.totalCount = totalCount;
  };
}
