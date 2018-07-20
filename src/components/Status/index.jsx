import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './index.scss';

export default class Status extends PureComponent {
  static propTypes = {
    style: PropTypes.string,
    className: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.oneOfType(['active', 'stopped', 'ceased', 'pending', 'suspended', 'deleted'])
  };

  static defaultProps = {
    status: 'pending'
  };

  render() {
    const { style, className, name, type } = this.props;

    return (
      <span className={classnames(styles.status, className)} style={style}>
        <i className={classnames(styles.icon, styles[type])} />
        {name}
      </span>
    );
  }
}
