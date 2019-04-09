import { getCookie, setCookie } from 'utils';
import { observable, action } from 'mobx';
import { map } from 'lodash';

import { getPortalFromPath } from 'routes';
import { PORTAL_NAME, FRONT_END_PORTAL } from 'config/roles';

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
    this.accessToken = getCookie('access_token');
    this.loginTime = getCookie('login_time');
    this.lang = getCookie('lang');
  }

  isLoggedIn() {
    return Boolean(this.accessToken && this.user_id);
  }

  @action
  update(props = {}) {
    Object.assign(this, props);
    // this.fixAdminPortal();

    // save own props to cookie
    const expires_in = parseInt(getCookie('expires_in'));
    map(props, (v, k) => {
      setCookie(k, v, new Date(expires_in));
    });
  }

  /* fixAdminPortal() {
    if (this.portal === PORTAL_NAME.admin) {
      this.portal = 'admin';
    }
  } */

  get isAdmin() {
    return this.portal === PORTAL_NAME.admin;
  }

  get isDev() {
    return this.portal === PORTAL_NAME.dev;
  }

  get isNormal() {
    return this.portal === PORTAL_NAME.user;
  }

  get isISV() {
    return this.portal === PORTAL_NAME.isv;
  }

  get isUserPortal() {
    return ['', PORTAL_NAME.user].includes(getPortalFromPath());
  }

  get isDevPortal() {
    return getPortalFromPath() === PORTAL_NAME.dev;
  }

  get isISVPortal() {
    return getPortalFromPath() === PORTAL_NAME.isv;
  }

  get isAdminPortal() {
    return getPortalFromPath() === FRONT_END_PORTAL[PORTAL_NAME.admin];
  }

  get defaultPortal() {
    if (this.isAdmin) {
      return PORTAL_NAME.admin;
    }
    if (this.isISV) {
      return PORTAL_NAME.isv;
    }
    if (this.isDev) {
      return PORTAL_NAME.dev;
    }
    return PORTAL_NAME.user;
  }

  get isEnglish() {
    return this.lang === 'en';
  }
}

export default (() => {
  if (!user) {
    user = new UserProvider();
  }

  return user;
})();
