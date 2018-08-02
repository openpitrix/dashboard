const Router = require('koa-router');
const agent = require('superagent');
const debug = require('debug')('op-dash');

const router = new Router();

const header = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
};

const agentTimeout={
  response: 5000,
  deadline: 10000
}

router.post('/api/*', async ctx => {
  let endpoint = ctx.url.replace(/^\/api\//, '');
  // strip query string
  endpoint = endpoint.substring(
    0,
    endpoint.indexOf('?') > -1 ? endpoint.indexOf('?') : endpoint.length
  );

  if (endpoint.startsWith('/')) {
    endpoint = endpoint.substring(1);
  }

  let apiServer = ctx.store.apiServer;
  if (apiServer.endsWith('/')) {
    apiServer = apiServer.substring(0, apiServer.length - 1);
  }

  let url = [apiServer, endpoint].join('/');

  let body = ctx.request.body;
  let forwardMethod = body.method || 'get';
  delete body.method;

  debug('%s %s', forwardMethod.toUpperCase(), url);

  try {
    let res;
    if (forwardMethod === 'get') {
      res = await agent
        .get(url)
        .timeout(agentTimeout)
        .set('Accept', 'application/json')
        .query(body);
    } else {
      res = await agent[forwardMethod](url)
        .timeout(agentTimeout)
        .set(header)
        .send(body);
    }

    // normalize response body
    ctx.body = res.body || null;
  } catch (err) {
    if(err.timeout){
      ctx.body={
        err: 'request timeout',
        status: 400
      }
    }

    ctx.body = {
      err: err.message,
      status: err.statusCode || err.status || 500,
      errDetail: err.response.body.error
    };
  }
});

module.exports = router;
