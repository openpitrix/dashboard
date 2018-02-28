import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { remove } from 'lodash';

import styles from './index.scss';

export default class CheckboxGroup extends Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
    values: PropTypes.array,
    name: PropTypes.string,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    children: [],
    values: [],
    name: '',
  };

  constructor(props) {
    super(props);

    this.values = [...props.values];
  }

  handleChange = (e) => {
    e.stopPropagation();

    const { name, onChange } = this.props;
    const targetValue = e.target.value;

    if (e.target.checked) {
      this.values.push(targetValue);
    } else {
      remove(this.values, v => v === targetValue);
    }
    onChange && onChange(this.values, name);
  }

  render() {
    const { className, name, children } = this.props;

    const childNodes = React.Children.map(children, (child) => React.cloneElement(child, {
      ...child.props,
      key: `check-${child.props.value}`,
      name: child.props.name || name,
      checked: this.values.indexOf(child.props.value) !== -1,
      onChange: this.handleChange,
    }));

    return (
      <div className={classNames(styles.group, className)}>
        {childNodes}
      </div>
    );
  }
}
