export const subNavMap = {
  dashboard: {
    title: 'Dashboard',
    links: [{ name: 'Overview', link: '/dashboard', active: 'dashboard' }]
  },
  app: {
    title: 'Store',
    links: [
      { name: 'All Apps', link: '/dashboard/apps', active: '/app' },
      { name: 'App Reviews', link: '/dashboard/reviews', active: 'review' },
      { name: 'Categroies', link: '/dashboard/categories', active: 'categor' }
      /*{ name: 'Appearance', link: '#', active: 'appearance' }*/
    ]
  },
  user: {
    title: 'Users',
    links: [
      { name: 'All Users', link: '/dashboard/users', active: 'user' }
      /* { name: 'User Groups', link: '#', active: 'group' },
       { name: 'Roles', link: '#', active: 'role' },
       { name: 'Policy', link: '#', active: 'policy' }*/
    ]
  },
  repo: {
    title: 'Platform',
    links: [
      /*{ name: 'Tickets', link: '#', active: 'ticket' },
       { name: 'Notifications', link: '#', active: 'notification' },*/
      { name: 'Repos', link: '/dashboard/repos', active: 'repo' },
      { name: 'Runtimes', link: '/dashboard/runtimes', active: 'runtime' },
      { name: 'All Clusters', link: '/dashboard/clusters', active: 'cluster' }
      /* { name: 'Service Status', link: '#', active: 'service' }*/
    ]
  }
};

export const getNavs = role => [
  {
    link: '/',
    iconName: 'op-logo',
    active: '',
    title: 'Home'
  },
  {
    link: '/dashboard',
    iconName: 'dashboard',
    active: 'dashboard',
    title: 'Dashboard'
  },
  {
    link: '/dashboard/apps',
    iconName: 'appcenter',
    active: 'app',
    title: role === 'developer' ? 'My Apps' : 'Store'
  },
  {
    link: '/dashboard/repos',
    iconName: 'components',
    active: 'repo',
    title: 'Platform'
  },
  {
    link: '/dashboard/users',
    iconName: 'group',
    active: 'user',
    title: 'Users'
  }
];
