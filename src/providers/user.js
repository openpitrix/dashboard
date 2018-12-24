import { getCookie, setCookie } from 'utils';

const ROLE_ADMIN = 'global_admin';
const ROLE_DEV = 'developer';
const ROLE_NORMAL = 'user';

export default class UserProvider {
  constructor() {
    this.role = '';
    this.username = '';
    this.user_id = '';
    this.email = '';
    this.changedRole = '';

    let user = {};

    // read user from cookie
    try {
      user = JSON.parse(getCookie('user') || '{}');
    } catch (err) {}

    Object.assign(this, user);

    this.accessToken = getCookie('access_token');
  }

  canChangeRole() {
    return this.isDev;
  }

  isLoggedIn() {
    return this.accessToken && this.username;
  }

  update(props = {}) {
    Object.assign(this, props);
    this.accessToken = getCookie('access_token');

    // save own props to cookie
    const expires_in = parseInt(getCookie('expires_in'));
    setCookie('user', JSON.stringify(this), new Date(expires_in));
  }

  get isAdmin() {
    return this.role === ROLE_ADMIN;
  }

  get isDev() {
    return (
      this.changedRole === ROLE_DEV
      || (this.changedRole !== ROLE_NORMAL
        && this.role === ROLE_DEV
        && this.username !== 'isv')
    );
  }

  get isNormal() {
    return this.changedRole === ROLE_NORMAL || this.role === ROLE_NORMAL;
  }

  get isISV() {
    return (
      this.changedRole !== ROLE_DEV
      && this.role === ROLE_DEV
      && this.username === 'isv'
    );
  }
}
