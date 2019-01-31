import routes, { toRoute } from 'routes';

// First level navigation(top) for admin, isv and developer
export const getNavs = {
  admin: [
    {
      link: toRoute(routes.portal.overview, { portal: 'admin' }),
      iconName: 'dashboard',
      active: 'dashboard',
      title: 'My dashboard'
    },
    {
      link: toRoute(routes.portal.apps, { portal: 'admin' }),
      iconName: 'components',
      active: 'app',
      title: 'App Store'
    },
    {
      link: toRoute(routes.portal._admin.providers, { portal: 'admin' }),
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
      link: toRoute(routes.portal._admin.users, { portal: 'admin' }),
      iconName: 'group',
      active: 'user',
      title: 'Users'
    },
    {
      link: toRoute(routes.portal._admin.cloudEnv, { portal: 'admin' }),
      iconName: 'cogwheel',
      active: 'setting',
      title: 'Settings'
    }
  ],
  isv: [
    {
      link: toRoute(routes.portal.apps, { portal: 'isv' }),
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
      disabled: true,
      title: 'Work list'
    },
    {
      link: '#',
      iconName: 'linechart',
      active: '',
      disabled: true,
      title: 'Operation Center'
    },
    {
      link: '#',
      iconName: 'wallet',
      active: '',
      disabled: true,
      title: 'Financial Center'
    },
    {
      link: toRoute(routes.portal._isv.users, { portal: 'isv' }),
      iconName: 'group',
      active: 'user',
      title: 'Team Members'
    },
    {
      link: toRoute(routes.portal._isv.provider, { portal: 'isv' }),
      iconName: 'shield',
      active: 'provider-detail',
      title: 'Service Provider Detail'
    }
  ],
  dev: [
    {
      link: toRoute(routes.portal._dev.appCreate, { portal: 'dev' }),
      iconName: 'plus-square',
      active: 'create',
      title: 'Create app'
    },
    {
      link: toRoute(routes.portal.apps, { portal: 'dev' }),
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
  },
  {
    link: '#',
    iconName: 'mail',
    active: '',
    title: 'My news'
  }, */
  {
    link: '/profile',
    iconName: 'human',
    active: 'profile',
    title: 'My account'
  }
];

// Secondary navigation for admin and isv
export const subNavMap = {
  admin: {
    dashboard: {
      title: 'Dashboard',
      links: [
        {
          name: 'Overview',
          link: toRoute(routes.portal.overview, { portal: 'admin' }),
          active: 'admin'
        }
      ]
    },
    app: {
      title: 'App Store',
      links: [
        {
          name: 'All Apps',
          link: toRoute(routes.portal.apps, { portal: 'admin' }),
          active: '/apps'
        },
        {
          name: 'App Reviews',
          link: toRoute(routes.portal.appsReview, { portal: 'admin' }),
          active: 'review'
        },
        {
          name: 'App Category',
          link: toRoute(routes.portal._admin.categories, { portal: 'admin' }),
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
          link: toRoute(routes.portal._admin.providers, { portal: 'admin' }),
          active: 'provider'
        },
        {
          name: 'Apply for Residence',
          link: toRoute(routes.portal._admin.providerApply, {
            portal: 'admin'
          }),
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
          link: toRoute(routes.portal._admin.users, { portal: 'admin' }),
          active: 'user'
        },
        {
          name: 'Roles',
          link: toRoute(routes.portal._admin.roles, { portal: 'admin' }),
          active: 'role'
        }
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
          link: toRoute(routes.portal._admin.cloudEnv, { portal: 'admin' }),
          active: 'cloud-env'
        },
        {
          name: 'Notification server',
          link: toRoute(routes.portal._admin.notificationServer, {
            portal: 'admin'
          }),
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
          link: toRoute(routes.portal.apps, { portal: 'isv' }),
          active: '/apps'
        },
        {
          name: 'App Reviews',
          link: toRoute(routes.portal.appsReview, { portal: 'isv' }),
          active: 'review'
        }
      ]
    },
    user: {
      title: 'Team and member',
      links: [
        {
          name: 'All members',
          link: toRoute(routes.portal._isv.users, { portal: 'isv' }),
          active: 'user'
        },
        {
          name: 'Roles',
          link: toRoute(routes.portal._isv.roles, { portal: 'isv' }),
          active: 'role'
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
        link: toRoute(routes.portal._dev.versions, { portal: 'dev', appId }),
        active: 'versions'
      },
      {
        name: 'App information',
        link: toRoute(routes.portal.appDetail, { portal: 'dev', appId }),
        active: 'info'
      },
      {
        name: 'Record',
        link: toRoute(routes.portal._dev.appAudits, { portal: 'dev', appId }),
        active: 'audits'
      }
    ]
  },
  /* {
    title: 'Operation and maintenance',
    items: [
      { name: 'Monitor', link: '#', disabled: true },
      { name: 'Event', link: '#', disabled: true }
    ]
  }, */
  {
    title: 'User',
    items: [
      {
        name: 'Instance',
        link: toRoute(routes.portal._dev.userInstances, {
          portal: 'dev',
          appId
        }),
        active: 'user-instances'
      }
    ]
  },
  {
    title: 'Sandbox',
    items: [
      {
        name: 'Instance',
        link: toRoute(routes.portal._dev.sandboxInstances, {
          portal: 'dev',
          appId
        }),
        active: 'sandbox-instances'
      }
    ]
  }
];

// User menus layer for all roles
export const userMenus = portal => [
  {
    name: 'Account Info',
    link: toRoute(routes.profile),
    iconName: 'folder'
  },
  {
    name: 'Change Password',
    link: toRoute(routes.profile, { type: 'password' }),
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
    name: portal === 'user' ? 'User runtime' : 'Testing env',
    link: toRoute(routes.portal.runtimes, { portal }),
    iconName: 'image',
    userPortalShow: true
  },
  {
    name: 'SSH Keys',
    link: toRoute(routes.profile, { type: 'ssh' }),
    iconName: 'ssh',
    divider: true,
    only: ['user']
  }
];
