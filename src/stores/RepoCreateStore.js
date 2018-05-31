import { observable, action } from 'mobx';
import Store from './Store';
import _ from 'lodash';

const s3UrlPattern = /^s3:\/\/s3\.(.+)\.(.+)\/(.+)\/?$/; // s3.<zone>.<host>/<bucket>

export default class RepoCreateStore extends Store {
  @observable providers = ['qingcloud'];
  @observable visibility = 'public';
  @observable protocolType = 'http'; // http, https, s3
  @observable accessKey = '';
  @observable secretKey = '';
  @observable labels = [];
  @observable curLabelKey = '';
  @observable curLabelValue = '';
  @observable selectors = [];
  @observable curSelectorKey = '';
  @observable curSelectorValue = '';
  @observable repoCreated = null;
  @observable isLoading = false;

  @action
  changeProviders = providers => {
    this.providers = providers;
  };

  @action
  changeVisibility = visibility => {
    this.visibility = visibility;
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
  changeProtocolType = type => {
    this.protocolType = type;
  };

  @action
  changeSelectorKey = e => {
    this.curSelectorKey = e.target.value;
  };

  @action
  changeSelectorValue = e => {
    this.curSelectorValue = e.target.value;
  };

  @action
  addSelector = selector => {
    if (!(this.curSelectorKey && this.curSelectorValue)) {
      return this.showMsg('please input selector key and value');
    }
    if (_.find(this.selectors, { key: this.curSelectorKey })) {
      return this.showMsg('selector key already exists');
    }

    this.selectors.push({
      key: this.curSelectorKey.trim(),
      value: this.curSelectorValue.trim()
    });

    this.curSelectorKey = '';
    this.curSelectorValue = '';
  };

  @action
  removeSelector = key => {
    this.selectors = this.selectors.filter(selector => {
      return selector.key !== key;
    });
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
      key: this.curLabelKey.trim(),
      value: this.curLabelValue.trim()
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

  toQueryString(items) {
    return items.map(item => [item.key, item.value].join('=')).join('&');
  }

  @action
  handleSubmit = async e => {
    e.preventDefault();
    this.isLoading = true;
    const { providers, visibility, protocolType, accessKey, secretKey, labels, selectors } = this;

    let fd = new FormData(e.target);
    let data = {};
    for (let p of fd.entries()) {
      data[p[0]] = p[1];
    }

    if (_.isEmpty(providers)) {
      this.isLoading = false;
      return this.showMsg('please select at least one provider');
    }

    if (_.isEmpty(selectors)) {
      this.isLoading = false;
      return this.showMsg('missing selectors');
    }

    if (_.isEmpty(labels)) {
      this.isLoading = false;
      return this.showMsg('missing labels');
    }

    if (protocolType === 's3') {
      data.credential = JSON.stringify({
        access_key_id: accessKey,
        secret_access_key: secretKey
      });

      // format s3 url
      if (!data.url.startsWith('s3://')) {
        data.url = 's3://' + data.url;
      }

      if (!s3UrlPattern.test(data.url)) {
        this.isLoading = false;
        return this.showMsg('invalid s3 url, should be like s3://s3.pek3a.qingstor.com/op-repo');
      }
    } else {
      let url = data.url;
      if (/^https?:\/\//.test(url)) {
        data.url = protocolType + '://' + url.match(/https?:\/\/(.+)/)[1];
      } else {
        data.url = protocolType + '://' + url;
      }

      // fixme: compat with http, https credential
      data.credential = '{}';
    }

    // fixme: both labels and selectors pass as query string
    data.selectors = selectors.map(selector => ({
      selector_key: selector.key,
      selector_value: selector.value
    }));

    data.labels = labels.map(label => ({
      label_key: label.key,
      label_value: label.value
    }));

    // data.selectors = this.toQueryString(selectors);
    // data.labels = this.toQueryString(labels);

    _.extend(data, {
      providers,
      visibility,
      type: protocolType
    });

    await this.create(data);

    if (_.get(this, 'repoCreated.repo')) {
      this.showMsg('create repo successfully');
    } else {
      let { errDetail } = this.repoCreated;
      this.showMsg(errDetail);
    }

    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  };

  @action
  async create(params) {
    params = typeof params === 'object' ? params : JSON.stringify(params);
    this.repoCreated = await this.request.post('repos', params);
  }

  @action
  reset() {
    this.hideMsg();

    this.providers = ['qingcloud'];
    this.visibility = 'public';
    this.protocolType = 'http';
    this.accessKey = '';
    this.secretKey = '';
    this.labels = [];
    this.curLabelKey = '';
    this.curLabelValue = '';
    this.selectors = [];
    this.curSelectorKey = '';
    this.curSelectorValue = '';
    this.repoCreated = null;
    this.isLoading = false;
  }
}
