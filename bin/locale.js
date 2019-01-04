#!/usr/bin/env node

const program = require('commander');

const baseDir = 'src/locales';

const stripDupKeys = file => {};

const mergeLocaleDir = dir => {};

const help = () => {
  program.outputHelp();
  process.exit(1);
};

let curCmd = '';
let curArgs = [];

program
  .version('0.1.0', '-v, --version')
  .description(`Dashboard locale files mgmt cli`)
  .usage(
    `
    locale strip <file>, Strip duplicate key in locale file
    locale merge <dir>, Merge locale files in dir
  `
  )
  .arguments('cmd <args>')
  .action((cmd, args) => {
    curCmd = cmd;
    curArgs = args;
  });

if (!process.argv.slice(2).length) {
  help();
}

// if(!['strip', 'merge'].includes(curCmd)){
//   console.log('Unknown cmd: ', curCmd, curArgs, '\n');
//   help();
// }

program.parse(process.argv);
