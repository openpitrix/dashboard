const url = require('url');

// initial state for client app store
const store = {};

/**
 * Middleware for creating the store
 * @param ctx
 * @param next
 */
module.exports = async (ctx, next) => {
  // local config for server
  const { config } = ctx.app;

  let serverUrl = process.env.serverUrl || config.serverUrl;

  const apiVer = process.env.apiVersion || config.apiVersion || 'v1';

  let socketUrl = process.env.socketUrl || config.socketUrl;

  if (!serverUrl.startsWith('http')) {
    serverUrl = `http://${serverUrl}`;
  }
  if (!socketUrl.startsWith('ws://')) {
    socketUrl = `ws://${socketUrl}`;
  }

  // url.resolve need first string starts with http
  let apiServer = url.resolve(serverUrl, apiVer);
  if (apiServer.endsWith('/')) {
    apiServer = apiServer.substring(0, apiServer.length - 1);
  }

  Object.assign(store, {
    config,
    socketUrl,
    apiServer,
    clientId: process.env.clientId || config.clientId,
    clientSecret: process.env.clientSecret || config.clientSecret
  });

  ctx.store = store;

  await next();
};
