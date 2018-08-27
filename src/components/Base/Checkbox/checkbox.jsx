import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import Icon from '../Icon';
import styles from './index.scss';

export default class Checkbox extends Component {
  static propTypes = {
    className: PropTypes.string,
    name: PropTypes.string,
    disabled: PropTypes.bool,
    checked: PropTypes.bool,
    onChange: PropTypes.func
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

  handleToggleCheck = e => {
    const { disabled, onChange } = this.props;

    if (disabled) {
      return;
    }
    const isChecked = this.state.isChecked;
    this.setState({ isChecked: !isChecked });
    onChange && onChange(e);
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.checked !== this.state.isChecked) {
      this.setState({ isChecked: nextProps.checked });
    }
  }

  render() {
    const { style, className, disabled, checked, onChange, children, ...restProps } = this.props;
    const isChecked = this.state.isChecked;
    const color = {
      primary: '#fff',
      secondary: '#fff'
    };
    return (
      <label
        className={classNames(styles.checkbox, className, {
          [styles.checked]: isChecked
        })}
        disabled={disabled}
        style={style}
      >
        {isChecked && <Icon name="check" color={color} />}
        <input
          type="checkbox"
          checked={isChecked}
          onChange={this.handleToggleCheck}
          {...restProps}
        />
        {children}
      </label>
    );
  }
}
