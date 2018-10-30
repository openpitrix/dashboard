import { observable, action } from 'mobx';
import _, { get } from 'lodash';
import { Base64 } from 'js-base64';
import yaml from 'js-yaml';

import Store from '../Store';
import { getFormData, flattenObject, unflattenObject, getYamlList } from 'utils';
import ts from 'config/translation';

export default class AppDeployStore extends Store {
  @observable versions = [];
  @observable runtimes = [];
  @observable subnets = [];

  @observable files = {};
  @observable config = {};

  // @observable configData = {
  //   cluster: {},
  //   env: {}
  // };

  @observable name = '';

  // @observable configBasics = [];
  // @observable configNodes = [];
  // @observable configEnvs = [];

  @observable yamlConfig = [];
  @observable yamlStr = '';

  // @observable appId = '';
  // @observable versionId = '';
  // @observable runtimeId = '';
  // @observable subnetId = '';

  @observable appDeployed = null;
  @observable isLoading = false;

  @observable loading = false;
  @observable isK8s = false;
  @observable errMsg = '';

  // checkResult = 'ok';

  configJson = {};

  reset() {
    this.versions = [];
    this.runtimes = [];
    this.subnets = [];
    this.errMsg = '';
    this.configJson = {};
  }

  normalizeRuntime = () => {
    return this.runtimes.map(({ runtime_id, name }) => ({
      name,
      value: runtime_id
    }));
  };

  normalizeVersions = () => {
    return this.versions.map(({ version_id, name }) => ({
      name,
      value: version_id
    }));
  };

  normalizeSubnets = () => {
    return this.subnets.map(({ subnet_id }) => ({ name: subnet_id, value: subnet_id }));
  };

  @action
  onChangeFormField = (fieldName, changedVal) => {
    console.log('change: ', fieldName, ' to ', changedVal);
  };

  // @action
  // changeCell = (value, item, params) => {
  //   const isInput =
  //     (item.type === 'string' && !item.range) ||
  //     (item.max && !item.step) ||
  //     item.key === 'description';
  //   if (isInput) {
  //     value = value.target.value;
  //   }
  //   item.default = value;
  //   if (params.type === 'basic') {
  //     this.configBasics.splice(params.index1, 1, item);
  //   } else if (params.type === 'node') {
  //     this.configNodes[params.index1].properties.splice(params.index2, 1, item);
  //   } else if (params.type === 'env') {
  //     this.configEnvs[params.index1].properties.splice(params.index2, 1, item);
  //   }
  // };

  @action
  changeYamlStr = value => {
    this.yamlStr = value;
  };

  @action
  changeYmalCell = (value, name, index) => {
    this.yamlConfig[index].value = value;
    this.yamlObj[name] = value;
  };

  @action
  changeName = event => {
    this.name = event.target.value;
  };

  @action
  changeRuntime = async runtimeId => {
    this.runtimeId = runtimeId;

    if (!this.isK8s) {
      await this.fetchSubnets(runtimeId);
    }
  };

  @action
  changeVersion = async versionId => {
    if (this.versionId !== versionId) {
      this.versionId = versionId;
      await this.fetchFilesByVersion(versionId);
    }
  };

  @action
  changeSubnet = subnetId => {
    this.subnetId = subnetId;
  };

