import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import isFunction from 'lodash/isFunction';
import { Icon } from 'components/Base';

import styles from './index.scss';

export default class Select extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.any,
    onChange: PropTypes.func,
    value: PropTypes.string,
    disabled: PropTypes.bool
  };

  static defaultProps = {
    className: '',
    disabled: false
  };

  state = {
    isOpen: false
  };

  childNodes = [];

  currentLabel = '';

  componentWillUnmount() {
    document.removeEventListener('click', this.handleOutsideClick.bind(this));
  }

  handleOutsideClick(e) {
    if (this.wrapper && !this.wrapper.contains(e.target)) {
      this.setState({ isOpen: false });
    }
  }

  handleOptionClick = e => {
    const value = e.currentTarget.getAttribute('value');
    isFunction(this.props.onChange) && this.props.onChange(value);
    this.setState({ isOpen: false });
  };

  handleControlClick = () => {
    const { isOpen } = this.state;

    if (isOpen) {
      document.removeEventListener('click', this.handleOutsideClick.bind(this));
    } else {
      document.addEventListener('click', this.handleOutsideClick.bind(this));
    }

    this.setState({ isOpen: !isOpen });
  };

  setChildNodes = () => {
    const { children, value } = this.props;

    this.childNodes = React.Children.map(children, child => {
      let checked = String(value) === child.props.value;
      if (checked) {
        this.currentLabel = child.props.children.toString();
      }

      return React.cloneElement(child, {
        ...child.props,
        onClick: this.handleOptionClick,
        isSelected: checked
      });
    });

    if (!this.currentLabel) {
      this.currentLabel = value;
    }

    return this.childNodes;
  };

  renderControl() {
    const { isOpen } = this.state;
    return (
      <div className={styles.control} onClick={this.handleControlClick}>
        <div className={styles.controlLabel}>{this.currentLabel}</div>
        <Icon name={isOpen ? 'caret-up' : 'caret-down'} />
      </div>
    );
  }

  renderOptions() {
    const { isOpen } = this.state;

    return this.childNodes.length > 0 ? (
      <div className={classnames(styles.options, { [styles.show]: isOpen })}>{this.childNodes}</div>
    ) : null;
  }

  render() {
    const { className, children, disabled, ...rest } = this.props;

    this.setChildNodes();

    return (
      <div
        className={classnames(styles.select, className, { [styles.disabledSel]: disabled })}
        {...rest}
        ref={ref => {
          this.wrapper = ref;
        }}
      >
        {this.renderControl()}
        {this.renderOptions()}
      </div>
    );
  }
}
