import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

import ErrorBoundary from 'components/ErrorBoundary';
import { needAuth, getPortalFromPath } from 'routes';
import { roleTypes } from 'config/roles';
import user from '../providers/user';

const WrapRoute = ({ component: Comp, ...rest }) => {
  const { path, computedMatch } = rest;
  const curPortal = getPortalFromPath(path);

  if (needAuth(path, curPortal) && !user.isLoggedIn()) {
    return <Redirect to={`/login?redirect_url=${computedMatch.url || '/'}`} />;
  }

  /*
   check current portal and control page access

   isv can access dev pages
   all roles can access user pages
   */
  if (curPortal && curPortal !== 'user') {
    const method = `is${roleTypes[curPortal]}`;

    if (curPortal === 'dev') {
      if (!(user.isISV || user.isDev)) {
        return <Redirect to="/" />;
      }
    } else {
      if (!user[method]) {
        return <Redirect to="/" />;
      }
    }
  }

  return (
    <Route
      {...rest}
      render={props => (
        <ErrorBoundary>
          <Comp {...props} />
        </ErrorBoundary>
      )}
    />
  );
};

WrapRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  exact: PropTypes.bool,
  path: PropTypes.string
};

WrapRoute.defaultProps = {
  exact: true,
  path: ''
};

export default WrapRoute;
