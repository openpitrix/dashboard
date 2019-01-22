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
    toggleType: 'header',
    onChange: _.noop
  };

  state = {
    isCheck: this.props.checked
  };

  /* getDerivedStateFromProps(nextProps) {
   *   debugger;
   *   if (this.props.checked !== nextProps.checked) {
   *     return {
   *       isCheck: nextProps.checked
   *     };
   *   }
   *   return this.state;
   * } */

  renderIcon() {
    const { iconType, toggleType } = this.props;
    const { isCheck } = this.state;

    const props = {};
    if (toggleType === 'icon') {
      props.onClick = this.toggleCheck;
    }
    if (iconType === 'switch') {
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
    const onClick = toggleType === 'header' ? this.toggleCheck : _.noop;
    return (
      <div onClick={onClick} className={styles.headerContainer}>
        {iconPosition === 'left' && this.renderIcon()}
        <span className={styles.header}>{header}</span>
        {iconPosition === 'right' && this.renderIcon()}
      </div>
    );
  }

  render() {
    const { children, className, disabled } = this.props;
    const { isCheck } = this.state;
    return (
      <div
        className={classnames(
          styles.container,
          {
            [styles.disabled]: disabled,
            [styles.isCheck]: isCheck
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
