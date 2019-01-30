import { observable, action } from 'mobx';
import _ from 'lodash';
import yaml from 'js-yaml';

import { sleep } from 'utils';

import Store from 'stores/Store';

// separate cluster detail operation in this store
export default class ClusterDetailStore extends Store {
  defaultStatus = ['active', 'stopped', 'ceased', 'pending', 'suspended'];

  @observable currentPage = 1;

  @observable isLoading = false;

  @observable cluster = {};

  // vmbase
  @observable clusterNodes = [];

  // helm
  @observable helmClusterNodes = [];

  @observable clusterJobs = [];

  @observable extendedRowKeys = [];

  @observable nodeType = '';

  @observable selectedNodeKeys = [];

  @observable selectedNodeIds = [];

  @observable selectedNodeRole = '';

  @observable currentNodePage = 1;

  @observable totalNodeCount = 0;

  @observable searchNode = '';

  @observable selectNodeStatus = '';

  @observable env = '';

  get clusterStore() {
    return this.getStore('cluster');
  }

  get describeActionName() {
    // developer query user instances relatived runtiems
    if (this.clusterStore.onlyView) {
      return 'clusters';
    }

    return this.getUser().isUserPortal ? 'clusters' : 'debug_clusters';
  }

  @action
  fetch = async clusterId => {
    this.isLoading = true;
    const result = await this.request.get(this.describeActionName, {
      cluster_id: clusterId
    });
    this.cluster = _.get(result, 'cluster_set[0]', {});
    this.setEnv();
    this.isLoading = false;
  };

  @action
  fetchNodes = async (params = {}) => {
    this.isLoading = true;
    params = this.normalizeParams(params);

    if (this.searchNode) {
      params.search_word = this.searchNode;
    }
    if (!params.status) {
      params.status = this.selectNodeStatus
        ? this.selectNodeStatus
        : this.defaultStatus;
    }
    if (this.nodeIds && this.nodeIds.length) {
      params.node_id = params.node_id || this.nodeIds;
    }

    // clusterStore.cluster_id = clusterId;
    // await userStore.fetchDetail(cluster.owner);

    if (params.isHelm) {
      this.formatClusterNodes({
        type: this.nodeType || 'Deployment',
        searchWord: this.searchNode
      });
      this.totalNodeCount = _.get(this.helmClusterNodes, 'length', 0);
    } else {
      const result = await this.request.get(`clusters/nodes`, params);
      this.clusterNodes = _.get(result, 'cluster_node_set', []);
      this.totalNodeCount = _.get(result, 'total_count', 0);
    }

    this.isLoading = false;
  };

  getClusterRoles = () => _.get(this.cluster, 'cluster_role_set', []).map(cl => cl.role);

  // todo: inject clusterStore
  // fixme: table search, filter no effect
  @action
  formatClusterNodes = ({ type, searchWord = '' }) => {
    const { cluster_role_set, cluster_node_set } = this.cluster;

    if (_.isEmpty(cluster_role_set)) {
      return false;
    }
    const clusterNodes = [];
    const keys = ['name', 'host_id', 'host_ip', 'instance_id', 'private_ip'];

    cluster_role_set.forEach(roleItem => {
      if (!roleItem.role) {
        return false;
      }

      if (!roleItem.role.includes(`-${type}`)) {
        return false;
      }

      const nodes = [];
      const status = {
        maxStatus: '',
        maxNumber: 0
      };

      if (Array.isArray(cluster_node_set)) {
        cluster_node_set.forEach(nodeItem => {
          if (nodeItem.role !== roleItem.role) {
            return;
          }

          const hasWord = _.some(keys, key => nodeItem[key].includes(searchWord));
          if (!hasWord) {
            return;
          }

          nodes.push(nodeItem);

          const nodeStatus = _.get(status, nodeItem.status);
          let number = 0;
          if (!nodeStatus) {
            number = 1;
          } else {
            number = nodeStatus + 1;
          }

          status[nodeItem.status] = number;

          if (status.maxStatus === '') {
            status.maxStatus = nodeItem.status;
            status.maxNumber = number;
          } else if (status.maxNumber < number) {
            status.maxStatus = nodeItem.status;
            status.maxNumber = number;
          }
        });
      }

      roleItem.nodes = nodes;
      roleItem.name = _.get(roleItem.role.split(`-${type}`), '[0]');
      roleItem.status = status.maxStatus;
      roleItem.statusText = `(${status.maxNumber}/${nodes.length})`;
      if (nodes.length > 0) {
        clusterNodes.push(roleItem);
      }
    });

    this.helmClusterNodes = clusterNodes;
    return clusterNodes;
  };

