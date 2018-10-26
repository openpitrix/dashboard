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
      { name: 'All Users', link: '/dashboard/users', active: 'user' },
      { name: 'Roles', link: '#', active: 'role' },
      { name: 'Permission and Policy', link: '#', active: 'policy' }
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

export const getNavs = {
  global_admin: [
    {
      link: '/',
      iconName: 'op-logo',
      active: '',
      title: 'QingCloud 应用中心'
    },
    {
      link: '/dashboard',
      iconName: 'dashboard',
      active: 'dashboard',
      title: '我的工作台'
    },
    {
      link: '/dashboard/apps',
      iconName: 'components',
      active: 'app',
      title: '应用商店'
    },
    {
      link: '/dashboard/repos',
      iconName: 'shield',
      active: 'repo',
      title: '应用服务商ISV'
    },
    {
      link: '#',
      iconName: 'ticket',
      active: '',
      title: '工单'
    },
    {
      link: '#',
      iconName: 'wallet',
      active: '',
      title: '财务中心'
    },
    {
      link: '#',
      iconName: 'linechart',
      active: '',
      title: '消息与监控'
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
      title: '设置'
    }
  ],
  developer: [
    {
      link: '/',
      iconName: 'op-logo',
      active: '',
      title: '应用开发中心'
    },
    {
      link: '/dashboard/app/create',
      iconName: 'plus-square',
      active: 'create',
      title: '创建新应用'
    },
    {
      link: '/dev/apps',
      iconName: 'more',
      active: 'app',
      title: '查看全部'
    }
  ]
};

export const getBottomNavs = [
  {
    link: '#',
    iconName: 'magnifier',
    active: '',
    title: '全局搜索'
  },
  {
    link: '#',
    iconName: 'bell',
    active: '',
    title: '告警'
  },
  {
    link: '#',
    iconName: 'mail',
    active: '',
    title: '我的消息'
  },
  {
    link: '/profile',
    iconName: 'human',
    active: 'profile',
    title: '我的帐户'
  }
];

export const getDevSubNavs = [
  {
    title: '开发',
    items: [
      { name: '版本管理', link: '#' },
      { name: '审核记录', link: '#' },
      { name: '应用信息', link: '#' }
    ]
  },
  {
    title: '运维',
    items: [
      { name: '监控', link: '#' },
      { name: '事件', link: '#' },
      { name: '应用信息', link: '#' }
    ]
  },
  {
    title: '客户',
    items: [{ name: '实例', link: '#' }, { name: '工单', link: '#' }, { name: '消息', link: '#' }]
  },
  {
    title: '沙盒',
    items: [{ name: '实例', link: '#' }, { name: '环境', link: '#' }]
  }
];
