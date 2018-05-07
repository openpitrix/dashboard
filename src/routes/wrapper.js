import React from 'react';

export default class RouteWrapper extends React.Component {
  componentDidMount() {
    const { component, rootStore, match } = this.props;

    // first render on ssr
    if (window.__preload === undefined) {
      window.__preload = true;
    }

    if (window.__preload) {
      window.__preload = false;
    } else {
      component.onEnter && component.onEnter(rootStore, match.params);
    }
  }

  render() {
    const { component: Component, ...restProps } = this.props;
    return <Component {...restProps} />;
  }
}
