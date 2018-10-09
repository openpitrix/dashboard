import { observable, action } from 'mobx';
import _ from 'lodash';

import Store from '../Store';

export default class KeyPairStore extends Store {
  defaultStatus = ['active', 'stopped', 'ceased', 'pending', 'suspended'];

  @observable isLoading = false;
  @observable modalType = '';
  @observable isModalOpen = false;

  @observable keyPairs = [];
  @observable pairId = '';
  @observable currentPairId = '';

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
      Object.assign({ noLimit: true }, params)
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
      this.error('Please input Name!');
    } else if (!this.pub_key) {
      this.error('Please input public key!');
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
        this.success('Create SSH Key successful!');
      } else {
        const { err, errDetail } = result;
        this.error(errDetail || err || 'Create SSH key fail!');
      }
    }
  };

  @action
  removeKeyPairs = async () => {
    const result = await this.request.delete('clusters/key_pairs', { key_pair_id: [this.pairId] });
    this.hideModal();

    if (_.get(result, 'key_pair_id')) {
      this.hideModal();
      await this.fetchKeyPairs();
      this.success('Delete SSH Key successfully.');
    } else {
      const { err, errDetail } = result;
      this.error(errDetail || err);
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
