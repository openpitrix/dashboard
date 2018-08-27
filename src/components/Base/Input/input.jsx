import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import Icon from '../Icon';

import styles from './index.scss';

export default class Input extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    icon: PropTypes.string,
    iconType: PropTypes.string,
    iconSize: PropTypes.number,
    disabled: PropTypes.bool
  };

  static defaultProps = {
    className: '',
    icon: '',
    iconType: 'light',
    iconSize: 16,
    disabled: false
  };

  render() {
    const { className, icon, iconType, iconSize, ...rest } = this.props;

    if (icon) {
      return (
        <div className={classnames(styles.inputGroup, className)}>
          <Icon name={icon} type={iconType} size={iconSize} />
          <input className={styles.input} {...rest} />
        </div>
      );
    }

    return <input className={classnames(styles.input, className)} {...rest} />;
  }
}
