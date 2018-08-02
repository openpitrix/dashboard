import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { NavLink } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { translate } from 'react-i18next';

import { Popover, Icon } from 'components/Base';
import { getSessInfo } from 'src/utils';
import Logo from '../Logo';
import Input from '../Base/Input';

import styles from './index.scss';

// translate hoc should place before mobx
@translate()
@inject('rootStore', 'sessInfo')
@observer
export default class Header extends Component {
  static propTypes = {
    isHome: PropTypes.bool
  };

  state = {
    dropdownOpen: false
  };

  toggleDropdown = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  };

  renderOperateMenu = () => {
    const { t } = this.props;

    return (
      <ul className={styles.operateItems}>
        <li>
          <NavLink to="/dashboard">{t('Dashboard')}</NavLink>
        </li>
        <li>
          <a href="/logout">{t('Log out')}</a>
        </li>
      </ul>
    );
  };

  renderMenuBtns() {
    const loggedInUser = getSessInfo('user', this.props.sessInfo);
    const { t } = this.props;
    const colorDark = {
      primary: 'rgba(52,57,69,.9)',
      secondary: 'rgba(52,57,69,.9)'
    };
    const colorDarkHover = {
      primary: 'rgba(52,57,69,1)',
      secondary: 'rgba(52,57,69,1)'
    };
    const color = {
      primary: 'rgba(255,255,255,.9)',
      secondary: 'rgba(255,255,255,.9)'
    };
    const colorHover = {
      primary: 'rgba(255,255,255,1)',
      secondary: 'rgba(255,255,255,1)'
    };

    if (!loggedInUser) {
      return <NavLink to="/login">{t('Sign In')}</NavLink>;
    }

    return (
      <Popover content={this.renderOperateMenu()} className={styles.role}>
        {loggedInUser}
        <Icon name="caret-down" color={colorDark} className={styles.iconDark} />
        <Icon name="caret-down" color={colorDarkHover} className={styles.iconDarkHover} />
        <Icon name="caret-down" color={color} className={styles.icon} />
        <Icon name="caret-down" color={colorHover} className={styles.iconHover} />
      </Popover>
    );
  }

  onSearch = async value => {
    const { appStore } = this.props.rootStore;
    appStore.changeAppSearch(value);
    await appStore.fetchApps({ search_word: value });
  };

  onClearSearch = async () => {
    await this.onSearch('');
    // this.props.rootStore.setNavFix(true);
    window.scroll({ top: 1, behavior: 'smooth' });
  };

  render() {
    const {
      t,
      isHome,
      rootStore: { fixNav }
    } = this.props;

    const { appStore } = this.props.rootStore;
    const { appSearch } = appStore;

    const isDark = !isHome || fixNav;
    const logoUrl = isDark ? '/assets/logo_light.svg' : '/assets/logo_dark.svg';
    const needShowSearch = isDark && isHome;

    return (
      <div className={classnames('header', styles.header, { [styles.stickyHeader]: isDark })}>
        <div className={styles.wrapper}>
          <Logo className={styles.logo} url={logoUrl} />
          <div className={styles.menus}>{this.renderMenuBtns()}</div>
          {needShowSearch && (
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
}
