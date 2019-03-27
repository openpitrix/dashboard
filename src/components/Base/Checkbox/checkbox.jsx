import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import Icon from '../Icon';
import styles from './index.scss';

export default class Checkbox extends Component {
  static propTypes = {
    checked: PropTypes.bool,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    name: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.string
  };

  static defaultProps = {
    className: '',
    disabled: false,
    checked: false
  };

  constructor(props) {
    super(props);

    this.state = {
      isChecked: props.checked
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.checked !== this.state.isChecked) {
      this.setState({ isChecked: nextProps.checked });
    }
  }

  handleToggleCheck = e => {
    const { disabled, onChange } = this.props;

    if (disabled) {
      return;
    }
    onChange && onChange(e);
  };

  onClick = e => {
    e.preventDefault();
    this.checkbox.click();
  };

  render() {
    const {
      style, className, disabled, children, isFold, fold, name, value
    } = this.props;
    const { isChecked } = this.state;
    const labelClass = isFold ? styles.foldCheckbox : styles.checkbox;

    return (
      <label
        className={classNames(labelClass, className, {
          [styles.checked]: isChecked
        })}
        disabled={disabled}
        style={style}
        onClick={this.onClick}
      >
        {isChecked && <Icon name="check" />}
        {isFold && fold && <Icon name="check-fold" size={28} />}
        {isFold && !fold && <Icon name="check-unfold" size={28} />}
        <input
          type="checkbox"
          ref={element => {
            this.checkbox = element;
          }}
          value={value}
          checked={isChecked}
          name={name}
          onChange={this.handleToggleCheck}
        />
        {children}
      </label>
    );
  }
}
