import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react/index';
import { translate } from 'react-i18next';
import classnames from 'classnames';

import { Icon, Popover } from 'components/Base';
import { getSessInfo } from 'src/utils';

import styles from './index.scss';

@translate()
@inject('rootStore', 'sessInfo')
@observer
class Menu extends React.Component {
  static propTypes = {
    className: PropTypes.string
  };

  static defaultProps = {};

  getMatchKey = () => {
    const { path } = this.props.match;
    const keys = ['app', 'cluster', 'runtime', 'repo', 'categories', 'category', 'user'];
    const changeKey = {
      cluster: 'app',
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
        links: [{ name: 'Dashboard', link: '/dashboard', active: 'dashboard' }]
      },
      app: {
        title: 'Store',
        links: [
          { name: 'All Apps', link: '/dashboard/apps', active: 'apps' },
          { name: 'App Reviews', link: '/', active: 'review' },
          { name: 'All Clusters', link: '/dashboard/clusters', active: 'cluster' },
          { name: 'Categroies', link: '/dashboard/categories', active: 'categor' },
          { name: 'Appearance', link: '/', active: 'appearance' }
        ]
      },
      user: {
        title: 'Users',
        links: [
          { name: 'All Users', link: '/dashboard/users', active: 'user' },
          { name: 'User Groups', link: '/', active: 'group' },
          { name: 'Roles', link: '/', active: 'role' },
          { name: 'Policy', link: '/', active: 'policy' }
        ]
      },
      repo: {
        title: 'Platform',
        links: [
          { name: 'Tickets', link: '/', active: 'ticket' },
          { name: 'Notifications', link: '/', active: 'notification' },
          { name: 'Runtimes', link: '/dashboard/runtimes', active: 'runtime' },
          { name: 'Repos', link: '/dashboard/repos', active: 'repo' },
          { name: 'Service Status', link: '/', active: 'service' }
        ]
      }
    };
    const key = this.getMatchKey();

    return subNavMap[key];
  };

  renderNav(role) {
    let navs = [
      {
        link: '/',
        iconName: 'home',
        active: ''
      },
      {
        link: '/dashboard',
        iconName: 'dashboard',
        active: 'dashboard'
      },
      {
        link: '/dashboard/apps',
        iconName: 'components',
        active: 'app'
      },
      {
        link: '/dashboard/repos',
        iconName: 'shield',
        active: 'repo'
      },
      {
        link: '/dashboard/users',
        iconName: 'group',
        active: 'user'
      }
    ];

    if (role === 'developer') {
      navs = navs.slice(0, 3);
    }

    return (
      <ul className={styles.nav}>
        {navs.map(nav => (
          <li key={nav.iconName}>
            <NavLink
              exact
              to={nav.link}
              activeClassName={styles.active}
              isActive={() => this.isLinkActive(nav.active, role)}
            >
              <Icon name={nav.iconName} size={24} />
            </NavLink>
          </li>
        ))}
      </ul>
    );
  }

  renderSubDev() {
    const { path } = this.props.match;

    if (path === '/dashboard') {
      return (
        <div className={styles.subNav}>
          <div className={styles.title}>My Apps</div>
          <Link
            className={classnames(styles.link, { [styles.active]: path.indexOf('dashboard') > -1 })}
            to="/dashboard"
          >
            Dashboard
          </Link>
        </div>
      );
    }

    return (
      <div className={styles.subNav}>
        <div className={styles.title}>My Apps</div>
        <div className={styles.app}>
          <Link className={styles.plus} to="/dashboard/app/create">
            <Icon name="add" />
          </Link>
          <Link className={styles.more} to="/dashboard/apps">
            <Icon name="more" />
          </Link>
        </div>
        <Link
          className={classnames(styles.link, { [styles.active]: path.indexOf('repo') > -1 })}
          to="/dashboard/repos"
        >
          Repos
        </Link>
        <div className={styles.test}>
          <span className={styles.word}>Test</span>
        </div>
        <Link
          className={classnames(styles.link, { [styles.active]: path.indexOf('cluster') > -1 })}
          to="/dashboard/clusters"
        >
          Clusters
        </Link>
        <Link
          className={classnames(styles.link, { [styles.active]: path.indexOf('runtime') > -1 })}
          to="/runtimes"
        >
          Runtimes
        </Link>
      </div>
    );
  }

  renderSubAdmin() {
    const subNavData = this.getSudNavData();
    const { path } = this.props.match;

    return (
      <div className={styles.subNav}>
        <div className={styles.title}>{subNavData.title}</div>
        {subNavData.links.map(link => (
          <Link
            key={link.name}
            className={classnames(styles.link, { [styles.active]: path.indexOf(link.active) > -1 })}
            to={link.link}
          >
            {link.name}
          </Link>
        ))}
      </div>
    );
  }

  renderHeader() {
    const loggedInUser = getSessInfo('user', this.props.sessInfo);

    return (
      <div className={styles.header}>
        <Popover content={this.renderOperateMenu()} className={styles.user}>
          {loggedInUser}
          <Icon name="caret-down" className={styles.iconDark} type="dark" />
        </Popover>
      </div>
    );
  }

  renderOperateMenu = () => {
    const { t } = this.props;

    return (
      <ul className={styles.operateItems}>
        <li>
          <NavLink to="/dashboard">{t('Dashboard')}</NavLink>
        </li>
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
    const role = getSessInfo('role', this.props.sessInfo);

    return (
      <Fragment>
        <div className={styles.menu}>
          {this.renderNav(role)}
          {role === 'developer' && this.renderSubDev()}
          {role === 'admin' && this.renderSubAdmin()}
        </div>

        {this.renderHeader()}
      </Fragment>
    );
  }
}

export default withRouter(Menu);
