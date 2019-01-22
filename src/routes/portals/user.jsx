import React from 'react';
import { Switch } from 'react-router-dom';

import WrapRoute from 'routes/WrapRoute';
import NotFound from 'components/NotFound';

import {
  Overview,
  CreateRuntime,
  ProviderCreate,
  AppDeploy
  // Runtimes,
} from 'pages/Dashboard';

import {
  Apps as Purchased,
  AppDetail as PurchasedDetail,
  Clusters,
  ClusterDetail,
  Runtimes
} from 'portals/user/pages';

export default ({ prefix }) => (
  <Switch>
    <WrapRoute path={prefix} component={Overview} />

    <WrapRoute path={`${prefix}/apps`} component={Purchased} />
    <WrapRoute path={`${prefix}/apps/:appId`} component={PurchasedDetail} />
    <WrapRoute
      path={`${prefix}/apps/:appId/deploy/:versionId?`}
      component={AppDeploy}
    />

    <WrapRoute path={`${prefix}/clusters`} component={Clusters} />
    <WrapRoute
      path={`${prefix}/clusters/:clusterId`}
      component={ClusterDetail}
    />

    <WrapRoute path={`${prefix}/runtimes`} component={Runtimes} />
    <WrapRoute path={`${prefix}/runtimes/create`} component={CreateRuntime} />

    <WrapRoute path={`${prefix}/provider/apply`} component={ProviderCreate} />

    <WrapRoute component={NotFound} />
  </Switch>
);
