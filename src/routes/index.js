import React, { lazy } from 'react';
import _ from 'lodash';
import { compile } from 'path-to-regexp';

import routeNames, { portals } from './names';

// fixme
const noHeaderPath = ['/dashboard/provider/submit'];

const commonRoutes = ['', 'apps', 'login', 'profile'];

export const toRoute = name => {
  const route = _.get(routeNames, name);
  if (!route) {
    throw Error(`invalid route: ${name}`);
  }
  return route;
};

export const toUrl = (route, params = {}) => {
  const portal = getPortalFromPath();
  if (route.indexOf('.')) {
    route = toRoute(route);
  }
  route = withPrefix(portal, route);
  if (!route.startsWith('/')) {
    route = `/${route}`;
  }
  return compile(route)(params);
};

export const getPortalFromPath = (path = location.pathname) => {
  const p = path.split('/')[1];
  if (commonRoutes.includes(p)) {
    return '';
  }
  if (portals.includes(p)) {
    return p;
  }
  // throw Error(`invalid portal ${p}`);
  console.warn(`invalid portal ${p}`);
  return '';
};

export const needAuth = path => false;

export const pathWithHeader = path => path !== '/login' && !noHeaderPath.includes(path);

export const pathWithFooter = path => pathWithHeader(path);

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
