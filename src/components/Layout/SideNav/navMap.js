import routes, { toRoute } from 'routes';

// First level navigation(top) for admin, isv and developer
export const getNavs = {
  global_admin: [
    {
      link: toRoute(routes.portal.overview),
      iconName: 'dashboard',
      active: 'dashboard',
      title: 'My dashboard'
    },
    {
      link: toRoute(routes.portal.apps),
      iconName: 'components',
      active: 'app',
      title: 'App Store'
    },
    {
      link: toRoute(routes.portal._admin.providers),
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
      link: toRoute(routes.portal._admin.users),
      iconName: 'group',
      active: 'user',
      title: 'Users'
    },
    {
      link: toRoute(routes.portal._admin.cloudEnv),
      iconName: 'cogwheel',
      active: 'setting',
      title: 'Settings'
    }
  ],
  isv: [
    {
      link: toRoute(routes.portal.apps),
      iconName: 'appcenter',
      active: 'app',
      title: 'App Manage'
    },
    {
      link: toRoute(routes.portal.apps, { portal: 'dev' }),
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
      link: toRoute(routes.portal._dev.appCreate),
      iconName: 'plus-square',
      active: 'create',
      title: 'Create app'
    },
    {
      link: toRoute(routes.portal.apps),
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
      links: [
        {
          name: 'Overview',
          link: toRoute(routes.portal.overview),
          active: 'admin'
        }
      ]
    },
    app: {
      title: 'App Store',
      links: [
        {
          name: 'All Apps',
          link: toRoute(routes.portal.apps),
          active: '/apps'
        },
        {
          name: 'App Reviews',
          link: toRoute(routes.portal.appsReview),
          active: 'review'
        },
        {
          name: 'App Category',
          link: toRoute(routes.portal._admin.categories),
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
          link: toRoute(routes.portal._admin.providers),
          active: 'provider'
        },
        {
          name: 'Apply for Residence',
          link: toRoute(routes.portal._admin.providerApply),
          active: 'apply'
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
        {
          name: 'All Users',
          link: toRoute(routes.portal._admin.users),
          active: 'user'
        },
        { name: 'Roles', link: '#', active: 'role' }
      ]
    },
    setting: {
      title: 'Platform setting',
      links: [
        {
          name: 'User authentication',
          link: '#',
          active: 'user-auth',
          disabled: true
        },
        {
          name: 'Cloud environment',
          link: toRoute(routes.portal._admin.cloudEnv),
          active: 'cloud-env'
        },
        {
          name: 'Notification server',
          link: toRoute(routes.portal._admin.notificationServer),
          active: 'notification-server'
        }
      ]
    }
  },
  isv: {
    app: {
      title: 'App Manage',
      links: [
        {
          name: 'All Apps',
          link: toRoute(routes.portal.apps),
          active: '/apps'
        },
        {
          name: 'App Reviews',
          link: toRoute(routes.portal.appsReview),
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
        link: toRoute(routes.portal._dev.versions, { appId }),
        active: 'versions'
      },
      {
        name: 'App information',
        link: toRoute(routes.portal.appDetail, { appId }),
        active: 'info'
      },
      {
        name: 'Record',
        link: toRoute(routes.portal._dev.appAudits, { appId }),
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
        link: toRoute(routes.portal._dev.userInstances, { appId }),
        active: 'user-instances'
      }
    ]
  },
  {
    title: 'Sandbox',
    items: [
      {
        name: 'Instance',
        link: toRoute(routes.portal._dev.sandboxInstances, { appId }),
        active: 'sandbox-instances'
      }
    ]
  }
];

// User menus layer for all roles
export const userMenus = [
  {
    name: 'Account Info',
    link: '/profile',
    iconName: 'folder'
  },
  {
    name: 'Change Password',
    link: '/profile/password',
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
    link: toRoute(routes.portal.runtimes),
    iconName: 'image'
  },
  {
    name: 'SSH Keys',
    link: '/profile/ssh',
    iconName: 'ssh',
    divider: true,
    only: ['user']
  }
];
