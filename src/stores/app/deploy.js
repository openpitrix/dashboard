import { action } from 'mobx';
import _ from 'lodash';
import { Base64 } from 'js-base64';
import yamlJs from 'js-yaml';

import { flattenObject } from 'utils';

import Store from '../Store';

export default class AppDeployStore extends Store {
  constructor(...args) {
    super(...args);

    this.steps = 1;
    this.configJson = {};

    this.defineObservables(function () {
      this.versions = [];

      this.runtimes = [];

      this.subnets = [];

      this.versionId = '';

      this.runtimeId = '';

      this.isLoading = false;

      this.isK8s = false;

      this.errMsg = '';

      this.yamlStr = '';

      this.activeStep = 1;

      this.disableNextStep = false;
    });
  }

  get appStore() {
    return this.getStore('app');
  }

  get runtimeStore() {
    return this.getStore('runtime');
  }

  get createActionName() {
    return this.getUser().isUserPortal
      ? 'clusters/create'
      : 'debug_clusters/create';
  }

  normalizeSubnets = () => this.subnets.map(({ subnet_id }) => ({
    name: subnet_id,
    value: subnet_id
  }));

  @action
  setErrMsg = (msg = '') => {
    this.errMsg = msg;
  };

  @action
  changeRuntime = async runtimeId => {
    this.runtimeId = runtimeId;
    if (!this.isK8s) {
      await this.fetchSubnetsByRuntime(runtimeId);
    }
  };

  @action
  changeVersion = async versionId => {
    this.versionId = versionId;
    await this.fetchFilesByVersion(versionId);
  };

  yaml2Json = yaml_str => flattenObject(yamlJs.safeLoad(yaml_str));

  @action
  changeHelmYaml = (str = '') => {
    this.yamlStr = str;
  };

  @action
  fetchVersions = async (params = {}) => {
    this.isLoading = true;
    if (!params.status) {
      params.status = [
        'draft',
        'submitted',
        'passed',
        'rejected',
        'active',
        'suspended'
      ];
    }
    params.bypass_auth = true;
    const result = await this.request.get('app_versions', params);
    this.versions = _.get(result, 'app_version_set', []);
    this.isLoading = false;
  };

  @action
  fetchRuntimes = async (params = {}) => {
    this.isLoading = true;

    await this.runtimeStore.fetchAll(
      _.assign({ limit: this.maxLimit, status: 'active' }, params)
    );
    this.runtimes = this.runtimeStore.runtimes;
    this.runtimeId = _.get(this.runtimes, '[0].runtime_id', '');

    if (!this.isK8s && this.runtimeId) {
      await this.fetchSubnetsByRuntime(this.runtimeId);
    }
    this.isLoading = false;
  };

  @action
  fetchSubnetsByRuntime = async runtimeId => {
    const result = await this.request.get(`clusters/subnets`, {
      runtime_id: runtimeId,
      limit: this.maxLimit
    });
    this.subnets = _.get(result, 'subnet_set', []);
  };

  @action
  fetchFilesByVersion = async versionId => {
    this.isLoading = true;
    const result = await this.request.get(`app_version/package/files`, {
      version_id: versionId
      // files: this.isK8s ? ['values.yaml'] : ['config.json']
    });

    const files = _.get(result, 'files', {});

    if (files['config.json']) {
      this.configJson = JSON.parse(Base64.decode(files['config.json']));
    } else if (files['values.yaml']) {
      this.yamlStr = Base64.decode(files['values.yaml']);
    } else {
      this.errMsg = 'Invalid config file, failed to render page';
      this.yamlStr = '';
    }

    this.isLoading = false;
  };

  @action
  create = async (params = {}) => await this.request.post(this.createActionName, params);
}
