#!/usr/bin/env node

const webpack = require('webpack');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');

const args = process.argv.slice(2);

// const devConf = require('./webpack.dev');
const prodConf = require('./webpack.prod');

const statsOpt = {
  hash: true,
  version: true,
  timings: true,
  chunks: false,
  chunkModules: false,
  modules: false,
  children: false,
  colors: true,
  errorDetails: true
};

const runWebpack = config => {
  const compiler = webpack(config);
  // show progress
  compiler.apply(
    new ProgressPlugin({
      profile: true
    })
  );

  compiler.run((err, stats) => {
    if (err || stats.hasErrors()) {
      console.error('build err: ', err);
      return;
    }

    console.log('build done: ', stats.toString(statsOpt));
  });
};

if (args.includes('--prod-client')) {
  runWebpack(prodConf[0]);
}

if (args.includes('--prod-server')) {
  runWebpack(prodConf[1]);
}
