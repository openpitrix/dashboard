import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import WrapRoute from 'routes/WrapRoute';
import * as Dash from 'pages/Dashboard';
import NotFound from 'components/NotFound';

const Routes = ({ prefix }) => (
  <Switch>
    <Route component={NotFound} />
  </Switch>
);

export default Routes;
