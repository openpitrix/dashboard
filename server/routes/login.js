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
  const names = ['access_token', 'token_type', 'access_token_home', 'refresh_token', 'user', 'role'];
  names.forEach(name => ctx.cookies.set(name, '', cookieOptions));
  ctx.redirect('/login');
});

module.exports = router;
