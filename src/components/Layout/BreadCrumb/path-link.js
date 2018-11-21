export default isDev => ({
  Dashboard: '/dashboard',
  Store: '/dashboard/apps',
  'All Apps': '/dashboard/apps',
  'App Reviews': '/dashboard/reviews',
  Categories: '/dashboard/categories',
  Platform: '/dashboard/repos',
  Repos: '/dashboard/repos',
  Runtimes: isDev ? '/runtimes' : '/dashboard/runtimes',
  'All Clusters': '/dashboard/clusters',
  Users: '/dashboard/users',
  'All Users': '/dashboard/users',
  'My Apps': '/dashboard/apps',
  Test: '/dashboard/clusters'
});