  @action
  handleSubmit = async e => {
    e.preventDefault();

    let conf = null;

    if (this.isK8s) {
      conf = `Name: ${this.name}
${this.yamlStr}`;
      conf = conf.replace(/#.*/g, '');
    } else {
      this.getConfigData();
      conf = JSON.stringify(this.configData);
    }

    //fix config key contains '.'
    let params = {
      app_id: this.appId,
      version_id: this.versionId,
      runtime_id: this.runtimeId,
      conf: conf.replace(/>>>>>>/g, '.')
    };
    const res = await this.create(params);

    if (!res.err && _.get(this.appDeployed, 'cluster_id')) {
      this.success(ts('Deploy app successfully.'));
    } else {
      return res;
    }
  };

  // getConfigData = () => {
  //   let cluster = {}, env = {};
  //   this.checkResult = 'ok';
  //
  //   for (let i = 0; i < this.configBasics.length; i++) {
  //     let basic = this.configBasics[i];
  //     if (basic.key === 'subnet') {
  //       basic.default = this.subnetId;
  //     }
  //     if (basic.required && _.isEmpty(basic.default)) {
  //       this.checkResult = basic.label;
  //       break;
  //     }
  //     cluster[basic.key] = basic.default;
  //   }
  //
  //   for (let i = 0; i < this.configNodes.length; i++) {
  //     let node = this.configNodes[i];
  //     cluster[node.key] = {};
  //     for (let j = 0; j < node.properties.length; j++) {
  //       let value = node.properties[j].default;
  //       if (node.properties[j].required && _.isEmpty(_.toString(node.properties[j].default))) {
  //         this.checkResult = node.properties[j].label;
  //         break;
  //       }
  //       if (node.properties[j].type === 'integer') value = parseInt(value);
  //       cluster[node.key][node.properties[j].key] = value;
  //     }
  //   }
  //
  //   for (let i = 0; i < this.configEnvs.length; i++) {
  //     let temp = this.configEnvs[i];
  //     env[temp.key] = {};
  //     for (let j = 0; j < temp.properties.length; j++) {
  //       if (temp.properties[j].required && _.isEmpty(_.toString(temp.properties[j].default))) {
  //         this.checkResult = temp.properties[j].label;
  //         break;
  //       }
  //       env[temp.key][temp.properties[j].key] = temp.properties[j].default;
  //     }
  //   }
  //
  //   if (!this.runtimeId) {
  //     this.checkResult = 'Runtime';
  //   }
  //   this.configData = { cluster, env };
  // };

  @action
  fetchVersions = async (params = {}) => {
    if (!params.status) {
      params.status = ['draft', 'submitted', 'passed', 'rejected', 'active', 'suspended'];
    }
    params.isGlobalQuery = true;

    const result = await this.request.get('app_versions', params);
    this.versions = get(result, 'app_version_set', []);

    // this.versionId = get(this.versions[0], 'version_id');

    // if (fetchVersionFiles) {
    //   await this.fetchFilesByVersion(get(this.versions[0], 'version_id'));
    // }
  };

  @action
  fetchRuntimes = async (params = {}) => {
    this.isLoading = true;
    const result = await this.request.get('runtimes', params);
    this.runtimes = get(result, 'runtime_set', []);

    // if (this.runtimes.length > 0) {
    //   this.runtimeId = this.runtimes[0].runtime_id;
    //   if (!this.isK8s) {
    //     await this.fetchSubnets(this.runtimeId);
    //   }
    // } else {
    //   this.info('Not find Runtime data!');
    // }

    this.isLoading = false;
  };

  @action
  async fetchSubnets(runtimeId) {
    const result = await this.request.get(`clusters/subnets`, { runtime_id: runtimeId });
    this.subnets = get(result, 'subnet_set', []);

    // this.subnetId = this.subnets[0] ? this.subnets[0].subnet_id : '';
  }

  @action
  async fetchFilesByVersion(versionId, isK8s = false) {
    const files = isK8s ? ['values.yaml'] : ['config.json'];
    const result = await this.request.get(`app_version/package/files`, {
      version_id: versionId,
      files
    });

    this.files = get(result, 'files', {});

    if (this.files['config.json']) {
      this.configJson = JSON.parse(Base64.decode(this.files['config.json']));
    } else if (this.files['values.yaml']) {
      const yamlStr = Base64.decode(this.files['values.yaml']);
      this.yamlStr = yamlStr;
      this.yamlObj = flattenObject(yaml.safeLoad(yamlStr));
      this.yamlConfig = getYamlList(this.yamlObj);
    } else {
      // this.error('Not find config file!');
      this.errMsg = 'Invalid config file, failed to render page';
      this.yamlConfig = [];
      this.yamlStr = '';

      // this.configBasics = [];
      // this.configNodes = [];
      // this.configEnvs = [];
    }
  }

  @action
  async create(params) {
    this.isLoading = true;
    this.appDeployed = await this.request.post(`clusters/create`, params);
    this.isLoading = false;

    return this.appDeployed;
  }
}
