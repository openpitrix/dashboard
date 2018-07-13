// i18n translate wrapper
import React from 'react';
import { t, exists } from 'i18next';
import { translate } from 'react-i18next';

const getComponentName = comp => {
  return comp.displayName || comp.name || 'Component';
};

export const __ = (key, ...rest) => {
  return (exists(key) && t(key, ...rest)) || key;
};

const trans = (namespace, options = {}) => WrapComponent => {
  const ComponentWithTrans = translate(namespace, options)(WrapComponent);

  ComponentWithTrans.displayName = `HocTrans(${getComponentName(WrapComponent)})`;

  return class extends React.Component {
    render() {
      const props = this.props;

      return <ComponentWithTrans __={__} {...props} />;
    }
  };
};

export default trans;
