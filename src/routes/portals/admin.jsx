import React from 'react';
import { Switch } from 'react-router-dom';

import WrapRoute from 'routes/WrapRoute';
import NotFound from 'components/NotFound';
import {
  Overview,
  Apps,
  AppDetail,
  Clusters,
  ClusterDetail,
  Runtimes,
  CreateRuntime,
  Providers,
  ProviderDetail,
  Applications,
  ApplicationDetail,
  Reviews,
  ReviewDetail,
  AppDeploy,
  CloudEnv,
  NotificationServer
} from 'pages/Dashboard';

import {
  Users,
  Roles,
} from 'portals/admin/pages';

export default ({ prefix }) => (
  <Switch>
    <WrapRoute path={`${prefix}`} component={Overview} />

    <WrapRoute path={`${prefix}/apps`} component={Apps} />
    <WrapRoute path={`${prefix}/apps/review`} component={Reviews} />
    <WrapRoute
      path={`${prefix}/apps/review/:reviewId`}
      component={ReviewDetail}
    />
    <WrapRoute
      path={`${prefix}/apps/:appId/deploy/:versionId?`}
      component={AppDeploy}
    />
    <WrapRoute path={`${prefix}/apps/:appId`} component={AppDetail} />

    <WrapRoute path={`${prefix}/clusters`} component={Clusters} />
    <WrapRoute
      path={`${prefix}/clusters/:clusterId`}
      component={ClusterDetail}
    />

    <WrapRoute path={`${prefix}/runtimes`} component={Runtimes} />
    <WrapRoute path={`${prefix}/runtimes/create`} component={CreateRuntime} />


    <WrapRoute path={`${prefix}/users`} component={Users} />
    <WrapRoute path={`${prefix}/roles`} component={Roles} />

    <WrapRoute path={`${prefix}/providers`} component={Providers} />
    <WrapRoute path={`${prefix}/providers/apply`} component={Applications} />
    <WrapRoute
      path={`${prefix}/providers/apply/:applyId`}
      component={ApplicationDetail}
    />
    <WrapRoute
      path={`${prefix}/providers/:providerId`}
      component={ProviderDetail}
    />
    <WrapRoute path={`${prefix}/settings/cloud-env`} component={CloudEnv} />
    <WrapRoute
      path={`${prefix}/settings/notification-server`}
      component={NotificationServer}
    />
    <WrapRoute component={NotFound} />
  </Switch>
);
