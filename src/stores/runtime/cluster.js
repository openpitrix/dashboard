import { action, observable } from 'mobx';
import _ from 'lodash';

import { useTableActions } from 'mixins';

import Store from '../Store';

@useTableActions
export default class RuntimeClusterStore extends Store {
  idKey = 'cluster_id';

  @observable clusters = [];

  @observable isLoading = false;

  get clusterIds() {
    return this.selectIds;
  }

  get describeActionName() {
    return this.getStore('cluster').describeActionName;
  }

  get runtimeId() {
    return _.get(
      this.getStore('testingEnv'),
      'runtimeToShowInstances.runtime_id'
    );
  }

  get clusterType() {
    return this.getStore('runtime').runtimeTab;
  }

  @action
  fetchAll = async (params = {}) => {
    params = this.normalizeParams(_.omit(params, ['attachApps']));
    if (this.searchWord) {
      params.search_word = this.searchWord;
    }
    if (this.appId) {
      params.app_id = this.appId;
    }
    if (this.runtimeId) {
      params.runtime_id = this.runtimeId;
    }
    if (this.userId) {
      params.owner = this.userId;
    }
    params.cluster_type = this.clusterType;

    this.isLoading = true;
    const result = await this.request.get(this.describeActionName, params);
    this.clusters = _.get(result, 'cluster_set', []);
    this.totalCount = _.get(result, 'total_count', 0);
    this.isLoading = false;
  };

  @action
  reset = () => {
    this.clusters = [];
  };
}
