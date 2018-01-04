import React, { PureComponent } from 'react';

import styles from './index.scss';

export default class Footer extends PureComponent {
  render() {
    return (
      <div className={styles.footer}>
        <div className={styles.wrapper}>OpenPitrix</div>
      </div>
    );
  }
}
