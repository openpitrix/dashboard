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
    let serverUrl = process.env.serverUrl || getServerConfig('serverUrl');

    let apiVer = process.env.apiVersion || getServerConfig('apiVersion') || 'v1';

    // attach socket server
    let socketUrl = process.env.socketUrl || getServerConfig('socketUrl');

    if (!serverUrl.startsWith('http')) {
      serverUrl = 'http://' + serverUrl;
    }

    if (!socketUrl.startsWith('ws://')) {
      socketUrl = 'ws://' + socketUrl;
    }

    // url.resolve need first string starts with http
    ctx.store.apiServer = url.resolve(serverUrl, apiVer);
    ctx.store.socketUrl = socketUrl;

    await next();
  } catch (err) {
    ctx.app.reportErr(err, ctx);
  }
};
