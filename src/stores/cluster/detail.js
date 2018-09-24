import { observable, action } from 'mobx';
import { get, some, union } from 'lodash';
import YAML from 'json2yaml';

import Store from 'stores/Store';

// separate cluster detail operation in this store
export default class ClusterDetailStore extends Store {
  @observable isLoading = false;
  @observable cluster = {};
  @observable clusterNodes = [];
  @observable clusterJobs = [];

  @observable extendedRowKeys = [];

  @observable currentNodePage = 1;
  @observable selectNodeStatus = '';

  @observable nodeType = '';

  @observable selectedNodeKeys = [];

  @observable selectedNodeIds = [];

  @observable selectedNodeRole = '';

  @action
  fetch = async clusterId => {
    this.isLoading = true;
    const result = await this.request.get(`clusters`, { cluster_id: clusterId });
    this.cluster = get(result, 'cluster_set[0]', {});
    this.versionId = this.cluster.version_id;
    this.isLoading = false;
    this.pageInitMap = { cluster: true };
  };

  @action
  fetchNodes = async (params = {}) => {
    this.isLoading = true;
    let pageOffset = params.page || this.currentNodePage;
    let defaultParams = {
      sort_key: 'create_time',
      limit: this.pageSize,
      offset: (pageOffset - 1) * this.pageSize
    };

    if (this.searchNode) {
      params.search_word = this.searchNode;
    }
    if (!params.status) {
      params.status = this.selectNodeStatus ? this.selectNodeStatus : this.defaultStatus;
    }
    
//    if (!runtimeStore.isKubernetes) {
//      await clusterStore.fetchNodes({ cluster_id: clusterId });
//      this.isLoading = false;
//    } else {
//      this.isLoading = false;
//      this.formatClusterNodes({
//        clusterStore,
//        type: 'Deployment'
//      });
//    }
//    clusterStore.cluster_id = clusterId;
//    await userStore.fetchDetail(cluster.owner);

    const result = await this.request.get(`clusters/nodes`, assign(defaultParams, params));
    this.clusterNodes = get(result, 'cluster_node_set', []);
    this.totalNodeCount = get(result, 'total_count', 0);
    this.isLoading = false;
  };

  @action
  fetchJobs = async clusterId => {
    this.isLoading = true;
    const result = await this.request.get(`jobs`, { cluster_id: clusterId });
    this.clusterJobs = get(result, 'job_set', []);
    this.isLoading = false;
  };

  @action
  addNodes = async params => {
    // todo
    const res = await this.request.post('clusters/add_nodes', params);
  };

  @action
  onChangeNodeRole = role => {
    this.selectedNodeRole = role;
>>>>>>> feat: VM based cluster support addNodes, resizeCluster, deleteNodes
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
    const res = await this.request.post('clusters/delete_nodes', params);
    console.log('delete nodes: ', res);
  };

  // resize cluster
  @action
  hideResizeClusterModal = () => {
    this.hideModal();
  };


  /////

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
    this.extendedRowKeys = union([], this.extendedRowKeys);
  };

  @action
  json2Yaml = str => {
    let yamlStr = YAML.stringify(JSON.parse(str));
    yamlStr = yamlStr.replace(/^---\n/, '');
    yamlStr = yamlStr.replace(/  (.*)/g, '$1');
    return yamlStr;
  };

  @action
  formatClusterNodes = ({ type, clusterStore, searchWord = '' }) => {
    const { cluster_role_set, cluster_node_set } = clusterStore.cluster;
    if (!cluster_role_set) {
      return false;
    }
    const clusterNodes = [];
    const keys = ['name', 'host_id', 'host_ip', 'instance_id', 'private_ip'];

    cluster_role_set.forEach(roleItem => {
      if (!roleItem.role) {
        clusterStore.env = this.json2Yaml(roleItem.env);
        return false;
      }

      if (!roleItem.role.includes(`-${type}`)) return false;

      const nodes = [];
      const status = {
        maxStatus: '',
        maxNumber: 0
      };

      if (cluster_node_set) {
        cluster_node_set.forEach(nodeItem => {
          if (nodeItem.role !== roleItem.role) {
            return;
          }

          const hasWord = some(keys, key => nodeItem[key].includes(searchWord));
          if (!hasWord) {
            return;
          }

          nodes.push(nodeItem);
          const nodeStatus = get(status, nodeItem.status);
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
      roleItem.name = get(roleItem.role.split(`-${type}`), '[0]');
      roleItem.status = status.maxStatus;
      roleItem.statusText = `(${status.maxNumber}/${nodes.length})`;
      if (nodes.length > 0) {
        clusterNodes.push(roleItem);
      }
    });
    clusterStore.clusterNodes = clusterNodes;
  };

  @action
  onChangeK8sTag = ({ isKubernetes, clusterStore }) => name => {
    if (!isKubernetes || !name) return;

    this.extendedRowKeys = [];
    const type = name.split(' ')[0];
    this.nodeType = type;
    this.formatClusterNodes({ clusterStore, type });
  };

  @action
  onSearchNode = (isKubernetes, clusterStore) => async word => {
    clusterStore.searchNode = word;
    this.currentNodePage = 1;
    const { cluster } = clusterStore;
    const { cluster_id } = cluster;
    if (!isKubernetes) {
      await clusterStore.fetchNodes({ cluster_id, search_word: word });
    } else {
      await clusterStore.fetch(cluster_id);
      this.formatClusterNodes({
        clusterStore,
        type: this.nodeType,
        searchWord: word
      });
    }
  };

  @action
  onClearNode = (isKubernetes, clusterStore) => async () => {
    await this.onSearchNode(isKubernetes, clusterStore)('');
  };

  @action
  onRefreshNode = (isKubernetes, clusterStore) => async () => {
    clusterStore.searchNode = '';
    await this.onSearchNode(isKubernetes, clusterStore)('');
  };
}
