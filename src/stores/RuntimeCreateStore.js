import { observable, action } from 'mobx';
import Store from './Store';
import _ from 'lodash';

export default class RuntimeCreateStore extends Store {
  @observable provider = 'qingcloud';
  @observable zone = 'pek3a';
  @observable accessKey = '';
  @observable secretKey = '';
  @observable curLabelKey = '';
  @observable curLabelValue = '';
  @observable labels = [];
  @observable runtimeCreated = null;
  @observable isLoading = false;

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
    if (!(this.curLabelKey && this.curLabelValue)) {
      return this.showMsg('please input label key and value');
    }
    if (_.find(this.labels, { key: this.curLabelKey })) {
      return this.showMsg('label key already exists');
    }

    this.labels.push({
      key: this.curLabelKey,
      value: this.curLabelValue
    });

    this.curLabelKey = '';
    this.curLabelValue = '';
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
  removeLabel = key => {
    this.labels = this.labels.filter(label => {
      return label.key !== key;
    });
  };

  @action
  handleSubmit = async e => {
    e.preventDefault();
    this.isLoading = true;
    const { provider, zone, labels } = this;

    let fd = new FormData(e.target);
    let data = {};
    for (let p of fd.entries()) {
      data[p[0]] = p[1];
    }

    if (_.isEmpty(labels)) {
      this.isLoading = false;
      return this.showMsg('missing labels');
    }

    if (provider === 'qingcloud') {
      data.runtime_credential = JSON.stringify({
        access_key_id: this.accessKey,
        secret_access_key: this.secretKey
      });
    } else if (provider === 'kubernetes') {
      let credential = data.credential;
      delete data.credential;
      data.runtime_credential = credential;
    }

    data.labels = labels
      .map(label => {
        return [label.key, label.value].join('=');
      })
      .join('&');

    _.extend(data, { provider, zone });

    await this.create(data);

    // todo
    if (this.runtimeCreated.runtime) {
      this.showMsg('create runtime successfully');
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
  reset() {
    this.hideMsg();

    this.provider = 'qingcloud';
    this.zone = 'pek3a';
    this.accessKey = '';
    this.secretKey = '';
    this.curLabelKey = '';
    this.curLabelValue = '';
    this.labels = [];
    this.runtimeCreated = null;
    this.isLoading = false;
  }
}
