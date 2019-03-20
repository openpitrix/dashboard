import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withTranslation } from 'react-i18next';
import _, { isFunction } from 'lodash';
import { Icon } from 'components/Base';

import Option from './option';

import styles from './index.scss';

@withTranslation()
export default class Select extends React.Component {
  static propTypes = {
    children: PropTypes.any,
    className: PropTypes.string,
    defaultValue: PropTypes.string,
    disabled: PropTypes.bool,
    name: PropTypes.string,
    onChange: PropTypes.func,
    positionFixed: PropTypes.bool,
    value: PropTypes.string
  };

  static defaultProps = {
    className: '',
    disabled: false,
    positionFixed: false,
    name: ''
  };

  state = {
    isOpen: false,
    value: this.props.defaultValue,
    noValue: this.noValue
  };

  componentWillUnmount() {
    document.removeEventListener('click', this.handleOutsideClick.bind(this));
  }

  get value() {
    return this.props.value || this.state.value;
  }

  get noValue() {
    const defaultValue = this.props.value || this.props.defaultValue;
    return typeof defaultValue === 'undefined' || defaultValue === null;
  }

  childNodes = [];

  currentLabel = '';

  handleOutsideClick(e) {
    if (this.wrapper && !this.wrapper.contains(e.target)) {
      this.setState({ isOpen: false });
    }
  }

  handleOptionClick = e => {
    const { onChange, value } = this.props;
    const curVal = e.currentTarget.getAttribute('value');
    const state = {
      isOpen: false,
      value: curVal
    };

    this.setState(state, () => {
      if (isFunction(onChange) && value !== curVal) {
        onChange(curVal);
      }
    });
  };

  handleControlClick = () => {
    const { isOpen } = this.state;
    const { disabled } = this.props;

    if (disabled) {
      return;
    }
    if (isOpen) {
      document.removeEventListener('click', this.handleOutsideClick.bind(this));
    } else {
      document.addEventListener('click', this.handleOutsideClick.bind(this));
    }

    this.setState({ isOpen: !isOpen });
  };

  setChildNodes = () => {
    const { children, t } = this.props;
    const value = this.props.value || this.state.value;

    this.currentLabel = '';
    this.childNodes = React.Children.map(children, child => {
      const checked = String(value) === child.props.value;

      if (checked) {
        this.currentLabel = child.props.children;
      }

      return React.cloneElement(child, {
        ...child.props,
        onClick: this.handleOptionClick,
        isSelected: checked
      });
    });

    if (this.state.noValue) {
      const txt = t('Please select');
      const isSelected = this.noValue;
      const option = React.cloneElement(
        <Option disabled key="please-select">
          {txt}
        </Option>,
        {
          isSelected
        }
      );
      if (isSelected) {
        this.currentLabel = txt;
      }

      this.childNodes.unshift(option);
    }
    if (!this.currentLabel) {
      this.currentLabel = value;
    }

    return this.childNodes;
  };

  renderControl() {
    const { isOpen } = this.state;
    const { disabled } = this.props;

    return (
      <div
        ref={ref => {
          this.control = ref;
        }}
        className={styles.control}
        onClick={this.handleControlClick}
      >
        <div className={styles.controlLabel}>{this.currentLabel}</div>
        <Icon
          name={isOpen && !disabled ? 'caret-up' : 'caret-down'}
          type="dark"
        />
      </div>
    );
  }

  renderOptions() {
    const { isOpen } = this.state;
    const { disabled, positionFixed } = this.props;
    const style = {
      position: positionFixed ? 'fixed' : 'absolute'
    };
    if (positionFixed) {
      const dimensions = this.control
        ? this.control.getBoundingClientRect()
        : null;
      Object.assign(style, {
        width: _.get(dimensions, 'width', 'auto')
      });
    }

    return this.childNodes.length > 0 ? (
      <div
        className={classnames(styles.options, {
          [styles.show]: isOpen && !disabled
        })}
        style={style}
      >
        {this.childNodes}
      </div>
    ) : null;
  }

  render() {
    const { className, disabled, name } = this.props;
    const { value } = this;

    this.setChildNodes();

    return (
      <div
        className={classnames(styles.select, className)}
        disabled={disabled}
        ref={ref => {
          this.wrapper = ref;
        }}
      >
        <input name={name} defaultValue={value} type="hidden" />
        {this.renderControl()}
        {this.renderOptions()}
      </div>
    );
  }
}
