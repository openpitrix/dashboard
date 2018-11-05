import React from 'react';
import PropTypes from 'prop-types';

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

  componentDidMount() {
    import('react-codemirror').then(module => this.setState({ module: module.default }));
  }

  render() {
    const { onChange, code, mode, ...rest } = this.props;
    const { module: CodeMirror } = this.state;

    return (
      <div>
        {CodeMirror && (
          <CodeMirror
            value={code}
            onChange={onChange}
            options={{ mode, lineNumbers: true }}
            ref="editor"
            {...rest}
          />
        )}
      </div>
    );
  }
}
