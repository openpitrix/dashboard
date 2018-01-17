import React from 'react';

export default class RouteWrapper extends React.Component {
  componentDidMount() {
    const { component, rootStore, match } = this.props;
    if (window.__SSR__) {
      window.__SSR__ = false;
    } else {
      component.onEnter && component.onEnter(rootStore, match);
    }
  }

  render() {
    const { component: Component, ...restProps } = this.props;
    return <Component {...restProps} />;
  }
}
