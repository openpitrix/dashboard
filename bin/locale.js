#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const program = require('commander');
const { root } = require('../lib/utils');

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
    console.log(`${file} saved \n`);
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
  console.log(`Merging locale files in ${dir}`);

  const files = fs.readdirSync(dir);
  const merged = files
    .sort()
    .filter(f => f !== reserveFile)
    .reduce((acc, f) => {
      const filePath = getFilePath(f, dir);
      console.log(`[merge] ${filePath}`);
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
  `
  )
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
    // todo: refactor later
    ['en', 'zh'].forEach(dir => {
      mergeLocaleDir(getFilePath(dir));
    });

    process.exit(0);
  }

  const file = getFilePath(arg);

  if (!isDir(file)) {
    console.warn(`${file} is not dir`);
    process.exit(-1);
  }

  mergeLocaleDir(file);
}
