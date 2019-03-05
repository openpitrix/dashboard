import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';

import { Icon, Switch } from 'components/Base';

import styles from './index.scss';

export default class SingleCollapse extends Component {
  static propTypes = {
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    iconPosition: PropTypes.oneOf(['left', 'right']),
    iconType: PropTypes.oneOf(['switch', 'chevron-right', 'chevron-up']),
    onChange: PropTypes.func,
    toggleType: PropTypes.oneOf(['header', 'icon'])
  };

  static defaultProps = {
    checked: false,
    disabled: false,
    iconPosition: 'left',
    iconType: 'chevron-right',
    toggleType: 'icon',
    onChange: _.noop
  };

  state = {
    isCheck: this.props.checked
  };

  renderIcon() {
    const { iconType, toggleType } = this.props;
    const { isCheck } = this.state;

    const props = {};
    if (toggleType === 'icon') {
      props.onClick = this.toggleCheck;
      props.className = styles.cursorPointer;
    }
    if (iconType === 'switch') {
      props.onChange = this.toggleCheck;
      return <Switch checked={isCheck} {...props} />;
    }

    props.type = 'dark';
    if (isCheck) {
      props.name = 'chevron-down';
    } else {
      props.name = iconType;
    }

    return <Icon {...props} />;
  }

  toggleCheck = () => {
    const isCheck = !this.state.isCheck;
    this.setState({ isCheck }, this.props.onChange(isCheck));
  };

  renderHeader() {
    const { iconPosition, header, toggleType } = this.props;
    const clickable = toggleType === 'header' || this.state.isCheck;
    const onClick = clickable ? this.toggleCheck : _.noop;
    return (
      <div
        onClick={onClick}
        className={classnames(styles.headerContainer, {
          [styles.cursorPointer]: clickable
        })}
      >
        {iconPosition === 'left' && this.renderIcon()}
        <span className={styles.header}>{header}</span>
        {iconPosition === 'right' && this.renderIcon()}
      </div>
    );
  }

  render() {
    const {
      children, className, checkCls, disabled
    } = this.props;
    const { isCheck } = this.state;
    return (
      <div
        className={classnames(
          styles.container,
          {
            [styles.disabled]: disabled,
            [styles.isCheck]: isCheck,
            [checkCls]: isCheck
          },
          className
        )}
      >
        {this.renderHeader()}
        <div className={styles.content}>{children}</div>
      </div>
    );
  }
}
