import { observable, action } from 'mobx';
import Store from '../Store';
import { getFormData } from 'utils';
import _, { assign, get } from 'lodash';

export default class AppDeployStore extends Store {
  @observable versions = [];
  @observable subnets = [];
  @observable
  deploy = {
    runtime: 'public',
    version: '',
    cpu: '1-core',
    memory: '64GB',
    type: 'high',
    volume: 100,
    vxNet: '',
    ip: '',
    perNode: ''
  };
  @observable version = '';
  @observable vxNet = '';
  @observable perNode = '';
  @observable volume = 100;
  @observable isLoading = false;

  @action
  changeRuntime = runtime => {
    this.deploy.runtime = runtime;
  };

  @action
  changeVersion = version => {
    this.version = version;
    this.deploy.version = version;
  };

  @action
  changeDescription = e => {
    this.deploy.description = e.target.value;
  };

  @action
  changeCpu = cpu => {
    this.deploy.cpu = cpu;
  };

  @action
  changeMemory = memory => {
    this.deploy.memory = memory;
  };

  @action
  changeType = type => {
    this.deploy.type = type;
  };

  @action
  changeVolume = volume => {
    this.volume = volume;
    this.deploy.volume = volume;
  };
  @action
  changeVolumeInput = e => {
    let value = e.target.value;
    if (parseInt(value) > 1000 || parseInt(value) < 10) value = 10;
    console.log(value);
    this.volume = value;
    this.deploy.volume = value;
  };

  @action
  changeVxNet = vxNet => {
    this.vxNet = vxNet;
    this.deploy.vxNet = vxNet;
  };

  @action
  changeIp = ip => {
    this.deploy.ip = ip;
  };

  @action
  changePerNode = perNode => {
    this.perNode = perNode;
    this.deploy.perNode = perNode;
  };

  @action
  handleSubmit = async e => {
    e.preventDefault();
    this.isLoading = true;
    const data = getFormData(e.target);
    _.extend(data, this.deploy);
  };

  @action
  async fetchVersions(appId) {
    this.isLoading = true;
    const result = await this.request.get('app_versions', {
      sort_key: 'create_time',
      app_id: appId
    });

    this.versions = get(result, 'app_version_set', []);
    this.isLoading = false;
  }

  @action
  async fetchSubnets() {
    this.isLoading = true;
    const result = await this.request.get(`clusters/subnets`);
    this.subnets = get(result, 'subnet_set', []);
    this.isLoading = false;
  }
}
