import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import Icon from '../Icon';

import styles from './index.scss';

export default class Input extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    icon: PropTypes.string,
    iconSize: PropTypes.number
  };

  static defaultProps = {
    className: '',
    icon: '',
    iconSize: 16
  };

  render() {
    const { className, icon, iconSize, ...rest } = this.props;

    if (icon) {
      return (
        <div className={classnames(styles.inputGroup, className)}>
          <Icon name={icon} size={iconSize} />
          <input className={styles.input} {...rest} />
        </div>
      );
    }

    return <input className={classnames(styles.input, className)} {...rest} />;
  }
}
