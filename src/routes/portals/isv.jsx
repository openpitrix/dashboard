import React from 'react';
import { Switch } from 'react-router-dom';

import WrapRoute from 'routes/WrapRoute';
import NotFound from 'components/NotFound';
import {
  Overview,
  Account,
  ApplicationDetail,
  ProviderCreate,
  Apps,
  AppDetail,
  Reviews,
  ReviewDetail,
  Runtimes,
  CreateRuntime,
  ClusterDetail,
  AppDeploy
} from 'pages/Dashboard';

import { Users, Roles } from 'portals/isv/pages';

export default ({ prefix }) => (
  <Switch>
    <WrapRoute path={prefix} component={Overview} />

    <WrapRoute path={`${prefix}/profile/:type?`} component={Account} />
    <WrapRoute path={`${prefix}/provider`} component={ApplicationDetail} />
    <WrapRoute path={`${prefix}/provider/apply`} component={ProviderCreate} />
    <WrapRoute path={`${prefix}/apps`} component={Apps} />
    <WrapRoute path={`${prefix}/apps/review`} component={Reviews} />
    <WrapRoute path={`${prefix}/apps/:appId`} component={AppDetail} />
    <WrapRoute
      path={`${prefix}/apps/review/:reviewId`}
      component={ReviewDetail}
    />
    <WrapRoute
      path={`${prefix}/clusters/:clusterId`}
      component={ClusterDetail}
    />

    <WrapRoute path={`${prefix}/users`} component={Users} />
    <WrapRoute path={`${prefix}/roles`} component={Roles} />

    <WrapRoute path={`${prefix}/runtimes`} component={Runtimes} />
    <WrapRoute path={`${prefix}/runtimes/create`} component={CreateRuntime} />

    <WrapRoute
      path={`${prefix}/apps/:appId/deploy/:versionId?`}
      component={AppDeploy}
    />

    <WrapRoute component={NotFound} />
  </Switch>
);
