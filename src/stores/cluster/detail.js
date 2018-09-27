import { observable, action } from 'mobx';
import { get, union } from 'lodash';

import Store from 'stores/Store';

export default class ClusterDetailStore extends Store {
  @observable extendedRowKeys = [];
  @observable isLoading = true;

  @observable currentNodePage = 1;
  @observable searchNode = '';
  @observable selectNodeStatus = '';

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
  formatClusterNodes = ({ type, clusterStore }) => {
    const { cluster_role_set, cluster_node_set } = clusterStore.cluster;
    if (!cluster_role_set) {
      return false;
    }
    const clusterNodes = [];

    cluster_role_set.forEach(roleItem => {
      if (!roleItem.role) {
        clusterStore.env = roleItem.env;
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
          if (nodeItem.role === roleItem.role) {
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
          }
        });
      }
      roleItem.nodes = nodes;
      roleItem.name = get(roleItem.role.split(`-${type}`), '[0]');
      roleItem.status = status.maxStatus;
      roleItem.statusText = `(${status.maxNumber}/${nodes.length})`;
      clusterNodes.push(roleItem);
    });
    clusterStore.clusterNodes = clusterNodes;
  };

  @action
  onChangeKubespacesTag = ({ isKubernetes, clusterStore }) => name => {
    if (!isKubernetes || !name) return;

    this.extendedRowKeys = [];
    const type = name.split(' ')[0];
    this.formatClusterNodes({ clusterStore, type });
  };

  @action
  onSearchNode = () => async word => {
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
    await this.fetchNodes({ cluster_id: this.cluster.cluster_id });
  };
}
