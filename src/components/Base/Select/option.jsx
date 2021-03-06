import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Icon } from 'components/Base';

import styles from './index.scss';

export default class Option extends React.Component {
  static propTypes = {
    children: PropTypes.any,
    className: PropTypes.string,
    isSelected: PropTypes.bool,
    value: PropTypes.string
  };

  static defaultProps = {
    className: ''
  };

  render() {
    const {
      className, children, label, isSelected, ...rest
    } = this.props;
    const text = children || label;

    const classNames = classnames(styles.option, className);

    return (
      <div className={classNames} {...rest}>
        {text}
        {isSelected && <Icon name="check" type="dark" />}
      </div>
    );
  }
}
