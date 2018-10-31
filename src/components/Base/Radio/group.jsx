import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import styles from './index.scss';

export default class Group extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    onChange: PropTypes.func,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
    name: PropTypes.string
  };

  static defaultProps = {
    className: '',
    name: ''
  };

  render() {
    const { className, value, children, onChange, name, ...others } = this.props;
    const classNames = classnames(styles.group, className);

    const childNodes = React.Children.map(children, child =>
      React.cloneElement(child, {
        ...child.props,
        onChange,
        checked: child.props.value === value
      })
    );

    return (
      <div {...others} className={classNames}>
        <input type="hidden" name={name} value={value} />
        {childNodes}
      </div>
    );
  }
}
