import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import classnames from 'classnames';
import { NavLink } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { ButtonDropdown, Dropdown, DropdownToggle, DropdownItem, DropdownMenu } from 'reactstrap';
import { translate } from 'react-i18next';

import { getSessInfo, getLinkLabelFromRole } from 'src/utils';
import Logo from '../Logo';
import Input from '../Base/Input';

import styles from './index.scss';

// translate hoc should place before mobx
@translate()
@inject('rootStore', 'sessInfo')
@observer
export default class Header extends Component {
  state = {
    dropdownOpen: false,
    translationDropdownOpen: false
  };

  toggleDropdown = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  };

  toggleTranslationDropdown = () => {
    this.setState({
      translationDropdownOpen: !this.state.translationDropdownOpen
    });
  };

  changeLocale = lang => {
    this.props.i18n.changeLanguage(lang);
    this.toggleTranslationDropdown();
  };

  renderLoginButton() {
    const { t } = this.props;
    const loggedInUser = getSessInfo('user', this.props.sessInfo);

    if (!loggedInUser) {
      return <NavLink to="/login">{t('Sign In')}</NavLink>;
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

  renderLocaleBtns() {
    const { translationDropdownOpen } = this.state;
    const curLocale = typeof window !== 'undefined' && localStorage.getItem('i18nextLng');

    return (
      <Dropdown
        isOpen={translationDropdownOpen}
        toggle={this.toggleTranslationDropdown}
        className={styles.translation}
      >
        <DropdownToggle
          tag="span"
          onClick={this.toggleTranslationDropdown}
          data-toggle="dropdown"
          caret
          style={{ cursor: 'pointer' }}
        >
          {curLocale}
        </DropdownToggle>
        <DropdownMenu className={styles.transMenu}>
          <div className={styles.locale}>
            <a href="javascript:void(0)" onClick={() => this.changeLocale('en')}>
              en
            </a>
          </div>
          <div className={styles.locale}>
            <a href="javascript:void(0)" onClick={() => this.changeLocale('zh-CN')}>
              zh-CN
            </a>
          </div>
        </DropdownMenu>
      </Dropdown>
    );
  }

  renderDevOpsLink() {
    const { t } = this.props;
    const role = getSessInfo('role', this.props.sessInfo);
    let labelName = getLinkLabelFromRole(role);
    return <NavLink to="/dashboard">{t(labelName)}</NavLink>;
  }

  onSearch = value => {
    const { appStore } = this.props.rootStore;
    appStore.fetchApps({ search_word: value });
  };

  render() {
    const {
      t,
      isHome,
      rootStore: { fixNav }
    } = this.props;

    const isDark = !isHome || fixNav;
    const logoUrl = isDark ? '/assets/logo_light.svg' : '/assets/logo_dark.svg';

    return (
      <div className={classnames('header', styles.header, { [styles.darkHeader]: !isDark })}>
        <div className={styles.wrapper}>
          <Logo className={styles.logo} url={logoUrl} />
          {isDark && (
            <Input.Search
              className={styles.search}
              onSearch={this.onSearch}
              placeholder={t('search.placeholder')}
            />
          )}
          <div className={styles.menus}>
            <NavLink to="/apps">{t('Catalog')}</NavLink>
            {this.renderDevOpsLink()}
            {this.renderLoginButton()}
            {this.renderLocaleBtns()}
          </div>
        </div>
      </div>
    );
  }
}
