import { observable, action } from 'mobx';
import Store from '../Store';
import { getFormData } from 'utils';
import _, { assign, get } from 'lodash';

export default class AppDeployStore extends Store {
  @observable versions = [];
  @observable subnets = [];
  @observable files = {};
  @observable config = {};
  @observable configData = '';
  @observable paramsData = '';
  @observable configBasics = [];
  @observable configNodes = [];
  @observable configEnvs = [];
  @observable appId = '';
  @observable versionId = '';
  @observable runtimeId = '';
  @observable subnetId = '';
  @observable isLoading = false;

  @action
  changeCell = (value, item, params) => {
    if (
      (item.type === 'string' && !item.range) ||
      (item.max && !item.step) ||
      item.key === 'description'
    ) {
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
  changeRuntime = runtimeId => {
    this.runtimeId = runtimeId;
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
    let check = this.setConfigData(this.configData);
    if (check !== 'ok') {
      this.showMsg('Please input or select ' + check + '!');
    } else {
      this.isLoading = true;
      let params = {
        app_id: this.appId,
        version_id: this.versionId,
        runtime_id: this.runtimeId,
        conf: this.paramsData
      };
      await this.create(params);
    }
  };

  setConfigData = data => {
    let checkResult = 'ok';
    this.paramsData = data;
    for (let i = 0; i < this.configBasics.length; i++) {
      let basic = this.configBasics[i];
      if (basic.key === 'subnet') {
        this.configBasics[i].default = basic.default = this.subnetId;
      }
      if (basic.required && !basic.default) {
        checkResult = basic.label;
        break;
      }
      this.changeConfigData(basic, 'cluster');
    }
    for (let i = 0; i < this.configNodes.length; i++) {
      let node = this.configNodes[i];
      for (let j = 0; j < node.properties.length; j++) {
        if (node.properties[j].required && !node.properties[j].default) {
          checkResult = node.properties[j].label;
          break;
        }
        this.changeConfigData(node.properties[j], 'cluster', node.key);
      }
    }
    for (let i = 0; i < this.configEnvs.length; i++) {
      let env = this.configEnvs[i];
      for (let j = 0; j < env.properties.length; j++) {
        this.changeConfigData(env.properties[j], 'env', env.key);
        if (env.properties[j].required && !env.properties[j].default) {
          checkResult = env.properties[j].label;
          break;
        }
      }
    }
    this.paramsData = this.paramsData.replace(/\s/g, '');
    this.paramsData = this.paramsData.replace(/\"/g, '"');
    return checkResult;
  };

  changeConfigData = (item, root, parent) => {
    let location = '{{.';
    if (parent) {
      location += root + '.' + parent + '.' + item.key + '}}';
    } else {
      location += root + '.' + item.key + '}}';
    }
    this.paramsData = this.paramsData.replace(location, item.default);
  };

  @action
  async fetchVersions(params = {}, flag) {
    this.isLoading = true;
    const result = await this.request.get('app_versions', params);
    this.versions = get(result, 'app_version_set', []);
    this.versionId = get(this.versions[0], 'version_id');
    this.isLoading = false;
    if (flag) await this.fetchFiles(get(this.versions[0], 'version_id'));
  }

  @action
  async fetchSubnets() {
    let runtimeId = 'runtime-3wOkjGKn5vvr';
    this.isLoading = true;
    const result = await this.request.get(`clusters/subnets`, { runtime_id: runtimeId });
    this.subnets = get(result, 'subnet_set', []);
    this.isLoading = false;
  }

  @action
  async fetchFiles(versionId) {
    this.isLoading = true;
    const result = await this.request.get(`app_version/package/files`, {
      version_id: versionId
    });
    this.files = get(result, 'files', {});
    if (this.files['config.json']) {
      const config = JSON.parse(atob(this.files['config.json']));
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
    if (this.files['cluster.json.tmpl']) {
      this.configData = atob(this.files['cluster.json.tmpl']);
    }
    this.isLoading = false;
  }

  @action
  async create(params) {
    this.isLoading = true;
    const result = await this.request.post(`clusters/create`, params);
    this.isLoading = false;
  }
}
