import { observable, action } from 'mobx';
import Store from '../Store';
import { getFormData } from 'utils';
import _, { assign, get } from 'lodash';
import { Base64 } from 'js-base64';

export default class AppDeployStore extends Store {
  @observable versions = [];
  @observable runtimes = [];
  @observable subnets = [];
  @observable files = {};
  @observable config = {};
  @observable
  configData = {
    cluster: {},
    env: {}
  };
  @observable paramsData = '';
  @observable configBasics = [];
  @observable configNodes = [];
  @observable configEnvs = [];
  @observable appId = '';
  @observable versionId = '';
  @observable runtimeId = '';
  @observable subnetId = '';
  @observable appDeployed = null;
  @observable isLoading = false;
  checkResult = 'ok';

  @action
  changeCell = (value, item, params) => {
    const isInput =
      (item.type === 'string' && !item.range) ||
      (item.max && !item.step) ||
      item.key === 'description';
    if (isInput) {
      value = value.target.value;
    }
    item.default = value;
    if (params.type === 'basic') {
      this.configBasics.splice(params.index1, 1, item);
    } else if (params.type === 'node') {
      this.configNodes[params.index1].properties.splice(params.index2, 1, item);
    } else if (params.type === 'env') {
      this.configEnvs[params.index1].properties.splice(params.index2, 1, item);
    }
  };

  @action
  changeRuntime = async runtimeId => {
    this.runtimeId = runtimeId;
    await this.fetchSubnets(runtimeId);
  };

  @action
  changeVersion = async versionId => {
    if (this.versionId !== versionId) {
      this.versionId = versionId;
      await this.fetchFiles(versionId);
    }
  };

  @action
  changeSubnet = subnetId => {
    this.subnetId = subnetId;
  };

  @action
  handleSubmit = async e => {
    e.preventDefault();
    this.getConfigData();
    if (this.checkResult === 'ok') {
      this.isLoading = true;
      let params = {
        app_id: this.appId,
        version_id: this.versionId,
        runtime_id: this.runtimeId,
        conf: JSON.stringify(this.configData)
      };
      await this.create(params);
      if (_.get(this, 'appDeployed.cluster_id')) {
        //this.showMsg('App deploy successfully.');
        location.href = '/dashboard/clusters';
      } else {
        let { errDetail } = this.appDeployed;
        this.showMsg(errDetail);
      }
      this.isLoading = false;
    } else {
      this.showMsg('Please input or select ' + this.checkResult + '!');
    }
  };

  getConfigData = () => {
    let cluster = {},
      env = {};
    this.checkResult = 'ok';
    for (let i = 0; i < this.configBasics.length; i++) {
      let basic = this.configBasics[i];
      if (basic.key === 'subnet') {
        basic.default = this.subnetId;
      }
      if (basic.required && _.isEmpty(basic.default)) {
        this.checkResult = basic.label;
        break;
      }
      cluster[basic.key] = basic.default;
    }
    for (let i = 0; i < this.configNodes.length; i++) {
      let node = this.configNodes[i];
      cluster[node.key] = {};
      for (let j = 0; j < node.properties.length; j++) {
        let value = node.properties[j].default;
        if (node.properties[j].required && _.isEmpty(_.toString(node.properties[j].default))) {
          this.checkResult = node.properties[j].label;
          break;
        }
        if (node.properties[j].type === 'integer') value = parseInt(value);
        cluster[node.key][node.properties[j].key] = value;
      }
    }
    for (let i = 0; i < this.configEnvs.length; i++) {
      let env = this.configEnvs[i];
      env[env.key] = {};
      for (let j = 0; j < env.properties.length; j++) {
        if (env.properties[j].required && _.isEmpty(_.toString(env.properties[j].default))) {
          this.checkResult = env.properties[j].label;
          break;
        }
        cluster[env.key][env.properties[j].key] = env.properties[j].default;
      }
    }
    if (!this.runtimeId) {
      this.checkResult = 'Runtime';
    }
    this.configData = { cluster, env };
  };

  changeConfigData = (item, root, parent) => {
    let location = '{{.';
    if (parent) {
      location += root + '.' + parent + '.' + item.key + '}}';
    } else {
      location += root + '.' + item.key + '}}';
    }
    if (item.type === 'integer') item.default = parseInt(item.default);
    this.paramsData = this.paramsData.replace(location, item.default);
  };

  @action
  async fetchVersions(params = {}, flag) {
    this.isLoading = true;
    const result = await this.request.get('app_versions', params);
    this.versions = get(result, 'app_version_set', []);
    this.versionId = get(this.versions[0], 'version_id');
    if (!flag) this.isLoading = false;
    if (flag) await this.fetchFiles(get(this.versions[0], 'version_id'));
  }

  @action
  fetchRuntimes = async () => {
    this.isLoading = true;
    const result = await this.request.get('runtimes', { status: this.defaultStatus });
    this.runtimes = get(result, 'runtime_set', []);
    if (this.runtimes[0]) {
      this.runtimeId = this.runtimes[0].runtime_id;
      await this.fetchSubnets(this.runtimes[0].runtime_id);
    }
    this.isLoading = false;
  };

  @action
  async fetchSubnets(runtimeId) {
    const result = await this.request.get(`clusters/subnets`, { runtime_id: runtimeId });
    this.subnets = get(result, 'subnet_set', []);
    if (this.subnets[0]) this.subnetId = this.subnets[0].subnet_id;
  }

  @action
  async fetchFiles(versionId) {
    const result = await this.request.get(`app_version/package/files`, {
      version_id: versionId
    });
    this.files = get(result, 'files', {});
    if (this.files['config.json']) {
      const config = JSON.parse(Base64.decode(this.files['config.json']));
      this.configBasics = _.filter(_.get(config, 'properties[0].properties'), function(obj) {
        return !obj.properties;
      });
      this.configNodes = _.filter(_.get(config, 'properties[0].properties'), function(obj) {
        return obj.properties;
      });
      this.configEnvs = _.filter(_.get(config, 'properties[1].properties'), function(obj) {
        return obj.properties;
      });
    } else {
      this.showMsg('Not find config file!');
    }
  }

  @action
  async create(params) {
    this.isLoading = true;
    this.appDeployed = await this.request.post(`clusters/create`, params);
    this.isLoading = false;
  }
}
