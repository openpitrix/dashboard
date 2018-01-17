import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import styles from './index.scss';

export default class Checkbox extends Component {
  static propTypes = {
    className: PropTypes.string,
    name: PropTypes.string,
    disabled: PropTypes.bool,
    checked: PropTypes.bool,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    className: '',
    disabled: false,
    checked: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      isChecked: props.checked,
    };
  }

  handleToggleCheck = (e) => {
    const { disabled, onChange } = this.props;

    if (!disabled) {
      const isChecked = this.state.isChecked;
      this.setState({ isChecked: !isChecked });
      onChange && onChange(e);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.checked !== this.state.isChecked) {
      this.setState({ isChecked: nextProps.checked });
    }
  }

  render() {
    const { style, className, disabled, checked, onChange, children, ...restProps } = this.props;
    const isChecked = this.state.isChecked;

    return (
      <label
        className={classNames(styles.checkbox, className, {
          [styles.disabled]: disabled,
          [styles.checked]: isChecked,
        })}
        style={style}
      >
        <input
          type="checkbox"
          disabled={disabled}
          checked={isChecked}
          onChange={this.handleToggleCheck}
          {...restProps}
        />
        {children}
      </label>
    );
  }
}
