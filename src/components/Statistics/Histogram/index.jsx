import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import styles from './index.scss';

export default class Histogram extends PureComponent {
  static propTypes = {
    histograms: PropTypes.array
  };

  render() {
    const { histograms } = this.props;
    const numbers = histograms.map(item => item.number);
    const max = Math.max(...numbers) * 1.25;
    return (
      <div className={styles.histogram}>
        {histograms.map((data, index) => (
          <div className={styles.column} key={index}>
            <div className={styles.inner} style={{ height: data.number * 100.0 / max + '%' }} />
            <div className={styles.tips}>
              <span className={styles.arrow} />
              <div className={styles.number}>{data.number}</div>
              <div className={styles.date}>{data.date}</div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}
