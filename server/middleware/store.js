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

  let apiVer = process.env.apiVersion || config.apiVersion || 'v1';

  let socketUrl = process.env.socketUrl || config.socketUrl;

  if (!serverUrl.startsWith('http')) {
    serverUrl = 'http://' + serverUrl;
  }
  if (!socketUrl.startsWith('ws://')) {
    socketUrl = 'ws://' + socketUrl;
  }

  // url.resolve need first string starts with http
  Object.assign(store, {
    config,
    socketUrl,
    apiServer: url.resolve(serverUrl, apiVer),
    clientId: process.env.clientId || config.clientId,
    clientSecret: process.env.clientSecret || config.clientSecret
  });

  ctx.store = store;

  await next();
};
