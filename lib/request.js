import axios from 'axios';
import _ from 'lodash';
import debug from 'debug';

import getMockData from '../cypress/mock-data';
import { obj2Qs } from '../src/utils';

const needMockData = Boolean(process.env.MOCKAPI);
const debugApi = debug('api:axios');
const isWindow = typeof window !== 'undefined';
const defaultOptions = {
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
      // eslint-disable-next-line
      return `${location.protocol}//${location.host}${url}`;
    }

    // server side
    return `http://${global.HOSTNAME}:${global.PORT}${url}`;
  };

  static isGet = (method, params) => method.toLowerCase === 'get'
    || _.invoke(params, 'method.toLowerCase') === 'get';

  static getServerConfig = (method, params) => {
    const data = Object.assign({}, params);
    params.data = _.omit(params.data, 'method');
    if (this.isGet(method, params)) {
      return {
        ..._.omit(params, 'data'),
        params: params.data,
        paramsSerializer: obj => obj2Qs(obj).replace(/\[\]=/g, '=')
      };
    }

    return data;
  };

  static exec = async config => {
    if (!isWindow && needMockData) {
      return await getMockData(config);
    }
    return await axios(config);
  };

  static send = async (method, url, params, options = {}) => {
    const requestUrl = HttpAgent.formalizeUrl(url);
    method = method.toLowerCase();

    if (!allowMethods.includes(method)) {
      throw Error(`Not allow method: ${method}`);
    }

    try {
      const headers = method === 'get'
        ? _.omit(defaultOptions.header, 'Content-Type')
        : defaultOptions.header;

      const timeout = !_.isUndefined(options.timeout)
        ? options.timeout
        : defaultOptions.timeout.response;
      let config = {
        url: requestUrl,
        headers,
        method,
        timeout,
        data: {
          ...params
        }
      };
      if (!_.isEmpty(options)) {
        _.extend(config, options);
      }
      if (!isWindow) {
        config = this.getServerConfig(method, config);
      }
      debugApi('send: ----------\r\n%O', config);
      const res = await this.exec(config);
      debugApi('res: ----------\r\n%o', res);
      const resBody = !_.isEmpty(res) && res.data ? res.data : {};
      debugApi('body: ----------\r\n%o', resBody);
      return resBody;
    } catch (err) {
      debugApi(`Request error: %O`, err.message);

      if (err.timeout) {
        return {
          err: `Response timeout of ${defaultOptions.timeout}ms exceeded`,
          status: 500
        };
      }

      // if (_.get(err, 'details[0].cause')) {
      //   return {
      //     err: '',
      //     status: 500,
      //     errDetail: _.get(err, 'details[0].cause')
      //   };
      // }

      return {
        err: err.message,
        status: err.statusCode || err.status || 500,
        errDetail: _.get(err, 'response.data.error', '')
      };
    }
  };

  static get(url, params) {
    if (isWindow && window.Cypress) {
      const _specName = _.get(window, 'Cypress.spec.name', {});
      Object.assign(params, {
        _specName,
        _testTitle: window.Cypress.cy.testCaseTitle
      });
    }
    return _.throttle(HttpAgent.send, delayExec).apply(null, [
      'GET',
      url,
      params
    ]);
  }

  static post(url, params) {
    if (isWindow && window.Cypress) {
      const _specName = _.get(window, 'Cypress.spec.name', {});
      Object.assign(params, {
        _specName,
        _testTitle: window.Cypress.cy.testCaseTitle
      });
    }
    return _.throttle(HttpAgent.send, delayExec).apply(null, [
      'POST',
      url,
      params
    ]);
  }
}

export default HttpAgent;
