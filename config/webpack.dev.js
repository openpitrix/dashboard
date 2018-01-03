const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.base.js');

const root = (dir) => path.resolve(__dirname, '..', dir);

const port = 3002;

Object.assign(config, {
  cache: true,
  devtool: 'source-map',
  entry: {
    bundle: [
      'react-hot-loader/patch',
      `webpack-dev-server/client?http://localhost:${port}`,
      'webpack/hot/only-dev-server',
      root('src/index.js'),
    ],
  },
  output: {
    publicPath: `http://localhost:${port}/build/`,
    libraryTarget: 'var',
    pathinfo: true,
  },
});

config.plugins.push(
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
  new webpack.NamedModulesPlugin(),
  new webpack.WatchIgnorePlugin([
    root('core'),
    root('config'),
    root('build'),
  ]),
  new webpack.DefinePlugin({
    'process.env.DEV': true,
    'process.env.BROWSER': true,
    'process.env.NODE_ENV': JSON.stringify('development'),
  }),
);

const compiler = webpack(config);

new WebpackDevServer(compiler, {
  publicPath: config.output.publicPath,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Expose-Headers': 'SourceMap,X-SourceMap',
  },
  hot: true,
  historyApiFallback: true,
  watchOptions: {
    aggregateTimeout: 300,
    poll: false,
  },
  stats: {
    colors: true,
    hash: false,
    timings: false,
    version: false,
    chunks: false,
    modules: false,
    children: false,
    chunkModules: false,
  },
}).listen(port, '0.0.0.0', (err) => {
  if (err) return console.error(err);

  console.info(`Running on port ${port}`);
});
