const utils = require('../../lib/utils');

module.exports = {
  getPageUrl: (suffix = '') => {
    const host = utils.getServerConfig('host') || 'localhost';
    const port = utils.getServerConfig('port') || 8000;
    let url = !host.startsWith('http') ? `http://${host}:${port}` : `${host}:${port}`;
    if (suffix) {
      if (!suffix.startsWith('/')) {
        suffix = '/' + suffix;
      }
      return `${url}${suffix}`;
    }
    return url;
  }
};
