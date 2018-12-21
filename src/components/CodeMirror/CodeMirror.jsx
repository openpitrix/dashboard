import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CodeMirror from 'react-codemirror';

// fixme
/* eslint-disable import/no-extraneous-dependencies */
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/yaml/yaml';
import 'codemirror/mode/javascript/javascript';

export default class LazyCodeMirror extends Component {
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
      <CodeMirror
        value={code}
        onChange={onChange}
        options={{
          lineNumbers: true,
          mode
        }}
        {...rest}
      />
    );
  }
}
