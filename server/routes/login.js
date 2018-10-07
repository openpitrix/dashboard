const Router = require('koa-router');

const router = new Router();

router.get('/logout', ctx => {
  let cookieOptions = {
    maxAge: -1,
    httpOnly: false
  };
  ctx.session = null;
  const names = ['access_token', 'token_type', 'refresh_token', 'user', 'changeUser'];
  names.forEach(name => ctx.cookies.set(name, '', cookieOptions));
  ctx.redirect('/login');
});

module.exports = router;
