import { observable, action } from 'mobx';
import Store from '../Store';
import _ from 'lodash';
import { getFormData } from 'utils';

const s3UrlPattern = /^s3:\/\/s3\.(.+)\.(.+)\/(.+)\/?$/; // s3.<zone>.<host>/<bucket>

export default class RepoCreateStore extends Store {
  @observable repoId = '';
  @observable name = '';
  @observable description = '';
  @observable providers = ['qingcloud'];
  @observable visibility = 'public';
  @observable protocolType = 'http'; // http, https, s3
  @observable url = '';
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
  changeName = e => {
    this.name = e.target.value;
  };

  @action
  changeDescription = e => {
    this.description = e.target.value;
  };

  @action
  changeUrl = e => {
    this.url = e.target.value;
  };

  @action
  changeProviders = providers => {
    this.providers = [providers];
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
  addSelector = () => {
    this.selectors.push({
      label_key: '',
      label_value: ''
    });
  };

  @action
  removeSelector = () => {
    this.selectors.splice(this.selectors.length - 1, 1);
  };

  @action
  addLabel = () => {
    this.labels.push({
      label_key: '',
      label_value: ''
    });
  };

  @action
  removeLabel = () => {
    this.labels.splice(this.labels.length - 1, 1);
  };

  @action
  changeLabel = (value, index, type, labelType) => {
    if (labelType === 'label') {
      this.labels[index]['label_' + type] = value;
    } else if (labelType === 'selector') {
      this.selectors[index]['label_' + type] = value;
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

  toQueryString(items) {
    return items.map(item => [item.label_key, item.label_value].join('=')).join('&');
  }

  @action
  handleSubmit = async e => {
    e.preventDefault();
    const { providers, visibility, protocolType, accessKey, secretKey, labels, selectors } = this;

    const data = getFormData(e.target);

    if (_.isEmpty(providers)) {
      return this.showMsg('please select at least one provider');
    }

    for (let i = 0; i < this.selectors.length; i++) {
      let item = this.selectors[i];
      if (item.label_key && _.isEmpty(item.label_value)) {
        return this.showMsg('Runtime Selector missing value');
      } else if (item.label_value && _.isEmpty(item.label_key)) {
        return this.showMsg('Runtime Selector missing key');
      }
    }
    for (let i = 0; i < this.labels.length; i++) {
      let item = this.labels[i];
      if (item.label_key && _.isEmpty(item.label_value)) {
        return this.showMsg('Labels missing value');
      } else if (item.label_value && _.isEmpty(item.label_key)) {
        return this.showMsg('Labels missing key');
      }
    }
    /* if (_.isEmpty(selectors)) {
      this.isLoading = false;
      return this.showMsg('missing selectors');
    }

    if (_.isEmpty(labels)) {
      this.isLoading = false;
      return this.showMsg('missing labels');
    }*/

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
      selector_key: selector.label_key,
      selector_value: selector.label_value
    }));

    data.labels = labels.map(label => ({
      label_key: label.label_key,
      label_value: label.label_value
    }));

    // data.selectors = this.toQueryString(selectors);
    // data.labels = this.toQueryString(labels);

    _.extend(data, {
      providers,
      visibility,
      type: protocolType
    });

    this.isLoading = true;
    if (this.repoId) {
      _.extend(data, { repo_id: this.repoId });
      await this.modifyRepo(data);
    } else {
      await this.create(data);
    }

    if (_.get(this, 'repoCreated.repo')) {
      this.showMsg('Create repo successfully');
    }
    if (_.get(this, 'repoCreated.repo_id')) {
      this.showMsg('Modify repo successfully');
      this.repoCreated.repo = this.repoCreated.repo_id;
    } else {
      let { errDetail } = this.repoCreated;
      this.showMsg(errDetail);
    }

    this.isLoading = false;
  };

  @action
  async create(params) {
    params = typeof params === 'object' ? params : JSON.stringify(params);
    this.repoCreated = await this.request.post('repos', params);
  }

  @action
  async modifyRepo(params) {
    params = typeof params === 'object' ? params : JSON.stringify(params);
    this.repoCreated = await this.request.patch('repos', params);
  }

  @action
  reset() {
    this.hideMsg();

    this.repoId = '';
    this.name = '';
    this.description = '';
    this.url = '';
    this.providers = ['qingcloud'];
    this.visibility = 'public';
    this.protocolType = 'http';
    this.accessKey = '';
    this.secretKey = '';
    this.labels = [{ label_key: '', label_value: '' }];
    this.curLabelKey = '';
    this.curLabelValue = '';
    this.selectors = [{ label_key: '', label_value: '' }];
    this.curSelectorKey = '';
    this.curSelectorValue = '';
    this.repoCreated = null;
    this.isLoading = false;
  }

  @action
  setRepo = detail => {
    if (detail) {
      this.repoId = detail.repo_id;
      this.name = detail.name;
      this.description = detail.description;
      this.url = detail.url;
      this.protocolType = detail.type;
      this.providers = detail.providers;
      this.visibility = detail.visibility;
      this.labels = detail.labels || [{ label_key: '', label_value: '' }];
      this.selectors = detail.selectors || [];
      if (this.selectors.length > 0) {
        this.selectors = this.selectors.map(item => ({
          label_key: item.selector_key,
          label_value: item.selector_value
        }));
      } else {
        this.selectors = [{ label_key: '', label_value: '' }];
      }
    }
  };
}
