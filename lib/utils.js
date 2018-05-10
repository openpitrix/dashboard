const fs = require('fs');
const yaml = require('js-yaml');
const appRoot = require('app-root-path');
const chokidar = require('chokidar');
const NodeCache = require('node-cache');

const root = dir => appRoot.resolve(dir || '');
const cache = global._pitrixCache || new NodeCache();
if (!global._pitrixCache) {
  global._pitrixCache = cache;
}

const server_conf_key = 'pitrix-server-conf-key';

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
  let config = cache.get(server_conf_key);
  if (!config) {
    // parse config yaml
    config = loadYaml(root('server/config.yml')) || {};
    const tryFile = root('server/local_config.yml');
    if (fs.existsSync(tryFile)) {
      // merge local_config
      const local_config = loadYaml(tryFile);
      if (typeof local_config === 'object') {
        Object.assign(config, local_config);
      }
    }
    cache.set(server_conf_key, config);
  }
  if (!config) {
    config = {};
  }
  return key ? config[key] : config;
};

const getCache = () => cache;

const watchServerConfig = () => {
  const watcher = chokidar.watch([root('server/config.yml'), root('server/local_config.yml')], {
    ignored: /(^|[/\\])\../,
    persistent: true
  });

  console.log('\n[server] watching config files..');
  watcher.on('all', (event, path) => {
    console.log(`[server] ${path} has been ${event}, flush internal cache..`);
    cache.flushAll();
  });
};

module.exports = {
  root,
  loadYaml,
  getCache,
  getServerConfig,
  watchServerConfig
};
