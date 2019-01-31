import { getCookie, setCookie } from 'utils';
import { map } from 'lodash';

import { getPortalFromPath } from 'routes';

const ROLE_ADMIN = 'admin';
const ROLE_DEV = 'dev';
const ROLE_ISV = 'isv';
const ROLE_NORMAL = 'user';

// singleton
let user = null;

class UserProvider {
  constructor() {
    this.portal = getCookie('portal');
    this.role = getCookie('role');
    this.username = getCookie('username');
    this.user_id = getCookie('user_id');
    this.email = getCookie('email');
    this.changedRole = getCookie('changedRole');
    this.accessToken = getCookie('access_token');
  }

  isLoggedIn() {
    return Boolean(this.accessToken && this.user_id);
  }

  update(props = {}) {
    Object.assign(this, props);

    // save own props to cookie
    const expires_in = parseInt(getCookie('expires_in'));
    map(props, (v, k) => {
      setCookie(k, v, new Date(expires_in));
    });
  }

  get isAdmin() {
    return this.portal === ROLE_ADMIN;
  }

  get isDev() {
    return this.portal === ROLE_DEV;
  }

  get isNormal() {
    return this.portal === ROLE_NORMAL;
  }

  get isISV() {
    return this.portal === ROLE_ISV;
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
