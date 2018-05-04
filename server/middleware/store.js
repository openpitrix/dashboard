const { useStaticRendering } = require('mobx-react');
const { toJS } = require('mobx');
const { getServerConfig } = require('lib/utils');
const RootStore = require('stores/RootStore').default; // import esm

useStaticRendering(true);

const rootStore = toJS(new RootStore());

/**
 * Middleware for creating the store
 * @param ctx
 * @param next
 */
module.exports = async (ctx, next) => {
  // Create state for SSR
  ctx.store = rootStore;
  ctx.store.config = getServerConfig('app');
  ctx.store.serverUrl = getServerConfig('serverUrl');

  await next();
};
