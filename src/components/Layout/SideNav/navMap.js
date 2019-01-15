// First level navigation(top) for admin, isv and developer
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
      title: 'Work list',
      disabled: true
    },
    {
      link: '#',
      iconName: 'wallet',
      active: '',
      title: 'Financial Center',
      disabled: true
    },
    {
      link: '#',
      iconName: 'linechart',
      active: '',
      title: 'Message and monitoring',
      disabled: true
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
      title: 'Settings',
      disabled: true
    }
  ],
  isv: [
    {
      link: '/dashboard/apps',
      iconName: 'appcenter',
      active: 'app',
      title: 'App Manage'
    },
    {
      link: '#',
      iconName: 'wrench',
      active: 'develop',
      title: 'App Develop'
    },
    {
      link: '#',
      iconName: 'ticket',
      active: '',
      title: 'Work list'
    },
    {
      link: '#',
      iconName: 'linechart',
      active: '',
      title: 'Operation Center'
    },
    {
      link: '#',
      iconName: 'wallet',
      active: '',
      title: 'Financial Center'
    },
    {
      link: '#',
      iconName: 'group',
      active: 'user',
      title: 'Team Members'
    },
    {
      link: '/dashboard/provider-detail',
      iconName: 'shield',
      active: 'provider-detail',
      title: '服务商详情'
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

// First level navigation(bottom) for all roles
export const getBottomNavs = [
  /* {
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
  }, */
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

// Secondary navigation for admin and isv
export const subNavMap = {
  global_admin: {
    dashboard: {
      title: 'Dashboard',
      links: [{ name: 'Overview', link: '/dashboard', active: 'dashboard' }]
    },
    app: {
      title: 'App Store',
      links: [
        { name: 'All Apps', link: '/dashboard/apps', active: '/apps' },
        {
          name: 'App Reviews',
          link: '/dashboard/app-reviews',
          active: 'review'
        },
        {
          name: 'App Category',
          link: '/dashboard/categories',
          active: 'categories'
        },
        {
          name: 'Store Appearance',
          link: '#',
          active: 'appearance',
          disabled: true
        }
      ]
    },
    provider: {
      title: 'App service provider',
      links: [
        {
          name: 'All Providers',
          link: '/dashboard/providers',
          active: 'provider'
        },
        {
          name: 'Apply for Residence',
          link: '/dashboard/applications',
          active: 'applications'
        },
        {
          name: 'Contract',
          link: '#',
          active: '#',
          disabled: true
        },
        {
          name: 'Margin',
          link: '#',
          active: '#',
          disabled: true
        }
      ]
    },
    user: {
      title: 'Users and Permission',
      links: [
        { name: 'All Users', link: '/dashboard/users', active: 'user' },
        { name: 'Roles', link: '#', active: 'role' },
        { name: 'Permission and Policy', link: '#', active: 'policy' }
      ]
    }
  },
  isv: {
    app: {
      title: 'App Manage',
      links: [
        { name: 'All Apps', link: '/dashboard/apps', active: '/apps' },
        {
          name: 'App Reviews',
          link: '/dashboard/app-reviews',
          active: 'review'
        }
      ]
    }
  }
};

// Secondary navigation for developer
export const getDevSubNavs = appId => [
  {
    title: 'Development',
    items: [
      {
        name: 'Version',
        link: `/dashboard/app/${appId}/versions`,
        active: 'versions'
      },
      {
        name: 'App information',
        link: `/dashboard/app/${appId}/info`,
        active: 'info'
      },
      {
        name: 'Record',
        link: `/dashboard/app/${appId}/audits`,
        active: 'audits'
      }
    ]
  },
  {
    title: 'Operation and maintenance',
    items: [
      { name: 'Monitor', link: '#', disabled: true },
      { name: 'Event', link: '#', disabled: true }
    ]
  },
  {
    title: 'User',
    items: [
      {
        name: 'Instance',
        link: `/dashboard/app/${appId}/user-instances`,
        active: 'user-instances'
      }
    ]
  },
  {
    title: 'Sandbox',
    items: [
      {
        name: 'Instance',
        link: `/dashboard/app/${appId}/sandbox-instances`,
        active: 'sandbox-instances'
      }
    ]
  }
];

// User menus layer for all roles
export const userMenus = [
  {
    name: 'Account Info',
    link: '/dashboard/account',
    iconName: 'folder'
  },
  {
    name: 'Change Password',
    link: '/dashboard/account/password',
    iconName: 'lock'
  },
  {
    name: 'Notice settings',
    link: '#',
    iconName: 'loudspeaker',
    disabled: true
  },
  {
    name: 'Payment',
    link: '#',
    iconName: 'creditcard',
    disabled: true,
    divider: true // show divide line
  },
  {
    name: 'Testing env',
    link: '/:dash/runtimes',
    iconName: 'image'
  },
  {
    name: 'SSH Keys',
    link: '/dashboard/account/ssh',
    iconName: 'ssh',
    divider: true,
    only: ['user']
  }
];
