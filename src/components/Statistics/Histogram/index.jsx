import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import styles from './index.scss';

export default class Histogram extends PureComponent {
  static propTypes = {
    histograms: PropTypes.array
  };

  render() {
    const { histograms } = this.props;

    return (
      <div className={styles.histogram}>
        {histograms.map((data, index) => (
          <div className={styles.column} key={index}>
            <div className={styles.inner} style={{ height: data + '%' }} />
          </div>
        ))}
      </div>
    );
  }
}
