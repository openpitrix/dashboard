import React, { Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';

import Header from 'components/Header';
import Footer from 'components/Footer';
import RouteWrapper from './wrapper';
import { getCookie, setCookie } from '../utils';

const renderRoute = (match, route, store) => {
  if (route.path === 'login') {
    setCookie('loginUser', '', -1);
    setCookie('changeDev', '', -1);
  }

  const loginUser = JSON.parse(getCookie('loginUser') || '{}');
  const changeDev = getCookie('changeDev');
  const hasHeader = loginUser.isNormal || !loginUser.username || changeDev === 'user';

  if (route.needAuth && !Boolean(loginUser.username)) {
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
