import React, { Fragment } from 'react';

import Header from 'components/Header';

import styles from './index.scss';

const NotFound = () => (
  <Fragment>
    <Header alwaysShow />
    <div className={styles.page}>
      <p className={styles.txt}>Page Not Found</p>
    </div>
  </Fragment>
);

export default NotFound;
