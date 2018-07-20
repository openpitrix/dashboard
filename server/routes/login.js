const _ = require('lodash');
const Router = require('koa-router');
const log = require('../../lib/log');
const userModel = require('../models/users.json');
const sessConfig = require('../session-config');

const router = new Router();

router.post('/login', async ctx => {
  let { username, password } = ctx.request.body;

  if (username && password) {
    let foundUser = _.find(userModel, { name: username, password });
    if (foundUser) {
      // log('found user: ', foundUser);

      ctx.cookies.set('user', username, sessConfig);
      ctx.cookies.set('role', foundUser.role, sessConfig);
      ctx.cookies.set('last_login', Date.now(), sessConfig);

      ctx.body = { success: true, redirect: '/dashboard' };
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

  ctx.redirect('/login');
});

module.exports = router;
