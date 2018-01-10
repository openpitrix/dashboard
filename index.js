require('./core/logger');
const fs = require('fs');
const semver = require('semver');
const { fork } = require('child_process');
const { debounce } = require('lodash');

if (semver.lt(process.version, '7.6.0')) {
  console.error('Node Version should be greater than 7.6.0');
  return;
}

['webpack-assets.json', 'webpack-stats.json'].forEach((path) => {
  fs.existsSync(path) && fs.unlinkSync(path);
});

const dirs = ['./server/**/*.js'];
const args = process.argv.slice(2);

if (args.includes('--dev')) {
  process.env.NODE_ENV = 'development';
  let server = fork('./core/server');
  require('./config/webpack.dev');

  // Run server
  const chokidar = require('chokidar');
  const watcher = chokidar.watch(dirs);
  const restart = debounce(() => {
    server.kill();
    server.on('exit', () => {
      console.server('✓ SERVER RESTART');
      server = fork('./core/server');
    });
  }, 100);

  watcher.on('ready', () => {
    watcher.on('all', restart);
  });
}

if (args.includes('--prod') || process.env.NODE_ENV === 'production') {
  process.env.NODE_ENV = 'production';
  require('./core/server');
  fork('./config/webpack.prod');
}
