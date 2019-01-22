import React from 'react';
import { Switch } from 'react-router-dom';

import WrapRoute from 'routes/WrapRoute';
import NotFound from 'components/NotFound';

import {
  Overview,
  MyApps,
  AppAdd,
  Versions,
  VersionDetail,
  Deploy,
  Audits,
  AppInfo,
  Clusters,
  ClusterDetail,
  Runtimes,
  CreateRuntime
} from 'pages/Dashboard';

export default ({ prefix }) => (
  <Switch>
    <WrapRoute path={prefix} component={Overview} />

    <WrapRoute path={`${prefix}/apps`} component={MyApps} />
    <WrapRoute path={`${prefix}/apps/create`} component={AppAdd} />

    <WrapRoute path={`${prefix}/apps/:appId/versions`} component={Versions} />
    <WrapRoute
      path={`${prefix}/apps/:appId/versions/create`}
      component={AppAdd}
    />
    <WrapRoute
      path={`${prefix}/apps/:appId/versions/:versionId`}
      component={VersionDetail}
    />
    <WrapRoute
      path={`${prefix}/apps/:appId/deploy/:versionId？`}
      component={Deploy}
    />

    <WrapRoute path={`${prefix}/apps/:appId`} component={AppInfo} />
    <WrapRoute path={`${prefix}/apps/:appId/audits`} component={Audits} />

    <WrapRoute path={`${prefix}/apps/:appId/instances`} component={Clusters} />
    <WrapRoute
      path={`${prefix}/apps/:appId/instances/:clusterId`}
      component={ClusterDetail}
    />

    <WrapRoute
      path={`${prefix}/apps/:appId/sandbox-instances`}
      component={Clusters}
    />
    <WrapRoute
      path={`${prefix}/apps/:appId/sandbox-instances/:clusterId`}
      component={ClusterDetail}
    />

    <WrapRoute path={`${prefix}/runtimes`} component={Runtimes} />
    <WrapRoute path={`${prefix}/runtimes/create`} component={CreateRuntime} />

    <WrapRoute component={NotFound} />
  </Switch>
);
