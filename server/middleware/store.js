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
    const config = getServerConfig();

    // Create state for SSR
    ctx.store = rootStore;

    ctx.store.config = config;

    // attach api server to ctx
    let serverUrl = process.env.serverUrl || config.serverUrl;

    let apiVer = process.env.apiVersion || config.apiVersion || 'v1';

    // attach socket server
    let socketUrl = process.env.socketUrl || config.socketUrl;

    if (!serverUrl.startsWith('http')) {
      serverUrl = 'http://' + serverUrl;
    }

    if (!socketUrl.startsWith('ws://')) {
      socketUrl = 'ws://' + socketUrl;
    }

    const clientId = config.clientId;
    const clientSecret = config.clientSecret;
    // url.resolve need first string starts with http
    ctx.store.apiServer = url.resolve(serverUrl, apiVer);
    ctx.store.socketUrl = socketUrl;
    ctx.store.clientId = clientId;
    ctx.store.clientSecret = clientSecret;

    await next();
  } catch (err) {
    ctx.app.reportErr(err, ctx);
  }
};
