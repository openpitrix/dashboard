import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { NavLink } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { ButtonDropdown, DropdownToggle, DropdownItem, DropdownMenu } from 'reactstrap';
import { getCookie } from 'src/utils';

import Logo from '../Logo';
import Input from '../Base/Input';
import styles from './index.scss';

@inject('rootStore')
@observer
export default class Header extends Component {
  state = {
    isHome: PropTypes.bool,
    dropdownOpen: false
  };

  toggleDropdown = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  };

  renderLoginButton() {
    const cookieUser = getCookie('user');

    if (!cookieUser) {
      return <NavLink to="/login">Sign In</NavLink>;
    }

    return (
      <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}>
        <DropdownToggle caret className={styles.toggleBtn}>
          {cookieUser}
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem style={{ padding: 0 }}>
            <a href="/logout">Logout</a>
          </DropdownItem>
        </DropdownMenu>
      </ButtonDropdown>
    );
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
            <NavLink to="/manage/overview">Deployment</NavLink>
            <NavLink to="/develop">Development</NavLink>
            {this.renderLoginButton()}
          </div>
        </div>
      </div>
    );
  }
}
