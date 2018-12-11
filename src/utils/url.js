const dashboardPrefix = '/dashboard';

const toUrl = path => {
  if (!path) return dashboardPrefix;
  if (path.startsWith('/:dash')) {
    path = path.replace('/:dash', dashboardPrefix);
  }
  return path;
};

const needAuth = route => {
  if (route.startsWith('/:dash')) {
    return true;
  }

  if (route.startsWith('/store/:appId/deploy')) {
    return true;
  }

  const paths = ['/runtimes', '/purchased', '/profile', '/ssh_keys', '/store'];
  return paths.includes(route);
};

export { toUrl, needAuth };
