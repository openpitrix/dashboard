import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react/index';
import { translate } from 'react-i18next';
import classnames from 'classnames';

import { Icon, Popover, Image, Tooltip } from 'components/Base';
import { setCookie } from 'utils';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  appStore: rootStore.appStore,
  user: rootStore.user
}))
@observer
class Menu extends React.Component {
  static propTypes = {
    className: PropTypes.string
  };

  static defaultProps = {};

  becomeUser = () => {
    setCookie('role', 'user');
    location.href = '/dashboard';
  };

  getMatchKey = () => {
    const { path } = this.props.match;
    const keys = ['app', 'review', 'cluster', 'runtime', 'repo', 'categories', 'category', 'user'];
    const changeKey = {
      review: 'app',
      cluster: 'repo',
      runtime: 'repo',
      categories: 'app',
      category: 'app'
    };
    let key = 'dashboard';

    for (let i = 0; i < keys.length; i++) {
      if (path.indexOf(keys[i]) > -1) {
        key = changeKey[keys[i]] ? changeKey[keys[i]] : keys[i];
        break;
      }
    }
    return key;
  };

  isLinkActive = (activeName, role) => {
    let key = this.getMatchKey();
    if (role === 'developer' && key === 'repo') {
      key = 'app';
    }

    return activeName === key;
  };

  getSudNavData = () => {
    const subNavMap = {
      dashboard: {
        title: 'Dashboard',
        links: [{ name: 'Overview', link: '/dashboard', active: 'dashboard' }]
      },
      app: {
        title: 'Store',
        links: [
          { name: 'All Apps', link: '/dashboard/apps', active: '/app' },
          { name: 'App Reviews', link: '/dashboard/reviews', active: 'review' },
          { name: 'Categroies', link: '/dashboard/categories', active: 'categor' }
          /*{ name: 'Appearance', link: '#', active: 'appearance' }*/
        ]
      },
      user: {
        title: 'Users',
        links: [
          { name: 'All Users', link: '/dashboard/users', active: 'user' }
          /* { name: 'User Groups', link: '#', active: 'group' },
          { name: 'Roles', link: '#', active: 'role' },
          { name: 'Policy', link: '#', active: 'policy' }*/
        ]
      },
      repo: {
        title: 'Platform',
        links: [
          /*{ name: 'Tickets', link: '#', active: 'ticket' },
          { name: 'Notifications', link: '#', active: 'notification' },*/
          { name: 'Repos', link: '/dashboard/repos', active: 'repo' },
          { name: 'Runtimes', link: '/dashboard/runtimes', active: 'runtime' },
          { name: 'All Clusters', link: '/dashboard/clusters', active: 'cluster' }
          /* { name: 'Service Status', link: '#', active: 'service' }*/
        ]
      }
    };
    const key = this.getMatchKey();

    return subNavMap[key];
  };

  renderNav(role) {
    const { t } = this.props;
    let navs = [
      {
        link: '/',
        iconName: 'op-logo',
        active: '',
        title: t('Home')
      },
      {
        link: '/dashboard',
        iconName: 'dashboard',
        active: 'dashboard',
        title: t('Dashboard')
      },
      {
        link: '/dashboard/apps',
        iconName: 'components',
        active: 'app',
        title: role === 'developer' ? t('My Apps') : t('Store')
      },
      {
        link: '/dashboard/repos',
        iconName: 'shield',
        active: 'repo',
        title: t('Platform')
      },
      {
        link: '/dashboard/users',
        iconName: 'group',
        active: 'user',
        title: t('Users')
      }
    ];

    if (role === 'developer') {
      navs = navs.slice(0, 3);
    }

    return (
      <ul className={styles.nav}>
        {navs.map(nav => (
          <Tooltip
            key={nav.iconName}
            className={styles.item}
            content={nav.title}
            isShowArrow
            placement="right"
          >
            <li>
              <NavLink
                exact
                to={nav.link}
                activeClassName={styles.active}
                isActive={() => this.isLinkActive(nav.active, role)}
              >
                <Icon
                  name={nav.iconName}
                  size={nav.iconName === 'op-logo' ? 16 : 24}
                  type="white"
                />
              </NavLink>
            </li>
          </Tooltip>
        ))}
      </ul>
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

    const { menuApps } = this.props.appStore;

    return (
      <div className={styles.subNav}>
        <div className={styles.title}>{t('My Apps')}</div>
        <div className={styles.apps}>
          {menuApps.map(app => (
            <Link
              key={app.app_id}
              className={classnames(styles.app, { [styles.active]: url.indexOf(app.app_id) > -1 })}
              title={app.name}
              to={`/dashboard/app/${app.app_id}`}
            >
              <Image src={app.icon} iconSize={16} className={styles.icon} />
              <span className={styles.appName}>{app.name}</span>
            </Link>
          ))}
          <Link className={styles.plus} to="/dashboard/app/create" title={t('Create')}>
            <Icon name="add" type="white" />
          </Link>
          <Link className={styles.more} to="/dashboard/apps" title={t('All Apps')}>
            <Icon name="more" type="white" />
          </Link>
        </div>
        <Link
          className={classnames(styles.link, { [styles.active]: url.indexOf('repo') > -1 })}
          to="/dashboard/repos"
        >
          {t('Repos')}
        </Link>
        <div className={styles.test}>
          <span className={styles.word}>{t('Test')}</span>
        </div>
        <Link
          className={classnames(styles.link, { [styles.active]: url.indexOf('cluster') > -1 })}
          to="/dashboard/clusters"
        >
          {t('Clusters')}
        </Link>
        <Link
          className={classnames(styles.link, { [styles.active]: url.indexOf('runtime') > -1 })}
          to="/runtimes"
        >
          {t('Runtimes')}
        </Link>
      </div>
    );
  }

  renderSubAdmin() {
    const { t } = this.props;
    const subNavData = this.getSudNavData();
    const { path } = this.props.match;

    return (
      <div className={styles.subNav}>
        <div className={styles.title}>{t(subNavData.title)}</div>
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
    const { username } = this.props.user;

    return (
      <div className={styles.header}>
        <Popover content={this.renderOperateMenu()} className={styles.user}>
          {username}
          <Icon name="caret-down" className={styles.iconDark} type="dark" />
        </Popover>
      </div>
    );
  }

  renderOperateMenu = () => {
    const { user, t } = this.props;

    return (
      <ul className={styles.operateItems}>
        {user.isDev && (
          <li onClick={this.becomeUser} className={styles.line}>
            <label>{t('Back to user')}</label>
          </li>
        )}
        <li>
          <NavLink to="/profile">{t('Profile')}</NavLink>
        </li>
        <li>
          <NavLink to="/ssh_keys">{t('SSH Keys')}</NavLink>
        </li>
        <li>
          <a href="/logout">{t('Log out')}</a>
        </li>
      </ul>
    );
  };

  render() {
    const { isDev, isAdmin, role } = this.props.user;

    return (
      <Fragment>
        <div className={styles.menu}>
          {this.renderNav(role)}
          {isDev && this.renderSubDev()}
          {isAdmin && this.renderSubAdmin()}
        </div>

        {this.renderHeader()}
      </Fragment>
    );
  }
}

export default withRouter(Menu);
