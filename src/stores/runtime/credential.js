import { observable, action } from 'mobx';
import _ from 'lodash';

import Store from '../Store';

export default class RuntimeCredentialStore extends Store {
  defaultStatus = ['active'];

  @observable isLoading = false;

  @observable credentials = [];

  // last created resource
  @observable credential = {};

  @observable runtimeZones = [];

  @observable credentialCount = 0;

  get actionName() {
    return this.getUser().isDev
      ? 'debug_runtimes/credentials'
      : 'runtimes/credentials';
  }

  @action
  fetchAll = async params => {
    params = this.normalizeParams(params);

    this.isLoading = true;
    const res = await this.request.get(this.actionName, params);
    this.credentials = _.get(res, 'runtime_credential_set', []);
    this.credentialCount = _.get(res, 'total_count', 0);
    this.isLoading = false;
  };

  @action
  validate = async (params = {}) => {
    this.isLoading = true;
    const res = await this.request.post(
      'runtimes/credentials:validate',
      params
    );
    this.isLoading = false;
    return res;
  };

  @action
  create = async (params = {}) => {
    this.isLoading = true;
    const res = await this.request.post(this.actionName, params);
    if (_.isObject(res) && res.runtime_credential_id) {
      this.credential = { ...res };
    }
    this.isLoading = false;
    return res;
  };

  @action
  modify = async (params = {}) => {
    this.isLoading = true;
    const res = await this.request.patch('runtimes/credentials', params);
    if (_.isObject(res) && res.runtime_credential_id) {
      this.credential = { ...res };
    }
    this.isLoading = false;
    return res;
  };

  @action
  fetchZonesByCredential = async credential_id => {
    this.isLoading = true;
    const res = await this.request.get('runtimes/zones', {
      runtime_credential_id: credential_id
    });
    this.runtimeZones = _.get(res, 'zone', []);
    this.isLoading = false;
    return this.runtimeZones;
  };
}
