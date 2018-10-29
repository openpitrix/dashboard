import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import isFunction from 'lodash/isFunction';

import Icon from '../Icon';
import styles from './index.scss';

export default class Button extends PureComponent {
  static propTypes = {
    type: PropTypes.oneOf(['default', 'primary', 'delete']),
    htmlType: PropTypes.oneOf(['submit', 'button', 'reset']),
    className: PropTypes.string,
    style: PropTypes.object,
    loading: PropTypes.bool,
    disabled: PropTypes.bool,
    onClick: PropTypes.func
  };

  static defaultProps = {
    type: 'default',
    htmlType: 'button'
  };

  handleClick = e => {
    const isDisabled = this.props.disabled;

    if (!isDisabled && isFunction(this.props.onClick)) {
      this.props.onClick(e);
    }
  };

  render() {
    const { children, type, htmlType, className, loading, ...others } = this.props;

    return (
      <button
        className={classNames(styles.button, styles[type], {
          [styles.loading]: loading,
          [className]: className
        })}
        type={htmlType}
        onClick={this.handleClick}
        {...others}
      >
        {loading && <Icon name="spinner" />}
        {children}
      </button>
    );
  }
}
