import { lazy } from 'react';

export const Apps = lazy(() => import('./Apps'));
export const AppAdd = lazy(() => import('./Apps/Add'));
export const AppDetail = lazy(() => import('./Apps/Detail'));
export const AppDeploy = lazy(() => import('./Apps/Deploy'));
export const MyApps = lazy(() => import('./Apps/MyApps'));
export const Audits = lazy(() => import('./Apps/Audits'));
export const Versions = lazy(() => import('./Versions'));
export const VersionDetail = lazy(() => import('./Versions/Detail'));
export const AppInfo = lazy(() => import('./Apps/AppInfo'));

export const Reviews = lazy(() => import('./Reviews'));
export const ReviewDetail = lazy(() => import('./Reviews/Detail'));

export const Providers = lazy(() => import('./Providers'));
export const ProviderDetail = lazy(() => import('./Providers/Detail'));
export const Applications = lazy(() => import('./Providers/Applications'));
export const ApplicationDetail = lazy(() => import('./Providers/Applications/Detail'));
export const ProviderCreate = lazy(() => import('./Providers/Create'));

export const Clusters = lazy(() => import('./Clusters'));
export const ClusterDetail = lazy(() => import('./Clusters/Detail'));

export const Overview = lazy(() => import('./Overview'));

export const Categories = lazy(() => import('./Categories'));

export const Runtimes = lazy(() => import('./Runtimes'));
export const CreateRuntime = lazy(() => import('./Runtimes/Create'));

export const CloudEnv = lazy(() => import('./CloudEnv'));
export const CloudInfo = lazy(() => import('./CloudInfo'));
export const NotificationServer = lazy(() => import('./NotificationServer'));

export const Account = lazy(() => import('./Account'));

export const UserInstance = lazy(() => import('./UserInstance'));
export const UserSandbox = lazy(() => import('./UserSandbox'));
