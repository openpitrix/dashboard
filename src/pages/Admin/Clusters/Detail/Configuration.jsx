import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

export default class Configuration extends Component {
  static propTypes = {
    configuration: PropTypes.object
  };

  getName = (key, value) => {
    let name = '';
    if (value || value === 0) {
      switch (key) {
        case 'cpu':
          name = value + '-Core';
          break;
        case 'memory':
          name = value / 1024 + ' GB';
          break;
        case 'gpu':
          name = value / 1024 + ' GB';
          break;
        default:
          name = value.toString();
          break;
      }
    }
    return name + ' ';
  };

  render() {
    const { configuration } = this.props;

    return (
      <div>
        {this.getName('cpu', configuration.cpu)}
        {this.getName('memory', configuration.memory)}
        {this.getName('gpu', configuration.gpu)}
      </div>
    );
  }
}
