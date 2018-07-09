const url = require('url');
const { useStaticRendering } = require('mobx-react');
const { getServerConfig } = require('lib/utils');
const RootStore = require('stores/RootStore').default;

useStaticRendering(true);

const rootStore = new RootStore();
rootStore.registerStores();

/**
 * Middleware for creating the store
 * @param ctx
 * @param next
 */
module.exports = async (ctx, next) => {
  try {
    // Create state for SSR
    ctx.store = rootStore;
    ctx.store.config = getServerConfig('app');

    // attach api server to ctx
    let serverUrl =
      process.env.serverUrl || getServerConfig('serverUrl') || 'http://localhost:9100';
    let apiVer = process.env.apiVersion || getServerConfig('apiVersion') || 'v1';

    if (!serverUrl.startsWith('http')) {
      serverUrl = 'http://' + serverUrl;
    }

    // url.resolve need first string starts with http
    ctx.store.apiServer = url.resolve(serverUrl, apiVer);

    await next();
  } catch (err) {
    ctx.app.reportErr(err, ctx);
  }
};
