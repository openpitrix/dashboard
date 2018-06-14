import React from 'react';
import { Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';
import RouteWrapper from './wrapper';
import { getCookie } from '../utils';

const hasLoggedIn = () => {
  return !!getCookie('user');
};

const renderRoute = (match, route, store) => {
  if (route.needAuth && !hasLoggedIn()) {
    return <Redirect to="/login" />;
  }

  if (route.noMatch) {
    return <Redirect to="/" />;
  }

  // attach history to component
  let component = withRouter(route.component);
  return <RouteWrapper component={component} match={match} rootStore={store} />;
};

export default renderRoute;
