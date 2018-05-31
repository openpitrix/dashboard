const Router = require('koa-router');
const agent = require('superagent');
// const log=require('../log');

const router = new Router();

const header = {
  Accept: 'application/json',
  // 'Content-Type': 'application/x-www-form-urlencoded'
  'Content-Type': 'application/json'
};

router.post('/api/*', async ctx => {
  let endpoint = ctx.url.replace(/^\/api\//, '');
  // strip query string
  endpoint = endpoint.substring(
    0,
    endpoint.indexOf('?') > -1 ? endpoint.indexOf('?') : endpoint.length
  );
  let url = [ctx.store.apiServer, endpoint].join('/');

  let body = ctx.request.body;
  let forwardMethod = body.method || 'get';
  delete body.method;

  try {
    let res;
    if (forwardMethod === 'get') {
      res = await agent
        .get(url)
        .set('Accept', 'application/json')
        .query(body);
    } else {
      res = await agent[forwardMethod](url)
        .set(header)
        .send(body);
    }

    // normalize response body
    ctx.body = res.body || null;
  } catch (err) {
    ctx.body = {
      err: err.message,
      status: err.status || 404,
      errDetail: err.response.body.error
    };
    // dont set ctx.status as 404, will cause page not found
    // ctx.status=err.status || 404;
  }
});

module.exports = router;
