#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const program = require('commander');
const chokidar = require('chokidar');
const debug = require('debug')('app');
const { root } = require('../../lib/utils');

const baseDir = 'src/locales';
const reserveFile = 'translation.json';
const validCmds = ['strip', 'merge'];

const getBaseDir = () => root(baseDir);

const getFilePath = (file, prefix = '') => {
  if (prefix.startsWith(getBaseDir())) {
    return path.resolve(prefix, file);
  }
  return path.resolve(getBaseDir(), prefix, file);
};

const isDir = file => fs.lstatSync(file).isDirectory();

const writeFileAsJson = (file, data) => {
  if (typeof data === 'object') {
    data = JSON.stringify(data, null, 2);
  }
  try {
    fs.writeFileSync(file, data, 'utf8');
    debug(`%s saved\n`, file);
  } catch (err) {
    throw err;
  }
};

const stripDupKeys = (file, write = true) => {
  // read file
  const cont = fs.readFileSync(file, { encoding: 'utf8' });
  if (write) {
    writeFileAsJson(file, JSON.parse(cont));
    return;
  }
  return JSON.parse(cont);
};

const mergeLocaleDir = (dir, write = true) => {
  // fixme: only handle first level files in src/locales
  debug(`Merging locale files in %s`, dir);

  const files = fs.readdirSync(dir);
  const merged = files
    .sort()
    .filter(f => f !== reserveFile)
    .reduce((acc, f) => {
      const filePath = getFilePath(f, dir);
      debug(`[merge] %s`, filePath);
      return Object.assign(acc, stripDupKeys(filePath, false));
    }, {});

  if (write) {
    writeFileAsJson(getFilePath(reserveFile, dir), merged);
    return;
  }
  return merged;
};

const help = () => {
  program.outputHelp();
  process.exit(1);
};

let curCmd = '';
let arg = '';

program
  .version('0.1.0', '-v, --version')
  .description(`Dashboard locale files mgmt cli`)
  .usage(
    `
    ./bin/locale strip <file>, Strip duplicate key in locale file
    ./bin/locale merge <dir>, Merge locale files in dir
    ./bin/locale merge all, Merge all locale files
    ./bin/locale merge all --watch, Merge all files on watch mode
  `
  )
  .option('-w, --watch', 'watch mode')
  .arguments('<cmd> <file|dir>')
  .action((cmd, file) => {
    curCmd = cmd;
    arg = file;
  })
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  help();
}

if (!validCmds.includes(curCmd)) {
  console.log('Unknown cmd: ', curCmd, '\n');
  help();
}

if (curCmd === 'strip') {
  const file = getFilePath(arg);
  if (isDir(file)) {
    const dirs = fs.readdirSync(file);
    dirs.forEach(f => {
      stripDupKeys(getFilePath(f, arg));
    });
  } else {
    stripDupKeys(file);
  }
}

if (curCmd === 'merge') {
  if (arg === 'all') {
    ['en', 'zh'].forEach(dir => {
      mergeLocaleDir(getFilePath(dir));
    });

    if (program.watch) {
      const watcher = chokidar.watch(getBaseDir(), {
        ignored: /translation\.json/
      });

      watcher.on('change', file => {
        debug('[watch locale]: %s', file);
        if (file.endsWith('.json')) {
          mergeLocaleDir(path.dirname(file));
        }
      });
    }

    return;
  }

  const file = getFilePath(arg);

  if (!isDir(file)) {
    console.error(`${file} is not dir`);
    return;
  }

  mergeLocaleDir(file);
}
