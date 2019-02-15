/*
 proxy server for websocket

 Since in production, `api-gateway` container will not expose ip,
 so in browser we can't connect websocket server directly.
 But `dashboard` container is linked with `api-gateway` container,
 we can use dashboard server as proxy node
*/

const parseUrl = require('url').parse;
const httpProxy = require('http-proxy');
const logger = require('./logger');

/**
 *
 * @param targetUrl  target websocket endpoint, example: ws://139.198.4.179:9100
 * @param proxyPort
 */
const runProxyServer = (targetUrl, proxyPort) => {
  if (!targetUrl) {
    throw Error('bad socket url endpoint');
  }

  const urlParts = parseUrl(targetUrl);

  const proxy = httpProxy.createProxyServer({
    target: {
      protocol: urlParts.protocol,
      host: urlParts.hostname,
      port: urlParts.port
    },
    ws: true
    // changeOrigin: true
  });

  proxy.listen(proxyPort, HOSTNAME);
  logger.info(
    `Websocket proxy server running at %s`,
    `${HOSTNAME}:${proxyPort}`
  );

  // proxy.on('proxyReqWs', (proxyReq, req, res)=> {
  //   logger.info('send proxy request');
  // })
  //
  // proxy.on('proxyRes', (proxyRes, req, res)=> {
  //   logger.info('proxy response data: ', proxyRes);
  // })

  proxy.on('open', proxySock => {
    logger.info('open proxy sock');

    proxySock.on('data', data => {
      logger.info('proxy recv data: ', data);
    });
  });

  proxy.on('error', err => {
    logger.error('proxy err: ', err);
  });

  // proxy.on('upgrade', (req, socket, head)=> {
  //   proxy.ws(req, socket, head)
  // })
};

module.exports = {
  run: runProxyServer
};
