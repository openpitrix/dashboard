import load from 'hoc/load';

const isProd = process.env.NODE_ENV === 'production';
const useExactRoute = true;
const dashboardPrefix = '/dashboard';

const dashUrl = path => {
  if (!path) {
    return dashboardPrefix;
  }

  if (path.startsWith('/:dash')) {
    path = path.replace('/:dash', dashboardPrefix);
  }

  return path;
};

export const generateRoutes = routes => {
  return Object.keys(routes).map(route => {
    const resolveComponent =  isProd
      // ? load(`${process.cwd()}/src/pages/${routes[route]}`)
      ? load(routes[route])
      : routes[route];

    const routeDefinition = {
      path: dashUrl(route),
      exact: useExactRoute,
      component: resolveComponent,
      needAuth: route.startsWith('/:dash')
    }

    if (route === '*') {
      Object.assign(routeDefinition, { noMatch: true });
    }
    return routeDefinition;
  });
}

