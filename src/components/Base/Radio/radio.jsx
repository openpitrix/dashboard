import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import styles from './index.scss';

export default class Radio extends React.Component {
  static propTypes = {
    checked: PropTypes.bool,
    children: PropTypes.node,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool
    ]).isRequired
  };

  static defaultProps = {
    disabled: false,
    className: ''
  };

  handleClick = () => {
    const {
      checked, value, onChange, disabled
    } = this.props;
    if (!disabled) {
      !checked && onChange(value);
    }
  };

  render() {
    const {
      className, checked, children, disabled
    } = this.props;
    const classNames = classnames(styles.radio, className, {
      [styles.checked]: checked
    });

    return (
      <label
        className={classNames}
        onClick={this.handleClick}
        disabled={disabled}
      >
        <span className={styles.circle} />
        <span className={styles.text}>{children}</span>
      </label>
    );
  }
}
