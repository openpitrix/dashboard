import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react/index';
import { translate } from 'react-i18next';
import classnames from 'classnames';
import _ from 'lodash';

import { Icon, Popover, Image, Tooltip } from 'components/Base';
import Status from 'components/Status'
import MenuLayer from 'components/MenuLayer';

import { subNavMap, getNavs, getDevSubNavs, getBottomNavs } from './navMap';

import styles from './index.scss';

const keys = ['app', 'review', 'cluster', 'runtime', 'repo', 'categories', 'category', 'user'];
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

  isLinkActive = (activeName, role) => {
    let key = this.getMatchKey();
    if (role === 'developer' && key === 'app') {
      key = 'repo';
    }

    return activeName === key;
  };

  getSudNavData = () => {
    const key = this.getMatchKey();
    return subNavMap[key];
  };

  renderNav() {
    const { user, appStore } = this.props;
    const { role, isDev } = user;
    let navs = getNavs[role];
    const { menuApps } = appStore;
    let bottomNavs = getBottomNavs;

    if (isDev ) {
      const topNav = navs[0];
      navs = menuApps.concat(navs.slice(1));
      navs.unshift(topNav);
      bottomNavs = bottomNavs.slice(2);
    }

    return (
      <div className={styles.nav}>
        <ul>
          {navs.map(nav => (
            <li key={nav.iconName || nav.app_id}>
              {/*<NavLink exact to={nav.link || `/dashboard/app/${nav.app_id}`}>*/}
                {
                  nav.app_id &&
                  <Image src={nav.icon} iconSize={24} className={styles.icon} />
                }
                {
                  nav.iconName &&
                  <Icon
                    className={styles.icon}
                    size={nav.iconName === 'more' ? 20 : 24}
                    name={nav.iconName}
                    type={this.isLinkActive(nav.active, role) ? 'light' : 'dark'}
                  />
                }
              {/*</NavLink>*/}
              {this.renderHoverNav(navs, bottomNavs, role)}
            </li>
          ))}
        </ul>
        <ul className={styles.bottomNav}>
          {bottomNavs.map(nav => (
            <li key={nav.iconName}>
             {/* <NavLink exact to={nav.link}>*/}
                <Icon
                  className={styles.icon}
                  size={24}
                  name={nav.iconName}
                  type={this.isLinkActive(nav.active, role) ? 'light' : 'dark'}
                />
             {/* </NavLink>*/}
              {this.renderHoverNav(navs, bottomNavs, role)}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  renderHoverNav = (navs ,bottomNavs, role) => {
    const { t } = this.props;

    return (
      <div className={styles.hoverNav}>
        <ul>
          {navs.map(nav => (
            <li
              key={nav.iconName || nav.app_id}
            >
              <NavLink
                exact
                to={nav.link || `/dashboard/app/${nav.app_id}`}
                activeClassName={styles.active}
                isActive={() => this.isLinkActive(nav.active, role)}
              >
                {t(nav.title) || nav.name}
              </NavLink>
            </li>
          ))}
        </ul>
        <ul className={styles.bottomNav}>
          {bottomNavs.map(nav => (
            <li
              key={nav.iconName}
              className={classnames({[styles.active]: this.isLinkActive(nav.active, role)})}
            >
              <NavLink
                exact
                to={nav.link}
                activeClassName={styles.active}
                isActive={() => this.isLinkActive(nav.active, role)}
              >
                {t(nav.title)}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    )
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
          <div className={styles.name}>
            {appDetail.name}
          </div>
          <Status className={styles.status} name={appDetail.status} type={appDetail.status} />
        </div>

        {
          getDevSubNavs.map(nav =>
            <div  key={nav.title} className={styles.subContent}>
              <div className={styles.subTitle}>
                {nav.title}
              </div>
              {
                nav.items.map( item =>
                  <Link
                    className={classnames(styles.link, { [styles.active]: url.indexOf(item.active) > -1 })}
                    to={item.link}
                  >
                    {item.name}
                  </Link>
                )
              }
            </div>
          )
        }
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

  render() {
    const { hasSubNav, user } = this.props;
    const { isDev, isAdmin } = user;

    return (
      <Fragment>
        <div className={styles.menu}>
          {this.renderNav()}
          {hasSubNav && isDev && this.renderSubDev()}
          {hasSubNav && isAdmin && this.renderSubAdmin()}
        </div>
      </Fragment>
    );
  }
}

export default withRouter(SideNav);
