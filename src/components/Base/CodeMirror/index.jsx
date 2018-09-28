import React from 'react';
import PropTypes from 'prop-types';
import CodeMirror from 'react-codemirror';

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

  render() {
    const { onChange, code, mode } = this.props;

    return <CodeMirror value={code} onChange={onChange} options={{ mode }} />;
  }
}
