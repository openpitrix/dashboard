import React, { Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';

import Header from 'components/Header';
import Footer from 'components/Footer';
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

  if (route.path !== '/login') {
    const isHome = route.path === '/' || route.path.toString().startsWith('/app');

    return (
      <Fragment>
        <Header isHome={isHome} />
        <RouteWrapper component={component} match={match} rootStore={store} />
        <Footer />
      </Fragment>
    );
  }
  return <RouteWrapper component={component} match={match} rootStore={store} />;
};

export default renderRoute;
