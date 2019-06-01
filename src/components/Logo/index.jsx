import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import classnames from 'classnames';

import styles from './index.scss';

export default class Logo extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    hasTitle: PropTypes.bool,
    iconCls: PropTypes.string,
    iconUrl: PropTypes.string,
    title: PropTypes.string,
    url: PropTypes.string
  };

  static defaultProps = {
    hasTitle: false,
    url: '/',
    iconUrl: '/op-logo.svg'
  };

  get title() {
    const { hasTitle, title } = this.props;
    if (!hasTitle) {
      return null;
    }

    if (title) {
      return title;
    }
    const cloudInfo = JSON.parse(sessionStorage.getItem('cloudInfo')) || {};
    return cloudInfo.platform_name;
  }

  render() {
    const {
      className, iconCls, url, iconUrl
    } = this.props;
    return (
      <NavLink className={classnames(className, styles.logo)} to={url}>
        <img
          className={classnames(iconCls, styles.icon)}
          src={iconUrl}
          alt="logo"
          height="100%"
        />
        {this.title}
      </NavLink>
    );
  }
}
