import React from 'react';

import checkAction from 'utils/checkAction';

export default function withCheckAction(WrappedComponent) {
  const displayName = `withCheckAction-${WrappedComponent.displayName
    || WrappedComponent.name
    || 'unkown'}`;

  class WithCheckAction extends React.Component {
    static displayName = displayName;

    render() {
      const { action, condition, ...restProps } = this.props;
      if (!checkAction(action, condition)) {
        return null;
      }

      return <WrappedComponent {...restProps} />;
    }
  }

  return WithCheckAction;
}
