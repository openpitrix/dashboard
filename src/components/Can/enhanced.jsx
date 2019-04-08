import React from 'react';

import checkAction from 'utils/checkAction';

export default function withCheckAction(WrappedComponent) {
  const displayName = `withCheckAction-${WrappedComponent.displayName
    || WrappedComponent.name
    || 'unkown'}`;

  class WithCheckAction extends React.Component {
    static displayName = displayName;

    render() {
      const { action, condiction, ...restProps } = this.props;
      if (!checkAction(action, condiction)) {
        return null;
      }

      return <WrappedComponent {...restProps} />;
    }
  }

  return WithCheckAction;
}
