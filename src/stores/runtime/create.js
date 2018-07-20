import { observable, action } from 'mobx';
import Store from '../Store';
import _ from 'lodash';
import { getFormData } from 'utils';

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
    }
  };

  checkSubmitDate = () => {
    let result = 'ok',
      keys = [];
    const { name, zone, provider, labels, runtimeId } = this;
    if (_.isEmpty(name)) {
      result = 'Please input Name!';
    }
    if (_.isEmpty(zone)) {
      result = 'Please select or input Zone!';
    }
    if (!runtimeId && provider !== 'kubernetes') {
      if (_.isEmpty(this.runtimeUrl)) {
        result = 'Please input URL!';
      }
      if (_.isEmpty(this.accessKey)) {
        result = 'Please input Access Key ID!';
      }
      if (_.isEmpty(this.secretKey)) {
        result = 'Please input Secret Access Key!';
      }
    } else if (!runtimeId) {
      if (_.isEmpty(this.credential)) {
        result = 'Please input Credential!';
      }
    }
    for (let i = 0; i < labels.length; i++) {
      let item = labels[i];
      if (keys.find(key => key === item.label_key)) {
        result = 'Labels has repeat key!';
      } else if (item.label_key) {
        keys.push(item.label_key);
      }
      if (item.label_value && _.isEmpty(item.label_key)) {
        result = 'Labels missing key!';
      } else if (item.label_key && _.isEmpty(item.label_value)) {
        result = 'Labels missing value!';
      }
    }
    return result;
  };

  @action
  handleSubmit = async e => {
    e.preventDefault();
    const checkResult = this.checkSubmitDate();
    if (checkResult === 'ok') {
      const { provider, zone, labels } = this;
      const data = getFormData(e.target);
      if (provider !== 'kubernetes') {
        data.runtime_credential = JSON.stringify({
          access_key_id: this.accessKey,
          secret_access_key: this.secretKey
        });
      } else {
        //data.runtime_url = 'https://api.qingcloud.com';
      }
      data.labels = labels
        .filter(label => label.label_key)
        .map(label => [label.label_key, label.label_value].join('='))
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

      if (_.get(this, 'runtimeCreated.runtime_id')) {
        if (this.runtimeId) {
          this.showMsg('Modify runtime successfully', 'success');
        } else {
          this.showMsg('Create runtime successfully', 'success');
        }
      } else {
        let { errDetail } = this.runtimeCreated;
        this.showMsg(errDetail);
      }

      // disable re-submit form in 2 sec
      setTimeout(() => {
        this.isLoading = false;
      }, 2000);
    } else {
      this.showMsg(checkResult);
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
    if (this.runtimeZones.length > 0) {
      this.showMsg('Get zone data success!', 'success');
    } else {
      this.showMsg('Get zone data fail!', 'error');
    }
  }

  @action
  reset() {
    this.hideMsg();
    this.runtimeId = '';
    this.name = '';
    this.provider = 'qingcloud';
    this.runtimeUrl = '';
    this.accessKey = '';
    this.secretKey = '';
    this.zone = '';
    this.credential = '';
    this.description = '';
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
