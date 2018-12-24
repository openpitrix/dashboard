const Router = require('koa-router');

const router = new Router();

router.get('/logout', ctx => {
  const cookieOptions = {
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

    'no_auth_access_token',
    'no_auth_expires_in',
    'no_auth_token_type'
  ];
  names.forEach(name => ctx.cookies.set(name, '', cookieOptions));
  ctx.redirect('/login');
});

module.exports = router;
