import _ from 'lodash';
import debug from 'debug';
import { compareObj } from '../../src/utils/object';

const debugMock = debug('mock');

const actionMap = {
  users_detail: './user/detail',
  'oauth2/token': './user/oauth',
  'roles:module': './user/role-module'
};

const getPathName = url => {
  const reg = /.*\/v[\d.]\//;
  return url.replace(reg, '');
};

const getApiUrl = input => {
  let source = input;
  if (!source.includes('?')) {
    source += '?';
  }
  return source.replace(/^.*\/v[\d.](\/.*)\?.*/g, '$1');
};

const getFixtureName = spec => {
  const specName = spec.replace('integration/', '').replace('.spec.js', '');
  return `api/${specName}.snapshot.json`;
};

const getFixtureData = (records, parmas, url) => {
  let data = null;
  const param = _.omit(parmas, ['_specName', '_testTitle', 'method']);
  debugMock('getFixtureData url %s param: %o', url, param);
  _.some(records, record => {
    if (
      record.url.replace('/api', '') === url
      && compareObj(param, _.omit(record.request.body, ['bypass_auth', 'method']))
    ) {
      data = _.get(record, 'response.body');
      debug('fetch data for url: %s', url);
    }
    return !!data;
  });

  return data;
};

export default function getMockData(config) {
  const pathName = getPathName(config.url);
  const actionPath = actionMap[pathName];
  debugMock('pathName: %o, actionPath: %o', pathName, actionPath);
  if (config.method === 'get') {
    config.data = config.params;
    delete config.params;
  }
  if (actionPath) {
    return import(actionPath).then(resolve => {
      const request = resolve.default;
      if (!_.isFunction(request) && _.isObject(request)) {
        debugMock('request isObject', request);
        return {
          data: request
        };
      }
      debugMock('config: %o', config);
      return {
        data: request(config)
      };
    });
  }

  const specName = _.get(config.data, '_specName');
  const testTitle = _.get(config.data, '_testTitle');
  debugMock('config.data: %o', config.data);
  if (specName) {
    const fixturePath = `../fixtures/${getFixtureName(specName)}`;
    let data = null;
    return import(fixturePath).then(fixtureData => {
      const dataAPI = fixtureData[testTitle];
      debugMock('params: %o', config.data);
      debugMock('apiUrl: %o', getApiUrl(config.url));
      if (dataAPI) {
        data = getFixtureData(
          dataAPI.records,
          config.data,
          getApiUrl(config.url)
        );
        debugMock('data: %o', data);
        return {
          data
        };
      }
    });
  }

  return {
    data: {}
  };
}
