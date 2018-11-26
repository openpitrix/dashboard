import React, { lazy, Suspense } from 'react';
import PropTypes from 'prop-types';

const CodeMirror = lazy(() => import('./CodeMirror'));

export default class CodeMirrorX extends React.Component {
  static propTypes = {
    code: PropTypes.string,
    mode: PropTypes.string,
    onChange: PropTypes.func
  };

  static defaultProps = {
    code: '',
    onChange: () => {},
    mode: 'yaml'
  };

  render() {
    const {
      onChange, code, mode, ...rest
    } = this.props;

    return (
      <Suspense fallback={<div>Loading...</div>}>
        <CodeMirror
          value={code}
          onChange={onChange}
          options={{ mode, lineNumbers: true }}
          {...rest}
        />
      </Suspense>
    );
  }
}
