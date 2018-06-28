const fs = require('fs');
const yaml = require('js-yaml');
const appRoot = require('app-root-path');
const chokidar = require('chokidar');
const deepmerge = require('deepmerge');
const log = require('./log');

const root = dir => appRoot.resolve(dir || '');

let serverConfig = {};

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
const getServerConfig = key => {
  if (!Object.keys(serverConfig).length) {
    serverConfig = loadYaml(root('server/config.yml')) || {};
    let tryFile = root('server/local_config.yml');
    if (fs.existsSync(tryFile)) {
      // merge local_config
      serverConfig = deepmerge(serverConfig, loadYaml(tryFile));
    }
  }

  return key ? serverConfig[key] : serverConfig;
};

const cleanServerConfig = () => {
  serverConfig = {};
};

const watchServerConfig = () => {
  const watcher = chokidar.watch([root('server/config.yml'), root('server/local_config.yml')], {
    ignored: /(^|[/\\])\../
  });

  log('watching config files..');
  watcher.on('all', (event, path) => {
    log(`${event}: ${path}`);
    cleanServerConfig();
  });
};

module.exports = {
  root,
  loadYaml,
  getServerConfig,
  cleanServerConfig,
  watchServerConfig
};
