import _ from 'lodash';

import factory, { isNodeItem } from './factory';

const defaultOptions = {};

const CLUSTER_KEY = 'cluster';
const NAME_KEY = 'name';
const DESC_KEY = 'description';
const SUBNET_KEY = 'subnet';
const ENV_KEY = 'env';

// setting placeholder
const defaultNameSetting = {
  key: 'name',
  label: 'Name',
  type: 'string',
  default: '',
  required: false
};

const defaultRuntimeSetting = {
  key: 'runtime',
  label: 'Runtime',
  renderType: 'radio',
  range: []
};

const defaultVersionSetting = {
  key: 'version',
  label: 'Version',
  items: [
    // {name: 'x1', value: 'v1'},
  ]
};

export default class VMConfigParser {
  constructor(config, options = {}) {
    this.config = config;
    this.options = _.extend(defaultOptions, options);

    this.runtimeConf = _.clone(defaultRuntimeSetting);
    this.versionConf = _.clone(defaultVersionSetting);
    this.vxnetConf = { items: [] };
  }

  setConfig(config = {}) {
    if (typeof config === 'string') {
      config = JSON.parse(config);
    }

    if (!this.validConfig(config)) {
      throw Error('invalid config input');
    }

    // config.json
    this.config = config;
  }

  validConfig(config) {
    return (
      _.isObject(config)
      && typeof config.type === 'string'
      && Array.isArray(config.properties)
    );
  }

  isReady() {
    return !_.isEmpty(this.config);
  }

  getConfigByKey(config, key) {
    if (typeof config === 'string' && !key) {
      key = config;
      config = null;
    }

    if (typeof key !== 'string') {
      throw Error(`key should be string, but ${typeof key} given`);
    }

    config = config || this.config;
    if (_.isEmpty(config)) {
      return;
    }

    const properties = config.properties || config;

    if (_.isArray(properties)) {
      return _.find(properties, { key });
    }
    if (_.isObject(properties)) {
      return _.extend({}, properties[key], { key });
    }
  }

  getClusterSetting() {
    return this.getConfigByKey(CLUSTER_KEY);
  }

  /**
   *  mock basic setting for helm app
   */
  getDefaultBasicSetting(override = {}) {
    const setting = [];
    const nameConf = _.clone(defaultNameSetting);
    setting.push(nameConf, this.runtimeConf, this.versionConf);

    if (!_.isEmpty(override)) {
      _.forEach(setting, item => {
        if (item.key === override.key) {
          _.extend(item, override);
        }
      });
    }

    return factory(setting, { keyPrefix: CLUSTER_KEY });
  }

  getBasicSetting() {
    const clusterSetting = this.getClusterSetting();
    const setting = [];
    const nameConf = this.getConfigByKey(clusterSetting, NAME_KEY);
    const descConf = this.getConfigByKey(clusterSetting, DESC_KEY);

    setting.push(nameConf, descConf, this.runtimeConf, this.versionConf);

    return factory(setting, { keyPrefix: CLUSTER_KEY });
  }

  getNodeSetting() {
    const clusterSetting = this.getClusterSetting();
    return factory(_.filter(clusterSetting.properties, isNodeItem), {
      keyPrefix: 'node'
    });
  }

  getVxnetSetting() {
    return factory([this.vxnetConf], { keyPrefix: CLUSTER_KEY });
  }

  getEnvSetting() {
    const envSetting = this.getConfigByKey(ENV_KEY);
    return factory(_.get(envSetting, 'properties', []), {
      keyPrefix: 'env',
      labelPrefix: 'env'
    });
  }

  setRuntimes(runtimes = [], mergeProps) {
    this.runtimeConf.range = runtimes;
    !_.isEmpty(mergeProps) && _.extend(this.runtimeConf, mergeProps);
  }

  setVersions(versions = [], mergeProps) {
    this.versionConf.items = versions;
    !_.isEmpty(mergeProps) && _.extend(this.versionConf, mergeProps);
  }

  setSubnets(nets = [], mergeProps) {
    if (!this.vxnetConf.key) {
      const clusterSetting = this.getClusterSetting();

      if (!_.isEmpty(clusterSetting)) {
        _.extend(
          this.vxnetConf,
          this.getConfigByKey(clusterSetting, SUBNET_KEY)
        );
      }
    }

    this.vxnetConf.items = nets;

    !_.isEmpty(mergeProps) && _.extend(this.vxnetConf, mergeProps);
  }
}
