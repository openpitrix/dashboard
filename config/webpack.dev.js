const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.base.js');
const postCssOptions = require('./postcss.options');

const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');

const webpackIsomorphicToolsPlugin =
  new WebpackIsomorphicToolsPlugin(require('./isomorphic-config'))
    .development();

const root = (dir) => path.resolve(__dirname, '..', dir);

const port = 3002;

Object.assign(config, {
  cache: true,
  // devtool: 'eval-source-map',
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

config.module.loaders.push({
  test: /\.s[ac]ss$/,
  use: [
    'style-loader',
    {
      loader: 'css-loader',
      options: {
        minimize: false,
        importLoaders: 1,
        localIdentName: '[folder]__[local]___[hash:base64:5]',
        modules: true,
      },
    },
    {
      loader: 'postcss-loader',
      options: postCssOptions,
    },
    { loader: 'sass-loader' },
  ],
  include: [root('src')],
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
  webpackIsomorphicToolsPlugin,
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
}).listen(port, '127.0.0.1', (err) => {
  if (err) return console.error(err);

  console.info(`Running on port ${port}`);
});
