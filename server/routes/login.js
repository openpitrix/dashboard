const _ = require('lodash');
const Router = require('koa-router');
const userModel = require('../models/users.json');
const sessConfig = require('../session-config');

const router = new Router();

router.post('/login', async ctx => {
  let { username, password, url } = ctx.request.body;

  if (username && password) {
    let foundUser = _.find(userModel, { name: username, password });
    if (foundUser) {
      ctx.cookies.set('user', username, sessConfig);
      ctx.cookies.set('role', foundUser.role, sessConfig);
      ctx.cookies.set('last_login', Date.now(), sessConfig);

      ctx.body = { success: true, redirect: url ? url : '/dashboard' };
    } else {
      ctx.body = { msg: 'user not found' };
    }
  } else {
    ctx.body = { msg: 'invalid params' };
  }
});

router.get('/logout', ctx => {
  let cookieOptions = {
    maxAge: -1,
    httpOnly: false
  };
  ctx.session = null;
  ctx.cookies.set('user', '', cookieOptions);
  ctx.cookies.set('role', '', cookieOptions);
  ctx.cookies.set('last_login', '', cookieOptions);
  ctx.cookies.set('access_token', '', cookieOptions);
  ctx.cookies.set('token_type', '', cookieOptions);
  ctx.cookies.set('refresh_token', '', cookieOptions);

  ctx.redirect('/login');
});

module.exports = router;
