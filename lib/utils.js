const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const appRoot = require('app-root-path');

const root = dir => appRoot.resolve(dir || '');

/**
 *
 * @param filePath
 * @returns {*} json formatted content
 */
const loadYaml = filePath => {
  try {
    return yaml.safeLoad(fs.readFileSync(filePath), 'utf8');
  } catch (e) {
    return false;
  }
};

/**
 * get server side configuration
 *
 * @returns {*|{}}
 */
const getServerConfig = () => {
  // parse config yaml
  let config = loadYaml(root('server/config.yml')) || {};
  let tryFile = root('server/local_config.yml');
  if (fs.existsSync(tryFile)) {
    // merge local_config
    let local_config = loadYaml(tryFile);
    if (typeof local_config === 'object') {
      Object.assign(config, local_config);
    }
  }
  return config;
};

module.exports = {
  root,
  loadYaml,
  getServerConfig,
};
