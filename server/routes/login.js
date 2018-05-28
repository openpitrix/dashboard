const _ = require('lodash');
const Router = require('koa-router');
const log = require('../log');
const userModel = require('../models/users.json');
const sessConfig = require('../session-config');

const router = new Router();

const apiMsg = require('lib/apiMsg');

router.post('/login', async ctx => {
  let { username, password } = ctx.request.body;

  if (username && password) {
    let foundUser = _.find(userModel, { name: username, password });
    if (foundUser) {
      log('found user: ', foundUser);

      // todo: save session
      ctx.cookies.set('user', username, sessConfig);
      ctx.cookies.set('role', foundUser.role, sessConfig);

      // ctx.redirect('/');  // fixme: login view not redirect
      ctx.body = apiMsg.extend({ success: true, redirect: '/' });
    } else {
      ctx.body = apiMsg.extend({ msg: 'user not found' });
    }
  } else {
    ctx.body = apiMsg.extend({ msg: 'invalid params' });
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

  ctx.redirect('/login');
});

module.exports = router;
