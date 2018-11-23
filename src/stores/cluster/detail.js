import { observable, action } from 'mobx';
import _ from 'lodash';
import YAML from 'json2yaml';

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

  @observable modalType = '';

  @observable isModalOpen = false;

  @observable extendedRowKeys = [];

  @observable nodeType = '';

  @observable selectedNodeKeys = [];

  @observable selectedNodeIds = [];

  @observable selectedNodeRole = '';

  @observable currentNodePage = 1;

  @observable totalNodeCount = 0;

  @observable searchNode = '';

  @observable selectNodeStatus = '';

  @action
  showModal = type => {
    this.modalType = type;
    this.isModalOpen = true;
  };

  @action
  hideModal = () => {
    this.isModalOpen = false;
  };

  @action
  fetch = async clusterId => {
    this.isLoading = true;
    const result = await this.request.get(`clusters`, {
      cluster_id: clusterId
    });
    this.cluster = _.get(result, 'cluster_set[0]', {});
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

  // todo: inject clusterStore
  // fixme: table search, filter no effect
  @action
  formatClusterNodes = ({
    type,
    clusterStore = this.clusterStore,
    searchWord = ''
  }) => {
    const { cluster_role_set, cluster_node_set } = this.cluster;

    if (_.isEmpty(cluster_role_set)) {
      return false;
    }
    const clusterNodes = [];
    const keys = ['name', 'host_id', 'host_ip', 'instance_id', 'private_ip'];

    cluster_role_set.forEach(roleItem => {
      if (!roleItem.role) {
        clusterStore.env = this.json2Yaml(roleItem.env);
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
    // todo
    // eslint-disable-next-line
    const res = await this.request.post('clusters/add_nodes', params);
  };

  @action
  onChangeNodeRole = role => {
    this.selectedNodeRole = role;
  };

  @action
  hideAddNodesModal = () => {
    this.hideModal();
    this.selectedNodeRole = '';
  };

  @action
  hideDeleteNodesModal = () => {
    this.hideModal();
    this.selectedNodeIds = [];
    this.selectedNodeKeys = [];
  };

  @action
  deleteNodes = async params => {
    // eslint-disable-next-line
    const res = await this.request.post('clusters/delete_nodes', params);
  };

  // resize cluster
  @action
  hideResizeClusterModal = () => {
    this.hideModal();
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

  @action
  json2Yaml = str => {
    const yamlStr = YAML.stringify(JSON.parse(str || '{}'));
    // fixme : some helm app with leading strings will cause deploy error
    return yamlStr.replace(/^---\n/, '').replace(/\s+(.*)/g, '$1');
  };

  @action
  onChangeK8sTag = name => {
    this.extendedRowKeys = [];
    const type = name.split(' ')[0];
    if (this.nodeType !== type) {
      this.nodeType = type;
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
}
