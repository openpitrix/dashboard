import React from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';

@inject(({ rootStore }) => ({
  roleStore: rootStore.roleStore
}))
export default class Can extends React.Component {
  static propTypes = {
    action: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    children: PropTypes.any.isRequired,
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

  get isVisible() {
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
    return typeof children === 'function'
      ? children(this.state.allowed)
      : children;
  }

  render() {
    console.log(this.isVisible, this.props.action);
    return this.props.passThrough || this.isVisible
      ? this.renderChildren()
      : null;
  }
}
