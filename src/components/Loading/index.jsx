import React, { PureComponent } from 'react';

import styles from './index.scss';

export default class Loading extends PureComponent {
  render() {
    return (
      <div className={styles.loading}>
        <div className={styles.loadOuter}>
          <div className={styles.loader} />
        </div>
      </div>
    );
  }
}
