import axios from 'axios';
import _ from 'lodash';

const isBrowser = typeof window === 'object' && typeof window.document === 'object';

const needMockAPI = !isBrowser && process.env.MOCKAPI;
if (needMockAPI) {
  const config = require('./mock-api.config');
  // TODO: unset `superagentMock` after test;
  require('superagent-mock')(axios, config);
}

const debug = require('debug')('app');

const agent = axios.create({
  timeout: 20000,
  maxContentLength: 200 * 1000
});

const excludeUrls = ['/login', '/logout'];
const delayExec = 1000;

const appendCypressParams = params => {
  if (typeof window === 'object' && window.Cypress) {
    const _specName = _.get(window, 'Cypress.spec.name', {});
    Object.assign(params, {
      _specName,
      _testTitle: window.Cypress.cy.testCaseTitle
    });
  }
  return params;
};

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

      const res = await agent.request(config);
      const { data } = res;

      if (_.get(data, 'details[0].cause')) {
        return {
          err: _.get(data, 'details[0].cause', ''),
          status: 500
        };
      }

      return data;
    } catch (err) {
      if (err.response) {
        const {
          status, statusText, headers, config, ...rest
        } = err.response;

        debug(`err with response: %O`, {
          status, statusText, headers, config
        });
        return {
          err: statusText,
          status
        };
      }
      if (err.request) {
        debug(`err with request: %O`, err.request);
        // todo
      } else {
        debug(`request error: %O`, err.message);

        return {
          err: err.message,
          status: err.statusCode || err.status || 500
        };
      }
    }
  };

  static get(url, params, options) {
    appendCypressParams(params);
    return _.throttle(HttpAgent.send, delayExec).apply(null, [
      'GET',
      url,
      params,
      options
    ]);
  }

  static post(url, params, options) {
    appendCypressParams(params);
    return _.throttle(HttpAgent.send, delayExec).apply(null, [
      'POST',
      url,
      params,
      options
    ]);
  }
}

export default HttpAgent;
