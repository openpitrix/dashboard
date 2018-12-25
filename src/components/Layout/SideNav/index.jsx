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

import { subNavMap, getNavs, getDevSubNavs, getBottomNavs } from './navMap';

import styles from './index.scss';

const keys = [
  'applications',
  'app',
  'review',
  'cluster',
  'runtime',
  'repo',
  'categories',
  'category',
  'user',
  'create',
  'provider-detail',
  'provider'
];
const changeKey = {
  review: 'app',
  cluster: 'repo',
  runtime: 'repo',
  categories: 'app',
  category: 'app',
  applications: 'provider'
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
    hasSubNav: PropTypes.bool
  };

  static defaultProps = {};

  async componentDidMount() {
    const { appStore, user, match, hasSubNav } = this.props;
    const { isDev } = user;
    const { hasMeunApps, fetchMenuApps } = appStore;

    const { appId } = match.params;
    if (hasSubNav && isDev && appId) {
      await appStore.fetch(appId);
    }

    if (isDev && !hasMeunApps) {
      await fetchMenuApps();
    }
  }

  becomeDeveloper = type => {
    const { rootStore } = this.props;

    if (type === 'wrench' || type === 'back') {
      rootStore.updateUser({
        changedRole: type === 'back' ? '' : 'developer'
      });
      const url = type === 'back' ? '/dashboard/apps' : '/dashboard/my/apps';
      location.replace(url);
    }
  };

  getMatchKey = () => {
    const { path } = this.props.match;
    const key = _.find(keys, k => path.indexOf(k) > -1) || 'app';

    return changeKey[key] || key;
  };

  isLinkActive = activeName => {
    const key = this.getMatchKey();

    return activeName === key;
  };

  getSudNavData = () => {
    const { user } = this.props;
    const { isISV } = user;
    const role = isISV ? 'isv' : user.role;
    const key = this.getMatchKey();

    return _.get(subNavMap, `${role}.${key}`, {});
  };

  renderSubsDev() {
    const { t } = this.props;
    const { url } = this.props.match;
    const { appDetail, resetAppDetail } = this.props.appStore;

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
          <div className={styles.name}>{resetAppDetail.name}</div>
          <Status
            className={styles.status}
            name={appDetail.status}
            type={appDetail.status}
          />
        </div>

        {getDevSubNavs(appDetail.app_id).map(nav => (
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

  renderSubs() {
    const { t } = this.props;
    const subNavData = this.getSudNavData();
    const { path } = this.props.match;

    if (!subNavData.title) {
      return null;
    }

    return (
      <div className={styles.subNav}>
        <div className={styles.title}>
          <div className={styles.name}>{t(subNavData.title)}</div>
        </div>
        {subNavData.links.map(link => (
          <Link
            key={link.name}
            className={classnames(styles.link, {
              [styles.disabled]: link.isDisabled,
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

  renderNavsBottom() {
    const { t } = this.props;
    const bottomNavs = getBottomNavs;

    return (
      <ul className={styles.bottomNav}>
        {bottomNavs.map(
          nav =>
            nav.iconName === 'human' ? (
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
            )
        )}
      </ul>
    );
  }

  renderNavsDev() {
    const { appStore, history, user, t } = this.props;
    const { pathname } = history.location;
    const { menuApps } = appStore;
    const { changedRole, isDev } = user;
    const hasBack = changedRole === 'developer' && isDev;

    return (
      <div className={styles.nav}>
        <ul className={styles.topNav}>
          {hasBack ? (
            <li onClick={() => this.becomeDeveloper('back')}>
              <Link to="#">
                <Icon
                  className={styles.icon}
                  size={20}
                  name="back"
                  type="dark"
                />
              </Link>
              <label className={styles.title}>{t('Back')}</label>
            </li>
          ) : (
            <li>
              <Link to="/">
                <img src="/logo_icon.svg" className={styles.icon} />
              </Link>
              <label className={styles.title}>
                {t('QingCloud App Center')}
              </label>
            </li>
          )}
          {menuApps.map(nav => (
            <li key={nav.app_id} className={styles.devItem}>
              <Link to={`/dashboard/app/${nav.app_id}/versions`}>
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
              </Link>
              <NavLink exact to={`/dashboard/app/${nav.app_id}/versions`}>
                <label className={styles.title}>{t(nav.name)}</label>
              </NavLink>
            </li>
          ))}
          <li className={styles.devItem}>
            <NavLink
              className={styles.addOuter}
              exact
              to="/dashboard/app/create"
            >
              <Icon name="add" size={20} type="dark" className={styles.icon} />
            </NavLink>
            <NavLink exact to="/dashboard/app/create" className={styles.title}>
              {t('Create app')}
            </NavLink>
          </li>
          <li>
            <NavLink exact to="/dashboard/my/apps">
              <Icon
                name="more"
                size={20}
                className={styles.icon}
                type={
                  pathname.indexOf('/dashboard/my/apps') > -1 ? 'light' : 'dark'
                }
              />
            </NavLink>
            <NavLink exact to="/dashboard/my/apps" className={styles.title}>
              {t('View all')}
            </NavLink>
          </li>
        </ul>
        {this.renderNavsBottom()}
      </div>
    );
  }

  renderNavs() {
    const { user, appStore, history, t } = this.props;
    const { pathname } = history.location;
    const { isISV, isDev, role } = user;
    const viewRole = isISV ? 'isv' : role;
    const navs = getNavs[viewRole] || [];

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
              key={nav.iconName}
              onClick={() => this.becomeDeveloper(nav.iconName)}
            >
              <Link to={nav.link}>
                <Icon
                  className={styles.icon}
                  size={20}
                  name={nav.iconName}
                  type={this.isLinkActive(nav.active) ? 'light' : 'dark'}
                />
              </Link>
              <NavLink exact to={nav.link}>
                <label className={styles.title}>{t(nav.title)}</label>
              </NavLink>
            </li>
          ))}
        </ul>
        {this.renderNavsBottom()}
      </div>
    );
  }

  render() {
    const { hasSubNav, user } = this.props;
    const { isDev, isAdmin, isISV, changedRole } = user;

    if (isDev) {
      return (
        <Fragment>
          {this.renderNavsDev()}
          {hasSubNav && this.renderSubsDev()}
        </Fragment>
      );
    }

    return (
      <Fragment>
        {this.renderNavs()}
        {hasSubNav && this.renderSubs()}
      </Fragment>
    );
  }
}

export default withRouter(SideNav);
