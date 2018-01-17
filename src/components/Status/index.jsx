import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './index.scss';

export default class Status extends PureComponent {
  static propTypes = {
    style: PropTypes.string,
    className: PropTypes.string,
    name: PropTypes.string,
    status: PropTypes.oneOf([
      'active', 'stopped', 'ceased', 'pending', 'suspended', 'deleted',
    ]),
  };

  static defaultProps = {
    status: 'pending',
  };

  render() {
    const { style, className, name, status } = this.props;

    return (
      <span className={classNames(styles.status, className)} style={style}>
        <i className={classNames(styles.icon, styles[status])}></i>
        {name}
      </span>
    );
  }
}
