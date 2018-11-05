import React, { lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
const CodeMirror = lazy(() => import('react-codemirror'));

if (process.browser) {
  require('codemirror/mode/yaml/yaml');
  require('codemirror/mode/javascript/javascript');
  require('codemirror/lib/codemirror.css');
}

export default class CodeMirrorX extends React.Component {
  static propTypes = {
    code: PropTypes.string,
    onChange: PropTypes.func,
    mode: PropTypes.string
  };

  static defaultProps = {
    code: '',
    onChange: () => {},
    mode: 'yaml'
  };

  constructor(props) {
    super(props);
    this.state = { module: null };
  }

  render() {
    const { onChange, code, mode, ...rest } = this.props;

    return (
      <Suspense fallback={<div>Loading...</div>}>
        <CodeMirror
          value={code}
          onChange={onChange}
          options={{ mode, lineNumbers: true }}
          ref="editor"
          {...rest}
        />
      </Suspense>
    );
  }
}
