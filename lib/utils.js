const fs = require('fs');
const yaml = require('js-yaml');
const appRoot = require('app-root-path');
const chokidar = require('chokidar');
const deepmerge = require('deepmerge');

const debug = require('debug')('app');

// when node_modules is linked, app-root-path will fail to detect root dir
const appRootDir = (function () {
  const entry_file = require.main && require.main.filename;
  let rootDir;
  if (process.env.CWD) {
    rootDir = process.env.CWD;
  } else if (entry_file) {
    rootDir = entry_file.substring(
      0,
      entry_file.lastIndexOf('server/server.js')
    );
  } else {
    rootDir = process.cwd(); // not always consistent
  }
  return rootDir;
}());

appRoot.setPath(appRootDir);

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
const getServerConfig = (key = '') => {
  if (!Object.keys(serverConfig).length) {
    serverConfig = loadYaml(root('server/config.yml')) || {};
    const tryFile = root('server/local_config.yml');
    if (fs.existsSync(tryFile)) {
      // merge local_config
      serverConfig = deepmerge(serverConfig, loadYaml(tryFile));
    }
  }

  return key ? serverConfig[key] : serverConfig;
};

const cleanConfig = () => {
  serverConfig = {};
};

const watchConfig = () => {
  const watcher = chokidar.watch(
    [root('server/config.yml'), root('server/local_config.yml')],
    {
      ignored: /(^|[/\\])\../
    }
  );

  watcher.on('all', (event, path) => {
    debug(`${event}: ${path}`);
    cleanConfig();
  });
};

const watchServer = shouldWatch => {
  if (shouldWatch) {
    // watch server w/ lib change
    const watcher = chokidar.watch([root('server'), root('lib')]);

    watcher.on('ready', () => {
      watcher.on('all', () => {
        debug('Clearing */server/*, */lib/* module cache from server');

        Object.keys(require.cache).forEach(id => {
          if (/dashboard[/\\](server|lib)[/\\]/.test(id)) {
            debug(`remove cache of %s`, id);
            delete require.cache[id];
          }
        });
      });
    });
  }
};

module.exports = {
  root,
  loadYaml,
  getServerConfig,
  watchConfig,
  watchServer
};
