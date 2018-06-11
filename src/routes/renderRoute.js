import React from 'react';
import { Redirect } from 'react-router-dom';
import RouteWrapper from './wrapper';
import { getCookie } from '../utils';

const validAdminTypes = ['deploy', 'develop', 'manage'];

const hasLoggedIn = () => {
  return !!getCookie('user');
};

const renderRoute = (match, route, store) => {
  const { params } = match;
  const adminType = params.admin;

  if (route.needAuth && validAdminTypes.indexOf(adminType) > -1 && !hasLoggedIn()) {
    return <Redirect to="/login" />;
  }

  if (adminType && validAdminTypes.indexOf(adminType) < 0) {
    return <Redirect to="/" />;
  }

  if (route.noMatch) {
    return <Redirect to="/" />;
  }

  return <RouteWrapper component={route.component} match={match} rootStore={store} />;
};

export default renderRoute;
