import _ from 'lodash';
import { getCookie } from 'utils';

const ROLE_ADMIN = 'global_admin';
const ROLE_DEV = 'developer';
const ROLE_NORMAL = 'user';

export default class UserProvider {
  constructor() {
    this.info = {};

    try {
      this.info = JSON.parse(getCookie('user') || '{}');
    } catch (err) {}

    this.role = this.info.role;

    // derived prop
    this.isAdmin = this.role === ROLE_ADMIN;
    this.isDev = this.role === ROLE_DEV;
    this.isNormal = this.role === ROLE_NORMAL;

    /*
     changed to role

     dev => normal
     normal => dev


     if `this.changedRole` is set, changedRole will override `this.role`
     */
    this.changedRole = '';

    this.accessToken = getCookie('access_token');
  }

  canChangeRole() {
    return this.isDev;
  }

  isLoggedIn() {
    return Boolean(this.accessToken) && this.info.username;
  }

  update(props = {}) {
    _.extend(this, props);
  }

  get username() {
    return this.info.username;
  }

  get email() {
    return this.info.email;
  }

  get user_id() {
    return this.info.user_id;
  }
}
