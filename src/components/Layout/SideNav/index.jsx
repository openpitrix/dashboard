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

import routes, { toRoute } from 'routes';

import {
  subNavMap, getNavs, getDevSubNavs, getBottomNavs
} from './navMap';

import styles from './index.scss';

const keys = [
  'apply',
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
  'provider',
  'setting',
  'cloud-env',
  'admin',
  'dashboard'
];
const changeKey = {
  review: 'app',
  cluster: 'repo',
  runtime: 'repo',
  categories: 'app',
  category: 'app',
  admin: 'dashboard',
  apply: 'provider'
};

@translate()
@inject(({ rootStore }) => ({
  rootStore,
  appStore: rootStore.appStore,
  user: rootStore.user
}))
@observer
export class SideNav extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    hasSubNav: PropTypes.bool
  };

  static defaultProps = {};

  async componentDidMount() {
    const {
      appStore, user, match, hasSubNav
    } = this.props;
    const { isDev } = user;
    const { fetchMenuApps, fetchMeunApp } = appStore;

    const { appId } = match.params;

    if (isDev) {
      await fetchMenuApps();

      if (hasSubNav && appId) {
        fetchMeunApp(appId);
      }
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
    console.log(key, changeKey[key]);

    return changeKey[key] || key;
  };

  isLinkActive = activeName => activeName === this.getMatchKey();

  getSudNavData = () => {
    const { user } = this.props;
    const { isISV } = user;
    const role = isISV ? 'isv' : user.role;
    const key = this.getMatchKey();

    return _.get(subNavMap, `${role}.${key}`, {});
  };

  renderSubsDev() {
    const { match, appStore, t } = this.props;
    const { appDetail, resetAppDetail } = appStore;
    const overviewLink = toRoute(routes.overview, 'dev');

    if (match.url === overviewLink) {
      return (
        <div className={styles.subNav}>
          <div className={styles.title}>{t('Dashboard')}</div>
          <Link
            className={classnames(styles.link, {
              [styles.active]: match.url.indexOf('/dev') > -1
            })}
            to={overviewLink}
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
                  [styles.active]: match.url.indexOf(item.active) > -1,
                  [styles.disabled]: item.disabled
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
              [styles.disabled]: link.disabled,
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

    return (
      <ul className={styles.bottomNav}>
        {getBottomNavs.map(
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
    );
  }

  renderNavsDev() {
    const {
      appStore, history, user, t
    } = this.props;
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
              <Link
                to={toRoute(routes.portal._dev.versions, { appId: nav.app_id })}
              >
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
              <NavLink
                exact
                to={toRoute(routes.portal._dev.versions, { appId: nav.app_id })}
              >
                <label className={styles.title}>{t(nav.name)}</label>
              </NavLink>
            </li>
          ))}
          <li className={styles.devItem}>
            <NavLink
              className={styles.addOuter}
              exact
              to={toRoute(routes.portal._dev.appCreate)}
            >
              <Icon name="add" size={20} type="dark" className={styles.icon} />
            </NavLink>
            <NavLink
              exact
              to={toRoute(routes.portal._dev.appCreate)}
              className={styles.title}
            >
              {t('Create app')}
            </NavLink>
          </li>
          <li>
            <NavLink exact to={toRoute(routes.portal.apps)}>
              <Icon
                name="more"
                size={20}
                className={styles.icon}
                type={
                  pathname.indexOf(toRoute(routes.portal.apps)) > -1
                    ? 'light'
                    : 'dark'
                }
              />
            </NavLink>
            <NavLink
              exact
              to={toRoute(routes.portal.apps)}
              className={styles.title}
            >
              {t('View all')}
            </NavLink>
          </li>
        </ul>
        {this.renderNavsBottom()}
      </div>
    );
  }

  renderNavs() {
    const { user, t } = this.props;
    const { isISV, role } = user;
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
              className={classnames(styles.navItem, {
                [styles.disabled]: nav.disabled
              })}
            >
              <Icon
                className={styles.icon}
                size={20}
                name={nav.iconName}
                type={this.isLinkActive(nav.active) ? 'light' : 'dark'}
              />
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

    if (user.isDev) {
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
