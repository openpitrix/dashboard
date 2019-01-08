import { observable, action } from 'mobx';
import _, { get } from 'lodash';

import { useTableActions } from 'mixins';
import { getProgress } from 'utils';

import Store from '../Store';

@useTableActions
export default class RuntimeStore extends Store {
  sortKey = 'status_time';

  defaultStatus = ['active'];

  @observable runtimes = [];

  // current runtimes
  @observable runtimeDetail = {};

  @observable summaryInfo = {};

  // replace original statistic
  @observable statistics = {};

  @observable isLoading = false;

  @observable runtimeId = '';

  @observable isModalOpen = false;

  @observable modalType = '';

  @observable isK8s = false;

  @observable userId = '';

  @observable operateType = '';

  @observable runtimeDeleted = null;

  @observable allRuntimes = [];

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

    if (!params.simpleQuery) {
      const result = await this.request.get('runtimes', params);
      this.runtimes = get(result, 'runtime_set', []);
      this.totalCount = get(result, 'total_count', 0);
    } else {
      // simple query: just fetch runtime data used in other pages
      // no need to set totalCount
      delete params.simpleQuery;
      const result = await this.request.get('runtimes', params);
      this.allRuntimes = get(result, 'runtime_set', []);
    }

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
    const result = await this.request.get(`runtimes`, {
      runtime_id: runtimeId
    });
    this.runtimeDetail = get(result, 'runtime_set[0]', {});
    this.isK8s = get(this.runtimeDetail, 'provider') === 'kubernetes';
    this.isLoading = false;
  };

  reset = () => {
    this.resetTableParams();
    this.userId = '';
    this.runtimeDeleted = null;
    this.runtimes = [];
    this.runtimeDetail = {};
  };
}

export Credential from './credential';
