import request from 'superagent';
import { throttle } from 'lodash';

const agentTimeout = {
  response: 10000,
  deadline: 15000
};

const buildRequest = async (method, url, params) => {
  method = method.toLowerCase();
  const requestUrl = createUrl(url);

  const header = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  };

  try {
    let res;
    if (method === 'get') {
      res = await request
        .get(requestUrl)
        .timeout(agentTimeout)
        .set('Accept', 'application/json')
        .query(params);
    } else {
      res = await request
        .post(requestUrl)
        .timeout(agentTimeout)
        .set(header)
        .send(params);
    }

    let resp = res.body || {};

    if (resp.success && resp.redirect) {
      location.href = resp.redirect;
    }

    return resp;
  } catch (err) {
    if (err.timeout) {
      return {
        err: `Response timeout of ${agentTimeout.response}ms exceeded`,
        status: 400
      };
    }
    return err.message;
  }
};

const delayExec = 1000;

export default {
  get(url, params) {
    // return buildRequest('GET', url, params);
    return throttle(buildRequest, delayExec).apply(null, ['GET', url, params]);
  },

  post(url, params) {
    // return buildRequest('POST', url, params);
    return throttle(buildRequest, delayExec).apply(null, ['POST', url, params]);
  }
};

function createUrl(path) {
  if (path.startsWith('http')) {
    return path;
  }

  let url = path.trim();
  if (!url.startsWith('/')) {
    url = `/${url}`;
  }

  if (typeof window === 'object') {
    // client side
    if (url === '/login') {
      return url;
    }
    return location.protocol + '//' + location.host + url;
  }

  // server side
  return `http://${global.HOSTNAME}:${global.PORT}${url}`;
}
