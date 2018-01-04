import fs from 'fs';
import { resolve } from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { matchRoutes } from 'react-router-config';
import App from '../../src/App';
import routes from '../../src/routes';

const indexHTML = fs.readFileSync(resolve(__dirname, '../../src/index.html'), 'utf8');

// Server-side render
export default async (ctx, next) => {
  if (process.env.NODE_ENV !== 'production') {
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

  const bundleURL = process.env.NODE_ENV === 'development' ? '//localhost:3002' : '';

  ctx.body = indexHTML
    .replace(/{bundleURL}/g, bundleURL)
    .replace('{title}', ctx.store.config.name)
    .replace('{state}', JSON.stringify(ctx.store, null, 2))
    .replace('{children}', components);
};
