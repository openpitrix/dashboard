import { action } from 'mobx';
import _ from 'lodash';

import { providers as providersConf, CLUSTER_TYPE } from 'config/runtimes';
import { isHelm } from 'utils';
import Store from '../Store';

export default class TestingEnvStore extends Store {
  constructor(...args) {
    super(...args);

    this.defineObservables(function () {
      // runtime provider
      this.platform = _.get(providersConf, '[0].key', '');

      this.curTab = 'runtime';

      this.providerCounts = {};

      this.isLoading = false;

      this.isModalOpen = false;

      this.modalType = '';

      this.selectId = ''; // current handle runtime id

      this.selectCredentialId = ''; // switch credential

      this.runtimeToShowInstances = {};
    });
  }

  // register external store instance if you want access
  get clusterStore() {
    return this.getStore('runtimeCluster');
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

  get runtimeName() {
    const { runtimes } = this.getStore('runtime');
    return _.get(_.find(runtimes, { runtime_id: this.selectId }), 'name');
  }

  get platformName() {
    return _.get(
      _.find(providersConf, { key: this.platform }),
      'name',
      this.platform
    );
  }

  @action
  changePlatform = platform => {
    this.platform = platform;
    this.changeRuntimeToShowInstances();
  };

  @action
  changeTab = tab => {
    this.curTab = tab;
  };

  @action
  setCurrentId = id => {
    this.selectId = id;
  };

  @action
  setCredentialId = id => {
    this.selectCredentialId = id;
  };

  @action
  changeRuntimeToShowInstances = (runtime = {}) => {
    this.runtimeToShowInstances = runtime;
  };

  @action
  handleOperation = async (e, formData) => {
    this.isLoading = true;

    const curHandleRt = _.find(this.runtimeStore.runtimes, {
      runtime_id: this.selectId
    });

    // runtime ops
    if (this.modalType === 'modify_runtime') {
      const pickKeys = ['name', 'description'];
      const data = _.pick(formData, pickKeys);
      if (
        JSON.stringify(data) === JSON.stringify(_.pick(curHandleRt, pickKeys))
      ) {
        this.isLoading = false;
        return this.warn('Data not changed');
      }

      const res = await this.request.patch(
        'runtimes',
        _.extend(data, {
          runtime_id: this.selectId
        })
      );
      if (res && res.runtime_id) {
        this.hideModal();
        this.success('Modify runtime successfully');
        await this.updateProviderCounts();
      }
    }

    if (this.modalType === 'switch_auth') {
      if (
        !this.selectCredentialId
        || this.selectCredentialId === curHandleRt.runtime_credential_id
      ) {
        this.isLoading = false;
        return this.warn('Data not changed');
      }
      const res = await this.request.patch('runtimes', {
        runtime_credential_id: this.selectCredentialId,
        runtime_id: this.selectId
      });
      if (res && res.runtime_id) {
        this.hideModal();
        this.selectCredentialId = '';
        this.success('Switch runtime credential successfully');
        await this.updateProviderCounts();
        await this.fetchCredentials();
      }
    }

    if (this.modalType === 'delete_runtime') {
      const res = await this.request.delete('runtimes', {
        runtime_id: [this.selectId]
      });

      if (res && res.runtime_id) {
        this.hideModal();
        this.success('Delete runtime successfully');
        await this.updateProviderCounts();
        await this.fetchData();
      }
    }

    // credential ops
    if (this.modalType === 'modify_auth_info') {
      const {
        name,
        description,
        access_key,
        secret_key,
        credential
      } = formData;
      const params = {
        name,
        description
      };

      let runtime_credential = '';
      if (!isHelm(this.platformName)) {
        if (access_key && secret_key) {
          runtime_credential = JSON.stringify({
            access_key_id: access_key,
            secret_access_key: secret_key
          });
        }

        if ((access_key && !secret_key) || (!access_key && secret_key)) {
          this.isLoading = false;
          return this.warn(`Access key or secret key is not completed`);
        }
      } else {
        runtime_credential = credential || '';
      }

      if (runtime_credential) {
        Object.assign(params, {
          runtime_credential_content: runtime_credential
        });
      }

      const res = await this.request.patch(
        'runtimes/credentials',
        Object.assign(params, {
          runtime_credential_id: this.selectCredentialId
        })
      );
      if (res && res.runtime_credential_id) {
        this.hideModal();
        this.success('Modify runtime credential successfully');
        await this.fetchData();
      }
    }

    if (this.modalType === 'delete_auth_info') {
      const res = await this.request.delete('runtimes/credentials', {
        runtime_credential_id: [this.selectCredentialId]
      });

      if (res && res.runtime_credential_id) {
        this.hideModal();
        this.success('Delete runtime credential successfully');
        await this.fetchData();
      }
    }
    this.isLoading = false;
  };

  // count runtime by provider
  getProviderRuntimesMap = () => _.mapValues(_.groupBy(this.runtimeStore.runtimes, 'provider'), v => _.map(v, 'runtime_id'));

  getValidProviders = () => _.map(_.filter(providersConf, p => !p.disabled), 'key');

  @action
  updateProviderCounts = async (provider = this.getValidProviders()) => {
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

    if (this.curTab === 'runtime') {
      await this.clusterStore.fetchCount({
        owner: this.userId,
        noLimit: true,
        // ['-'] assume no runtime found
        runtime_id: _.get(this.getProviderRuntimesMap(), this.platform, ['-']),
        cluster_type: CLUSTER_TYPE.instance
      });

      await this.fetchCredentials();
    }

    if (this.curTab === 'runtime_credential') {
      await this.fetchCredentials();
    }

    this.isLoading = false;
  };

  @action
  fetchCredentials = async () => {
    await this.credentialStore.fetchAll({
      owner: this.userId,
      noLimit: true,
      provider: this.platform
    });
  };

  checkStoreWhenInitPage = async provider => {
    if (_.isArray(provider)) {
      this.changePlatform(_.first(provider));
    }
    if (_.isEmpty(this.runtimeStore.runtimes)) {
      await this.updateProviderCounts(provider);
    }
    if (_.isEmpty(this.credentialStore.credentials)) {
      await this.fetchCredentials();
    }
  };
}

export Create from './create';
