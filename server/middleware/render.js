import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { matchRoutes } from 'react-router-config';
import App from 'src/App';
import routes from 'src/routes';

const isDev = process.env.NODE_ENV === 'development';

// Server-side render
export default async (ctx, next) => {
  if (isDev) {
    global.webpackIsomorphicTools.refresh();
  }

  const branches = matchRoutes(routes, ctx.url);
  const promises = branches.map(({ route, match }) => (route.component.onEnter
    ? route.component.onEnter(ctx.store, match.params)
    : Promise.resolve(null)));
  await Promise.all(promises);

  const context = {};
  const components = renderToString(
    <StaticRouter location={ctx.url} context={context}>
      <App rootStore={ctx.store}/>
    </StaticRouter>,
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
  });
};
