import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { NavLink, withRouter, Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { translate } from 'react-i18next';
import { toUrl } from 'utils/url';

import { Popover, Icon } from 'components/Base';
import MenuLayer from 'components/MenuLayer';
import Logo from '../Logo';

import styles from './index.scss';

// translate hoc should place before mobx
@translate()
@inject(({ rootStore }) => ({
  rootStore,
  appStore: rootStore.appStore,
  user: rootStore.user
}))
@observer
class Header extends Component {
  isLinkActive = curLink => {
    const { pathname } = location;

    if (curLink === 'apps') {
      return pathname === '/' || pathname.indexOf(curLink) > -1;
    }

    return pathname.indexOf(curLink) > -1;
  };

  renderMenus = () => {
    const { t } = this.props;

    return (
      <div className={styles.menus}>
        <NavLink
          to="/apps"
          exact
          activeClassName={styles.active}
          isActive={() => this.isLinkActive('apps')}
        >
          {t('App Store')}
        </NavLink>
        <NavLink
          to={toUrl('/:dash/purchased')}
          exact
          activeClassName={styles.active}
          isActive={() => this.isLinkActive('purchased')}
        >
          {t('Purchased')}
        </NavLink>
        <NavLink
          to={toUrl('/:dash/clusters')}
          exact
          activeClassName={styles.active}
          isActive={() => this.isLinkActive('cluster')}
        >
          {t('My Instances')}
        </NavLink>
        <NavLink
          to={toUrl('/:dash/runtimes')}
          exact
          activeClassName={styles.active}
          isActive={() => this.isLinkActive('runtime')}
        >
          {t('My Runtimes')}
        </NavLink>
      </div>
    );
  };

  renderMenuBtns() {
    const { t } = this.props;
    const { username } = this.props.user;

    if (!username) {
      return (
        <NavLink to="/login" className={styles.login}>
          {t('Sign In')}
        </NavLink>
      );
    }

    return (
      <div className={styles.user}>
        <Popover content={<MenuLayer />}>
          {username}
          <Icon name="caret-down" className={styles.icon} type="dark" />
        </Popover>
      </div>
    );
  }

  render() {
    const { user, t } = this.props;

    if (!user.isNormal) {
      return (
        <div className={styles.header}>
          <div className={styles.wrapper}>
            <Logo className={styles.logo} url="/logo_light.svg" />
            {this.renderMenuBtns()}
          </div>
        </div>
      );
    }

    return (
      <div className={classnames(styles.header, styles.menusHeader)}>
        <div className={styles.wrapper}>
          <Link className={styles.logoIcon} to="/">
            <Icon
              className={styles.icon}
              name="op-logo"
              type="white"
              size={16}
            />
          </Link>
          {this.renderMenus()}
          {this.renderMenuBtns()}
          <Icon name="mail" size={20} type="white" className={styles.mail} />
          <Link to="/dashboard/provider/submit" className={styles.upgrade}>
            <Icon
              name="shield"
              size={16}
              type="white"
              className={styles.shield}
            />
            {t('UPGRADE_PROVIDER')}
          </Link>
        </div>
      </div>
    );
  }
}

export default withRouter(Header);
