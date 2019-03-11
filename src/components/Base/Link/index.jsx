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
    navLink: PropTypes.bool
  };

  static defaultProps = {
    navLink: false,
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
      navLink,
      children,
      actionId,
      tRead,
      roleStore,
      ...props
    } = this.props;
    if (this.state.hide) {
      return null;
    }

    const Container = navLink ? NavLink : Link;
    return <Container {...props}>{children}</Container>;
  }
}
