import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Icon from '../Icon';

import styles from './index.scss';

export default class Input extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
    icon: PropTypes.string,
    iconSize: PropTypes.number,
    iconType: PropTypes.string,
    valueChange: PropTypes.func
  };

  static defaultProps = {
    className: '',
    icon: '',
    iconType: 'light',
    iconSize: 16,
    valueChange: _.noop,
    onChange: _.noop,
    disabled: false
  };

  onChange = event => {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.props.valueChange(name, value);
    this.props.onChange(event);
  };

  render() {
    const {
      className,
      icon,
      iconType,
      iconSize,
      onChange,
      valueChange,
      ...rest
    } = this.props;

    if (icon) {
      return (
        <div className={classnames(styles.inputGroup, className)}>
          <Icon name={icon} type={iconType} size={iconSize} />
          <input className={styles.input} onChange={this.onChange} {...rest} />
        </div>
      );
    }

    return (
      <input
        className={classnames(styles.input, className)}
        onChange={this.onChange}
        {...rest}
      />
    );
  }
}
