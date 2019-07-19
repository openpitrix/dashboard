import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link, NavLink } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { withTranslation } from 'react-i18next';
import classnames from 'classnames';
import _ from 'lodash';

import { Icon, Popover, Image } from 'components/Base';
import Can from 'components/Can';
import Status from 'components/Status';
import MenuLayer from 'components/MenuLayer';
import routes, { toRoute } from 'routes';
import { mappingStatus } from 'utils';
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
  categories: 'app',
  category: 'app',
  admin: 'dashboard',
  apply: 'provider',
  role: 'user'
};

@withTranslation()
@inject(({ rootStore }) => ({
  rootStore,
  appStore: rootStore.appStore,
  user: rootStore.user,
  roleStore: rootStore.roleStore
}))
@observer
export class SideNav extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    hasSubNav: PropTypes.bool
  };

  static defaultProps = {};

  state = {
    isLoading: true,
    subNavChildLinks: []
  };

  componentWillMount() {
    const subNavChildLinks = _.map(
      _.get(this.getSudNavData(), 'links', []),
      'link'
    );

    this.setState({
      subNavChildLinks
    });
  }

  async componentDidMount() {
    const {
      appStore, user, match, hasSubNav, roleStore
    } = this.props;
    const { fetchMenuApps, fetchMeunApp } = appStore;
    const { appId } = match.params;

    await roleStore.setRoleSession();
    this.setState({
      isLoading: false
    });

    if (user.isDevPortal) {
      await fetchMenuApps();

      if (hasSubNav && appId) {
        fetchMeunApp(appId);
      }
    }
  }

  async componentDidUpdate(prevProps) {
    const {
      appStore, user, hasSubNav, match
    } = this.props;
    const { fetchMeunApp } = appStore;
    const appId = _.get(match, 'params.appId', '');
    const prevAppId = _.get(prevProps.match, 'params.appId', '');

    if (user.isDevPortal && hasSubNav && appId !== prevAppId) {
      fetchMeunApp(appId);
    }
  }

  getMatchKey = () => {
    const { path } = this.props.match;
    const key = _.find(keys, k => path.indexOf(k) > -1) || '';

    return changeKey[key] || key;
  };

  isActiveLink = link => link === location.pathname || this.state.subNavChildLinks.includes(link);

  getSudNavData = () => {
    const { user } = this.props;
    const key = this.getMatchKey();

    return _.get(subNavMap, `${user.portal}.${key}`, {});
  };

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
            name={mappingStatus(appDetail.status)}
            type={appDetail.status}
          />
        </div>

        {getDevSubNavs(appDetail.app_id).map(nav => (
          <div key={nav.title} className={styles.subContent}>
            <div className={styles.subTitle}>{t(nav.title)}</div>
            {nav.items.map(item => (
              <Can
                do="show"
                action={item.actionId}
                condition={item.condition}
                key={item.name}
              >
                <NavLink
                  exact
                  activeClassName={styles.active}
                  className={classnames(styles.link, {
                    [styles.disabled]: item.disabled
                  })}
                  to={item.link}
                >
                  {t(item.name)}
                </NavLink>
              </Can>
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
          <Can
            do="show"
            action={link.actionId}
            condition={link.condition}
            key={link.name}
          >
            <NavLink
              exact
              activeClassName={styles.active}
              className={classnames(styles.link, {
                [styles.disabled]: link.disabled
              })}
              to={link.link}
            >
              {t(link.name)}
            </NavLink>
          </Can>
        ))}
      </div>
    );
  }

  renderPlatformLogo() {
    const { user, t } = this.props;
    let label = 'QingCloud App Center';

    if (user.isAdmin) {
      label = 'Manage Console';
    } else if (user.isISV) {
      label = 'Provider Center';
    }

    return (
      <NavItem
        to={toRoute(routes.portal.apps)}
        label={t(label)}
        className={styles.firstElem}
        wrapLabelInLink
      >
        <img src="/logo_icon.svg" className={styles.icon} />
      </NavItem>
    );
  }

  renderBottomNavs() {
    const { user, location, t } = this.props;

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
                  type={
                    location.pathname.indexOf(nav.link) > -1 ? 'light' : 'dark'
                  }
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
                type={
                  location.pathname.indexOf(nav.link) > -1 ? 'light' : 'dark'
                }
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
              name: 'wrench'
            }}
            label={t('App Develop')}
            hoverLabel={t('Back to Provider Center')}
            className={styles.firstElem}
            hasBack
          />
        ) : (
          this.renderPlatformLogo()
        )}

        {menuApps.map(({ app_id, name, icon }) => {
          const link = toRoute(routes.portal._dev.versions, {
            appId: app_id
          });

          return (
            <NavItem
              key={app_id}
              to={link}
              label={t(name)}
              wrapLabelInLink
              className={classnames({
                [styles.active]:
                  pathname.indexOf(
                    link.substring(0, link.lastIndexOf('/versions'))
                  ) > -1
              })}
              iconLinkCls={styles.iconLink}
            >
              <Image
                src={icon}
                iconLetter={t(name)}
                iconSize={20}
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
        {navs.map(nav => (
          <Can
            key={`${nav.title}-${nav.link}`}
            do="show"
            action={nav.actionId}
            condition={nav.condition}
          >
            <NavItem
              className={classnames({
                [styles.disabled]: nav.disabled,
                [styles.active]: this.isActiveLink(nav.link)
              })}
              iconProps={{
                name: nav.iconName,
                type: this.isActiveLink(nav.link) ? 'light' : 'dark'
              }}
              wrapLabelInLink
              label={t(nav.title)}
              to={nav.link}
            />
          </Can>
        ))}
      </Fragment>
    );
  }

  render() {
    const { hasSubNav, user } = this.props;
    if (this.state.isLoading) {
      return null;
    }

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