  @action
  fetchJobs = async clusterId => {
    this.isLoading = true;
    const result = await this.request.get(`jobs`, { cluster_id: clusterId });
    this.clusterJobs = _.get(result, 'job_set', []);
    this.isLoading = false;
  };

  @action
  addNodes = async params => {
    const res = await this.request.post('clusters/add_nodes', params);
    return res && res.job_id;
  };

  @action
  setNodeRole = (role = '') => {
    this.selectedNodeRole = role;
  };

  @action
  deleteNodes = async params => {
    const res = await this.request.post('clusters/delete_nodes', params);
    return res && res.job_id;
  };

  @action
  cancelDeleteNodes = () => {
    this.selectedNodeIds = [];
    this.selectedNodeKeys = [];
  };

  @action
  resizeCluster = async params => {
    const res = await this.request.post('clusters/resize', params);
    return res && res.job_id;
  };

  @action
  onChangeExtend = e => {
    const { value } = e.target;
    const { extendedRowKeys } = this;
    const index = extendedRowKeys.indexOf(value);

    if (index === -1) {
      extendedRowKeys.push(value);
    } else {
      extendedRowKeys.splice(index, 1);
    }
    this.extendedRowKeys = _.union([], this.extendedRowKeys);
  };

  /**
   * string to yaml
   * @param str
   * @returns {XML|string}
   */
  @action
  toYaml = str => {
    const yamlStr = yaml.safeDump(JSON.parse(str || '{}'));
    // fixme : some helm app with leading strings will cause deploy error
    // return yamlStr.replace(/^---\n?/, '').replace(/\s+(.*)/g, '$1');

    return yamlStr;
  };

  @action
  setEnv = () => {
    const { env } = this.cluster;
    if (env) {
      this.env = this.toYaml(env);
    } else {
      this.env = '';
    }
  };

  @action
  onChangeK8sTag = async name => {
    this.extendedRowKeys = [];
    const type = name.split(' ')[0];
    if (this.nodeType !== type) {
      this.nodeType = type;
      this.isLoading = true;
      await sleep(300);
      this.isLoading = false;
      this.formatClusterNodes({ type });
    }
  };

  @action
  onChangeSelectNodes = (rowKeys, rows) => {
    this.selectedNodeKeys = rowKeys;
    this.selectedNodeIds = rows.map(row => row.node_id);
  };

  @action
  cancelSelectNodes = () => {
    this.selectedNodeKeys = [];
    this.selectedNodeIds = [];
  };

  @action
  onSearchNode = async word => {
    this.searchNode = word;
    this.currentNodePage = 1;
    await this.fetchNodes({ cluster_id: this.cluster.cluster_id });
  };

  @action
  onClearNode = async () => {
    await this.onSearchNode('');
  };

  @action
  onRefreshNode = async () => {
    const { cluster_id } = this.cluster;

    this.isLoading = true;

    if (this.isHelm) {
      await this.fetch(cluster_id);
    } else {
      await this.fetchNodes({ cluster_id });
    }

    this.isLoading = false;
  };

  @action
  changePaginationNode = async page => {
    this.currentNodePage = page;
    await this.fetchNodes({ cluster_id: this.cluster.cluster_id });
  };

  @action
  onChangeNodeStatus = async status => {
    this.currentNodePage = 1;
    this.selectNodeStatus = this.selectNodeStatus === status ? '' : status;
    await this.fetchNodes({
      cluster_id: this.cluster.cluster_id
    });
  };

  @action
  changeEnv = env => {
    this.env = env;
  };

  cancelChangeEnv = () => {
    this.getStore('cluster').hideModal();
    this.setEnv();
  };

  @action
  reset = () => {
    this.currentNodePage = 1;
    this.selectNodeStatus = '';
    this.searchNode = '';
    this.selectedRowKeys = [];
    this.nodeIds = [];

    this.cluster = {};
    this.helmClusterNodes = [];
    this.clusterNodes = [];
  };

  @action
  envJson = () => {
    let { env } = this;
    if (env) {
      env = JSON.stringify(yaml.safeLoad(env));
    }
    return env;
  };
}
