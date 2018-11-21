import { observable, action } from 'mobx';
import _ from 'lodash';

import { getFormData } from 'utils';
import ts from 'config/translation';

import Store from '../Store';

export default class RuntimeCreateStore extends Store {
  @observable runtimeId = '';

  @observable name = '';

  @observable provider = 'qingcloud';

  @observable zone = '';

  @observable credential = '';

  @observable description = '';

  @observable runtimeUrl = '';

  @observable accessKey = '';

  @observable secretKey = '';

  @observable labels = [{ label_key: '', label_value: '' }];

  @observable runtimeCreated = null;

  @observable isLoading = false;

  @observable runtimeZones = [];

  @action
  changeName = e => {
    this.name = e.target.value;
  };

  @action
  changeUrl = e => {
    this.runtimeUrl = e.target.value;
  };

  @action
  changeCredential = e => {
    this.credential = e.target.value;
  };

  @action
  changeDescription = e => {
    this.description = e.target.value;
  };

  @action
  changeProvider = async provider => {
    this.provider = provider;
    this.zone = '';
    if (provider !== 'kubernetes') {
      await this.getRuntimeZone();
    }
  };

  @action
  changeZone = zone => {
    this.zone = zone;
  };

  @action
  changeInputZone = e => {
    this.zone = e.target.value;
  };

  @action
  changeAccessKey = e => {
    this.accessKey = e.target.value;
  };

  @action
  changeSecretKey = e => {
    this.secretKey = e.target.value;
  };

  @action
  handleValidateCredential = () => {
    if (this.runtimeUrl && this.accessKey && this.secretKey) {
      this.getRuntimeZone();
    } else {
      this.info(ts('Information to be verified is incomplete!'));
    }
  };

  @action
  addLabel = () => {
    this.labels.push({
      label_key: '',
      label_value: ''
    });
  };

  @action
  removeLabel = index => {
    this.labels = this.labels.filter((item, i) => i !== index);
  };

  @action
  changeLabel = (value, index, type, labelType) => {
    if (labelType === 'label') {
      this.labels[index][`label_${type}`] = value;
      this.labels = [...this.labels];
    } else if (labelType === 'selector') {
      this.selectors[index][`label_${type}`] = value;
      this.selectors = [...this.selectors];
    }
  };

  @action
  changeLabelKey = e => {
    this.curLabelKey = e.target.value;
  };

  @action
  changeLabelValue = e => {
    this.curLabelValue = e.target.value;
  };

  @action
  getRuntimeZone = async () => {
    if (this.runtimeUrl && this.accessKey && this.secretKey) {
      const params = {
        provider: this.provider,
        runtime_url: this.runtimeUrl,
        runtime_credential: JSON.stringify({
          access_key_id: this.accessKey,
          secret_access_key: this.secretKey
        })
      };
      await this.fetchRuntimeZones(params);
    } else {
      this.runtimeZones = [];
      this.zone = '';
    }
  };

  checkSubmitDate = () => {
    let result = 'ok';
    const keys = [];
    const {
      name, zone, provider, labels, runtimeId
    } = this;

    if (_.isEmpty(name)) {
      result = ts('Please input Name!');
    }
    if (!runtimeId && provider !== 'kubernetes') {
      if (_.isEmpty(this.runtimeUrl)) {
        result = ts('Please input URL!');
      }
      if (_.isEmpty(this.accessKey)) {
        result = ts('Please input Access Key ID!');
      }
      if (_.isEmpty(this.secretKey)) {
        result = ts('Please input Secret Access Key!');
      }
      if (_.isEmpty(zone)) {
        result = ts('Please select Zone!');
      }
    } else if (!runtimeId) {
      if (_.isEmpty(this.credential)) {
        result = ts('Please input kubeconfig!');
      }
    }
    for (let i = 0; i < labels.length; i++) {
      const item = labels[i];
      if (keys.find(key => key === item.label_key)) {
        result = ts('Labels has repeat key');
      } else if (item.label_key) {
        keys.push(item.label_key);
      }
      if (item.label_value && _.isEmpty(item.label_key)) {
        result = ts('Labels missing key');
      } else if (item.label_key && _.isEmpty(item.label_value)) {
        result = ts('Labels missing value');
      }
    }
    return result;
  };

  @action
  handleSubmit = async e => {
    e.preventDefault();
    const checkResult = this.checkSubmitDate();
    if (checkResult !== 'ok') {
      return this.error(checkResult);
    }

    const { provider, zone, labels } = this;
    const data = getFormData(e.target);
    if (provider !== 'kubernetes') {
      data.runtime_credential = JSON.stringify({
        access_key_id: this.accessKey,
        secret_access_key: this.secretKey
      });
    }
    data.labels = labels
      .filter(label => label.label_key)
      .map(label => [label.label_key, label.label_value].join('='))
      .join('&');
    _.extend(data, { provider, zone });

    this.isLoading = true;
    if (this.runtimeId) {
      if (provider !== 'kubernetes' && (!this.accessKey || !this.secretKey)) {
        delete data.runtime_credential;
      } else if (provider !== 'kubernetes') {
        data.runtime_url = this.runtimeUrl;
      }
      if (!data.runtime_credential) {
        delete data.runtime_credential;
      }
      _.extend(data, { runtime_id: this.runtimeId });
      await this.modifyRuntime(data);
    } else {
      await this.create(data);
    }
    this.isLoading = false;

    if (_.get(this, 'runtimeCreated.runtime_id')) {
      if (this.runtimeId) {
        this.success(ts('Modify runtime successfully.'));
      } else {
        this.success(ts('Create runtime successfully.'));
      }
      return this.runtimeCreated;
    }
  };

  @action
  async create(params) {
    params = typeof params === 'object' ? params : JSON.stringify(params);
    this.runtimeCreated = await this.request.post('runtimes', params);
  }

  @action
  async modifyRuntime(params) {
    params = typeof params === 'object' ? params : JSON.stringify(params);
    this.runtimeCreated = await this.request.patch('runtimes', params);
  }

  @action
  async fetchRuntimeZones(params) {
    const result = await this.request.get(`runtimes/zones`, params);
    this.runtimeZones = _.get(result, 'zone', []);
    if (this.runtimeZones.length === 0) {
      this.zone = '';
    }
  }

  @action
  reset() {
    this.runtimeId = '';
    this.name = '';
    this.provider = 'qingcloud';
    this.runtimeUrl = '';
    this.accessKey = '';
    this.secretKey = '';
    this.zone = '';
    this.runtimeZones = [];
    this.credential = '';
    this.description = '';
    this.labels = [{ label_key: '', label_value: '' }];
    this.runtimeCreated = null;
    this.isLoading = false;
  }

  @action
  setRuntime = detail => {
    this.runtimeCreated = null;

    if (detail) {
      this.runtimeId = detail.runtime_id;
      this.name = detail.name;
      this.description = detail.description;
      this.provider = detail.provider;
      this.runtimeUrl = detail.runtime_url;
      this.zone = detail.zone;
      this.labels = detail.labels || [{ label_key: '', label_value: '' }];
    }
  };
}
