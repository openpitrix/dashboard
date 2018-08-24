import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import styles from './index.scss';

export default class Radio extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    checked: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]).isRequired,
    onChange: PropTypes.func,
    children: PropTypes.node,
    disabled: PropTypes.bool
  };

  static defaultProps = {
    disabled: false,
    className: ''
  };

  handleClick = () => {
    const { checked, value, onChange, disabled } = this.props;
    if (!disabled) {
      !checked && onChange(value);
    }
  };

  render() {
    const { className, checked, children, ...others } = this.props;
    const classNames = classnames(styles.radio, className, { [styles.checked]: checked });

    return (
      <label className={classNames} onClick={this.handleClick} {...others}>
        <span className={styles.circle} />
        <span className={styles.text}>{children}</span>
      </label>
    );
  }
}
