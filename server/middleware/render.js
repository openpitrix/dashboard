// if (process.env.COMPILE_CLIENT) {
//   process.env.BABEL_ENV = 'server';
// }

const React = require('react');
const { renderToString } = require('react-dom/server');
const { StaticRouter } = require('react-router-dom');
const { matchRoutes, renderRoutes } = require('react-router-config');
const { Provider } = require('mobx-react');
const get = require('lodash/get');
const renderPage = require('../render-page');

const App = require('src/App').default;
const routes = require('src/routes').default;
const isDev = process.env.NODE_ENV !== 'production';

const i18n = require('../i18n');
const { I18nextProvider } = require('react-i18next');

module.exports = async (ctx, next) => {
  const branches = matchRoutes(routes, ctx.url);
  const promises = branches.map(
    ({ route, match }) =>
      route.component.onEnter
        ? route.component.onEnter(ctx.store, match.params)
        : Promise.resolve(null)
  );

  await Promise.all(promises);

  const context = {};

  const cookies = ctx.cookies;
  const sessInfo = {
    user: cookies.get('user'),
    role: cookies.get('role'),
    lastLogin: cookies.get('last_login')
  };

  try {
    const components = !isDev
      ? renderToString(
          <I18nextProvider i18n={i18n}>
            <Provider rootStore={ctx.store} sessInfo={sessInfo}>
              <StaticRouter location={ctx.url} context={context}>
                <App>{renderRoutes(routes)}</App>
              </StaticRouter>
            </Provider>
          </I18nextProvider>
        )
      : null;

    if (context.url) {
      ctx.redirect(context.url);
      ctx.body = '<!DOCTYPE html>redirecting';
      return await next();
    }

    ctx.body = renderPage({
      isDev,
      title: get(ctx.store, 'config.name'),
      children: components,
      state: JSON.stringify(ctx.store)
    });
  } catch (err) {
    ctx.app.reportErr(err, ctx);
  }
};
