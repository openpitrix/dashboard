const _ = require('lodash');
const debug = require('debug')('test');
const compareObj = require('../src/utils/object').compareObj;

const qs2Obj = query => {
  const obj = {};
  // If no query string, return empty object
  if (query === '') return obj;
  // Remove the '?' at front of query string
  query = query.slice(1);
  // Split the query string into key/value pairs (ampersand-separated)
  query = query.split('&');
  // Loop through each key/value pair
  query.forEach(part => {
    // Split each key/value pair into their separate parts
    part = part.split('=');
    const key = part[0];
    const value = part[1];
    // If the key doesn't exist yet, set it
    if (!obj[key]) {
      obj[key] = decodeURIComponent(value);
    } else {
      // If it does already exist...

      // If it's not an array, make it an array
      if (!Array.isArray(obj[key])) {
        obj[key] = [decodeURIComponent(obj[key])];
      }

      // Push the new value to the key's array
      obj[key].push(decodeURIComponent(value));
    }
  });

  // Return the query string object
  return obj;
};

const getFixtureName = spec => {
  const specName = spec.replace('integration/', '').replace('.spec.js', '');
  return `api/${specName}.snapshot.json`;
};

const getApiUrl = input => {
  let source = input;
  if (!source.includes('?')) {
    source += '?';
  }
  return source.replace(/^.*\/v[\d.](\/.*)\?.*/g, '$1');
};

const getParmObj = params => {
  const result = {};
  const boolean = ['true', 'false'];
  _.keys(params).forEach(key => {
    if (/^\d+$/.test(params[key])) {
      result[key] = +params[key];
    } else if (boolean.includes(params[key])) {
      result[key] = params[key] === 'true';
    } else {
      result[key] = params[key];
    }
  });
  return result;
};

const getFixtureData = (records, parmas, url) => {
  let data = null;
  const param = _.omit(parmas, ['_specName', '_testTitle', 'method']);
  debug('getFixtureData url %s param: %O', url, param);
  _.some(records, record => {
    if (
      record.url.includes(url)
      && compareObj(param, _.omit(record.request.body, ['bypass_auth', 'method']))
    ) {
      data = _.get(record, 'response.body');
      debug('fetch data for url: %s', url);
    }
    return !!data;
  });

  return data;
};

module.exports = [
  {
    /**
     * returns the data
     *
     * @param match array Result of the resolution of the regular expression
     * @param params object sent by 'send' function
     * @param headers object set by 'set' function
     * @param context object the context of running the fixtures function
     */
    fixtures(match, params, headers, context) {
      let data = {};
      if (match.input.includes('oauth2/token')) {
        data = require('../cypress/fixtures/api/user/isv-token.snapshot.json');
        return data;
      }
      let param = params;
      debug('Mock api for %s', match.input);
      if (context.method === 'get') {
        param = qs2Obj(match.input.replace(/^.*\?/, '?'));
        param = getParmObj(param);
      }
      const specName = _.get(param, '_specName');
      const testTitle = _.get(param, '_testTitle');
      if (match.input.includes('roles:module')) {
        if (param.role_id === 'isv') {
          data = require('../cypress/fixtures/api/user/isv-role-module.snapshot.json');
        } else if (param.role_id === 'global_admin') {
          data = require('../cypress/fixtures/api/user/admin-role-module.snapshot.json');
        }
        return data;
      }

      if (specName) {
        const fixtureData = require(`../cypress/fixtures/${getFixtureName(
          specName
        )}`);
        const dataAPI = fixtureData[testTitle];
        if (dataAPI) {
          data = getFixtureData(dataAPI.records, param, getApiUrl(match.input));
          return data;
        }
      }

      return {
        status: 201,
        body: 'ok'
      };
    },

    get(match, data) {
      return {
        status: 201,
        body: data
      };
    },

    post(match, data) {
      return {
        status: 201,
        body: data
      };
    },

    patch(match, data) {
      return {
        status: 201,
        body: data
      };
    },

    delete(match, data) {
      return {
        body: data
      };
    }
  }
];
