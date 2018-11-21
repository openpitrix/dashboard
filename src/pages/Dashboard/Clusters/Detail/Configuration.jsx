import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.scss';

const numericConf = [
  'cpu',
  'gpu',
  'memory',
  'instance_size',
  'storage_size',
  'ready_replicas',
  'replicas'
];

export default class Configuration extends React.PureComponent {
  static propTypes = {
    configuration: PropTypes.object
  };

  calcNumericItem(num, type = 'memory') {
    let label = '';

    switch (type) {
      case 'cpu':
        label = `${num}-Core`;
        break;
      case 'memory':
        label = `${(parseFloat(num) / 1024).toFixed(0)}GB`;
        break;
      case 'storage_size':
      case 'instance_size':
        label = `${parseFloat(num)}GB`;
        break;
      default:
        label = num;
        break;
    }

    return label;
  }

  getConfItem(confKey) {
    const { configuration } = this.props;

    if (numericConf.includes(confKey)) {
      return this.calcNumericItem(configuration[confKey], confKey);
    }

    return configuration[confKey];
  }

  render() {
    return (
      <div>
        <span className={styles.nodeConfKey}>{this.getConfItem('cpu')}</span>
        <span className={styles.nodeConfKey}>{this.getConfItem('memory')}</span>
        <span className={styles.nodeConfKey}>
          {this.getConfItem('storage_size')}
        </span>
      </div>
    );
  }
}
