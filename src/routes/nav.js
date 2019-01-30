import routes, { toRoute } from 'routes';

const global_admin = [
  {
    title: 'My dashboard',
    subTitle: 'Dashboard',
    iconName: 'dashboard',
    link: toRoute(routes.portal.overviews, { portal: 'admin' }),
    children: [
      {
        title: 'Overview',
        link: toRoute(routes.portal.overview, { portal: 'admin' })
      }
    ]
  },
  {
    title: 'App Store',
    iconName: 'components',
    link: toRoute(routes.portal.apps, { portal: 'admin' }),
    children: [
      {
        title: 'All Apps',
        link: toRoute(routes.portal.apps, { portal: 'admin' })
      },
      {
        title: 'App Reviews',
        link: toRoute(routes.portal.appsReview, { portal: 'admin' })
      },
      {
        title: 'App Category',
        link: toRoute(routes.portal._admin.categories, { portal: 'admin' })
      },
      {
        title: 'Store Appearance',
        link: '#',
        disabled: true
      }
    ]
  },
  {
    title: 'App service provider',
    iconName: 'shield',
    link: toRoute(routes.portal._admin.providers, { portal: 'admin' }),
    children: [
      {
        title: 'All Providers',
        link: toRoute(routes.portal._admin.providers, { portal: 'admin' })
      },
      {
        title: 'Apply for Residence',
        link: toRoute(routes.portal._admin.providerApply, {
          portal: 'admin'
        })
      },
      {
        title: 'Contract',
        link: '#',
        disabled: true
      },
      {
        title: 'Margin',
        link: '#',
        disabled: true
      }
    ]
  },
  {
    title: 'Work list',
    iconName: 'ticket',
    link: '#',
    disabled: true
  },
  {
    title: 'Financial Center',
    iconName: 'wallet',
    link: '#',
    disabled: true
  },
  {
    title: 'Message and monitoring',
    iconName: 'linechart',
    link: '#',
    disabled: true
  },
  {
    title: 'Account and Permission',
    subTitle: 'Users and Permission',
    iconName: 'group',
    link: toRoute(routes.portal._admin.users, { portal: 'admin' }),
    children: [
      {
        title: 'All Users',
        link: toRoute(routes.portal._admin.users, { portal: 'admin' })
      },
      {
        title: 'Roles',
        link: toRoute(routes.portal._admin.roles, { portal: 'admin' })
      }
    ]
  },
  {
    title: 'Settings',
    subTitle: 'Platform setting',
    iconName: 'cogwheel',
    link: toRoute(routes.portal._admin.cloudEnv, { portal: 'admin' }),
    children: [
      {
        title: 'User authentication',
        link: '#',
        disabled: true
      },
      {
        title: 'Cloud environment',
        link: toRoute(routes.portal._admin.cloudEnv, { portal: 'admin' })
      },
      {
        title: 'Notification server',
        link: toRoute(routes.portal._admin.notificationServer, {
          portal: 'admin'
        })
      }
    ]
  }
];

const isv = [
  {
    title: 'App Manage',
    iconName: 'appcenter',
    link: toRoute(routes.portal.apps, { portal: 'isv' }),
    children: [
      {
        title: 'User authentication',
        link: '#',
        disabled: true
      },
      {
        title: 'Cloud environment',
        link: toRoute(routes.portal._admin.cloudEnv, { portal: 'admin' })
      },
      {
        name: 'Notification server',
        link: toRoute(routes.portal._admin.notificationServer, {
          portal: 'admin'
        })
      }
    ]
  },
  {
    title: 'App Develop',
    iconName: 'wrench',
    link: toRoute(routes.portal.apps, { portal: 'dev' })
  },
  {
    title: 'Work list',
    iconName: 'ticket',
    link: '#'
  },
  {
    title: 'Operation Center',
    iconName: 'linechart',
    link: '#'
  },
  {
    title: 'Financial Center',
    iconName: 'wallet',
    link: '#'
  },
  {
    title: 'Team Members',
    iconName: 'group',
    link: toRoute(routes.portal._isv.users)
  },
  {
    title: 'Service Provider Detail',
    iconName: 'shield',
    link: toRoute(routes.portal._isv.provider, { portal: 'isv' })
  }
];

const developer = [
  {
    title: 'Create app',
    iconName: 'plus-square',
    link: toRoute(routes.portal._dev.appCreate, { portal: 'dev' })
  },
  {
    title: 'View all',
    iconName: 'more',
    link: toRoute(routes.portal.apps, { portal: 'dev' })
  }
];

export default {
  global_admin,
  isv,
  developer
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
          link: toRoute(routes.portal._admin.roles),
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
          link: toRoute(routes.portal._isv.users),
          active: 'user'
        },
        {
          name: 'Role',
          link: toRoute(routes.portal._isv.roles),
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
export const userMenus = [
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
    name: 'Testing env',
    link: toRoute(routes.portal.runtimes),
    iconName: 'image'
  },
  {
    name: 'SSH Keys',
    link: toRoute(routes.profile, { type: 'ssh' }),
    iconName: 'ssh',
    divider: true,
    only: ['user']
  }
];
