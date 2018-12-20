export const subNavMap = {
  dashboard: {
    title: 'Dashboard',
    links: [{ name: 'Overview', link: '/dashboard', active: 'dashboard' }]
  },
  app: {
    title: 'Store',
    links: [
      { name: 'All Apps', link: '/dashboard/apps', active: '/app' },
      { name: 'App Reviews', link: '/dashboard/app-reviews', active: 'review' },
      { name: 'Categroies', link: '/dashboard/categories', active: 'categor' }
      /* { name: 'Appearance', link: '#', active: 'appearance' } */
    ]
  },
  user: {
    title: 'Users',
    links: [
      { name: 'All Users', link: '/dashboard/users', active: 'user' },
      { name: 'Roles', link: '#', active: 'role' },
      { name: 'Permission and Policy', link: '#', active: 'policy' }
    ]
  },
  repo: {
    title: 'Platform',
    links: [
      /* { name: 'Tickets', link: '#', active: 'ticket' },
       { name: 'Notifications', link: '#', active: 'notification' }, */
      { name: 'Repos', link: '/dashboard/repos', active: 'repo' },
      { name: 'Runtimes', link: '/dashboard/runtimes', active: 'runtime' },
      { name: 'All Clusters', link: '/dashboard/clusters', active: 'cluster' }
      /* { name: 'Service Status', link: '#', active: 'service' } */
    ]
  },
  provider: {
    title: 'App service provider',
    links: [
      { name: '全部服务商', link: '/dashboard/providers', active: 'providers' },
      {
        name: '入驻申请',
        link: '/dashboard/applications',
        active: 'applications'
      },
      { name: '合约', link: '#', active: '#' },
      { name: '保证金', link: '#', active: '#' }
    ]
  }
};

export const getNavs = {
  global_admin: [
    {
      link: '/dashboard',
      iconName: 'dashboard',
      active: 'dashboard',
      title: 'My dashboard'
    },
    {
      link: '/dashboard/apps',
      iconName: 'components',
      active: 'app',
      title: 'App Store'
    },
    {
      link: '/dashboard/providers',
      iconName: 'shield',
      active: 'provider',
      title: 'App service provider'
    },
    {
      link: '#',
      iconName: 'ticket',
      active: '',
      title: 'Work list'
    },
    {
      link: '#',
      iconName: 'wallet',
      active: '',
      title: 'Financial Center'
    },
    {
      link: '#',
      iconName: 'linechart',
      active: '',
      title: 'Message and monitoring'
    },
    {
      link: '/dashboard/users',
      iconName: 'group',
      active: 'user',
      title: 'Users'
    },
    {
      link: '#',
      iconName: 'cogwheel',
      active: '',
      title: 'Settings'
    }
  ],
  developer: [
    {
      link: '/dashboard/app/create',
      iconName: 'plus-square',
      active: 'create',
      title: 'Create app'
    },
    {
      link: '/dashboard/my/apps',
      iconName: 'more',
      active: 'app',
      title: 'View all'
    }
  ]
};

export const getBottomNavs = [
  {
    link: '#',
    iconName: 'magnifier',
    active: '',
    title: 'Global search'
  },
  {
    link: '#',
    iconName: 'bell',
    active: '',
    title: 'Alarms'
  },
  {
    link: '#',
    iconName: 'mail',
    active: '',
    title: 'My news'
  },
  {
    link: '/profile',
    iconName: 'human',
    active: 'profile',
    title: 'My account'
  }
];

export const getDevSubNavs = appId => [
  {
    title: 'Development',
    items: [
      {
        name: 'Version',
        link: `/dashboard/app/${appId}/versions`
      },
      { name: 'App information', link: `/dashboard/app/${appId}/info` },
      { name: 'Record', link: `/dashboard/app/${appId}/audits` }
    ]
  },
  {
    title: 'Operation and maintenance',
    items: [
      { name: 'Monitor', link: '#' },
      { name: 'Event', link: '#' },
      { name: 'App information', link: '#' }
    ]
  },
  {
    title: 'Customer',
    items: [
      { name: 'Instance', link: `/dashboard/app/${appId}/customer-instances` },
      { name: 'Work list', link: '#' },
      { name: 'News', link: '#' }
    ]
  },
  {
    title: 'Sandbox',
    items: [
      { name: 'Instance', link: `/dashboard/app/${appId}/sandbox-instances` },
      { name: 'Environment', link: '#' }
    ]
  }
];

export const userMenus = [
  {
    name: 'Account Info',
    link: '/dashboard/account',
    iconName: 'folder'
  },
  {
    name: 'Change Password',
    link: '/dashboard/account?type=Change Password',
    iconName: 'lock'
  },
  {
    name: 'Notice settings',
    link: '#',
    iconName: 'loudspeaker'
  },
  {
    name: 'Payment',
    link: '#',
    iconName: 'creditcard',
    divider: true // show divide line
  },
  {
    name: 'Testing env',
    link: '/:dash/testing-runtime',
    iconName: 'image',
    only: ['global_admin', 'developer']
  },
  {
    name: 'SSH Keys',
    link: '/dashboard/account?type=SSH Keys',
    iconName: 'ssh',
    divider: true
  }
];
