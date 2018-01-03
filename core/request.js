import fetch from 'isomorphic-fetch';

/**
 * This is our overly complicated isomorphic "request"
 * @param state
 * @returns {Function}
 */
export default function () {
  return {
    get(url, params) {
      return buildRequest('GET', url, omitNil(params));
    },

    post(url, data, isMultiForm = false) {
      return buildRequest('POST', url, data, isMultiForm);
    },
  };
}

/**
 * Build and execute remote request
 * @param method
 * @param url
 * @param params
 * @param config
 */
function buildRequest(method, url, params, isMultiForm) {
  const requestURL = createURL(url) + (method === 'GET' && params ? toQueryString(params) : '');
  const request = {
    method,
    mode: 'cors',
    credentials: 'include',
    headers: {
      'content-type': 'application/json',
    },
  };

  if (method === 'POST') {
    if (isMultiForm) {
      const formData = new FormData();
      Object.keys(params).forEach((name) => {
        formData.append(name, params[name]);
      });
      request.body = formData;
    } else {
      request.body = JSON.stringify(params || {});
    }
  }

  return fetch(requestURL, request).then(handleResponse);
}

/**
 * Prepend host of API server
 * @param path
 * @returns {String}
 * @private
 */
function createURL(path) {
  if (path.startsWith('http')) {
    return path;
  } else if (process.env.BROWSER) {
    return `/${path.trimLeft('/')}`;
  }
  return `http://${global.HOSTNAME}:${global.PORT}/${path.trimLeft('/')}`;
}

/**
 * Decide what to do with the response
 * @param response
 * @returns {Promise}
 * @private
 */
function handleResponse(response) {
  const redirect = response.headers.get('Location');
  if (redirect) {
    window.location.replace(redirect);
    return Promise.reject();
  }

  if (response.headers.get('content-type').includes('json')) {
    return response.json().then(res => {
      if (response.status === 403) {
        console.warn('Unauthorized', response, response.ok);
      }
      if (response.ok) {
        return res;
      }
      return Promise.reject(res);
    });
  }
  return response.text().then(error => { throw error; });
}

/**
 * Transform an JSON object to a query string
 * @param params
 * @returns {string}
 */
export function toQueryString(params) {
  return `?${Object.keys(params).map(k => {
    const name = encodeURIComponent(k);
    if (Array.isArray(params[k])) {
      return params[k].map(val => `${name}[]=${encodeURIComponent(val)}`).join('&');
    }
    return `${name}=${encodeURIComponent(params[k])}`;
  }).join('&')}`;
}

function omitNil(obj) {
  if (typeof obj !== 'object') return obj;
  return Object.keys(obj).reduce((acc, v) => {
    if (obj[v] !== undefined) acc[v] = obj[v];
    return acc;
  }, {});
}
