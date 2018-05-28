const { useStaticRendering } = require('mobx-react');
// const { toJS } = require('mobx');
const { getServerConfig } = require('lib/utils');
const RootStore = require('stores/RootStore').default; // import esm

useStaticRendering(true);

const rootStore = new RootStore();

/**
 * Middleware for creating the store
 * @param ctx
 * @param next
 */
module.exports = async (ctx, next) => {
  // Create state for SSR
  ctx.store = rootStore;
  ctx.store.config = getServerConfig('app');

  // attach api server to ctx
  let serverUrl = (getServerConfig('serverUrl') || '').trim();
  let apiVer = (getServerConfig('apiVersion') || '').trim();
  serverUrl = serverUrl.endsWith('/') ? serverUrl.substr(0, serverUrl.length - 1) : serverUrl;
  apiVer = apiVer.startsWith('/') ? apiVer.substr(1) : apiVer;

  ctx.store.apiServer = `${serverUrl}/${apiVer}`;

  await next();
};
