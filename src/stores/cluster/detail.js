import { observable, action } from 'mobx';
import { get, some, union } from 'lodash';
import YAML from 'json2yaml';

import Store from 'stores/Store';

export default class ClusterDetailStore extends Store {
  @observable extendedRowKeys = [];
  @observable isLoading = true;

  @observable currentNodePage = 1;
  @observable selectNodeStatus = '';

  @observable nodeType = '';

  @action
  fetchPage = async ({ clusterId, clusterStore, runtimeStore, appStore }) => {
    this.isLoading = true;
    await clusterStore.fetch(clusterId);
    await clusterStore.fetchJobs(clusterId);
    const { cluster } = clusterStore;
    const { runtime_id, app_id } = cluster;
    if (runtime_id) {
      await runtimeStore.fetch(runtime_id);
    }
    if (app_id) {
      await appStore.fetch(app_id);
    }
    if (!runtimeStore.isKubernetes) {
      await clusterStore.fetchNodes({ cluster_id: clusterId });
      this.isLoading = false;
    } else {
      this.isLoading = false;
      this.formatClusterNodes({
        clusterStore,
        type: 'Deployment'
      });
    }
    clusterStore.cluster_id = clusterId;
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
  onChangeKubespacesTag = ({ isKubernetes, clusterStore }) => name => {
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
