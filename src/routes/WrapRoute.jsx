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

  // check current portal and control page access
  if (curPortal && curPortal !== 'user' && !user[`is${roleTypes[curPortal]}`]) {
    return <Redirect to="/" />;
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
  exact: true
};

export default WrapRoute;
