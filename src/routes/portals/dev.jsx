import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import WrapRoute from 'routes/WrapRoute';
import routes, { withPrefix } from 'routes';

import { MyApps, AppAdd } from 'pages/Dashboard';
import NotFound from 'components/NotFound';

const Routes = ({ prefix }) => (
  <Switch>
    <WrapRoute path={withPrefix(routes.dev.apps, prefix)} component={MyApps} />
    <WrapRoute
      path={withPrefix(routes.dev.appCreate, prefix)}
      component={AppAdd}
    />

    <Route component={NotFound} />
  </Switch>
);

export default Routes;
