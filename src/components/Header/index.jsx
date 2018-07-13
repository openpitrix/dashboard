import React, { Component } from 'react';
import classnames from 'classnames';
import { NavLink } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { Dropdown, DropdownToggle, DropdownItem, DropdownMenu } from 'reactstrap';
import trans, { __ } from 'hoc/trans';

import { getSessInfo } from 'src/utils';
import Logo from '../Logo';
import Input from '../Base/Input';

import styles from './index.scss';

// translate hoc should place before mobx
@trans()
@inject('rootStore', 'sessInfo')
@observer
export default class Header extends Component {
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

    if (!loggedInUser) {
      return <NavLink to="/login">{__('Sign In')}</NavLink>;
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
          <DropdownItem className={styles.profileItem}>
            <NavLink to="/dashboard">{__('Dashboard')}</NavLink>
          </DropdownItem>
          <DropdownItem className={styles.profileItem}>
            <a href="/logout">{__('Log out')}</a>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }

  onSearch = async value => {
    const { appStore } = this.props.rootStore;
    await appStore.fetchApps({ search_word: value });
  };

  onClearSearch = async () => {
    await this.onSearch('');
    // this.props.rootStore.setNavFix(true);
    window.scroll({ top: 1, behavior: 'smooth' });
  };

  render() {
    const {
      isHome,
      rootStore: { fixNav }
    } = this.props;

    const { appStore } = this.props.rootStore;
    const { appSearch } = appStore;

    const isDark = !isHome || fixNav;
    const logoUrl = isDark ? '/assets/logo_light.svg' : '/assets/logo_dark.svg';
    const needShowSearch = isDark && isHome;

    return (
      <div className={classnames('header', styles.header, { [styles.lightHeader]: !isDark })}>
        <div className={styles.wrapper}>
          <Logo className={styles.logo} url={logoUrl} />
          {needShowSearch && (
            <Input.Search
              className={styles.search}
              placeholder={__('search.placeholder')}
              value={appSearch}
              onSearch={this.onSearch}
              onClear={this.onClearSearch}
            />
          )}
          <div className={styles.menus}>{this.renderMenuBtns()}</div>
        </div>
      </div>
    );
  }
}
