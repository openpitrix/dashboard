import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { translate } from 'react-i18next';
import classnames from 'classnames';
import _ from 'lodash';

import { Icon, Popover, Image } from 'components/Base';
import Status from 'components/Status';
import MenuLayer from 'components/MenuLayer';

import {
  subNavMap, getNavs, getDevSubNavs, getBottomNavs
} from './navMap';

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
    className: PropTypes.string,
    hasSubNav: PropTypes.bool,
    isScroll: PropTypes.bool
  };

  static defaultProps = {};

  async componentDidMount() {
    const { isDev } = this.props.user;
    const { hasMeunApps, fetchMenuApps } = this.props.appStore;

    if (isDev && !hasMeunApps) {
      await fetchMenuApps();
    }
  }

  becomeDeveloper = isNormal => {
    const { rootStore } = this.props;
    rootStore.updateUser({
      changedRole: isNormal ? '' : 'user'
    });
    location.href = '/dashboard';
  };

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
    const {
      user, appStore, history, t
    } = this.props;
    const { role, isDev } = user;
    const { pathname } = history.location;
    const { menuApps } = appStore;
    const navs = isDev ? menuApps : getNavs[role];
    const bottomNavs = isDev ? getBottomNavs.slice(2) : getBottomNavs;

    return (
      <div className={styles.nav}>
        <ul className={styles.topNav}>
          <li>
            <Link to="/">
              <img src="/logo_icon.svg" className={styles.icon} />
            </Link>
            <label className={styles.title}>{t('QingCloud App Center')}</label>
          </li>
          {navs.map(nav => (
            <li
              key={nav.iconName || nav.app_id}
              className={classnames({ [styles.devItem]: isDev })}
            >
              <Link to={nav.link || `/dashboard/app/${nav.app_id}`}>
                {nav.app_id && (
                  <span
                    className={classnames(styles.imageOuter, {
                      [styles.activeApp]: pathname.indexOf(nav.app_id) > -1
                    })}
                  >
                    <Image
                      src={nav.icon}
                      iconLetter={t(nav.name)}
                      iconSize={32}
                      className={styles.image}
                    />
                  </span>
                )}
                {nav.iconName && (
                  <Icon
                    className={styles.icon}
                    size={20}
                    name={nav.iconName}
                    type={this.isLinkActive(nav.active) ? 'light' : 'dark'}
                  />
                )}
              </Link>
              <NavLink exact to={nav.link || `/dashboard/app/${nav.app_id}`}>
                <label className={styles.title}>
                  {t(nav.title || nav.name)}
                </label>
              </NavLink>
            </li>
          ))}
          {isDev && (
            <Fragment>
              <li className={styles.devItem}>
                <NavLink
                  className={styles.addOuter}
                  exact
                  to="/dashboard/app/create"
                >
                  <Icon
                    name="add"
                    size={20}
                    type="dark"
                    className={styles.icon}
                  />
                </NavLink>
                <NavLink
                  exact
                  to="/dashboard/app/create"
                  className={styles.title}
                >
                  {t('Create app')}
                </NavLink>
              </li>
              <li>
                <NavLink exact to="/dev/apps">
                  <Icon
                    name="more"
                    size={20}
                    className={styles.icon}
                    type={pathname.indexOf('/dev/apps') > -1 ? 'light' : 'dark'}
                  />
                </NavLink>
                <NavLink exact to="/dev/apps" className={styles.title}>
                  {t('View all')}
                </NavLink>
              </li>
            </Fragment>
          )}
        </ul>
        <ul className={styles.bottomNav}>
          {bottomNavs.map(
            nav => (nav.iconName === 'human' ? (
                <li key={nav.iconName}>
                  <Popover content={<MenuLayer />} className={styles.iconOuter}>
                    <Icon
                      className={styles.icon}
                      size={20}
                      name={nav.iconName}
                      type={this.isLinkActive(nav.active) ? 'light' : 'dark'}
                    />
                    <Link to="#">
                      <label className={styles.title}>{t(nav.title)}</label>
                    </Link>
                  </Popover>
                </li>
            ) : (
                <li key={nav.iconName}>
                  <Icon
                    className={styles.icon}
                    size={20}
                    name={nav.iconName}
                    type={this.isLinkActive(nav.active) ? 'light' : 'dark'}
                  />
                  <Link to="#">
                    <label className={styles.title}>{t(nav.title)}</label>
                  </Link>
                </li>
            ))
          )}
        </ul>
      </div>
    );
  }

  renderSubDev() {
    const { t } = this.props;
    const { url } = this.props.match;
    const { appDetail } = this.props.appStore;

    if (url === '/dashboard') {
      return (
        <div className={styles.subNav}>
          <div className={styles.title}>{t('Dashboard')}</div>
          <Link
            className={classnames(styles.link, {
              [styles.active]: url.indexOf('dashboard') > -1
            })}
            to="/dashboard"
          >
            {t('Overview')}
          </Link>
        </div>
      );
    }

    return (
      <div className={styles.subNav}>
        <div className={styles.title}>
          <div className={styles.name}>{appDetail.name}</div>
          <Status
            className={styles.status}
            name={appDetail.status}
            type={appDetail.status}
          />
        </div>

        {getDevSubNavs.map(nav => (
          <div key={nav.title} className={styles.subContent}>
            <div className={styles.subTitle}>{t(nav.title)}</div>
            {nav.items.map(item => (
              <Link
                key={item.name}
                className={classnames(styles.link, {
                  [styles.active]: url.indexOf(item.active) > -1
                })}
                to={item.link}
              >
                {t(item.name)}
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
            className={classnames(styles.link, {
              [styles.active]: path.indexOf(link.active) > -1
            })}
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
      <div
        className={classnames(styles.header, {
          [styles.headerShadow]: isScroll
        })}
      >
        <Popover content={<MenuLayer />} className={styles.user}>
          {username}
          <Icon name="caret-down" className={styles.iconDark} type="dark" />
        </Popover>
      </div>
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
