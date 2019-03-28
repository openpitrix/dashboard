import { observable, action } from 'mobx';
import _, { get } from 'lodash';

import { getProgress } from 'utils';
import { useTableActions } from 'mixins';
import { CLUSTER_TYPE } from 'config/runtimes';

import Store from '../Store';

const defaultStatus = ['active', 'stopped', 'ceased', 'pending', 'suspended'];
@useTableActions
export default class ClusterStore extends Store {
  /**
   * used on tableAction mixin when fetch value by id
   * @type {string}
   */
  idKey = 'cluster_id';

  defaultStatus = defaultStatus;

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

  @observable
  cluster_type = CLUSTER_TYPE.instance;

  @observable
  with_detail = false;

  // cluster job queue
  @observable
  jobs = {
    // job_id=> cluster_id
  };

  @observable attachApps = false;

  @observable attachVersions = false;

  @observable attachUsers = false;

  @observable clusterTab = CLUSTER_TYPE.instance;

  get appStore() {
    return this.getStore('app');
  }

  get appVersionStore() {
    return this.getStore('appVersion');
  }

  get userStore() {
    return this.getStore('user');
  }

  get detailStore() {
    return this.getStore('clusterDetail');
  }

  get clusterEnv() {
    const { changedEnv, env } = this.detailStore;
    return JSON.stringify(changedEnv || env);
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
    params = this.normalizeParams(params);

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
    if (this.cluster_type !== null) {
      params.cluster_type = this.cluster_type;
    }
    if (this.with_detail) {
      params.with_detail = true;
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

    if (this.attachApps) {
      const appIds = this.clusters.map(cluster => cluster.app_id);
      if (appIds.length) {
        await this.appStore.fetchAll({
          app_id: _.uniq(appIds),
          action: this.describeAppsAction
        });
      }
    }

    if (this.attachVersions) {
      const versionIds = this.clusters.map(cluster => cluster.version_id);
      if (versionIds.length) {
        await this.appVersionStore.fetchAll({ version_id: _.uniq(versionIds) });
      }
    }

    if (this.attachUsers) {
      const userIds = this.clusters.map(cluster => cluster.owner);
      if (this.attachUsers && userIds.length > 0) {
        await this.userStore.fetchAll({ user_id: _.uniq(userIds) });
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
    this.attachApps = false;
    this.attachVersions = false;
    this.attachUsers = false;
    this.resetTableParams();
    this.cluster_type = CLUSTER_TYPE.instance;
    this.with_detail = false;
    this.clusterTab = CLUSTER_TYPE.instance;

    this.operateType = '';
    this.modalType = '';
    this.clusterId = '';

    this.defaultStatus = defaultStatus;
  };

  @action
  changeAppVersion = type => {
    this.versionId = type;
  };

  /**
   *
   * @param clusterIds
   * @param opts
   * @returns {Promise<void>}
   */
  @action
  updateEnv = async (clusterIds, opts = {}) => {
    const clusterId = [].concat(clusterIds)[0];
    const params = {
      cluster_id: clusterId,
      env: this.clusterEnv
      // advanced_param: ['']
    };

    Object.assign(params, opts);

    const result = await this.request.patch('clusters/update_env', params);
    if (get(result, 'cluster_id')) {
      this.hideModal();
      // refresh env
      await this.detailStore.fetch(clusterId);
      // clean up
      this.detailStore.changedEnv = '';
      this.success('Update cluster env successfully');
    }
  };

  @action
  doActions = async (params = {}) => {
    const ids = this.operateType === 'multiple' ? this.clusterIds.toJSON() : [this.clusterId];
    const specialActionMap = {
      update_env: this.updateEnv,
      upgrade: this.upgradeVersion
    };

    const method = specialActionMap[this.modalType] || this[this.modalType];

    if (!_.isFunction(method)) {
      this.error('Invalid operation');
      return;
    }

    // first arg maybe event object
    if (_.isObject(params) && !params.nativeEvent) {
      await method(ids, params);
    } else {
      await method(ids);
    }
  };
}

export Detail from './detail';
