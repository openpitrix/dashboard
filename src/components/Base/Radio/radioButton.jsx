import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import Radio from './radio';
import styles from './index.scss';

export default class RadioButton extends React.Component {
  static propTypes = {
    checked: PropTypes.bool,
    children: PropTypes.node,
    className: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
  };

  handleClick = () => {
    this.props.onChange(this.props.value);
  };

  render() {
    const { className, children, ...others } = this.props;

    return (
      <Radio {...others} className={classNames(styles.radioButton, className)}>
        {children}
      </Radio>
    );
  }
}
