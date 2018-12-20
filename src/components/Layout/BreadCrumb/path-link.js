export default isDev => ({
  Dashboard: '/:dash',
  Store: '/:dash/apps',
  'All Apps': '/:dash/apps',
  'App Reviews': '/:dash/reviews',
  Categories: '/:dash/categories',
  Platform: '/:dash/repos',
  Repos: '/:dash/repos',
  Runtimes: isDev ? '/runtimes' : '/:dash/runtimes',
  'All Clusters': '/:dash/clusters',
  Users: '/:dash/users',
  'All Users': '/:dash/users',
  'My Apps': '/:dash/apps',
  Test: '/:dash/clusters',
  'Cloud Provider': '/:dash/cloud-providers'
});
