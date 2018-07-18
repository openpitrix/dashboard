import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import Icon from '../Icon';

import styles from './index.scss';

export default class Input extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    icon: PropTypes.string,
    iconType: PropTypes.string
  };

  static defaultProps = {
    className: '',
    icon: '',
    iconType: 'light'
  };

  render() {
    const { className, icon, iconType, ...rest } = this.props;

    if (icon) {
      return (
        <div className={classnames(styles.inputGroup, className)}>
          <Icon name={icon} type={iconType} />
          <input className={styles.input} {...rest} />
        </div>
      );
    }

    return <input className={classnames(styles.input, className)} {...rest} />;
  }
}
