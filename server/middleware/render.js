// if (process.env.COMPILE_CLIENT) {
//   process.env.BABEL_ENV = 'server';
// }

const React = require('react');
const { renderToString } = require('react-dom/server');
const { StaticRouter } = require('react-router-dom');
const { matchRoutes, renderRoutes } = require('react-router-config');
const { Provider } = require('mobx-react');
const get = require('lodash/get');
const Loadable = require('react-loadable');
const { getBundles } = require('react-loadable/webpack');
const loadableStats = require('../react-loadable.json');

const renderPage = require('../render-page');
const isProd = process.env.NODE_ENV === 'production';

// todo
const App = require('src/App').default;
const routes = isProd ? require('src/routes/prod').default : require('src/routes/index').default;

const i18n = require('../i18n');
const { I18nextProvider } = require('react-i18next');

const resolve = obj=> {
  return obj && obj.__esModule ? obj.default : obj;
}

module.exports = async (ctx, next) => {
  // fix ssr notifications store not sync
  ctx.store.notifications = [];

  // disable ssr on dev mode
  const branches = matchRoutes(routes, ctx.url);
  
  const promises = branches.map(({ route, match }) => {
    if(isProd){
      console.time('preload-comp');

      return route.component.preload().then(loaded=> {
        console.timeEnd('preload-comp');

        loaded = resolve(loaded);
        if(loaded.onEnter){
          return loaded.onEnter(ctx.store, match.params)
        } else {
          return Promise.resolve(null);
        }
      }).catch(err=> Promise.reject(err));
    }

    return route.component.onEnter
      ? route.component.onEnter(ctx.store, match.params)
      : Promise.resolve(null);
  });

  await Promise.all(promises);

  let modules = [], bundles = [];

  const context = {};

  const cookies = ctx.cookies;
  const sessInfo = {
    user: cookies.get('user'),
    role: cookies.get('role'),
    lastLogin: cookies.get('last_login')
  };

  try {
    const components = isProd
      ? renderToString(
        <Loadable.Capture report={moduleName => modules.push(moduleName)}>
          <I18nextProvider i18n={i18n}>
            <Provider rootStore={ctx.store} sessInfo={sessInfo} sock={null}>
              <StaticRouter location={ctx.url} context={context}>
                <App>{renderRoutes(routes)}</App>
              </StaticRouter>
            </Provider>
          </I18nextProvider>
        </Loadable.Capture>
      )
      : null;

    if(isProd){
      bundles = getBundles(loadableStats, modules);
      console.log('current loaded bundle: ', bundles);
    }

    if (context.url) {
      ctx.redirect(context.url);
      ctx.body = '<!DOCTYPE html>redirecting';
      return await next();
    }

    ctx.body = renderPage({
      isProd,
      bundles,
      title: get(ctx.store, 'config.title'),
      children: components,
      state: JSON.stringify(ctx.store),
    });
  } catch (err) {
    ctx.app.reportErr(err, ctx);
  }
};
