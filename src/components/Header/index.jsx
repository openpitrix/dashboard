import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

import Logo from '../Logo';
import { Search } from '../Base/Input';
import styles from './index.scss';

export default class Header extends PureComponent {
  static propTypes = {
    isHome: PropTypes.bool,
  }

  render() {
    const { isHome } = this.props;

    return (
      <div className={classnames(styles.header, { header: isHome })}>
        <div className={styles.wrapper}>
          <Logo className={styles.logo} url='../../assets/logo.svg' />
          {!isHome && <Search className={styles.search} placeholder="Search apps in Pitrix"/>}
          <div className={styles.menus}>
            <Link to="/apps">Browse</Link>
            <Link to="/apps">Manage</Link>
            <Link to="/apps">Develop</Link>
            <Link to="/apps">Sign In</Link>
          </div>
        </div>
      </div>
    );
  }
}
