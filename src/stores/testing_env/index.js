import { observable, action } from 'mobx';
import _ from 'lodash';

import { providers as providersConf, tabs } from 'config/testing-env';
import Store from '../Store';

export default class TestingEnvStore extends Store {
  // runtime provider
  @observable platform = _.get(providersConf, '[0].key', '');

  @observable curTab = tabs[0] || '';

  @observable providerCounts = {};

  @observable isLoading = false;

  @observable isModalOpen = false;

  @observable modalType = '';

  // register external store instance if you want access
  get clusterStore() {
    return this.getStore('cluster');
  }

  get runtimeStore() {
    return this.getStore('runtime');
  }

  get credentialStore() {
    return this.getStore('runtimeCredential');
  }

  get userId() {
    return _.get(this.getUser(), 'user_id', '');
  }

  @action
  changePlatform = platform => {
    this.platform = platform;
  };

  @action
  changeTab = tab => {
    this.curTab = tab;
  };

  @action
  showModal = type => {
    this.modalType = type;
    this.isModalOpen = true;
  };

  @action
  hideModal = () => {
    this.isModalOpen = false;
  };

  // count runtime by provider
  getProviderRuntimesMap = () => _.mapValues(_.groupBy(this.runtimeStore.runtimes, 'provider'), v => _.map(v, 'runtime_id'));

  @action
  updateProviderCounts = async provider => {
    this.isLoading = true;
    await this.runtimeStore.fetchAll({
      provider,
      owner: this.userId,
      noLimit: true
    });
    this.providerCounts = _.mapValues(
      this.getProviderRuntimesMap(),
      v => v.length
    );
    this.isLoading = false;
  };

  @action
  fetchData = async () => {
    this.isLoading = true;

    if (this.curTab === 'Testing env') {
      await this.fetchClusters();
      await this.fetchCredentials();
    }

    if (this.curTab === 'Authorization info') {
      await this.fetchCredentials();
    }

    this.isLoading = false;
  };

  @action
  fetchClusters = async () => {
    await this.clusterStore.fetchAll({
      owner: this.userId,
      noLimit: true,
      // ['runtime-'] assume no runtime found
      runtime_id: _.get(this.getProviderRuntimesMap(), this.platform, [
        'runtime-'
      ])
    });
  };

  @action
  fetchCredentials = async () => {
    const platformRts = _.map(
      _.filter(this.runtimeStore.runtimes, r => r.provider === this.platform),
      'runtime_credential_id'
    );
    await this.credentialStore.fetchAll({
      owner: this.userId,
      noLimit: true,
      runtime_credential_id: platformRts,
      provider: this.platform
    });
  };
}

export Create from './create';
