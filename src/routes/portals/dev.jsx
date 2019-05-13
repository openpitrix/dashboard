import React from 'react';
import { Switch } from 'react-router-dom';

import WrapRoute from 'routes/WrapRoute';
import NotFound from 'components/NotFound';

import {
  Overview,
  Account,
  MyApps,
  AppAdd,
  Versions,
  VersionDetail,
  VersionFiles,
  AppDeploy,
  Audits,
  AppInfo,
  ClusterDetail,
  Runtimes,
  CreateRuntime,
  UserInstance,
  UserSandbox
} from 'pages/Dashboard';

export default ({ prefix }) => (
  <Switch>
    <WrapRoute path={prefix} component={Overview} />

    <WrapRoute path={`${prefix}/profile/:type?`} component={Account} />
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
      path={`${prefix}/apps/:appId/versionFiles/:versionId`}
      component={VersionFiles}
    />
    <WrapRoute
      path={`${prefix}/apps/:appId/deploy/:versionId?`}
      component={AppDeploy}
    />

    <WrapRoute path={`${prefix}/apps/:appId`} component={AppInfo} />
    <WrapRoute path={`${prefix}/apps/:appId/audits`} component={Audits} />

    <WrapRoute
      path={`${prefix}/apps/:appId/instances`}
      component={UserInstance}
    />
    <WrapRoute
      path={`${prefix}/apps/:appId/instances/:clusterId`}
      component={ClusterDetail}
    />

    <WrapRoute
      path={`${prefix}/apps/:appId/sandbox-instances`}
      component={UserSandbox}
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
