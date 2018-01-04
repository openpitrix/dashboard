import { useStaticRendering } from 'mobx-react';
import { toJS } from 'mobx';
import config from '../config';
import RootStore from '../../src/stores/RootStore';

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
  ctx.store.config = config.app;

  await next();
};
