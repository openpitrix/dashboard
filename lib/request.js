import agent from 'superagent';
import _ from 'lodash';

const debug = require('debug')('app');

const agentOptions = {
  header: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  },
  timeout: {
    response: 20000,
    deadline: 30000
  }
};

const allowMethods = ['get', 'post', 'put', 'delete', 'patch'];
const excludeUrls = ['/login', '/logout'];
const delayExec = 1000;

class HttpAgent {
  static formalizeUrl = (url = '') => {
    url = url.trim();
    if (url.startsWith('http')) {
      return url;
    }

    if (!url.startsWith('/')) {
      url = `/${url}`;
    }

    if (!excludeUrls.includes(url) && !/^api\//.test(url)) {
      url = `/api${url}`;
    }

    // client side
    if (typeof window === 'object') {
      return `${location.protocol}//${location.host}${url}`;
    }

    // server side
    return `http://${global.HOSTNAME}:${global.PORT}${url}`;
  };

  static send = async (method, url, params, options = {}) => {
    const requestUrl = HttpAgent.formalizeUrl(url);
    method = method.toLowerCase();

    if (!allowMethods.includes(method)) {
      throw Error(`Not allow method: ${method}`);
    }

    try {
      const headers =
        method === 'get' ? _.omit(agentOptions.header, 'Content-Type') : agentOptions.header;
      if (!_.isEmpty(options.header)) {
        _.extend(headers, options.header);
      }

      const res = await agent[method](requestUrl)
        .timeout(_.extend(agentOptions.timeout, options.timeout))
        .set(headers)
        [method === 'get' ? 'query' : 'send'](params);

      return !_.isEmpty(res) && res.body ? res.body : {};
    } catch (err) {
      debug(`res err: %O`, err.message);

      if (err.timeout) {
        return {
          err: `Response timeout of ${agentOptions.timeout.response}ms exceeded`,
          status: 500
        };
      }

      return {
        err: err.message,
        status: err.statusCode || err.status || 500,
        errDetail: _.get(err, 'response.body.error', '')
      };
    }
  };

  static get(url, params) {
    return _.throttle(HttpAgent.send, delayExec).apply(null, ['GET', url, params]);
  }

  static post(url, params) {
    return _.throttle(HttpAgent.send, delayExec).apply(null, ['POST', url, params]);
  }
}

export default HttpAgent;
