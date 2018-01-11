import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { NavLink } from 'react-router-dom';

import Logo from '../Logo';
import Input from '../Base/Input';
import styles from './index.scss';

export default class Header extends PureComponent {
  static propTypes = {
    isHome: PropTypes.bool,
  }

  render() {
    const { isHome } = this.props;

    const logoUrl = isHome ? '../../assets/logo.svg' : '../../assets/logo2.svg';

    return (
      <div className={classnames(styles.header, { header: isHome })}>
        <div className={styles.wrapper}>
          <Logo className={styles.logo} url={logoUrl}/>
          {!isHome && <Input.Search className={styles.search} placeholder="Search apps in Pitrix"/>}
          <div className={styles.menus}>
            <NavLink to="/apps">Browse</NavLink>
            <NavLink to="/manage/apps">Manage</NavLink>
            <NavLink to="/develop">Develop</NavLink>
            <NavLink to="/login">Sign In</NavLink>
          </div>
        </div>
      </div>
    );
  }
}
