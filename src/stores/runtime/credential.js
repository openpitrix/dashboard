import { observable, action } from 'mobx';
import _ from 'lodash';

import Store from '../Store';

export default class RuntimeCredentialStore extends Store {
  defaultStatus = ['active'];

  @observable isLoading = false;

  @observable credentials = [];

  @observable credentialCount = 0;

  @action
  fetchAll = async params => {
    params = this.normalizeParams(params);

    this.isLoading = true;
    const res = await this.request.get('runtimes/credentials', params);
    this.credentials = _.get(res, 'runtime_credential_set', []);
    this.credentialCount = _.get(res, 'total_count', 0);
    this.isLoading = false;
  };

  @action
  validate = async (params = {}) => {
    this.isLoading = true;
    const res = await this.request.get('runtimes/credentials:validate', params);
    this.isLoading = false;
    return res;
  };
}
