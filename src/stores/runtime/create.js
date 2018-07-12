import { observable, action } from 'mobx';
import Store from '../Store';
import _ from 'lodash';
import { getFormData } from 'utils';

export default class RuntimeCreateStore extends Store {
  @observable runtimeId = '';
  @observable name = '';
  @observable provider = 'qingcloud';
  @observable zone = 'pek3a';
  @observable description = '';
  @observable runtimeUrl = '';
  @observable accessKey = '';
  @observable secretKey = '';
  @observable curLabelKey = '';
  @observable curLabelValue = '';
  @observable labels = [{ label_key: '', label_value: '' }];
  @observable runtimeCreated = null;
  @observable isLoading = false;

  @action
  changeName = e => {
    this.name = e.target.value;
  };

  @action
  changeUrl = e => {
    this.runtimeUrl = e.target.value;
  };

  @action
  changeDescription = e => {
    this.description = e.target.value;
  };

  @action
  changeProvider = provider => {
    this.provider = provider;
  };

  @action
  changeZone = zone => {
    this.zone = zone;
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
    this.showMsg(this.accessKey && this.secretKey ? 'valid credential' : 'invalid credential');
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
    this.labels = this.labels.filter((item, i) => i != index);
  };

  @action
  changeLabel = (value, index, type, labelType) => {
    if (labelType === 'label') {
      this.labels[index]['label_' + type] = value;
      this.labels = [...this.labels];
    } else if (labelType === 'selector') {
      this.selectors[index]['label_' + type] = value;
      this.selectors = [...this.selectors];
    }
  };

  /* @action
  addLabel = () => {
    if (!(this.curLabelKey && this.curLabelValue)) {
      return this.showMsg('please input label key and value');
    }
    if (_.find(this.labels, { label_key: this.curLabelKey })) {
      return this.showMsg('label key already exists');
    }

    this.labels.push({
      label_key: this.curLabelKey,
      label_value: this.curLabelValue
    });

    this.curLabelKey = '';
    this.curLabelValue = '';
  };*/

  @action
  changeLabelKey = e => {
    this.curLabelKey = e.target.value;
  };

  @action
  changeLabelValue = e => {
    this.curLabelValue = e.target.value;
  };

  /*@action
  removeLabel = key => {
    this.labels = this.labels.filter(label => {
      return label.label_key !== key;
    });
  };*/

  @action
  handleSubmit = async e => {
    e.preventDefault();
    const { provider, zone, labels } = this;

    const data = getFormData(e.target);

    for (let i = 0; i < this.labels.length; i++) {
      let item = this.labels[i];
      if (_.isEmpty(item.label_key)) {
        return this.showMsg('Labels missing key');
      } else if (_.isEmpty(item.label_value)) {
        return this.showMsg('Labels missing value');
      }
    }

    if (provider === 'qingcloud' || provider === 'aws') {
      data.runtime_credential = JSON.stringify({
        access_key_id: this.accessKey,
        secret_access_key: this.secretKey
      });
    } else if (provider === 'kubernetes') {
      let credential = data.credential;
      delete data.credential;
      data.runtime_url = 'https://api.qingcloud.com';
      data.runtime_credential = credential;
    }

    data.labels = labels
      .map(label => {
        return [label.label_key, label.label_value].join('=');
      })
      .join('&');

    _.extend(data, { provider, zone });

    this.isLoading = true;
    if (this.runtimeId) {
      delete data.runtime_url;
      delete data.runtime_credential;
      _.extend(data, { runtime_id: this.runtimeId });
      await this.modifyRuntime(data);
    } else {
      await this.create(data);
    }

    if (_.get(this, 'runtimeCreated.runtime')) {
      this.showMsg('Create runtime successfully');
    } else if (_.get(this, 'runtimeCreated.runtime_id')) {
      this.showMsg('Modify runtime successfully');
      this.runtimeCreated.runtime = this.runtimeCreated.runtime_id;
    } else {
      let { errDetail } = this.runtimeCreated;
      this.showMsg(errDetail);
    }

    // disable re-submit form in 2 sec
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
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
  reset() {
    this.hideMsg();
    this.runtimeId = '';
    this.name = '';
    this.provider = 'qingcloud';
    this.zone = 'pek3a';
    this.runtimeUrl = '';
    this.description = '';
    this.accessKey = '';
    this.secretKey = '';
    this.curLabelKey = '';
    this.curLabelValue = '';
    this.labels = [{ label_key: '', label_value: '' }];
    this.runtimeCreated = null;
    this.isLoading = false;
  }

  @action
  setRuntime = detail => {
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
