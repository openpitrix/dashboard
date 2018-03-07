import { useStaticRendering } from 'mobx-react';
import { toJS } from 'mobx';
import RootStore from 'stores/RootStore';
import { getServerConfig } from 'lib/utils';

useStaticRendering(true);

const rootStore = toJS(new RootStore());

/**
 * Middleware for creating the store
 * @param ctx
 * @param next
 */
export default async (ctx, next) => {
  // Create state for SSR
  ctx.store = rootStore;
  ctx.store.config = getServerConfig().app;

  await next();
};
