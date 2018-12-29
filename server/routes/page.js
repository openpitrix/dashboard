const Router = require('koa-router');
const agent = require('lib/request').default;
const auth = require('../middleware/auth');
const gzip = require('../middleware/gzip');

const router = new Router();

router.get('/attachments/:id', async ctx => {
  const { apiServer } = ctx.store;
  const apiUrl = `${apiServer.split('/v')[0]}/attachments/${ctx.params.id}/raw`;

  ctx.body = await agent.send('get', apiUrl);
});

router.get('/logout', ctx => {
  const cookieOptions = {
    maxAge: -1,
    httpOnly: false
  };
  ctx.session = null;
  const names = [
    'username',
    'user_id',
    'role',
    'email',
    'login_time',
    'changedRole',

    'access_token',
    'token_type',
    'expires_in',

    'no_auth_access_token',
    'no_auth_expires_in',
    'no_auth_token_type'
  ];
  names.forEach(name => ctx.cookies.set(name, '', cookieOptions));
  localStorage.removeItem('menuApps'); // clear newest visited menu apps
  ctx.redirect('/login');
});

router.get('/:page(/?.*)', auth, gzip, async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.app.reportErr(err, ctx);
  }
});

module.exports = router;
