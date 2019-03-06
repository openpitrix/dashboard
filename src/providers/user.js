import { getCookie, setCookie } from 'utils';
import { observable, action } from 'mobx';
import { map } from 'lodash';

import { getPortalFromPath } from 'routes';

const ROLE_ADMIN = 'global_admin';
const ROLE_DEV = 'dev';
const ROLE_ISV = 'isv';
const ROLE_NORMAL = 'user';

// singleton
let user = null;

class UserProvider {
  @observable username = '';

  constructor() {
    this.portal = getCookie('portal');
    this.role = getCookie('role');
    this.username = getCookie('username');
    this.user_id = getCookie('user_id');
    this.email = getCookie('email');
    this.changedRole = getCookie('changedRole');
    this.accessToken = getCookie('access_token');
    this.loginTime = getCookie('login_time');
    this.fixAdminPortal();
  }

  isLoggedIn() {
    return Boolean(this.accessToken && this.user_id);
  }

  @action
  update(props = {}) {
    Object.assign(this, props);
    this.fixAdminPortal();

    // save own props to cookie
    const expires_in = parseInt(getCookie('expires_in'));
    map(props, (v, k) => {
      setCookie(k, v, new Date(expires_in));
    });
  }

  fixAdminPortal() {
    if (this.portal === ROLE_ADMIN) {
      this.portal = 'admin';
    }
  }

  get isAdmin() {
    return this.portal === 'admin';
  }

  get isDev() {
    return this.role === ROLE_DEV;
  }

  get isNormal() {
    return this.role === ROLE_NORMAL;
  }

  get isISV() {
    return this.role === ROLE_ISV;
  }

  get isUserPortal() {
    return ['', 'user'].includes(getPortalFromPath());
  }

  get isDevPortal() {
    return getPortalFromPath() === 'dev';
  }

  get defaultPortal() {
    if (this.isAdmin) {
      return 'admin';
    }
    if (this.isISV) {
      return 'isv';
    }
    if (this.isDev) {
      return 'dev';
    }
    return 'user';
  }
}

export default (() => {
  if (!user) {
    user = new UserProvider();
  }

  return user;
})();
