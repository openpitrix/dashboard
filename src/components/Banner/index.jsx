import React, { PureComponent } from 'react';

import styles from './index.scss';

export default class Footer extends PureComponent {
  render() {
    return (
      <div className={styles.banner}>
        <div className={styles.wrapper}>
          <div className={styles.title}>
            Application Management Platform on Multi-Cloud Environment.
          </div>
        </div>
      </div>
    );
  }
}
