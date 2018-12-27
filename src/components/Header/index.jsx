import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { NavLink, withRouter, Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { translate } from 'react-i18next';
import { toUrl } from 'utils/url';

import { Popover, Icon, Input } from 'components/Base';
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
  static propTypes = {
    isHome: PropTypes.bool
  };

  onSearch = async value => {
    const { appStore, history, isHome } = this.props;
    const pushUrl = isHome ? `/apps/search/${value}` : `/store/search/${value}`;
    history.push(pushUrl);
    await appStore.fetchAll({ search_word: value });
    appStore.homeApps = appStore.apps;
  };

  onClearSearch = async () => {
    this.props.history.push('/');
  };

  isLinkActive = (curLink, match, location) => {
    const { pathname } = location;
    return pathname.indexOf(curLink) > -1;
  };

  renderMenus = () => {
    const { t } = this.props;

    return (
      <div className={styles.menus}>
        <NavLink
          to="/store"
          exact
          activeClassName={styles.active}
          isActive={this.isLinkActive.bind(null, 'store')}
        >
          {t('App Store')}
        </NavLink>
        <NavLink
          to="/purchased"
          exact
          activeClassName={styles.active}
          isActive={this.isLinkActive.bind(null, 'purchased')}
        >
          {t('Purchased')}
        </NavLink>
        <NavLink
          to={toUrl('/:dash/runtimes')}
          exact
          activeClassName={styles.active}
          isActive={this.isLinkActive.bind(null, 'runtime')}
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
    const {
      t,
      isHome,
      match,
      rootStore: { fixNav }
    } = this.props;
    const logoUrl = fixNav ? '/logo_light.svg' : '/logo_dark.svg';
    const appSearch = match.params.search;

    if (isHome) {
      return (
        <div
          className={classnames('header', styles.header, {
            [styles.deepHome]: fixNav
          })}
        >
          <div className={styles.wrapper}>
            <Logo className={styles.logo} url={logoUrl} />
            {this.renderMenuBtns()}
            {fixNav && (
              <Input.Search
                className={styles.search}
                placeholder={t('search.placeholder')}
                value={appSearch}
                onSearch={this.onSearch}
                onClear={this.onClearSearch}
              />
            )}
          </div>
        </div>
      );
    }

    return (
      <div className={classnames(styles.header, styles.deepInner)}>
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
