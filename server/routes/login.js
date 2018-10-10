const Router = require('koa-router');

const router = new Router();

router.get('/logout', ctx => {
  let cookieOptions = {
    maxAge: -1,
    httpOnly: false
  };
  ctx.session = null;
  const names = [
    'access_token',
    'token_type',
    'user',
    'role',
    'expires_in',

    'un_auth_access_token',
    'un_auth_expires_in',
    'un_auth_token_type'
  ];
  names.forEach(name => ctx.cookies.set(name, '', cookieOptions));
  ctx.redirect('/login');
});

module.exports = router;
