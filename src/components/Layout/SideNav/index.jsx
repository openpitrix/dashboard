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
import NavItem from './NavItem';

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
  'role',
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
  apply: 'provider',
  role: 'user'
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
    const { fetchMenuApps, fetchMeunApp } = appStore;

    const { appId } = match.params;

    if (user.isDevPortal) {
      await fetchMenuApps();

      if (hasSubNav && appId) {
        fetchMeunApp(appId);
      }
    }
  }

  getMatchKey = () => {
    const { path } = this.props.match;
    const key = _.find(keys, k => path.indexOf(k) > -1) || 'app';

    return changeKey[key] || key;
  };

  isLinkActive = activeName => activeName === this.getMatchKey();

  getSudNavData = () => {
    const { user } = this.props;
    const key = this.getMatchKey();

    return _.get(subNavMap, `${user.portal}.${key}`, {});
  };

  isActiveSubNav(item, subNavData) {
    const { path } = this.props.match;
    if (_.some(subNavData.links, o => o.link === path)) {
      return item.link === path;
    }
    return path.includes(item.active);
  }

  renderSubNavsForDev() {
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

  renderSubNavsForOthers() {
    const { t } = this.props;
    const subNavData = this.getSudNavData();

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
              [styles.active]: this.isActiveSubNav(link, subNavData)
            })}
            to={link.link}
          >
            {t(link.name)}
          </Link>
        ))}
      </div>
    );
  }

  renderPlatformLogo() {
    const { t } = this.props;
    return (
      <NavItem
        to="/"
        label={t('QingCloud App Center')}
        className={styles.firstElem}
      >
        <img src="/logo_icon.svg" className={styles.icon} />
      </NavItem>
    );
  }

  renderBottomNavs() {
    const { user, t } = this.props;

    return (
      <ul
        className={classnames(styles.bottomNav, {
          [styles.userBottomNav]: user.isDevPortal
        })}
      >
        {getBottomNavs.map(nav => (nav.iconName === 'human' ? (
            <li key={nav.iconName}>
              <Popover content={<MenuLayer />} className={styles.iconOuter}>
                <Icon
                  className={styles.icon}
                  size={20}
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
                size={20}
                name={nav.iconName}
                type={this.isLinkActive(nav.active) ? 'light' : 'dark'}
              />
              <Link to="#">
                <label className={styles.title}>{t(nav.title)}</label>
              </Link>
            </li>
        )))}
      </ul>
    );
  }

  renderMainNavsForDev() {
    const {
      appStore, history, user, t
    } = this.props;
    const { pathname } = history.location;
    const { menuApps } = appStore;
    const hasBack = user.isISV && user.isDevPortal;

    return (
      <Fragment>
        {hasBack ? (
          <NavItem
            to={toRoute(routes.portal.apps, { portal: 'isv' })}
            iconProps={{
              name: 'back'
            }}
            label={t('Back')}
            className={styles.firstElem}
          />
        ) : (
          this.renderPlatformLogo()
        )}

        {menuApps.map(nav => {
          const link = toRoute(routes.portal._dev.versions, {
            appId: nav.app_id
          });

          return (
            <NavItem
              key={nav.app_id}
              to={link}
              label={t(nav.name)}
              wrapLabelInLink
              className={classnames({
                [styles.active]: link === pathname
              })}
              iconLinkCls={styles.iconLink}
            >
              <Image
                src={nav.icon}
                iconLetter={t(nav.name)}
                iconSize={24}
                className={styles.image}
              />
            </NavItem>
          );
        })}

        <NavItem
          to={toRoute(routes.portal._dev.appCreate)}
          label={t('Create app')}
          wrapLabelInLink
          iconProps={{
            name: 'add'
          }}
        />
        <NavItem
          to={toRoute(routes.portal.apps)}
          label={t('View all')}
          wrapLabelInLink
          className={classnames({
            [styles.active]: pathname === toRoute(routes.portal.apps)
          })}
          iconProps={{
            name: 'more',
            type: pathname === toRoute(routes.portal.apps) ? 'light' : 'dark'
          }}
        />
      </Fragment>
    );
  }

  renderMainNavsForOthers() {
    const { user, t } = this.props;
    const { portal } = user;
    const navs = getNavs[portal] || [];

    return (
      <Fragment>
        {this.renderPlatformLogo()}
        {navs.map((nav, idx) => (
          <NavItem
            key={idx}
            className={classnames({
              [styles.disabled]: nav.disabled,
              [styles.active]: this.isLinkActive(nav.active)
            })}
            iconProps={{
              name: nav.iconName,
              type: this.isLinkActive(nav.active) ? 'light' : 'dark'
            }}
            wrapLabelInLink
            label={t(nav.title)}
            to={nav.link}
          />
        ))}
      </Fragment>
    );
  }

  render() {
    const { hasSubNav, user } = this.props;

    return (
      <Fragment>
        <div className={styles.nav}>
          <ul className={styles.topNav}>
            {user.isDevPortal
              ? this.renderMainNavsForDev()
              : this.renderMainNavsForOthers()}
          </ul>
          {this.renderBottomNavs()}
        </div>

        {hasSubNav
          && (user.isDevPortal
            ? this.renderSubNavsForDev()
            : this.renderSubNavsForOthers())}
      </Fragment>
    );
  }
}

export default withRouter(SideNav);
