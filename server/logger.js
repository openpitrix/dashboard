const debug = require('debug')('app');
const pick = require('lodash/pick');

const logger = (params = {}) => {
  params = pick(params, ['method', 'url', 'body']);
  debug(
    '[api] %s -- %s %s -- %o',
    new Date().toLocaleString(),
    params.method.toUpperCase(),
    params.url,
    params.body
  );
};

module.exports = logger;
