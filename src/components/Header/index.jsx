import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import classnames from 'classnames';
import { NavLink } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { ButtonDropdown, DropdownToggle, DropdownItem, DropdownMenu } from 'reactstrap';

import { getSessInfo } from 'src/utils';
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

    if (role === 'admin') {
      return <NavLink to="/manage">Management</NavLink>;
    } else if (role === 'developer') {
      return <NavLink to="/develop">Development</NavLink>;
    }
    return <NavLink to="/deploy">Deployment</NavLink>;
  }

  render() {
    const {
      isHome,
      rootStore: { fixNav }
    } = this.props;

    const isDark = !isHome || fixNav;
    const logoUrl = isDark ? '/assets/logo2.svg' : '/assets/logo.svg';

    return (
      <div className={classnames('header', styles.header, { [styles.darkHeader]: !isDark })}>
        <div className={styles.wrapper}>
          <Logo className={styles.logo} url={logoUrl} />
          {isDark && (
            <Input.Search className={styles.search} placeholder="Search apps in Pitrix..." />
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
