export const portals = ['user', 'dev', 'isv', 'admin'];

// route name => route path
export default {
  // common routes
  home: '/',
  appDetail: '/apps/:appId',
  login: '/login',
  logout: '/logout',
  profile: '/profile',

  portal: {
    appsReview: '/:portal/apps/review',
    appReviewDetail: '/:portal/apps/review/:reviewId',

    // portal common keys
    overview: '/:portal',
    apps: '/:portal/apps',
    appDetail: '/:portal/apps/:appId',
    runtimes: '/:portal/runtimes',
    runtimeCreate: '/:portal/runtimes/create',
    deploy: '/:portal/apps/:appId/deploy/:versionId?',

    // partial common routes
    clusters: '/:portal/clusters',
    clusterDetail: '/:portal/clusters/:clusterId',

    // if key prefix with _, means portal section
    _user: {
      providerApply: '/:portal/provider/apply'
    },
    _dev: {
      appCreate: '/:portal/apps/create',
      appAudits: '/:portal/apps/:appId/audits',
      versions: '/:portal/apps/:appId/versions',
      versionCreate: '/:portal/apps/:appId/versions/create',
      versionDetail: '/:portal/apps/:appId/versions/:versionId',
      userInstances: '/:portal/apps/:appId/instances',
      userInstanceDetail: '/:portal/apps/:appId/instances/:clusterId',
      sandboxInstances: '/:portal/apps/:appId/sandbox-instances',
      sandboxInstanceDetail: '/:portal/apps/:appId/sandbox-instances/:clusterId'
    },
    _isv: {
      provider: '/:portal/provider',
      providerApply: '/:portal/provider/apply'
    },
    _admin: {
      categories: '/:portal/categories',
      users: '/:portal/users',
      userDetail: '/:portal/users/:userId',
      providers: '/:portal/providers',
      providerDetail: '/:portal/providers/:providerId',
      providerApply: '/:portal/providers/apply',
      providerApplyDetail: '/:portal/providers/apply/:applyId',
      cloudEnv: '/:portal/settings/cloud-env',
      notificationServer: '/:portal/settings/notification-server'
    }
  }
};
