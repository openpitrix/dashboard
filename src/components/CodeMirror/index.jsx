import React, { lazy, Suspense } from 'react';

const Component = lazy(() => import('./CodeMirror'));

export default class CodeMirror extends React.Component {
  render() {
    return (
      <Suspense fallback={<div>Loading</div>}>
        <Component {...this.props} />
      </Suspense>
    );
  }
}
