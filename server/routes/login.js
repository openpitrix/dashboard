const _ = require('lodash');
const Router = require('koa-router');
const log = require('../log');
const userModel = require('../models/users.json');
const sessConfig = require('../session-config');

const router = new Router();

router.post('/login', async ctx => {
  let { username, password } = ctx.request.body;

  if (username && password) {
    let foundUser = _.find(userModel, { name: username, password });
    if (foundUser) {
      // todo: save session
      ctx.cookies.set('user', username, sessConfig);

      ctx.redirect('/');
    } else {
      ctx.body = 'user not found';
    }
  } else {
    ctx.body = 'invalid params';
  }
});

router.get('/logout', ctx => {
  let cookieOptions = {
    maxAge: -1,
    httpOnly: false
  };
  ctx.session = null;
  ctx.cookies.set('user', '', cookieOptions);

  ctx.redirect('/login');
});

module.exports = router;
