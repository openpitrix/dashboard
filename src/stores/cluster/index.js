import { observable, action } from 'mobx';
import _, { get } from 'lodash';

import { getProgress } from 'utils';
import { useTableActions } from 'mixins';

import Store from '../Store';

@useTableActions
export default class ClusterStore extends Store {
  /**
   * used on tableAction mixin when fetch value by id
   * @type {string}
   */
  idKey = 'cluster_id';

  defaultStatus = ['active', 'stopped', 'ceased', 'pending', 'suspended'];

  @observable clusters = [];

  @observable isLoading = false;

  @observable modalType = '';

  @observable isModalOpen = false;

  @observable summaryInfo = {};

  @observable clusterCount = 0;

  @observable clusterId = '';

  @observable operateType = '';

  @observable appId = '';

  @observable runtimeId = '';

  @observable userId = '';

  @observable versionId = '';

  @observable onlyView = false; // user-instances only view, can't operate

  // cluster job queue
  @observable
  jobs = {
    // job_id=> cluster_id
  };

  @observable attachApps = false;

  get appStore() {
    return this.getStore('app');
  }

  get appVersionStore() {
    return this.getStore('appVersion');
  }

  get clusterEnv() {
    return this.getStore('clusterDetail').envJson();
  }

  get fetchJobs() {
    return this.getStore('clusterDetail').fetchJobs;
  }

  // back compat
  get clusterIds() {
    return this.selectIds;
  }

  get describeActionName() {
    // developer query user instances
    if (this.onlyView) {
      return 'clusters';
    }

    return this.getUser().isUserPortal ? 'clusters' : 'debug_clusters';
  }

  get describeAppsAction() {
    return this.getUser().isUserPortal ? 'active_apps' : 'apps';
  }

  @action
  fetchAll = async (params = {}) => {
    const attachApps = Boolean(params.attachApps);

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

    this.isLoading = true;
    const result = await this.request.get(this.describeActionName, params);
    this.clusters = get(result, 'cluster_set', []);
    this.totalCount = get(result, 'total_count', 0);

    if (!this.searchWord && !this.selectStatus) {
      this.clusterCount = this.totalCount;
    }

    if (params.created_date === 30) {
      this.monthCount = get(result, 'total_count', 0);
    }

    if (attachApps) {
      const appIds = this.clusters.map(cluster => cluster.app_id);
      if (appIds.length) {
        await this.appStore.fetchAll({
          app_id: appIds,
          action: this.describeAppsAction
        });
      }
    }

    if (this.attachVersions) {
      const versionIds = this.clusters.map(cluster => cluster.version_id);
      if (versionIds.length) {
        await this.appVersionStore.fetchAll({ version_id: versionIds });
      }
    }

    this.isLoading = false;
  };

  @action
  fetchStatistics = async () => {
    // this.isLoading = true;
    const result = await this.request.get('clusters/statistics');
    this.summaryInfo = {
      name: 'Clusters',
      iconName: 'cluster',
      centerName: 'Runtimes',
      total: get(result, 'cluster_count', 0),
      progressTotal: get(result, 'runtime_count', 0),
      progress: get(result, 'top_ten_runtimes', {}),
      histograms: get(result, 'last_two_week_created', {}),
      topRuntimes: getProgress(get(result, 'top_ten_runtimes', {})),
      topApps: getProgress(get(result, 'top_ten_apps', {})),
      clusterCount: get(result, 'cluster_count', 0),
      runtimeCount: get(result, 'runtime_count', 0)
    };
    // this.isLoading = false;
  };

  @action
  remove = async clusterIds => {
    const result = await this.request.post('clusters/delete', {
      cluster_id: clusterIds
    });

    if (get(result, 'cluster_id')) {
      this.hideModal();
      await this.fetchAll();
      await this.fetchJobs();
      this.cancelSelected();
      this.success('Delete cluster successfully');
    } else {
      return result;
    }
  };

  @action
  start = async clusterIds => {
    const result = await this.request.post('clusters/start', {
      cluster_id: clusterIds
    });
    if (get(result, 'cluster_id')) {
      this.hideModal();
      await this.fetchAll();
      this.cancelSelected();
      this.success('Start cluster successfully');
    }
  };

  @action
  stop = async clusterIds => {
    const result = await this.request.post('clusters/stop', {
      cluster_id: clusterIds
    });
    if (get(result, 'cluster_id')) {
      this.hideModal();
      await this.fetchAll();
      this.cancelSelected();
      this.success('Stop cluster successfully');
    }
  };

  @action
  cease = async clusterIds => {
    const result = await this.request.post('clusters/cease', {
      cluster_id: clusterIds
    });

    if (get(result, 'cluster_id')) {
      this.hideModal();
      await this.fetchAll();
      await this.fetchJobs();
      this.cancelSelected();
      this.success('Cease cluster successfully');
    }
  };

  @action
  rollback = async clusterIds => {
    const result = await this.request.post('clusters/rollback', {
      cluster_id: clusterIds[0]
    });
    if (get(result, 'cluster_id')) {
      this.hideModal();
      await this.fetchAll();
      await this.fetchJobs();
      this.success('Rollback cluster successfully');
    }
  };

  @action
  upgradeVersion = async clusterIds => {
    const result = await this.request.post('clusters/upgrade', {
      cluster_id: clusterIds[0],
      version_id: this.versionId
    });
    if (get(result, 'cluster_id')) {
      this.hideModal();
      await this.fetchAll();
      await this.fetchJobs();
      this.success('Upgrade cluster successfully');
    }
  };

  @action
  showOperateCluster = (clusterIds, type) => {
    if (typeof clusterIds === 'string') {
      this.clusterId = clusterIds;
      this.operateType = 'single';
    } else {
      this.operateType = 'multiple';
    }
    this.showModal(type);
  };

  @action
  reset = () => {
    this.appId = '';
    this.runtimeId = '';
    this.userId = '';
    this.onlyView = false;
    this.clusters = [];
    this.attachVersions = false;
    this.resetTableParams();
  };

  @action
  changeAppVersion = type => {
    this.versionId = type;
  };

  @action
  updateEnv = async clusterIds => {
    const clusterId = [].concat(clusterIds)[0];
    const result = await this.request.patch('clusters/update_env', {
      cluster_id: clusterId,
      env: this.clusterEnv
    });
    if (get(result, 'cluster_id')) {
      this.hideModal();
      // for refresh env
      await this.getStore('clusterDetail').fetch(clusterId);
      this.success('Update cluster env successfully');
    }
  };
}

export Detail from './detail';
