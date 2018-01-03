import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Logo from '../Logo';
import './index.scss';

export default class Header extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
  }

  render() {
    return (
      <div className={`header ${this.props.className}`}>
        <div className="header-wrapper">
          <Logo className="header-logo" url='../../assets/logo.svg' />
          <div className="header-menus">
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
