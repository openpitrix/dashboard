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
    condition: PropTypes.oneOf(['or', 'and']),
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

  state = {
    allowed: !this.defaultHide,
    hide: this.defaultHide
  };

  async componentDidMount() {
    const {
      action, not, roleStore, condition
    } = this.props;
    if (!this.defaultHide) {
      return;
    }
    let allowed = await roleStore.checkAction(action, condition);
    if (not) {
      allowed = !allowed;
    }
    if (allowed) {
      this.setState({
        hide: false,
        allowed
      });
    }
  }

  get defaultAllow() {
    return true;
  }

  get defaultHide() {
    return !!this.props.action;
  }

  renderChildren() {
    const { children } = this.props;
    return typeof children === 'function'
      ? children(this.state.allowed)
      : children;
  }

  render() {
    return this.props.passThrough || !this.state.hide
      ? this.renderChildren()
      : null;
  }
}
