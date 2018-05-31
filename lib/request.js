import request from 'superagent';

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
