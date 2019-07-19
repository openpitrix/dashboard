import axios from 'axios';
import _ from 'lodash';
import qs from 'qs';
import { getHashByParams } from './mock';

const isBrowser = typeof window === 'object' && typeof window.document === 'object';
const mockApi = isBrowser && !!process.env.MOCKAPI;

const debug = require('debug')('app');

const agent = axios.create({
  timeout: 20000,
  maxContentLength: 200 * 1000,
  // not reject response with any status
  validateStatus: status => true
});

const excludeUrls = ['/login', '/logout'];
const excludeMockEndpoints = ['oauth2/token'];
const delayExec = 1000;

const normalizeUrl = (url = '') => {
  if (url.startsWith('http')) {
    return url;
  }

  if (!url.startsWith('/')) {
    url = `/${url}`;
  }

  if (!excludeUrls.includes(url) && !url.startsWith('/api/')) {
    url = `/api${url}`;
  }

  return url;
};

const formatErrDetails = details => _.map(details, row => {
  let str = '';
  _.each(row, (v, k) => {
    str += `${k}: ${v}\n`;
  });
  return str;
}).join('\n');

class HttpAgent {
  static send = async (method, url, params = {}, options = {}) => {
    method = method.toLowerCase();

    try {
      const config = {
        method,
        url: normalizeUrl(url)
      };
      config[method === 'get' ? 'params' : 'data'] = params;
      if (!_.isEmpty(options)) {
        _.extend(config, options);
      }
      if (method === 'get') {
        config.paramsSerializer = opts => qs.stringify(opts, { arrayFormat: 'repeat' });
      }

      const res = await agent.request(config);
      const { data } = res;

      if (
        _.isObject(data)
        && Array.isArray(data.details)
        && _.has(data, 'error')
      ) {
        let errMsg = data.error || data.message;
        const errDetails = formatErrDetails(data.details);
        if (errDetails) {
          errMsg += `\n\n${errDetails}`;
        }

        return {
          err: errMsg,
          status: 500
        };
      }

      return data;
    } catch (err) {
      if (err.response) {
        const {
          status, statusText, headers, config
        } = err.response;

        debug(`err with response: %O`, {
          status,
          statusText,
          headers,
          config
        });
        return {
          err: statusText,
          status
        };
      }

      if (err.message) {
        debug(`request error: %O`, err.message);

        return {
          err: err.message,
          status: err.status || 500
        };
      }

      debug(`Unknown request error: %O`, err);

      return {
        err: 'Unknown request error',
        status: 500
      };
    }
  };

  static get(url, params, options) {
    return _.throttle(HttpAgent.send, delayExec).apply(null, [
      'GET',
      url,
      params,
      options
    ]);
  }

  static post(url, params, options) {
    if (
      mockApi
      && !_.find(excludeMockEndpoints, endpoint => url.endsWith(endpoint))
    ) {
      // rewrite url in browser when in e2e mock mode
      url += `?_sid=${getHashByParams(params)}`;
    }
    return _.throttle(HttpAgent.send, delayExec).apply(null, [
      'POST',
      url,
      params,
      options
    ]);
  }
}

export default HttpAgent;
