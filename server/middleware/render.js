/* eslint-disable import/first */
process.env.BABEL_ENV = 'server';

const React = require('react');
const { renderToString } = require('react-dom/server');
const { StaticRouter } = require('react-router-dom');
const { matchRoutes } = require('react-router-config');

const App = require('src/App').default;
const routes = require('src/routes').default;

const isDev = process.env.NODE_ENV === 'development';

// Server-side render
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
  const components = isDev
    ? null
    : renderToString(
        <StaticRouter location={ctx.url} context={context}>
          <App rootStore={ctx.store} />
        </StaticRouter>
      );

  /**
   * Disable ssr
   * const components = null;
   */

  if (context.url) {
    ctx.redirect(context.url);
    ctx.body = '<!DOCTYPE html>redirecting';
    return await next();
  }

  await ctx.render('index.pug', {
    isDev,
    title: ctx.store.config.name,
    children: components,
    state: JSON.stringify(ctx.store),
    isSSR: true
  });
};
