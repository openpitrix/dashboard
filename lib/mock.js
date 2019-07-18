const { parse } = require('url');
const crypto = require('crypto');
const { sortObjByKeys } = require('../src/utils/object');

const getUrlPath = url => {
  if (url.startsWith('/')) {
    return url;
  }
  return parse(url).pathname;
};

const md5 = str => crypto
  .createHash('md5')
  .update(str)
  .digest('hex');

// map xhr request params to hash code
// then append hash to request url
// because cypress match route only based on url and method
const getHashByParams = params => md5(JSON.stringify(sortObjByKeys(params)));

module.exports = {
  getUrlPath,
  md5,
  getHashByParams
};
