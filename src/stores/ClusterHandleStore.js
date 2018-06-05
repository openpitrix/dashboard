import { observable, action } from 'mobx';
import Store from './Store';

export default class ClusterHandleStore extends Store {
  @observable clusterId = '';
  @observable showDeleteCluster = false;
  @observable showClusterJobs = false;
  @observable showClusterParameters = false;

  @action
  deleteClusterShow = clusterId => {
    this.clusterId = clusterId;
    this.showDeleteCluster = true;
  };

  @action
  deleteClusterClose = () => {
    this.showDeleteCluster = false;
  };

  @action
  deleteCluster = async clusterStore => {
    await clusterStore.deleteCluster([this.clusterId]);
    this.showDeleteCluster = false;
    await clusterStore.fetchClusters();
  };

  @action
  clusterJobsOpen = () => {
    this.showClusterJobs = true;
  };

  @action
  clusterJobsClose = () => {
    this.showClusterJobs = false;
  };

  @action
  clusterParametersOpen = () => {
    this.showClusterParameters = true;
  };

  @action
  clusterParametersClose = () => {
    this.showClusterParameters = false;
  };
}
