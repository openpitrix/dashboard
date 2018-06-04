import { getCookie } from './index';

const role = getCookie('role');

export default {
  isDeveloper() {
    return role === 'developer';
  },

  isAdmin() {
    return role === 'admin';
  }
};
