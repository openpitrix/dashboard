import _ from 'lodash';

import factory, { isNodeItem } from './section';

const defaultOptions = {};

const CLUSTER_KEY = 'cluster';
const NAME_KEY = 'name';
const DESC_KEY = 'description';
const SUBNET_KEY = 'subnet';

export default class VMConfigParser {
  constructor(config, options = {}) {
    this.setConfig(config);
    this.options = _.extend(defaultOptions, options);
    this.clusterSetting = this.getConfigByKey(CLUSTER_KEY);
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
      _.isObject(config) && typeof config.type === 'string' && Array.isArray(config.properties)
    );
  }

  getConfigByKey = (config, key) => {
    if (typeof config === 'string' && !key) {
      key = config;
      config = null;
    }

    if (typeof key !== 'string') {
      throw Error(`key should be string, but given `, typeof key);
    }

    config = config || this.config;
    const properties = config.properties || config;

    if (_.isArray(properties)) {
      return _.find(properties, { key });
    }
    if (_.isObject(properties)) {
      return _.extend({}, properties[key], { key });
    }
  };

  getBasicSetting = () => {
    const setting = [];
    const nameConf = this.getConfigByKey(this.clusterSetting, NAME_KEY);
    const descConf = this.getConfigByKey(this.clusterSetting, DESC_KEY);

    // preload settings
    const runtimeConf = factory({
      key: 'runtimes',
      renderType: 'radio',
      range: []
    });
    const versionConf = factory({
      key: 'versions',
      items: []
    });

    setting.push(factory(nameConf), factory(descConf), runtimeConf, versionConf);

    return setting;
  };

  getNodeSetting = () => {
    return factory(_.filter(this.clusterSetting.properties, isNodeItem));
  };

  getVxnetSetting = () => {
    let vxnetConf = this.getConfigByKey(this.clusterSetting, SUBNET_KEY);
    if (!Array.isArray(vxnetConf)) {
      vxnetConf = [vxnetConf];
    }

    return factory(vxnetConf, { items: [] });
  };

  getEnvSetting = () => {
    // todo
    return [];
  };
}
