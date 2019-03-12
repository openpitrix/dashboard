import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import { NavLink, Link } from 'react-router-dom';

@inject(({ rootStore }) => ({
  roleStore: rootStore.roleStore
}))
@observer
export default class BaseLink extends Component {
  static propTypes = {
    actionId: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    isNavLink: PropTypes.bool
  };

  static defaultProps = {
    isNavLink: false,
    actionId: ''
  };

  state = {
    hide: !!this.props.actionId
  };

  async componentDidMount() {
    const { actionId, roleStore } = this.props;
    if (!actionId) {
      return;
    }
    const canDo = await roleStore.checkAction(actionId);
    if (canDo) {
      this.setState({
        hide: false
      });
    }
  }

  render() {
    const {
      isNavLink,
      children,
      actionId,
      tRead,
      roleStore,
      ...props
    } = this.props;
    if (this.state.hide) {
      return null;
    }

    const Container = isNavLink ? NavLink : Link;
    return <Container {...props}>{children}</Container>;
  }
}
