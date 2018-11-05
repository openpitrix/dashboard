import { observable, action } from 'mobx';
import _ from 'lodash';

import Store from '../Store';
import ts from 'config/translation';

export default class KeyPairStore extends Store {
  defaultStatus = ['active', 'stopped', 'ceased', 'pending', 'suspended'];

  @observable isLoading = false;
  @observable modalType = '';
  @observable isModalOpen = false;

  @observable keyPairs = [];
  @observable pairId = '';
  @observable currentPairId = '';
  @observable userId = '';

  @observable name = '';
  @observable pub_key = '';
  @observable description = '';

  @observable nodeIds = '';

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
  fetchKeyPairs = async (params = {}) => {
    this.isLoading = true;
    const result = await this.request.get(
      'clusters/key_pairs',
      Object.assign({ noLimit: true,  owner: this.userId }, params)
    );
    this.keyPairs = _.get(result, 'key_pair_set', []);

    if (!this.currentPairId || this.currentPairId === this.pairId) {
      this.nodeIds = _.get(this.keyPairs[0], 'node_id', '');
      this.currentPairId = _.get(this.keyPairs[0], 'key_pair_id', '');
    }

    this.isLoading = false;
  };

  @action
  addKeyPairs = async () => {
    if (!this.name) {
      this.error(ts('Please input Name!'));
    } else if (!this.pub_key) {
      this.error(ts('Please input public key!'));
    } else {
      const data = {
        name: this.name,
        pub_key: this.pub_key,
        description: this.description
      };
      const result = await this.request.post('clusters/key_pairs', data);

      if (_.get(result, 'key_pair_id')) {
        this.hideModal();
        await this.fetchKeyPairs();
        this.success(ts('Create SSH Key successful!'));
      }
    }
  };

  @action
  removeKeyPairs = async () => {
    const result = await this.request.delete('clusters/key_pairs', { key_pair_id: [this.pairId] });
    this.hideModal();

    if (_.get(result, 'key_pair_id')) {
      await this.fetchKeyPairs();
      this.success(ts('Delete SSH Key successfully.'));
    }
  };

  @action
  attachKeyPairs = async (keyPairIds, nodeIds) => {
    const result = await this.request.post('clusters/key_pair/attach', {
      key_pair_id: keyPairIds,
      node_id: nodeIds
    });

    if (_.get(result, 'job_id')) {
      this.hideModal();
      this.success(ts('Attach SSH Key successfully.'));
    } else {
      return result;
    }
  };

  @action
  detachKeyPairs = async (keyPairIds, nodeIds) => {
    const result = await this.request.post('clusters/key_pair/detach', {
      key_pair_id: keyPairIds,
      node_id: nodeIds
    });

    if (_.get(result, 'job_id')) {
      this.hideModal();
      this.success(ts('Detach SSH Key successfully.'));
    } else {
      return result;
    }
  };

  @action
  resetKeyPair = () => {
    this.name = '';
    this.pub_key = '';
    this.description = '';
  };

  @action
  changeName = e => {
    this.name = e.target.value;
  };

  @action
  changePubkey = e => {
    this.pub_key = e.target.value;
  };

  @action
  changeDescription = e => {
    this.description = e.target.value;
  };
}
