import React from 'react';

import styles from './index.scss';

const Loading = () => (
  <div className={styles.loading}>
    <div className={styles.loadOuter}>
      <div className={styles.loader} />
    </div>
  </div>
);

export default Loading;
