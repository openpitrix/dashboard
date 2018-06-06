if (process.env.COMPILE_CLIENT) {
  process.env.BABEL_ENV = 'server';
}

const React = require('react');
const { renderToString } = require('react-dom/server');
const { StaticRouter } = require('react-router-dom');
const { matchRoutes, renderRoutes } = require('react-router-config');
const { Provider } = require('mobx-react');

const App = require('src/App').default;
const routes = require('src/routes').default;
const isDev = process.env.NODE_ENV === 'development';

// Server-side render
module.exports = async (ctx, next) => {
  const branches = matchRoutes(routes, ctx.url);
  const promises = branches.map(
    ({ route, match }) =>
      route.component.onEnter
        ? route.component.onEnter(ctx.store, match.params, 'from_server')
        : Promise.resolve(null)
  );
  await Promise.all(promises);

  const context = {};

  const sessInfo = {
    user: ctx.cookies.get('user'),
    role: ctx.cookies.get('role'),
    lastLogin: ctx.cookies.get('last_login')
  };

  // when in dev mode, disable ssr
  const components = isDev
    ? null
    : renderToString(
        <Provider rootStore={ctx.store} sessInfo={sessInfo}>
          <StaticRouter location={ctx.url} context={context}>
            <App>{renderRoutes(routes)}</App>
          </StaticRouter>
        </Provider>
      );

  if (context.url) {
    ctx.redirect(context.url);
    ctx.body = '<!DOCTYPE html>redirecting';
    return await next();
  }

  await ctx.render('index.pug', {
    isDev,
    isLogin: ctx.url === '/login',
    title: ctx.store.config.name,
    children: components,
    state: JSON.stringify(ctx.store)
  });
};
