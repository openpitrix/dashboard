import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react/index';
import { translate } from 'react-i18next';
import classnames from 'classnames';
import _ from 'lodash';

import { Icon, Popover, Image, Tooltip } from 'components/Base';
import Status from 'components/Status';
import MenuLayer from 'components/MenuLayer';

import { subNavMap, getNavs, getDevSubNavs, getBottomNavs } from './navMap';

import styles from './index.scss';

const keys = [
  'app',
  'review',
  'cluster',
  'runtime',
  'repo',
  'categories',
  'category',
  'user',
  'create'
];
const changeKey = {
  review: 'app',
  cluster: 'repo',
  runtime: 'repo',
  categories: 'app',
  category: 'app'
};

@translate()
@inject(({ rootStore }) => ({
  rootStore,
  appStore: rootStore.appStore,
  user: rootStore.user
}))
@observer
class SideNav extends React.Component {
  static propTypes = {
    isScroll: PropTypes.bool,
    hasSubNav: PropTypes.bool,
    className: PropTypes.string
  };

  static defaultProps = {};

  async componentDidMount() {
    const { isDev } = this.props.user;
    const { hasMeunApps, fetchMenuApps } = this.props.appStore;

    if (isDev && !hasMeunApps) {
      await fetchMenuApps();
    }
  }

  getMatchKey = () => {
    const { path } = this.props.match;
    const key = _.find(keys, k => path.indexOf(k) > -1) || 'dashboard';

    return changeKey[key] || key;
  };

  isLinkActive = activeName => {
    const key = this.getMatchKey();
    return activeName === key;
  };

  getSudNavData = () => {
    const key = this.getMatchKey();
    return subNavMap[key];
  };

  renderNav() {
    const { user, appStore, history, t } = this.props;
    const { role, isDev } = user;
    let navs = getNavs[role];
    const { menuApps } = appStore;
    let bottomNavs = getBottomNavs;
    const { pathname } = history.location;

    if (isDev) {
      const topNav = navs[0];
      navs = menuApps.concat(navs.slice(1));
      navs.unshift(topNav);
      bottomNavs = bottomNavs.slice(2);
    }

    return (
      <div className={styles.nav}>
        <ul className={styles.topNav}>
          {navs.map(nav => (
            <li key={nav.iconName || nav.app_id}>
              <a href={nav.link || `/dashboard/app/${nav.app_id}`}>
                {nav.app_id && (
                  <span
                    className={classnames(styles.imageOuter, {
                      [styles.activeApp]: pathname.indexOf(nav.app_id) > -1
                    })}
                  >
                    <Image src={nav.icon} iconSize={16} className={styles.image} />
                  </span>
                )}
                {nav.iconName && (
                  <Icon
                    className={styles.icon}
                    size={nav.iconName === 'more' ? 20 : 24}
                    name={nav.iconName}
                    type={this.isLinkActive(nav.active) ? 'light' : 'dark'}
                  />
                )}
              </a>
              <NavLink exact to={nav.link || `/dashboard/app/${nav.app_id}`}>
                <label className={styles.title}>{t(nav.title || nav.name)}</label>
              </NavLink>
            </li>
          ))}
        </ul>
        <ul className={styles.bottomNav}>
          {bottomNavs.map(
            nav =>
              nav.iconName === 'human' ? (
                <li key={nav.iconName}>
                  <Popover content={this.renderUserMenus()} className={styles.iconOuter}>
                    <Icon
                      className={styles.icon}
                      size={24}
                      name={nav.iconName}
                      type={this.isLinkActive(nav.active) ? 'light' : 'dark'}
                    />
                    <label className={styles.title}>{t(nav.title)}</label>
                  </Popover>
                </li>
              ) : (
                <li key={nav.iconName}>
                  <Icon
                    className={styles.icon}
                    size={24}
                    name={nav.iconName}
                    type={this.isLinkActive(nav.active) ? 'light' : 'dark'}
                  />
                  <label className={styles.title}>{t(nav.title)}</label>
                </li>
              )
          )}
        </ul>
      </div>
    );
  }

  renderSubDev() {
    const { t } = this.props;
    const { url } = this.props.match;

    if (url === '/dashboard') {
      return (
        <div className={styles.subNav}>
          <div className={styles.title}>{t('Dashboard')}</div>
          <Link
            className={classnames(styles.link, { [styles.active]: url.indexOf('dashboard') > -1 })}
            to="/dashboard"
          >
            {t('Overview')}
          </Link>
        </div>
      );
    }

    const { appDetail } = this.props.appStore;

    return (
      <div className={styles.subNav}>
        <div className={styles.title}>
          <div className={styles.name}>{appDetail.name}</div>
          <Status className={styles.status} name={appDetail.status} type={appDetail.status} />
        </div>

        {getDevSubNavs.map(nav => (
          <div key={nav.title} className={styles.subContent}>
            <div className={styles.subTitle}>{nav.title}</div>
            {nav.items.map(item => (
              <Link
                className={classnames(styles.link, {
                  [styles.active]: url.indexOf(item.active) > -1
                })}
                to={item.link}
              >
                {item.name}
              </Link>
            ))}
          </div>
        ))}
      </div>
    );
  }

  renderSubAdmin() {
    const { t } = this.props;
    const subNavData = this.getSudNavData();
    const { path } = this.props.match;

    return (
      <div className={styles.subNav}>
        <div className={styles.title}>
          <div className={styles.name}>{t(subNavData.title)}</div>
        </div>
        {subNavData.links.map(link => (
          <Link
            key={link.name}
            className={classnames(styles.link, { [styles.active]: path.indexOf(link.active) > -1 })}
            to={link.link}
          >
            {t(link.name)}
          </Link>
        ))}
      </div>
    );
  }

  renderHeader() {
    const { isScroll } = this.props;
    const { username } = this.props.user;

    return (
      <div className={classnames(styles.header, { [styles.headerShadow]: isScroll })}>
        <Popover content={<MenuLayer />} className={styles.user}>
          {username}
          <Icon name="caret-down" className={styles.iconDark} type="dark" />
        </Popover>
      </div>
    );
  }

  renderUserMenus() {
    const { user, t } = this.props;

    return (
      <ul className={styles.userMenus}>
        <li>
          <span className={styles.userIcon}>
            <Icon name="human" size={24} type="dark" className={styles.icon} />
          </span>
          {user.username}
        </li>
        <li>
          <Link to="/profile">基本信息</Link>
        </li>
        <li>
          <Link to="/profile">修改密码</Link>
        </li>
        <li>
          <Link to="#">支付</Link>
        </li>
        <li>
          <Link to="#">通知</Link>
        </li>
        <li>
          <Link to="/ssh_keys">{t('SSH Keys')}</Link>
        </li>
        <li>
          <a href="/logout">{t('Log out')}</a>
        </li>
      </ul>
    );
  }

  render() {
    const { hasSubNav, user } = this.props;
    const { isDev, isAdmin } = user;

    return (
      <Fragment>
        {this.renderNav()}
        {hasSubNav && isDev && this.renderSubDev()}
        {hasSubNav && isAdmin && this.renderSubAdmin()}
      </Fragment>
    );
  }
}

export default withRouter(SideNav);
