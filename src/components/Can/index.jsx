import React from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';

@inject(({ rootStore }) => ({
  roleStore: rootStore.roleStore
}))
export default class Can extends React.Component {
  static propTypes = {
    action: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    condition: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    do: PropTypes.oneOf(['show']),
    not: PropTypes.bool,
    passThrough: PropTypes.bool
  };

  static defaultProps = {
    action: '',
    do: 'show',
    not: false,
    condition: 'and',
    passThrough: false
  };

  get defaultHide() {
    return !!this.props.action;
  }

  get allowed() {
    const {
      action, not, roleStore, condition
    } = this.props;
    if (!this.defaultHide) {
      return true;
    }
    let allowed;
    if (typeof condition === 'function') {
      allowed = condition(action, roleStore.muduleSession);
    } else {
      allowed = roleStore.checkAction(action, condition);
    }
    if (not) {
      allowed = !allowed;
    }
    return allowed;
  }

  renderChildren() {
    const { children } = this.props;
    return typeof children === 'function' ? children(this.allowed) : children;
  }

  render() {
    return this.props.passThrough || this.allowed
      ? this.renderChildren()
      : null;
  }
}
