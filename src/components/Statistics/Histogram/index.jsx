import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import styles from './index.scss';

export default class Histogram extends PureComponent {
  static propTypes = {
    dataArray: PropTypes.array
  };

  render() {
    const { dataArray } = this.props;

    return (
      <div className={styles.histogram}>
        {dataArray.map((data, index) => (
          <div className={styles.column} key={index}>
            <div className={styles.inner} style={{ height: data + '%' }} />
          </div>
        ))}
      </div>
    );
  }
}
