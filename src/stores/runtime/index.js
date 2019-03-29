import { action } from 'mobx';
import { get } from 'lodash';

import { useTableActions } from 'mixins';
import { getProgress } from 'utils';
import { CLUSTER_TYPE } from 'config/runtimes';

import Store from '../Store';

@useTableActions
export default class RuntimeStore extends Store {
  constructor(...args) {
    super(...args);

    this.idKey = 'runtime_id';

    this.sortKey = 'status_time';

    this.defaultStatus = ['active'];

    this.defineObservables(function () {
      this.runtimes = [];

      // current runtimes
      this.runtimeDetail = {};

      this.summaryInfo = {};

      // replace original statistic
      this.statistics = {};

      this.isLoading = false;

      this.runtimeId = '';

      this.isModalOpen = false;

      this.modalType = '';

      this.isK8s = false;

      this.userId = '';

      this.operateType = '';

      this.runtimeDeleted = null;

      this.clusterTab = CLUSTER_TYPE.instance;
    });
  }

  get clusterStore() {
    return this.getStore('cluster');
  }

  get actionName() {
    // developer query user instances relatived runtiems
    if (this.clusterStore.onlyView) {
      return 'runtimes';
    }

    return this.getUser().isUserPortal ? 'runtimes' : 'debug_runtimes';
  }

  @action
  fetchAll = async (params = {}) => {
    params = this.normalizeParams(params);

    if (this.searchWord) {
      params.search_word = this.searchWord;
    }
    if (this.userId) {
      params.owner = this.userId;
    }

    this.isLoading = true;

    const result = await this.request.get(this.actionName, params);
    this.runtimes = get(result, 'runtime_set', []);
    this.totalCount = get(result, 'total_count', 0);

    this.isLoading = false;
  };

  @action
  fetchStatistics = async () => {
    this.isLoading = true;
    const result = await this.request.get('runtimes/statistics');
    this.summaryInfo = {
      name: 'Runtimes',
      iconName: 'stateful-set',
      centerName: 'Provider',
      total: get(result, 'runtime_count', 0),
      progressTotal: get(result, 'provider_count', 0),
      progress: get(result, 'top_ten_providers', {}),
      histograms: get(result, 'last_two_week_created', {}),
      topProviders: getProgress(get(result, 'top_ten_providers', {})),
      runtimeCount: get(result, 'runtime_count', 0),
      providerount: get(result, 'provider_count', 0)
    };
    this.isLoading = false;
  };

  @action
  fetch = async runtimeId => {
    this.isLoading = true;
    const result = await this.request.get(this.actionName, {
      runtime_id: runtimeId
    });
    this.runtimeDetail = get(result, 'runtime_set[0]', {});
    this.isK8s = get(this.runtimeDetail, 'provider') === 'kubernetes';
    this.isLoading = false;
  };

  @action
  changeClusterTab = value => {
    this.clusterTab = value;
  };
}

export Credential from './credential';

export RuntimeCluster from './cluster';
