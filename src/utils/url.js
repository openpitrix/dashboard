import qs from 'query-string';

const dashboardPrefix = '/dashboard';

export const toUrl = path => {
  if (!path) return dashboardPrefix;
  if (path.startsWith('/:dash')) {
    path = path.replace('/:dash', dashboardPrefix);
  }
  return path;
};

const getUrlParam = key => {
  const query = qs.parse(location.search);
  return key ? query[key] : query;
};

export { toUrl, getUrlParam };

