import React from 'react';
import { Redirect } from 'react-router-dom';
import RouteWrapper from './wrapper';
import { getCookie } from '../utils';

const bypassUrl = ['/deployment'];
const validManageTypes = ['develop', 'manage'];

const hasLoggedIn = () => {
  return !!getCookie('user');
};

const renderRoute = (match, route, store) => {
  const { params } = match;

  if (route.needAuth && validManageTypes.indexOf(params.manage) > -1 && !hasLoggedIn()) {
    return <Redirect to="/login" />;
  }

  if (params.manage && validManageTypes.indexOf(params.manage) < 0) {
    return <Redirect to="/" />;
  }

  if (route.noMatch && bypassUrl.indexOf(match.url) < 0) {
    return <Redirect to="/" />;
  }

  return <RouteWrapper component={route.component} match={match} rootStore={store} />;
};

export default renderRoute;
