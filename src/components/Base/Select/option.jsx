import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Icon } from 'components/Base';

import styles from './index.scss';

export default class Option extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    value: PropTypes.string,
    children: PropTypes.any,
    isSelected: PropTypes.bool
  };

  static defaultProps = {
    className: ''
  };

  render() {
    const { className, children, isSelected, ...rest } = this.props;

    const classNames = classnames(styles.option, className);

    return (
      <div className={classNames} {...rest}>
        {children}
        {isSelected && <Icon name="check" />}
      </div>
    );
  }
}
