import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import isFunction from 'lodash/isFunction';

import styles from './index.scss';

export default class Button extends PureComponent {
  static propTypes = {
    type: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    loading: PropTypes.bool,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    isSubmit: PropTypes.bool,        
  };

  static defaultProps = {
    type: 'default',
  };  

  handleClick = (e) => {
    let isDisabled = this.props.disabled;

    if (!isDisabled && isFunction(this.props.onClick)) {
      this.props.onClick(e);     
    }
  }

  render() {
    const { children, type, className, style, loading, disabled, onClick, isSubmit } = this.props;
    
    const buttonType = isSubmit ? 'submit' : 'button';

    return (
      <button
        className={classNames(styles.button, styles[type], {
          [styles.loading]: loading,
          [className]: className,
        })}
        style={style}
        type={buttonType}
        disabled={disabled}
        onClick={this.handleClick}
      >
        {loading && <i class="fa fa-spinner"></i>}
        {children}
      </button>
    );
  }
}
