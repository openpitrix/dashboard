import { getCookie } from './index';

let role;

export default {
  get loginRole(){
    if(!role){
      role = getCookie('role');
    }
    return role;
  },
  isDeveloper() {
    return this.loginRole === 'developer';
  },

  isAdmin() {
    return this.loginRole === 'admin';
  }
};
