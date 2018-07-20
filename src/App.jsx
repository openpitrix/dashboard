import React from 'react';
import PropTypes from 'prop-types';

import './scss/index.scss';

class App extends React.PureComponent {
  static propTypes = {
    rootStore: PropTypes.object,
    location: PropTypes.object
  };

  static defaultProps = {
    rootStore: {},
    location: {}
  };

  render() {
    return <div className="main">{this.props.children}</div>;
  }
}

export default App;
