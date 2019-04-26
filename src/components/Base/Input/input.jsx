import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import Icon from '../Icon';

import styles from './index.scss';

export default class Input extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
    icon: PropTypes.string,
    iconSize: PropTypes.number,
    iconType: PropTypes.string,
    size: PropTypes.oneOf(['normal', 'large', 'small']),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  };

  static defaultProps = {
    className: '',
    icon: '',
    iconType: 'light',
    iconSize: 16,
    disabled: false
  };

  render() {
    const {
      className, icon, iconType, iconSize, size, ...rest
    } = this.props;

    if (icon) {
      return (
        <div className={classnames(styles.inputGroup, styles[size], className)}>
          <Icon name={icon} type={iconType} size={iconSize} />
          <input className={styles.input} {...rest} />
        </div>
      );
    }

    return (
      <input
        className={classnames(styles.input, styles[size], className)}
        {...rest}
      />
    );
  }
}
