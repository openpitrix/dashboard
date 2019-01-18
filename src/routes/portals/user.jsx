import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import WrapRoute from 'routes/WrapRoute';
import routes, { withPrefix } from 'routes';

import {
  Purchased,
  PurchasedDetail,
  Clusters,
  ClusterDetail,
  Runtimes,
  ProviderCreate,
  AppDeploy
} from 'pages/Dashboard';

import NotFound from 'components/NotFound';

const Routes = ({ prefix }) => (
  <Switch>
    <WrapRoute
      path={withPrefix(routes.user.deployedApps, prefix)}
      component={Purchased}
    />
    <WrapRoute
      path={withPrefix(routes.user.deployedAppDetail, prefix)}
      component={PurchasedDetail}
    />
    <WrapRoute
      path={withPrefix(routes.user.deploy, prefix)}
      component={AppDeploy}
    />

    <WrapRoute
      path={withPrefix(routes.user.clusters, prefix)}
      component={Clusters}
    />
    <WrapRoute
      path={withPrefix(routes.user.clusterDetail)}
      component={ClusterDetail}
    />

    <WrapRoute
      path={withPrefix(routes.user.runtimes, prefix)}
      component={Runtimes}
    />

    <WrapRoute
      path={withPrefix(routes.user.providerApply, prefix)}
      component={ProviderCreate}
    />

    <Redirect
      from={prefix}
      exact
      to={withPrefix(routes.user.deployedApps, prefix)}
    />
    <Route component={NotFound} />
  </Switch>
);

export default Routes;
