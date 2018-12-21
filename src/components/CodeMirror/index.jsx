import React, { lazy } from 'react';

const Component = lazy(() => import('./CodeMirror'));

export default class CodeMirror extends React.Component {
  render() {
    const { props } = this;

    return <Component {...props} />;
  }
}
