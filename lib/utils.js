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

const watchFiles = (when, cb) => {
  // watch current dir
  const watcher = chokidar.watch(
    [root('config'), root('src'), root('lib'), root('server')],
    {
      // ignore dotfile, node_modules
      ignored: [/(^|[/\\])\../, /[/\\]node_modules[/\\]/]
    }
  );

  watcher.on('all', (evt, path) => {
    if (when(path, evt)) {
      debug(`[watchFile] ${evt}: ${path}`);
      typeof cb === 'function' && cb();
    }
  });
};

const watchConfig = cb => {
  watchFiles(
    path => /[/\\](local_)?config\.ya?ml$/.test(path),
    () => {
      serverConfig = {};
      cb();
    }
  );
};

module.exports = {
  root,
  loadYaml,
  getServerConfig,
  watchFiles,
  watchConfig
};
