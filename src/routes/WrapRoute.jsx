import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

import Header from 'components/Header';
import Footer from 'components/Footer';
import ErrorBoundary from 'components/ErrorBoundary';
import { needAuth } from 'routes';
import user from '../providers/user';

const WrapRoute = ({ component: Comp, ...rest }) => {
  const { path, computedMatch } = rest;

  if (needAuth() && !user.isLoggedIn()) {
    return <Redirect to={`/login?redirect_url=${computedMatch.url || ''}`} />;
  }

  // const isHome = rest.applyHome || Comp.isHome;
  // let { acl } = rest;
  //
  // if (!_.isEmpty(acl)) {
  //   acl = [].concat(acl);
  //   if (!_.some(acl, role => user[`is${role}`])) {
  //     return <Redirect to="/" />;
  //   }
  // }

  return (
    <Route
      {...rest}
      render={props => (
        <ErrorBoundary>
          <Header />
          <Comp {...props} />
          <Footer />
        </ErrorBoundary>
      )}
    />
  );
};

WrapRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  path: PropTypes.string.isRequired
};

export default WrapRoute;
