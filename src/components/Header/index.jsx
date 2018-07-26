import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { NavLink } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { Dropdown, DropdownToggle, DropdownItem, DropdownMenu } from 'reactstrap';
import { translate } from 'react-i18next';

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

  renderMenuBtns() {
    const loggedInUser = getSessInfo('user', this.props.sessInfo);
    const { t } = this.props;

    if (!loggedInUser) {
      return <NavLink to="/login">{t('Sign In')}</NavLink>;
    }

    return (
      <Dropdown
        className={styles.loginButton}
        isOpen={this.state.dropdownOpen}
        toggle={this.toggleDropdown}
      >
        <DropdownToggle tag="span" caret className={styles.toggleBtn}>
          {loggedInUser}
        </DropdownToggle>
        <DropdownMenu className={styles.profiles}>
          <NavLink to="/dashboard">{t('Dashboard')}</NavLink>
          <a href="/logout">{t('Log out')}</a>
        </DropdownMenu>
      </Dropdown>
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
