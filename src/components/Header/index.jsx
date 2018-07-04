import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import classnames from 'classnames';
import { NavLink } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { ButtonDropdown, DropdownToggle, DropdownItem, DropdownMenu } from 'reactstrap';

import { getSessInfo, getLinkLabelFromRole } from 'src/utils';
import Logo from '../Logo';
import Input from '../Base/Input';

import styles from './index.scss';

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

  renderLoginButton() {
    const loggedInUser = getSessInfo('user', this.props.sessInfo);

    if (!loggedInUser) {
      return <NavLink to="/login">Sign In</NavLink>;
    }

    return (
      <ButtonDropdown
        className={styles.loginButton}
        isOpen={this.state.dropdownOpen}
        toggle={this.toggleDropdown}
      >
        <DropdownToggle caret className={styles.toggleBtn}>
          {loggedInUser}
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem style={{ padding: 0 }}>
            <a href="/logout">Logout</a>
          </DropdownItem>
        </DropdownMenu>
      </ButtonDropdown>
    );
  }

  renderDevOpsLink() {
    const role = getSessInfo('role', this.props.sessInfo);
    return <NavLink to="/dashboard">{getLinkLabelFromRole(role)}</NavLink>;
  }

  onSearch = async value => {
    const { appStore } = this.props.rootStore;
    await appStore.fetchApps({ search_word: value });
  };

  onClearSearch = async () => {
    await this.onSearch('');
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

    return (
      <div className={classnames('header', styles.header, { [styles.darkHeader]: !isDark })}>
        <div className={styles.wrapper}>
          <Logo className={styles.logo} url={logoUrl} />
          {isDark && (
            <Input.Search
              className={styles.search}
              placeholder="Search apps in Pitrix..."
              value={appSearch}
              onSearch={this.onSearch}
              onClear={this.onClearSearch}
            />
          )}
          <div className={styles.menus}>
            <NavLink to="/apps">Catalog</NavLink>
            {this.renderDevOpsLink()}
            {this.renderLoginButton()}
          </div>
        </div>
      </div>
    );
  }
}
