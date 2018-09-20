import React, { Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';

import Header from 'components/Header';
import Footer from 'components/Footer';
import RouteWrapper from './wrapper';
import { getCookie } from '../utils';

const hasLoggedIn = () => !!getCookie('user');
const hasHeader = getCookie('role') === 'normal' || !getCookie('role');

const renderRoute = (match, route, store) => {
  if (route.needAuth && !hasLoggedIn()) {
    return <Redirect to={`/login?url=${match.url}`} />;
  }

  if (route.noMatch) {
    return <Redirect to="/" />;
  }

  // attach history to component
  const component = withRouter(route.component);

  if (route.path !== '/login') {
    const isHome = route.path === '/' || route.path.toString().startsWith('/app');

    return (
      <Fragment>
        {(hasHeader || isHome) && <Header isHome={isHome} />}
        <RouteWrapper component={component} match={match} rootStore={store} />
        {(hasHeader || isHome) && <Footer />}
      </Fragment>
    );
  }
  return <RouteWrapper component={component} match={match} rootStore={store} />;
};

export default renderRoute;
