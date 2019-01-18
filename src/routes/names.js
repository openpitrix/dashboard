export const portals = ['user', 'dev', 'isv', 'admin'];

// name=> path
export default {
  // common routes
  home: '/',
  appDetail: '/apps/:appId',
  login: '/login',
  profile: '/profile',

  // portals
  user: {
    deployedApps: '/deployed-apps',
    deployedAppDetail: '/deployed-apps/:appId',
    clusters: '/clusters',
    clusterDetail: '/cluster/:clusterId',
    runtimes: '/runtimes',
    deploy: '/apps/:appId/deploy/:versionId?',
    providerApply: '/provider/apply'
  },
  dev: {
    apps: '/apps',
    appCreate: '/apps/create',
    appDetail: '/apps/:appId/info',
    appVersions: '/apps/:appId/versions',
    appVersionDetail: '/apps/:appId/versions/:versionId',
    appVersionCreate: '/apps/:appId/versions/create',
    appAudits: '/apps/:appId/audits',
    // deploy: '/apps/:appId/deploy/:versionId?',
    userInstances: '/apps/:appId/instances',
    userInstanceDetail: '/apps/:appId/instances/:clusterId',
    sandboxInstances: '/apps/:appId/sandbox-instances',
    sandboxInstanceDetail: '/apps/:appId/sandbox-instances/:clusterId'
  },
  isv: {
    apps: '/apps',
    appDetail: '/apps/:appId',
    appsReview: '/apps/review',
    appReviewDetail: '/apps/review/:reviewId',
    // deploy: '/apps/:appId/deploy/:versionId?',
    provider: '/provider',
    providerApply: '/provider/apply'
  },
  admin: {
    apps: '/apps',
    appDetail: '/apps/:appId',
    appsReview: '/apps/review',
    appReviewDetail: '/apps/review/:reviewId',
    // deploy: '/apps/:appId/deploy/:versionId?',
    clusters: '/clusters',
    clusterDetail: '/clusters/:clusterId',
    runtimes: '/runtimes',
    runtimeDetail: '/runtimes/:runtimeId',
    categories: '/categories',
    users: '/users',
    userDetail: '/users/:userId',
    providers: '/providers',
    providerDetail: '/providers/:providerId',
    providerApply: '/providers/apply',
    providerApplyDetail: '/providers/apply/:applyId'
  }
};
