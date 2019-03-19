import { action, observable } from 'mobx';
import _ from 'lodash';

import { useTableActions } from 'mixins';

import { CLUSTER_TYPE } from 'config/runtimes';
import Store from '../Store';

@useTableActions
export default class RuntimeClusterStore extends Store {
  idKey = 'cluster_id';

  @observable clusters = [];

  @observable isLoading = false;

  @observable countInstance = 0;

  @observable countProxy = 0; // frontgate

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

  get defaultStatus() {
    return this.getStore('cluster').defaultStatus;
  }

  setParams = (params = {}, extra = {}) => {
    if (this.runtimeId) {
      params.runtime_id = this.runtimeId;
    }
    if (this.userId) {
      params.owner = this.userId;
    }

    if (params.cluster_type === undefined) {
      params.cluster_type = this.clusterType;
    }

    return Object.assign(params, extra);
  };

  @action
  fetchAll = async (params = {}) => {
    params = this.normalizeParams(_.omit(params, ['attachApps']));
    if (this.searchWord) {
      params.search_word = this.searchWord;
    }
    if (this.appId) {
      params.app_id = this.appId;
    }

    this.setParams(params);

    this.isLoading = true;
    const result = await this.request.get(this.describeActionName, params);
    this.clusters = _.get(result, 'cluster_set', []);
    this.totalCount = _.get(result, 'total_count', 0);
    this.isLoading = false;
  };

  @action
  fetchCount = async (params = {}) => {
    params = this.normalizeParams(params);
    this.setParams(params, {
      display_columns: ['']
    });

    this.isLoading = true;
    const result = await this.request.get(this.describeActionName, params);
    const clusterType = params.cluster_type !== undefined
      ? params.cluster_type
      : this.clusterType;
    const prop = clusterType === CLUSTER_TYPE.instance ? 'countInstance' : 'countProxy';
    this[prop] = _.get(result, 'total_count', 0);
    this.isLoading = false;
  };

  @action
  reset = () => {
    this.clusters = [];
  };
}
