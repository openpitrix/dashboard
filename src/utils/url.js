import { qs2Obj } from 'utils';

export const getUrlParam = key => {
  const query = qs2Obj(location.search);
  return key ? query[key] : query;
};
