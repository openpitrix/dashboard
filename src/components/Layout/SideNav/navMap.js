import routes, { toRoute } from 'routes';
import { PORTAL_NAME } from 'config/roles';

import ACTION from 'config/action-id';

// First level navigation(top) for admin, isv and developer
export const getNavs = {
  [PORTAL_NAME.admin]: [
    /* {
      link: toRoute(routes.portal.overview, { portal: 'admin' }),
      iconName: 'dashboard',
      title: 'My dashboard'
    }, */
    {
      link: toRoute(routes.portal.apps, { portal: 'admin' }),
      iconName: 'components',
      title: 'App Store'
    },
    {
      link: toRoute(routes.portal._admin.providers, { portal: 'admin' }),
      iconName: 'shield',
      title: 'App service provider'
    },
    {
      link: '#',
      iconName: 'ticket',
      title: 'Work list',
      disabled: true
    },
    {
      link: '#',
      iconName: 'wallet',
      title: 'Financial Center',
      disabled: true
    },
    {
      link: '#',
      iconName: 'linechart',
      title: 'Message and monitoring',
      disabled: true
    },
    {
      link: toRoute(routes.portal._admin.users, { portal: 'admin' }),
      iconName: 'group',
      title: 'Users and Permission'
    },
    {
      link: toRoute(routes.portal._admin.cloudEnv, { portal: 'admin' }),
      iconName: 'cogwheel',
      title: 'Settings'
    }
  ],
  [PORTAL_NAME.isv]: [
    {
      link: toRoute(routes.portal.apps, { portal: 'isv' }),
      iconName: 'appcenter',
      title: 'App Manage'
    },
    {
      link: toRoute(routes.portal.apps, { portal: 'dev' }),
      iconName: 'wrench',
      title: 'App Develop'
    },
    {
      link: '#',
      iconName: 'ticket',
      disabled: true,
      title: 'Work list'
    },
    {
      link: '#',
      iconName: 'linechart',
      disabled: true,
      title: 'Operation Center'
    },
    {
      link: '#',
      iconName: 'wallet',
      disabled: true,
      title: 'Financial Center'
    },
    {
      link: toRoute(routes.portal._isv.users, { portal: 'isv' }),
      iconName: 'group',
      title: 'Team Members'
    },
    {
      link: toRoute(routes.portal._isv.provider, { portal: 'isv' }),
      iconName: 'shield',
      title: 'Service Provider Detail'
    }
  ],
  [PORTAL_NAME.dev]: [
    {
      link: toRoute(routes.portal._dev.appCreate, { portal: 'dev' }),
      iconName: 'plus-square',
      title: 'Create app'
    },
    {
      link: toRoute(routes.portal.apps, { portal: 'dev' }),
      iconName: 'more',
      title: 'View all'
    }
  ]
};

// First level navigation(bottom) for all roles
export const getBottomNavs = [
  /* {
    link: '#',
    iconName: 'magnifier',
    title: 'Global search'
  },
  {
    link: '#',
    iconName: 'bell',
    title: 'Alarms'
  },
  {
    link: '#',
    iconName: 'mail',
    title: 'My news'
  }, */
  {
    link: '/profile',
    iconName: 'human',
    title: 'My account'
  }
];

// Secondary navigation for admin and isv
export const subNavMap = {
  [PORTAL_NAME.admin]: {
    dashboard: {
      title: 'Dashboard',
      links: [
        {
          name: 'Overview',
          link: toRoute(routes.portal.overview, { portal: 'admin' })
        }
      ]
    },
    app: {
      title: 'App Store',
      links: [
        {
          name: 'All Apps',
          link: toRoute(routes.portal.apps, { portal: 'admin' })
        },
        {
          name: 'App Reviews',
          link: toRoute(routes.portal.appsReview, { portal: 'admin' })
        },
        {
          name: 'App Category',
          link: toRoute(routes.portal._admin.categories, { portal: 'admin' })
        },
        {
          name: 'Store Appearance',
          link: '#',
          disabled: true
        }
      ]
    },
    provider: {
      title: 'App service provider',
      links: [
        {
          name: 'All Providers',
          link: toRoute(routes.portal._admin.providers, { portal: 'admin' })
        },
        {
          name: 'Apply for Residence',
          link: toRoute(routes.portal._admin.providerApply, {
            portal: 'admin'
          }),
          actionId: ACTION.isv_auth
        },
        {
          name: 'Contract',
          link: '#',
          disabled: true
        },
        {
          name: 'Margin',
          link: '#',
          disabled: true
        }
      ]
    },
    user: {
      title: 'Users and Permission',
      links: [
        {
          name: 'All Users',
          link: toRoute(routes.portal._admin.users, { portal: 'admin' })
        },
        {
          name: 'Roles',
          link: toRoute(routes.portal._admin.roles, { portal: 'admin' })
        }
      ]
    },
    setting: {
      title: 'Platform setting',
      links: [
        {
          name: 'User authentication',
          link: '#',
          disabled: true
        },
        {
          name: 'Cloud environment',
          link: toRoute(routes.portal._admin.cloudEnv, { portal: 'admin' })
        },
        {
          name: 'Notification server',
          link: toRoute(routes.portal._admin.notificationServer, {
            portal: 'admin'
          })
        }
      ]
    }
  },
  [PORTAL_NAME.isv]: {
    app: {
      title: 'App Manage',
      links: [
        {
          name: 'All Apps',
          link: toRoute(routes.portal.apps, { portal: 'isv' })
        },
        {
          name: 'App Reviews',
          link: toRoute(routes.portal.appsReview, { portal: 'isv' })
        }
      ]
    },
    user: {
      title: 'Team and member',
      links: [
        {
          name: 'All members',
          link: toRoute(routes.portal._isv.users, { portal: 'isv' })
        },
        {
          name: 'Roles',
          link: toRoute(routes.portal._isv.roles, { portal: 'isv' })
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
        link: toRoute(routes.portal._dev.versions, { portal: 'dev', appId })
      },
      {
        name: 'App information',
        link: toRoute(routes.portal.appDetail, { portal: 'dev', appId })
      },
      {
        name: 'Record',
        link: toRoute(routes.portal._dev.appAudits, { portal: 'dev', appId })
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
        })
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
        })
      }
    ]
  }
];

// User menus layer for all roles
export const userMenus = portal => [
  {
    name: 'Account Info',
    link: toRoute(routes.portal.profile, { type: 'account' }),
    iconName: 'folder'
  },
  {
    name: 'Change Password',
    link: toRoute(routes.portal.profile, { type: 'password' }),
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
    disabled: true
  },
  {
    name: portal === PORTAL_NAME.user ? 'User runtime' : 'Testing env',
    link: toRoute(routes.portal.runtimes, { portal }),
    iconName: 'image',
    userPortalShow: true,
    divider: true,
    only: [PORTAL_NAME.isv, PORTAL_NAME.dev, PORTAL_NAME.admin]
  },
  {
    name: 'Test instance',
    link: toRoute(routes.portal.clusters, { portal }),
    iconName: 'cluster',
    userPortalShow: true,
    only: [PORTAL_NAME.admin]
  },
  {
    name: 'SSH Keys',
    link: toRoute(routes.portal.profile, { type: 'ssh' }),
    iconName: 'ssh',
    divider: true
  }
];
