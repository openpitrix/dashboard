import request from 'superagent';

let requestOptions = {
  prefix: ''
};

const buildRequest = async (method, url, params) => {
  method = method.toLowerCase();
  const requestUrl = createUrl(url);

  const header = {
    Accept: 'application/json',
    // 'Content-Type': 'application/x-www-form-urlencoded'
    'Content-Type': 'application/json'
  };

  // console.log(`requestUrl: `, requestUrl);

  try {
    let res;
    if (method === 'get') {
      res = await request
        .get(requestUrl)
        .set('Accept', 'application/json')
        .query(params);
    } else {
      res = await request
        .post(requestUrl)
        .set(header)
        .send(params);
    }

    let resp = res.body || {};

    if (resp.success && resp.redirect) {
      location.href = resp.redirect;
    }

    return resp;
  } catch (err) {
    return err.message;
  }
};

export default {
  get(url, params) {
    return buildRequest('GET', url, params);
  },

  post(url, params) {
    return buildRequest('POST', url, params);
  },

  getOptions(key) {
    return key ? requestOptions[key] : requestOptions;
  },

  setOptions(opts) {
    return Object.assign(requestOptions, opts);
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
    // let serverPrefix = requestOptions.prefix;
    // if (serverPrefix && serverPrefix.indexOf(location.host) < 0) {
    //   return serverPrefix + url;
    // }
    return location.protocol + '//' + location.host + url;
  }

  // server side
  return `http://${global.HOSTNAME}:${global.PORT}${url}`;
}
