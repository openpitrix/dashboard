import React from 'react';

export default class RouteWrapper extends React.Component {
  shouldComponentUpdate(nextProps) {
    const { match } = this.props;
    return match.url !== nextProps.match.url;
  }

  // componentWillReceiveProps(nextProps) {
  //   const { component, ...restProps } = nextProps;
  //   const { wrappedComponent } = component;
  //
  //   if (this.props.match.url !== nextProps.match.url) {
  //     wrappedComponent.prototype.componentWillReceiveProps &&
  //       wrappedComponent.prototype.componentWillReceiveProps(restProps);
  //   }
  // }

  render() {
    const { component: Component, ...restProps } = this.props;
    return <Component {...restProps} />;
  }
}
