import _ from 'lodash';
import { compile } from 'path-to-regexp';

import routeNames, { portals } from './names';

const noHeaderPaths = ['/login', '/user/provider/apply'];

const noFooterPaths = ['/login', '/user/provider/apply'];

const commonRoutes = ['', 'apps', 'login', 'logout', 'profile'];

export const getRouteByName = name => {
  const route = _.get(routeNames, name);
  if (!route) {
    throw Error(`invalid route: ${name}`);
  }
  return route;
};

export const toRoute = (route = '', params = {}) => {
  if (typeof params === 'string') {
    params = {
      portal: params
    };
  }
  const guessPortal = getPortalFromPath();
  const portal = params.portal || guessPortal;

  if (route.indexOf('.') > 0) {
    route = getRouteByName(route);
  }
  if (portal && guessPortal && portal !== guessPortal) {
    route = withPrefix(route, portal);
  }
  if (!route.startsWith('/')) {
    route = `/${route}`;
  }
  return compile(route)(Object.assign(params, { portal: portal || 'user' }));
};

export const getPortalFromPath = (path = location.pathname) => {
  const p = path.split('/')[1];
  if (commonRoutes.includes(p)) {
    return '';
  }
  if (portals.includes(p)) {
    return p;
  }
  // console.warn(`invalid portal ${p}`);
  return '';
};

export const needAuth = (path, portal) => portals.includes(portal) || path === '/profile';

export const pathWithoutHeader = path => {
  const portal = getPortalFromPath();
  return noHeaderPaths.includes(path) || (portal && portal !== 'user');
};

export const pathWithoutFooter = path => noFooterPaths.includes(path);

export const withPrefix = (url, prefix = '') => {
  if (prefix) {
    if (url.startsWith('/')) {
      url = url.substring(1);
    }
    if (prefix.endsWith('/')) {
      prefix = prefix.substring(0, prefix.length - 1);
    }
    return [prefix, url].join('/');
  }

  return url;
};

export UserRoutes from './portals/user';
export DevRoutes from './portals/dev';
export IsvRoutes from './portals/isv';
export AdminRoutes from './portals/admin';

export default routeNames;
