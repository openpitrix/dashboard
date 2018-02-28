import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import Radio from './radio';
import styles from './index.scss';

export default class RadioButton extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    checked: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onChange: PropTypes.func,
    children: PropTypes.node,
  }

  handleClick = () => {
    this.props.onChange(this.props.value);
  }

  render() {
    const { className, children, ...others } = this.props;

    return (
      <Radio
        {...others}
        className={classNames(styles.radioButton, className)}
      >
        {children}
      </Radio>
    );
  }
}
